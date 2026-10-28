<template>
  <q-form ref="myForm" greedy class="q-pa-xs">
    <!-- SECCIÓN 1: Datos Generales de la Orden de Compra -->
    <div
      class="text-subtitle1 text-weight-bold text-primary q-mb-sm flex items-center"
    >
      <q-icon name="receipt_long" size="sm" class="q-mr-xs" />
      Datos Generales de la Orden
    </div>

    <q-card flat bordered class="bg-grey-1 q-mb-md">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Vehículo -->
          <div class="col-12 col-sm-6 col-md-6">
            <q-select
              v-model="formHeader.vehicle_id"
              :options="filteredVehicles"
              label="Unidad / Vehículo *"
              option-value="id"
              :option-label="
                (v) =>
                  v
                    ? `${v.placas || 'S/P'} - ${v.estatus?.nombre || ''} (${
                        v.serie || 'Sin serie'
                      })`
                    : ''
              "
              emit-value
              map-options
              :use-input="!fixedVehicleId"
              input-debounce="0"
              @filter="filterVehiclesFn"
              outlined
              dense
              options-dense
              behavior="menu"
              :clearable="!fixedVehicleId"
              :disable="!!fixedVehicleId"
              bg-color="white"
              :rules="[(val) => !!val || 'Seleccione una unidad']"
            >
              <template v-slot:prepend>
                <q-icon name="directions_car" color="primary" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ scope.opt.placas || "Sin placa" }}
                      <span class="text-caption text-grey-7 q-ml-xs">
                        ({{ scope.opt.estatus?.nombre || "Unidad" }})
                      </span>
                    </q-item-label>
                    <q-item-label caption>
                      Serie: {{ scope.opt.serie || "N/A" }} &bull; Sucursal:
                      {{ scope.opt.sucursal?.nombre || "N/A" }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="orange-9" outline>
                      Último KM: {{ formatKm(scope.opt.ultimo_km || 0) }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!-- Indicador de Último Kilometraje Registrado de la Unidad -->
            <div
              v-if="selectedVehicle"
              class="q-mt-xs q-px-sm q-py-xs rounded-borders bg-orange-1 text-orange-10 row items-center justify-between border-orange"
            >
              <div class="text-caption text-weight-medium flex items-center">
                <q-icon name="speed" size="16px" class="q-mr-xs" />
                Último kilometraje registrado ({{ selectedVehicle.placas }}):
              </div>
              <div class="text-subtitle2 text-weight-bolder">
                {{
                  ultimoKmUnidad > 0
                    ? formatKm(ultimoKmUnidad)
                    : "Sin registro previo (0 km)"
                }}
              </div>
            </div>
          </div>

          <!-- Fecha de elaboración -->
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              v-model="formHeader.fecha_elaboracion"
              type="date"
              label="Fecha de Registro *"
              outlined
              dense
              bg-color="white"
              stack-label
              :rules="[(val) => !!val || 'La fecha es obligatoria']"
            >
              <template v-slot:prepend>
                <q-icon name="event" color="primary" />
              </template>
            </q-input>
          </div>

          <!-- Kilometraje de la Unidad -->
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              v-model.number="formHeader.km_evento"
              type="number"
              :min="ultimoKmUnidad > 0 ? ultimoKmUnidad : 0"
              label="Kilometraje (KM) *"
              suffix="km"
              outlined
              dense
              bg-color="white"
              reactive-rules
              :rules="[validateKm]"
            >
              <template v-slot:prepend>
                <q-icon name="speed" color="orange-8" />
              </template>
            </q-input>
          </div>

          <!-- Solicitante -->
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              v-model="formHeader.solicitante_id"
              :options="filteredEmpleados"
              label="Empleado Solicitante"
              option-value="id"
              option-label="nombreCompleto"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterEmpleadosFn"
              outlined
              dense
              options-dense
              behavior="menu"
              clearable
              bg-color="white"
              :disable="
                !checkRole('Admin') &&
                !checkPuestoIncludes('Coordinador de compras') &&
                !checkPuestoIncludes('Director administrativo')
              "
            >
              <template v-slot:prepend>
                <q-icon name="person" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- Sucursal con Cargo -->
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              v-model="formHeader.suc_cargo_id"
              :options="filteredSucursalesCargo"
              label="Sucursal Cargo"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterSucursalesCargoFn"
              outlined
              dense
              options-dense
              behavior="menu"
              clearable
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="store" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- Departamento con Cargo -->
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              v-model="formHeader.depto_cargo_id"
              :options="filteredDeptosCargo"
              label="Departamento Cargo"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterDeptosCargoFn"
              outlined
              dense
              options-dense
              behavior="menu"
              clearable
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="domain" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- Separador y título para Datos Fiscales Predeterminados -->
          <div class="col-12 q-pt-xs">
            <q-separator class="q-my-xs" />
            <div class="row items-center justify-between q-py-xs">
              <div class="text-caption text-weight-bold text-blue-grey-9 flex items-center">
                <q-icon name="tune" size="16px" class="q-mr-xs text-primary" />
                Datos Fiscales Predeterminados (Se seleccionarán automáticamente en cada cotización agregada)
              </div>
              <q-btn
                v-if="formHeader.forma_pago_id || formHeader.metodo_pago_id || formHeader.uso_cfdi_id"
                flat
                dense
                size="xs"
                color="primary"
                icon="sync"
                label="Aplicar a todas las cotizaciones actuales"
                @click="applyHeaderFiscalToAllCotizaciones"
                class="text-weight-bold"
              >
                <q-tooltip>Rellenar o actualizar todas las cotizaciones registradas con estos datos</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Forma de Pago (Predeterminada de Cabecera) -->
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              v-model="formHeader.forma_pago_id"
              :options="filteredFormasPago"
              label="Forma de Pago (Predeterminada)"
              option-value="id"
              :option-label="(opt) => opt ? `${opt.clave} - ${opt.nombre}` : ''"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterFormasPagoFn"
              outlined
              dense
              options-dense
              behavior="menu"
              clearable
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="payments" color="primary" />
              </template>
            </q-select>
          </div>

          <!-- Método de Pago (Predeterminado de Cabecera) -->
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              v-model="formHeader.metodo_pago_id"
              :options="filteredMetodosPago"
              label="Método de Pago (Predeterminado)"
              option-value="id"
              :option-label="(opt) => opt ? `${opt.clave} - ${opt.nombre}` : ''"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterMetodosPagoFn"
              outlined
              dense
              options-dense
              behavior="menu"
              clearable
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="credit_card" color="primary" />
              </template>
            </q-select>
          </div>

          <!-- Uso CFDI (Predeterminado de Cabecera) -->
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              v-model="formHeader.uso_cfdi_id"
              :options="filteredUsosCfdi"
              label="Uso de CFDI (Predeterminado)"
              option-value="id"
              :option-label="(opt) => opt ? `${opt.clave} - ${opt.nombre}` : ''"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterUsosCfdiFn"
              outlined
              dense
              options-dense
              behavior="menu"
              clearable
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="receipt_long" color="primary" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SECCIÓN 2: Conceptos y Múltiples Cotizaciones -->
    <div class="row items-center justify-between q-mb-sm">
      <div
        class="text-subtitle1 text-weight-bold text-primary flex items-center"
      >
        <q-icon name="handyman" size="sm" class="q-mr-xs" />
        Conceptos Solicitados ({{ conceptos.length }})
      </div>
      <q-btn
        unelevated
        dense
        color="primary"
        icon="add_circle"
        label="Agregar otro concepto"
        class="q-px-sm"
        @click="addConcepto"
      />
    </div>

    <!-- Lista de Conceptos -->
    <div class="q-gutter-y-lg">
      <q-card
        v-for="(concepto, cIndex) in conceptos"
        :key="'concepto-' + cIndex"
        flat
        bordered
        class="bg-white concept-card"
      >
        <!-- Encabezado del Concepto -->
        <q-card-section
          class="q-py-xs q-px-md bg-blue-grey-2 flex items-center justify-between"
        >
          <div class="text-subtitle2 text-weight-bolder text-blue-grey-10 flex items-center">
            <q-icon name="category" size="18px" class="q-mr-xs" />
            Concepto #{{ cIndex + 1 }}
            <span v-if="getConceptoServiceName(concepto)" class="q-ml-xs text-primary text-weight-bold">
              - {{ getConceptoServiceName(concepto) }}
            </span>
          </div>
          <q-btn
            v-if="conceptos.length > 1"
            flat
            dense
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="removeConcepto(cIndex)"
          >
            <q-tooltip>Eliminar este concepto completo</q-tooltip>
          </q-btn>
        </q-card-section>

        <!-- Datos Base del Concepto -->
        <q-card-section class="q-pa-md bg-grey-1">
          <div class="row q-col-gutter-md">
            <!-- Tipo de Compra -->
            <div class="col-12 col-sm-6 col-md-5">
              <q-select
                v-model="concepto.tipo_servicio_id"
                :options="filteredTiposServicio"
                label="Tipo de Compra"
                option-value="id"
                option-label="nombre"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterTiposServicioFn"
                outlined
                dense
                options-dense
                behavior="menu"
                clearable
                bg-color="white"
                @update:model-value="onTipoChange(concepto)"
              />
            </div>

            <!-- Servicio específico del catálogo -->
            <div class="col-12 col-sm-6 col-md-7">
              <q-select
                v-model="concepto.servicio_id"
                :options="getServiciosOptionsForConcept(concepto)"
                label="Concepto / Servicio *"
                option-value="id"
                option-label="nombre"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="
                  (val, update) => filterServiciosConceptFn(concepto, val, update)
                "
                outlined
                dense
                options-dense
                behavior="menu"
                clearable
                bg-color="white"
                :rules="[(val) => !!val || 'Seleccione el concepto']"
                @update:model-value="(val) => onServicioSelect(concepto, val)"
              />
            </div>

            <!-- Descripción / Detalle del trabajo -->
            <div class="col-12">
              <q-input
                v-model="concepto.descripcion"
                type="textarea"
                rows="2"
                autogrow
                label="Descripción / Detalle del trabajo o refacción *"
                outlined
                dense
                bg-color="white"
                :rules="[
                  (val) =>
                    (val && String(val).trim().length > 0) ||
                    'Ingrese la descripción del trabajo',
                ]"
              />
            </div>

            <!-- Medidas de Llanta (Condicional si es Refacciones - Llanta) -->
            <div v-if="isLlantaService(concepto)" class="col-12">
              <div class="q-pa-sm rounded-borders bg-white border-grey">
                <div
                  class="text-caption text-weight-bold text-blue-grey-9 q-mb-xs flex items-center"
                >
                  <q-icon name="tire_repair" size="18px" class="q-mr-xs text-primary" />
                  Especificaciones de Medida de Llanta
                </div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model.number="concepto.llanta_anchura"
                      type="number"
                      min="1"
                      label="Anchura (ej. 205)"
                      outlined
                      dense
                      bg-color="white"
                    />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model.number="concepto.llanta_altura"
                      type="number"
                      min="1"
                      label="Altura / Perfil (ej. 55)"
                      outlined
                      dense
                      bg-color="white"
                    />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model.number="concepto.llanta_rin"
                      type="number"
                      min="1"
                      label="Rin (ej. 16)"
                      prefix="R"
                      outlined
                      dense
                      bg-color="white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Subsección: Cotizaciones Comparativas para este Concepto -->
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-subtitle2 text-weight-bold text-blue-grey-9 flex items-center">
              <q-icon name="request_quote" size="20px" class="q-mr-xs text-teal-8" />
              Cotizaciones para este concepto ({{ concepto.cotizaciones.length }})
            </div>
            <q-btn
              unelevated
              dense
              color="teal-8"
              icon="add"
              label="+ Agregar cotización"
              class="q-px-sm text-caption"
              @click="addCotizacion(concepto)"
            />
          </div>

          <!-- Lista de Cotizaciones por Concepto -->
          <div class="q-gutter-y-sm">
            <q-card
              v-for="(cot, qIndex) in concepto.cotizaciones"
              :key="'cot-' + cIndex + '-' + qIndex"
              flat
              bordered
              class="quote-card"
            >
              <q-card-section
                class="q-py-xs q-px-sm bg-blue-grey-1 flex items-center justify-between"
              >
                <div class="row items-center q-gutter-x-xs">
                  <q-badge color="teal-8" class="text-weight-bold q-px-sm">
                    Cotización #{{ qIndex + 1 }}
                  </q-badge>
                  <span v-if="getProveedorName(cot.proveedor_id)" class="text-caption text-weight-bold text-grey-9 q-ml-xs">
                    {{ getProveedorName(cot.proveedor_id) }}
                  </span>
                </div>
                <q-btn
                  v-if="concepto.cotizaciones.length > 1"
                  flat
                  dense
                  round
                  color="negative"
                  icon="close"
                  size="sm"
                  @click="removeCotizacion(concepto, qIndex)"
                >
                  <q-tooltip>Quitar esta cotización</q-tooltip>
                </q-btn>
              </q-card-section>

              <q-card-section class="q-pa-sm">
                <div class="row q-col-gutter-sm items-center">
                  <!-- Fila 1: Proveedor de la cotización y Archivo PDF -->
                  <div class="col-12 col-sm-7 col-md-7">
                    <q-select
                      v-model="cot.proveedor_id"
                      :options="filteredProveedores"
                      label="Proveedor / Taller *"
                      option-value="id"
                      option-label="nombre"
                      emit-value
                      map-options
                      use-input
                      input-debounce="0"
                      @filter="filterProveedoresFn"
                      outlined
                      dense
                      options-dense
                      behavior="menu"
                      clearable
                      bg-color="white"
                      :rules="[(val) => !!val || 'Seleccione el proveedor']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="storefront" color="primary" />
                      </template>
                    </q-select>
                  </div>

                  <!-- Archivo PDF de esta Cotización -->
                  <div class="col-12 col-sm-5 col-md-5">
                    <q-file
                      v-model="cot.cotizacionFile"
                      label="Archivo Cotización (PDF)"
                      outlined
                      dense
                      bg-color="white"
                      accept=".pdf,application/pdf"
                      max-file-size="15728640"
                      @rejected="onRejectedFile"
                      @update:model-value="(file) => onCotizacionFileChange(file, cot)"
                      clearable
                      @clear="clearCotizacion(cot)"
                    >
                      <template v-slot:prepend>
                        <q-icon name="picture_as_pdf" color="red-8" />
                      </template>
                      <template v-slot:append>
                        <q-btn
                          v-if="cot.cotizacion_url"
                          flat
                          round
                          dense
                          color="primary"
                          icon="open_in_new"
                          @click.stop="openPdf(cot.cotizacion_url)"
                        >
                          <q-tooltip>Ver cotización PDF guardada</q-tooltip>
                        </q-btn>
                      </template>
                    </q-file>
                    <div
                      v-if="cot.cotizacion_url && !cot.cotizacionFile"
                      class="text-caption text-grey-7 q-mt-xs flex items-center"
                    >
                      <q-icon
                        name="check_circle"
                        color="positive"
                        size="14px"
                        class="q-mr-xs"
                      />
                      Cotización ya guardada previamente
                    </div>
                  </div>

                  <!-- Fila 2: Cantidad y Valores Financieros -->
                  <div class="col-6 col-sm-2 col-md-2">
                    <q-input
                      v-model.number="cot.cantidad"
                      type="number"
                      step="1"
                      min="1"
                      label="Cantidad *"
                      outlined
                      dense
                      bg-color="white"
                      @update:model-value="onPrecioCantidadChange(cot)"
                    />
                  </div>

                  <div class="col-6 col-sm-2 col-md-2">
                    <q-input
                      v-model.number="cot.precio_unitario"
                      type="number"
                      step="0.01"
                      min="0"
                      prefix="$"
                      label="P. Unitario"
                      outlined
                      dense
                      bg-color="white"
                      @update:model-value="onPrecioCantidadChange(cot)"
                    />
                  </div>

                  <div class="col-6 col-sm-3 col-md-3">
                    <q-input
                      v-model.number="cot.subtotal"
                      type="number"
                      step="0.01"
                      min="0"
                      prefix="$"
                      label="Subtotal *"
                      outlined
                      dense
                      bg-color="white"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '' && Number(val) >= 0) ||
                          'Requerido',
                      ]"
                      @update:model-value="onSubtotalChange(cot)"
                    />
                  </div>

                  <div class="col-6 col-sm-2 col-md-2">
                    <q-input
                      v-model.number="cot.iva"
                      type="number"
                      step="0.01"
                      min="0"
                      prefix="$"
                      label="IVA (16%) *"
                      outlined
                      dense
                      bg-color="white"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '' && Number(val) >= 0) ||
                          'Requerido',
                      ]"
                      @update:model-value="onIvaChange(cot)"
                    />
                  </div>

                  <div class="col-12 col-sm-3 col-md-3">
                    <q-input
                      v-model.number="cot.total"
                      type="number"
                      step="0.01"
                      min="0"
                      prefix="$"
                      label="Total *"
                      outlined
                      dense
                      bg-color="green-1"
                      class="text-weight-bold"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '' && Number(val) >= 0) ||
                          'Requerido',
                      ]"
                    />
                  </div>

                  <!-- Fila 3: Datos Fiscales de la Cotización -->
                  <div class="col-12 col-sm-4 col-md-4">
                    <q-select
                      v-model="cot.forma_pago_id"
                      :options="filteredFormasPago"
                      label="Forma de Pago *"
                      option-value="id"
                      :option-label="(opt) => opt ? `${opt.clave} - ${opt.nombre}` : ''"
                      emit-value
                      map-options
                      use-input
                      input-debounce="0"
                      @filter="filterFormasPagoFn"
                      outlined
                      dense
                      options-dense
                      behavior="menu"
                      clearable
                      bg-color="white"
                      :rules="[(val) => !!val || 'Seleccione la forma de pago']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="payments" color="primary" />
                      </template>
                    </q-select>
                  </div>

                  <div class="col-12 col-sm-4 col-md-4">
                    <q-select
                      v-model="cot.metodo_pago_id"
                      :options="filteredMetodosPago"
                      label="Método de Pago *"
                      option-value="id"
                      :option-label="(opt) => opt ? `${opt.clave} - ${opt.nombre}` : ''"
                      emit-value
                      map-options
                      use-input
                      input-debounce="0"
                      @filter="filterMetodosPagoFn"
                      outlined
                      dense
                      options-dense
                      behavior="menu"
                      clearable
                      bg-color="white"
                      :rules="[(val) => !!val || 'Seleccione el método de pago']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="credit_card" color="primary" />
                      </template>
                    </q-select>
                  </div>

                  <div class="col-12 col-sm-4 col-md-4">
                    <q-select
                      v-model="cot.uso_cfdi_id"
                      :options="filteredUsosCfdi"
                      label="Uso de CFDI *"
                      option-value="id"
                      :option-label="(opt) => opt ? `${opt.clave} - ${opt.nombre}` : ''"
                      emit-value
                      map-options
                      use-input
                      input-debounce="0"
                      @filter="filterUsosCfdiFn"
                      outlined
                      dense
                      options-dense
                      behavior="menu"
                      clearable
                      bg-color="white"
                      :rules="[(val) => !!val || 'Seleccione el uso de CFDI']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="receipt_long" color="primary" />
                      </template>
                    </q-select>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Resumen General de la Orden -->
    <q-card flat bordered class="q-mt-md bg-green-1 border-positive">
      <q-card-section class="q-py-sm q-px-md row items-center justify-between">
        <div class="text-subtitle2 text-grey-9 flex items-center">
          <q-icon name="summarize" size="20px" class="q-mr-xs text-positive" />
          Resumen: {{ conceptos.length }} concepto(s) &bull; {{ totalCotizacionesCount }} cotización(es) en total
        </div>
        <div class="row q-gutter-x-lg items-center">
          <div class="text-caption text-grey-8">
            Subtotal acumulado:
            <strong class="text-body2">{{ formatCurrency(summaryTotals.subtotal) }}</strong>
          </div>
          <div class="text-caption text-grey-8">
            IVA acumulado:
            <strong class="text-body2">{{ formatCurrency(summaryTotals.iva) }}</strong>
          </div>
          <div class="text-subtitle1 text-weight-bolder text-positive">
            Total acumulado: {{ formatCurrency(summaryTotals.total) }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import {
  sendRequest,
  checkRole,
  checkPuestoIncludes,
} from "src/boot/functions";

const props = defineProps({
  service: {
    type: Object,
    default: null,
  },
  catalogs: {
    type: Object,
    default: null,
  },
  fixedVehicleId: {
    type: [Number, String],
    default: null,
  },
  allowedVehicles: {
    type: Array,
    default: null,
  },
  defaultSolicitanteId: {
    type: [Number, String],
    default: null,
  },
});

const $q = useQuasar();
const myForm = ref(null);

const vehicles = ref([]);
const filteredVehicles = ref([]);
const empleados = ref([]);
const filteredEmpleados = ref([]);
const proveedores = ref([]);
const filteredProveedores = ref([]);
const tiposServicio = ref([]);
const filteredTiposServicio = ref([]);
const serviciosCat = ref([]);
const sucursalesCargo = ref([]);
const filteredSucursalesCargo = ref([]);
const deptosCargo = ref([]);
const filteredDeptosCargo = ref([]);
const formasPago = ref([]);
const filteredFormasPago = ref([]);
const metodosPago = ref([]);
const filteredMetodosPago = ref([]);
const usosCfdi = ref([]);
const filteredUsosCfdi = ref([]);

const todayStr = new Date().toISOString().slice(0, 10);

const getInitialKm = (srv) => {
  const raw =
    srv?.detalles || srv?.detalles_servicio || srv?.detallesServicio || [];
  const kms = raw.map((d) => Number(d.km_evento || 0)).filter((k) => k > 0);
  return kms.length > 0 ? Math.max(...kms) : null;
};

const initialDetails =
  props.service?.detalles ||
  props.service?.detalles_servicio ||
  props.service?.detallesServicio ||
  [];
const firstDetalle = initialDetails[0] || null;

const formHeader = ref({
  id: props.service?.id || null,
  vehicle_id:
    props.service?.vehicle_id ||
    (props.fixedVehicleId ? Number(props.fixedVehicleId) : null),
  fecha_elaboracion: props.service?.fecha_elaboracion
    ? String(props.service.fecha_elaboracion).slice(0, 10)
    : todayStr,
  km_evento: getInitialKm(props.service),
  autorizacion_compras: props.service?.autorizacion_compras || null,
  orden_compra: props.service?.orden_compra || null,
  factura: props.service?.factura || null,
  solicitante_id:
    props.service?.solicitante_id ||
    (props.defaultSolicitanteId ? Number(props.defaultSolicitanteId) : null),
  suc_cargo_id: props.service?.suc_cargo_id || null,
  depto_cargo_id: props.service?.depto_cargo_id || null,
  forma_pago_id:
    firstDetalle?.forma_pago_id ||
    firstDetalle?.forma_pago?.id ||
    firstDetalle?.formaPago?.id ||
    null,
  metodo_pago_id:
    firstDetalle?.metodo_pago_id ||
    firstDetalle?.metodo_pago?.id ||
    firstDetalle?.metodoPago?.id ||
    null,
  uso_cfdi_id:
    firstDetalle?.uso_cfdi_id ||
    firstDetalle?.uso_cfdi?.id ||
    firstDetalle?.usoCfdi?.id ||
    null,
});

const createEmptyCotizacion = () => ({
  id: null,
  proveedor_id: null,
  forma_pago_id: formHeader.value?.forma_pago_id || null,
  metodo_pago_id: formHeader.value?.metodo_pago_id || null,
  uso_cfdi_id: formHeader.value?.uso_cfdi_id || null,
  cantidad: 1,
  precio_unitario: null,
  subtotal: 0,
  iva: 0,
  total: 0,
  cotizacion_url: null,
  cotizacionFile: null,
  base64: null,
  archivo: null,
});

const createEmptyConcepto = () => ({
  tipo_servicio_id: null,
  servicio_id: null,
  servicioSearch: "",
  descripcion: "",
  llanta_anchura: null,
  llanta_altura: null,
  llanta_rin: null,
  cotizaciones: [createEmptyCotizacion()],
});

const mapInitialConceptos = (srv) => {
  const raw =
    srv?.detalles || srv?.detalles_servicio || srv?.detallesServicio || [];
  if (!raw.length) {
    return [createEmptyConcepto()];
  }

  const map = new Map();
  raw.forEach((d) => {
    const tipoId =
      d.servicio?.tipo_servicio_id ||
      d.servicio?.tipo_servicio?.id ||
      d.servicio?.tipoServicio?.id ||
      null;
    const srvId = d.servicio_id || d.servicio?.id || null;
    const desc = (d.descripcion || "").trim();
    const anchura = d.llanta_anchura ?? "";
    const altura = d.llanta_altura ?? "";
    const rin = d.llanta_rin ?? "";

    const groupKey = `${srvId}_${desc}_${anchura}_${altura}_${rin}`;

    if (!map.has(groupKey)) {
      map.set(groupKey, {
        tipo_servicio_id: tipoId,
        servicio_id: srvId,
        servicioSearch: "",
        descripcion: d.descripcion || "",
        llanta_anchura:
          d.llanta_anchura !== null && d.llanta_anchura !== undefined
            ? Number(d.llanta_anchura)
            : null,
        llanta_altura:
          d.llanta_altura !== null && d.llanta_altura !== undefined
            ? Number(d.llanta_altura)
            : null,
        llanta_rin:
          d.llanta_rin !== null && d.llanta_rin !== undefined
            ? Number(d.llanta_rin)
            : null,
        cotizaciones: [],
      });
    }

    map.get(groupKey).cotizaciones.push({
      id: d.id,
      proveedor_id: d.proveedor_id || d.proveedor?.id || null,
      forma_pago_id: d.forma_pago_id || d.forma_pago?.id || d.formaPago?.id || null,
      metodo_pago_id: d.metodo_pago_id || d.metodo_pago?.id || d.metodoPago?.id || null,
      uso_cfdi_id: d.uso_cfdi_id || d.uso_cfdi?.id || d.usoCfdi?.id || null,
      cantidad:
        d.cantidad !== null && d.cantidad !== undefined
          ? Number(d.cantidad)
          : 1,
      precio_unitario:
        d.precio_unitario !== null && d.precio_unitario !== undefined
          ? Number(d.precio_unitario)
          : null,
      subtotal: Number(d.subtotal || 0),
      iva: Number(d.iva || 0),
      total: Number(d.total || 0),
      cotizacion_url: d.cotizacion_url || null,
      cotizacionFile: null,
      base64: null,
      archivo: null,
    });
  });

  return Array.from(map.values());
};

const conceptos = ref(mapInitialConceptos(props.service));

// Al cambiar la forma, método o uso en la cabecera, autoseleccionar en cotizaciones que estén vacías
watch(
  () => formHeader.value.forma_pago_id,
  (newVal) => {
    if (newVal) {
      conceptos.value.forEach((concepto) => {
        concepto.cotizaciones?.forEach((cot) => {
          if (!cot.forma_pago_id) {
            cot.forma_pago_id = newVal;
          }
        });
      });
    }
  }
);

watch(
  () => formHeader.value.metodo_pago_id,
  (newVal) => {
    if (newVal) {
      conceptos.value.forEach((concepto) => {
        concepto.cotizaciones?.forEach((cot) => {
          if (!cot.metodo_pago_id) {
            cot.metodo_pago_id = newVal;
          }
        });
      });
    }
  }
);

watch(
  () => formHeader.value.uso_cfdi_id,
  (newVal) => {
    if (newVal) {
      conceptos.value.forEach((concepto) => {
        concepto.cotizaciones?.forEach((cot) => {
          if (!cot.uso_cfdi_id) {
            cot.uso_cfdi_id = newVal;
          }
        });
      });
    }
  }
);

const applyHeaderFiscalToAllCotizaciones = () => {
  let count = 0;
  conceptos.value.forEach((concepto) => {
    concepto.cotizaciones?.forEach((cot) => {
      if (formHeader.value.forma_pago_id) {
        cot.forma_pago_id = formHeader.value.forma_pago_id;
      }
      if (formHeader.value.metodo_pago_id) {
        cot.metodo_pago_id = formHeader.value.metodo_pago_id;
      }
      if (formHeader.value.uso_cfdi_id) {
        cot.uso_cfdi_id = formHeader.value.uso_cfdi_id;
      }
      count++;
    });
  });
  $q.notify({
    type: "positive",
    message: `Datos fiscales de cabecera aplicados a ${count} cotización(es).`,
    timeout: 2000,
  });
};

const addConcepto = () => {
  conceptos.value.push(createEmptyConcepto());
};

const removeConcepto = (index) => {
  if (conceptos.value.length > 1) {
    conceptos.value.splice(index, 1);
  }
};

const addCotizacion = (concepto) => {
  concepto.cotizaciones.push(createEmptyCotizacion());
};

const removeCotizacion = (concepto, cIndex) => {
  if (concepto.cotizaciones.length > 1) {
    concepto.cotizaciones.splice(cIndex, 1);
  }
};

const getConceptoServiceName = (concepto) => {
  if (!concepto.servicio_id) return "";
  const found = serviciosCat.value.find(
    (s) => Number(s.id) === Number(concepto.servicio_id)
  );
  return found?.nombre || "";
};

const getProveedorName = (provId) => {
  if (!provId) return "";
  const found = proveedores.value.find((p) => Number(p.id) === Number(provId));
  return found?.nombre || "";
};

const onRejectedFile = () => {
  $q.notify({
    type: "negative",
    message:
      "El archivo no es válido. Asegúrese de que sea un PDF de máximo 15 MB.",
  });
};

const onCotizacionFileChange = (file, cot) => {
  if (!file) {
    cot.archivo = null;
    cot.base64 = null;
    return;
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    $q.notify({
      type: "negative",
      message: "Solo se permiten archivos en formato PDF (.pdf).",
    });
    cot.cotizacionFile = null;
    cot.archivo = null;
    cot.base64 = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Data = e.target.result;
    cot.base64 = base64Data;
    cot.archivo = {
      name: file.name,
      extension: "pdf",
      base64: base64Data,
    };
  };
  reader.readAsDataURL(file);
};

const clearCotizacion = (cot) => {
  cot.cotizacionFile = null;
  cot.archivo = null;
  cot.base64 = null;
};

const openPdf = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};

const selectedVehicle = computed(() => {
  if (!formHeader.value.vehicle_id) return null;
  return (
    vehicles.value.find(
      (v) => Number(v.id) === Number(formHeader.value.vehicle_id)
    ) || null
  );
});

const ultimoKmUnidad = computed(() => {
  return Number(selectedVehicle.value?.ultimo_km || 0);
});

const validateKm = (val) => {
  if (val === null || val === "" || val === undefined) {
    return "Ingrese el kilometraje";
  }
  const num = Number(val);
  if (isNaN(num) || num < 0) {
    return "El kilometraje no puede ser negativo";
  }
  if (ultimoKmUnidad.value > 0 && num < ultimoKmUnidad.value) {
    return `No puede ser menor al último KM registrado (${formatKm(
      ultimoKmUnidad.value
    )})`;
  }
  return true;
};

const getServiciosOptionsForConcept = (concepto) => {
  let list = serviciosCat.value;
  if (concepto.tipo_servicio_id) {
    list = list.filter(
      (s) => Number(s.tipo_servicio_id) === Number(concepto.tipo_servicio_id)
    );
  }
  if (concepto.servicioSearch) {
    const q = concepto.servicioSearch.toLowerCase();
    list = list.filter((s) => s.nombre && s.nombre.toLowerCase().includes(q));
  }
  return list;
};

const filterServiciosConceptFn = (concepto, val, update) => {
  update(() => {
    concepto.servicioSearch = val || "";
  });
};

const isLlantaService = (concepto) => {
  if (!concepto?.servicio_id) return false;
  const srv = serviciosCat.value.find(
    (s) => Number(s.id) === Number(concepto.servicio_id)
  );
  if (!srv) return false;

  const tipoId = concepto.tipo_servicio_id || srv.tipo_servicio_id;
  const tipoObj =
    tiposServicio.value.find((t) => Number(t.id) === Number(tipoId)) ||
    srv.tipo_servicio ||
    srv.tipoServicio;

  const tipoNombre = (tipoObj?.nombre || "").trim().toLowerCase();
  const servicioNombre = (srv.nombre || "").trim().toLowerCase();

  return (
    (tipoNombre.includes("refaccion") || tipoNombre.includes("refacción")) &&
    servicioNombre.includes("llanta")
  );
};

const clearLlantaFieldsIfNeeded = (concepto) => {
  if (!isLlantaService(concepto)) {
    concepto.llanta_anchura = null;
    concepto.llanta_altura = null;
    concepto.llanta_rin = null;
  }
};

const onTipoChange = (concepto) => {
  if (concepto.tipo_servicio_id && concepto.servicio_id) {
    const found = serviciosCat.value.find(
      (s) => Number(s.id) === Number(concepto.servicio_id)
    );
    if (
      found &&
      Number(found.tipo_servicio_id) !== Number(concepto.tipo_servicio_id)
    ) {
      concepto.servicio_id = null;
    }
  }
  clearLlantaFieldsIfNeeded(concepto);
};

const onServicioSelect = (concepto, servicioId) => {
  if (servicioId) {
    const found = serviciosCat.value.find(
      (s) => Number(s.id) === Number(servicioId)
    );
    if (found && found.tipo_servicio_id) {
      concepto.tipo_servicio_id = found.tipo_servicio_id;
    }
  }
  clearLlantaFieldsIfNeeded(concepto);
};

const onPrecioCantidadChange = (cot) => {
  if (
    cot.precio_unitario !== null &&
    cot.precio_unitario !== "" &&
    cot.precio_unitario !== undefined &&
    cot.cantidad !== null &&
    cot.cantidad !== "" &&
    cot.cantidad !== undefined
  ) {
    const cant = Number(cot.cantidad || 1);
    const pu = Number(cot.precio_unitario || 0);
    cot.subtotal = Number((cant * pu).toFixed(2));
    cot.iva = Number((cot.subtotal * 0.16).toFixed(2));
    cot.total = Number((cot.subtotal + cot.iva).toFixed(2));
  }
};

const onSubtotalChange = (cot) => {
  const sub = Number(cot.subtotal || 0);
  cot.iva = Number((sub * 0.16).toFixed(2));
  cot.total = Number((sub + cot.iva).toFixed(2));
};

const onIvaChange = (cot) => {
  const sub = Number(cot.subtotal || 0);
  const iva = Number(cot.iva || 0);
  cot.total = Number((sub + iva).toFixed(2));
};

const totalCotizacionesCount = computed(() => {
  return conceptos.value.reduce(
    (acc, c) => acc + (c.cotizaciones ? c.cotizaciones.length : 0),
    0
  );
});

const summaryTotals = computed(() => {
  const totals = { subtotal: 0, iva: 0, total: 0 };
  conceptos.value.forEach((concepto) => {
    concepto.cotizaciones.forEach((cot) => {
      totals.subtotal += Number(cot.subtotal || 0);
      totals.iva += Number(cot.iva || 0);
      totals.total += Number(cot.total || 0);
    });
  });
  return totals;
});

const filterVehiclesFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredVehicles.value = vehicles.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredVehicles.value = vehicles.value.filter(
      (v) =>
        (v.placas && v.placas.toLowerCase().includes(q)) ||
        (v.serie && v.serie.toLowerCase().includes(q)) ||
        (v.estatus?.nombre && v.estatus.nombre.toLowerCase().includes(q))
    );
  });
};

const filterProveedoresFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredProveedores.value = proveedores.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredProveedores.value = proveedores.value.filter(
      (p) => p.nombre && p.nombre.toLowerCase().includes(q)
    );
  });
};

const filterEmpleadosFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredEmpleados.value = empleados.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredEmpleados.value = empleados.value.filter(
      (e) => e.nombreCompleto && e.nombreCompleto.toLowerCase().includes(q)
    );
  });
};

const filterSucursalesCargoFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredSucursalesCargo.value = sucursalesCargo.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredSucursalesCargo.value = sucursalesCargo.value.filter(
      (s) => s.nombre && s.nombre.toLowerCase().includes(q)
    );
  });
};

const filterDeptosCargoFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredDeptosCargo.value = deptosCargo.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredDeptosCargo.value = deptosCargo.value.filter(
      (d) => d.nombre && d.nombre.toLowerCase().includes(q)
    );
  });
};

const filterTiposServicioFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredTiposServicio.value = tiposServicio.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredTiposServicio.value = tiposServicio.value.filter(
      (t) => t.nombre && t.nombre.toLowerCase().includes(q)
    );
  });
};

const filterFormasPagoFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredFormasPago.value = formasPago.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredFormasPago.value = formasPago.value.filter(
      (f) =>
        (f.clave && f.clave.toLowerCase().includes(q)) ||
        (f.nombre && f.nombre.toLowerCase().includes(q))
    );
  });
};

const filterMetodosPagoFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredMetodosPago.value = metodosPago.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredMetodosPago.value = metodosPago.value.filter(
      (m) =>
        (m.clave && m.clave.toLowerCase().includes(q)) ||
        (m.nombre && m.nombre.toLowerCase().includes(q))
    );
  });
};

const filterUsosCfdiFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredUsosCfdi.value = usosCfdi.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredUsosCfdi.value = usosCfdi.value.filter(
      (u) =>
        (u.clave && u.clave.toLowerCase().includes(q)) ||
        (u.nombre && u.nombre.toLowerCase().includes(q))
    );
  });
};

const applyCatalogs = (res) => {
  if (!res) return;
  const allVehicles = res.vehicles || [];
  if (props.allowedVehicles && props.allowedVehicles.length > 0) {
    const allowedIds = props.allowedVehicles.map((v) => Number(v.id));
    const matched = allVehicles.filter((v) =>
      allowedIds.includes(Number(v.id))
    );
    vehicles.value = matched.length > 0 ? matched : props.allowedVehicles;
  } else {
    vehicles.value = allVehicles;
  }
  filteredVehicles.value = vehicles.value;
  empleados.value = res.empleados || [];
  filteredEmpleados.value = empleados.value;
  proveedores.value = res.proveedores || [];
  filteredProveedores.value = proveedores.value;
  tiposServicio.value = res.tipos_servicio || [];
  filteredTiposServicio.value = tiposServicio.value;
  serviciosCat.value = res.servicios_cat || [];
  sucursalesCargo.value = res.sucursales_cargo || [];
  filteredSucursalesCargo.value = sucursalesCargo.value;
  deptosCargo.value = res.deptos_cargo || [];
  filteredDeptosCargo.value = deptosCargo.value;
  formasPago.value = res.formas_pago || [];
  filteredFormasPago.value = formasPago.value;
  metodosPago.value = res.metodos_pago || [];
  filteredMetodosPago.value = metodosPago.value;
  usosCfdi.value = res.usos_cfdi || [];
  filteredUsosCfdi.value = usosCfdi.value;
};

const getForms = async () => {
  if (props.catalogs && props.catalogs.vehicles?.length) {
    applyCatalogs(props.catalogs);
    return;
  }
  const res = await sendRequest("GET", null, "/api/service/forms", "");
  applyCatalogs(res);
};

const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
};

const formatKm = (val) => {
  return `${Number(val || 0).toLocaleString("es-MX")} km`;
};

const validate = async () => {
  return await myForm.value.validate();
};

const formService = computed(() => {
  const flatDetalles = [];
  conceptos.value.forEach((concepto) => {
    concepto.cotizaciones.forEach((cot) => {
      flatDetalles.push({
        id: cot.id || undefined,
        servicio_id: concepto.servicio_id,
        proveedor_id: cot.proveedor_id,
        forma_pago_id: cot.forma_pago_id ? Number(cot.forma_pago_id) : null,
        metodo_pago_id: cot.metodo_pago_id ? Number(cot.metodo_pago_id) : null,
        uso_cfdi_id: cot.uso_cfdi_id ? Number(cot.uso_cfdi_id) : null,
        km_evento:
          formHeader.value.km_evento !== null &&
          formHeader.value.km_evento !== "" &&
          formHeader.value.km_evento !== undefined
            ? Number(formHeader.value.km_evento)
            : null,
        vehicle_id: formHeader.value.vehicle_id
          ? Number(formHeader.value.vehicle_id)
          : null,
        descripcion: concepto.descripcion,
        cantidad:
          cot.cantidad !== null && cot.cantidad !== ""
            ? Number(cot.cantidad)
            : 1,
        precio_unitario:
          cot.precio_unitario !== null && cot.precio_unitario !== ""
            ? Number(cot.precio_unitario)
            : null,
        llanta_anchura:
          concepto.llanta_anchura !== null && concepto.llanta_anchura !== ""
            ? Number(concepto.llanta_anchura)
            : null,
        llanta_altura:
          concepto.llanta_altura !== null && concepto.llanta_altura !== ""
            ? Number(concepto.llanta_altura)
            : null,
        llanta_rin:
          concepto.llanta_rin !== null && concepto.llanta_rin !== ""
            ? Number(concepto.llanta_rin)
            : null,
        subtotal: Number(cot.subtotal || 0),
        iva: Number(cot.iva || 0),
        total: Number(cot.total || 0),
        cotizacion_url: cot.cotizacion_url || null,
        base64: cot.base64 || null,
        archivo: cot.archivo || null,
      });
    });
  });

  return {
    ...formHeader.value,
    proveedor_id: null,
    detalles: flatDetalles,
  };
});

onMounted(() => {
  getForms();
});

defineExpose({
  formService,
  validate,
});
</script>

<style scoped>
.concept-card {
  border-left: 5px solid var(--q-primary);
}
.quote-card {
  border-left: 4px solid var(--q-teal-8, #00897b);
  background-color: #fafafa;
}
.border-positive {
  border: 1px solid var(--q-positive);
}
.border-orange {
  border: 1px solid #ffb74d;
}
.border-grey {
  border: 1px dashed #b0bec5;
}
</style>
