<template>
  <q-card flat bordered class="q-pa-none bg-grey-1">
    <!-- Encabezado de la Orden -->
    <q-card-section class="bg-primary text-white q-py-sm q-px-md">
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-x-sm">
          <q-avatar
            icon="receipt_long"
            color="white"
            text-color="primary"
            size="40px"
          />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Orden de Compra #{{ service?.id }}
            </div>
            <div class="text-caption text-blue-1">
              Fecha:
              <strong>{{ formatFecha(service?.fecha_elaboracion) }}</strong>
              <span v-if="service?.orden_compra || service?.id">
                &bull; OC:
                <strong>{{ service.orden_compra || service.id }}</strong>
              </span>
              <span v-if="service?.autorizacion_compras">
                &bull; Aut. Compras:
                <strong>{{ service.autorizacion_compras }}</strong>
              </span>
            </div>
          </div>
        </div>
        <div class="row items-center q-gutter-x-md">
          <q-btn
            v-if="service?.cotizacion_url"
            unelevated
            dense
            color="white"
            text-color="negative"
            icon="picture_as_pdf"
            label="Ver Cotización"
            class="q-px-sm text-weight-bold"
            @click="openPdf(service.cotizacion_url)"
          >
            <q-tooltip>Abrir documento de cotización en PDF</q-tooltip>
          </q-btn>
          <div class="text-right">
            <div class="text-caption text-blue-1">Total de la Orden</div>
            <div class="text-h6 text-weight-bolder text-white">
              {{ isTotalPending ? "Pendiente" : formatCurrency(orderTotals.total) }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-md">
      <!-- Datos de la Unidad y de la Orden -->
      <div class="row q-col-gutter-md q-mb-md">
        <!-- Tarjeta Unidad -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section
              class="q-py-xs q-px-md bg-grey-2 text-subtitle2 text-weight-bold text-primary flex items-center"
            >
              <q-icon name="directions_car" class="q-mr-xs" size="18px" />
              Datos de la Unidad
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <div class="text-caption text-grey-7">Placas Actuales</div>
                  <div class="text-body1 text-weight-bold text-primary">
                    {{ service?.vehicle?.placas || "S/P" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Tipo de Vehículo</div>
                  <div class="text-body2 text-weight-medium">
                    {{ service?.vehicle?.estatus?.nombre || "No definido" }}
                  </div>
                </div>
                <div class="col-12">
                  <div class="text-caption text-grey-7">Serie (VIN)</div>
                  <div class="text-body2 text-weight-bold font-mono">
                    {{ service?.vehicle?.serie || "Sin serie" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Sucursal Unidad</div>
                  <div class="text-body2">
                    {{ service?.vehicle?.sucursal?.nombre || "-" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">
                    Departamento Unidad
                  </div>
                  <div class="text-body2">
                    {{ service?.vehicle?.departamento?.nombre || "-" }}
                  </div>
                </div>
                <div class="col-12 q-mt-xs">
                  <q-badge
                    :color="onlyGasolina ? 'amber-1' : 'indigo-1'"
                    :text-color="onlyGasolina ? 'amber-10' : 'indigo-9'"
                    class="q-px-sm q-py-xs"
                  >
                    <q-icon
                      :name="onlyGasolina ? 'local_gas_station' : 'analytics'"
                      size="14px"
                      class="q-mr-xs"
                    />
                    {{
                      onlyGasolina
                        ? "Historial de cargas de gasolina disponible abajo"
                        : "Historial de servicios de la unidad disponible abajo"
                    }}
                  </q-badge>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tarjeta Datos Administrativos -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section
              class="q-py-xs q-px-md bg-grey-2 text-subtitle2 text-weight-bold text-primary flex items-center"
            >
              <q-icon name="business" class="q-mr-xs" size="18px" />
              Información Administrativa y Cargo
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <div class="text-caption text-grey-7">Proveedor / Taller</div>
                  <div class="text-body2 text-weight-bold text-dark">
                    {{ service?.proveedor?.nombre || "No especificado" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Aut. Compras</div>
                  <div class="text-body2 text-weight-medium">
                    {{ service?.autorizacion_compras || "-" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Factura</div>
                  <div class="text-body2 text-weight-medium">
                    {{ service?.factura || "Sin factura" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Sucursal Cargo</div>
                  <div class="text-body2">
                    {{
                      service?.sucursal_cargo?.nombre ||
                      service?.sucursalCargo?.nombre ||
                      "-"
                    }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Departamento Cargo</div>
                  <div class="text-body2">
                    {{
                      service?.departamento_cargo?.nombre ||
                      service?.departamentoCargo?.nombre ||
                      "-"
                    }}
                  </div>
                </div>
                <div class="col-12">
                  <div class="text-caption text-grey-7">
                    Empleado Solicitante
                  </div>
                  <div class="text-body2">
                    {{
                      service?.solicitante?.nombreCompleto || "No registrado"
                    }}
                  </div>
                </div>
                <div class="col-12" v-if="service?.cotizacion_url">
                  <div class="text-caption text-grey-7">Cotización (PDF)</div>
                  <q-btn
                    dense
                    outline
                    color="negative"
                    icon="picture_as_pdf"
                    label="Ver Cotización (PDF)"
                    size="sm"
                    class="q-mt-xs"
                    @click="openPdf(service.cotizacion_url)"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Desplegable: Servicios Realizados en la Orden -->
      <q-card flat bordered class="bg-white q-mb-md">
        <q-expansion-item
          default-opened
          header-class="bg-grey-2 text-primary"
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar
                icon="handyman"
                color="primary"
                text-color="white"
                size="30px"
              />
            </q-item-section>
            <q-item-section>
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center"
              >
                Desglose de Conceptos de la Orden
                <q-badge color="primary" class="q-ml-sm">
                  {{ conceptosAgrupados.length }}
                </q-badge>
                <span class="text-caption text-grey-7 q-ml-sm">
                  ({{ detallesList.length }} cotizaciones registradas)
                </span>
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="text-caption text-grey-8">
                Total:
                <strong :class="isTotalPending ? 'text-orange-9' : 'text-positive'">
                  {{ isTotalPending ? "Pendiente" : formatCurrency(orderTotals.total) }}
                </strong>
              </div>
            </q-item-section>
          </template>

          <q-separator />

          <!-- Lista de Conceptos con sus Cotizaciones Desglosables -->
          <div class="q-pa-sm q-gutter-y-sm">
            <q-card
              v-for="(concepto, cIdx) in conceptosAgrupados"
              :key="concepto.key"
              flat
              bordered
              class="border-concept bg-white"
            >
              <q-expansion-item
                default-opened
                header-class="bg-blue-grey-1 text-blue-grey-9 q-py-xs"
                expand-icon-class="text-blue-grey-9"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-badge color="primary" class="text-weight-bold q-px-sm">
                      Concepto #{{ cIdx + 1 }}
                    </q-badge>
                  </q-item-section>

                  <q-item-section>
                    <div class="row items-center q-gutter-x-xs wrap">
                      <q-badge
                        :color="getTipoColor(concepto.tipo_servicio?.nombre)"
                        class="q-px-sm"
                      >
                        {{ concepto.tipo_servicio?.nombre || "General" }}
                      </q-badge>
                      <span class="text-subtitle2 text-weight-bold text-primary q-ml-xs">
                        {{ concepto.servicio?.nombre || "Servicio" }}
                      </span>
                      <q-badge
                        v-if="
                          concepto.llanta_anchura ||
                          concepto.llanta_altura ||
                          concepto.llanta_rin
                        "
                        color="indigo-7"
                        outline
                        class="q-ml-xs"
                      >
                        <q-icon name="tire_repair" size="14px" class="q-mr-xs" />
                        {{ concepto.llanta_anchura || "-" }}/{{ concepto.llanta_altura || "-" }} R{{ concepto.llanta_rin || "-" }}
                      </q-badge>
                    </div>
                    <div class="text-caption text-grey-8 q-mt-xs">
                      <strong>Descripción:</strong> {{ concepto.descripcion || "Sin descripción" }}
                      <span v-if="concepto.km_evento" class="q-ml-sm text-grey-7">
                        &bull; <strong>KM:</strong> {{ formatKm(concepto.km_evento) }}
                      </span>
                    </div>
                  </q-item-section>

                  <q-item-section side>
                    <div class="row items-center q-gutter-x-xs">
                      <template v-if="canAuthorize">
                        <q-badge
                          v-if="selectedQuotes[concepto.key]"
                          color="positive"
                          class="q-px-sm text-weight-bold"
                        >
                          <q-icon name="check_circle" size="14px" class="q-mr-xs" />
                          Cotización seleccionada
                        </q-badge>
                        <q-badge
                          v-else
                          color="orange-9"
                          outline
                          class="q-px-sm text-weight-medium"
                        >
                          <q-icon name="warning" size="14px" class="q-mr-xs" />
                          Sin selección (Se descartará)
                        </q-badge>

                        <q-btn
                          v-if="selectedQuotes[concepto.key]"
                          flat
                          dense
                          round
                          size="xs"
                          color="negative"
                          icon="close"
                          @click.stop="selectedQuotes[concepto.key] = null"
                        >
                          <q-tooltip>Deseleccionar / Omitir este concepto de la orden</q-tooltip>
                        </q-btn>
                      </template>
                      <q-badge color="teal-8" class="q-px-sm text-weight-bold">
                        {{ concepto.cotizaciones.length }} {{ concepto.cotizaciones.length === 1 ? 'cotización' : 'cotizaciones' }}
                      </q-badge>
                    </div>
                  </q-item-section>
                </template>

                <q-separator />

                <q-markup-table flat dense separator="horizontal">
                  <thead>
                    <tr class="bg-grey-2 text-grey-8 text-caption">
                      <th v-if="canAuthorize" class="text-center" style="width: 80px;">Elegir</th>
                      <th class="text-center" style="width: 130px;">Cotización</th>
                      <th class="text-left">Proveedor / Taller</th>
                      <th class="text-center">Cant.</th>
                      <th class="text-right">P. Unitario</th>
                      <th class="text-right">Subtotal</th>
                      <th class="text-right">IVA</th>
                      <th class="text-right">Total</th>
                      <th class="text-center" style="width: 120px;">Archivo Cotización</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(cot, qIdx) in concepto.cotizaciones"
                      :key="cot.id || qIdx"
                      :class="canAuthorize && selectedQuotes[concepto.key] === cot.id ? 'selected-quote-row' : ''"
                      :style="canAuthorize ? 'cursor: pointer;' : ''"
                      @click="canAuthorize ? selectQuoteForConcept(concepto.key, cot.id) : null"
                    >
                      <td v-if="canAuthorize" class="text-center" @click.stop>
                        <q-radio
                          v-model="selectedQuotes[concepto.key]"
                          :val="cot.id"
                          color="positive"
                          size="sm"
                        />
                      </td>
                      <td class="text-center">
                        <q-badge
                          :color="canAuthorize && selectedQuotes[concepto.key] === cot.id ? 'positive' : 'teal-8'"
                          :outline="!canAuthorize || selectedQuotes[concepto.key] !== cot.id"
                          class="text-weight-bold q-px-sm"
                        >
                          <q-icon
                            v-if="canAuthorize && selectedQuotes[concepto.key] === cot.id"
                            name="check"
                            size="14px"
                            class="q-mr-xs"
                          />
                          Cotización #{{ qIdx + 1 }}
                        </q-badge>
                      </td>
                      <td class="text-left text-weight-medium">
                        <div class="row items-center q-gutter-x-xs">
                          <q-icon name="storefront" color="primary" size="16px" />
                          <span>{{ cot.proveedor?.nombre || props.service?.proveedor?.nombre || "-" }}</span>
                        </div>
                        <div
                          v-if="cot.forma_pago || cot.formaPago || cot.metodo_pago || cot.metodoPago || cot.uso_cfdi || cot.usoCfdi"
                          class="row items-center q-gutter-x-xs q-mt-xs wrap"
                        >
                          <q-badge
                            v-if="cot.formaPago || cot.forma_pago"
                            color="blue-grey-1"
                            text-color="blue-grey-9"
                            class="text-caption text-weight-normal border-grey"
                          >
                            <q-icon name="payments" size="12px" class="q-mr-xs" />
                            {{ (cot.formaPago || cot.forma_pago).clave }} - {{ (cot.formaPago || cot.forma_pago).nombre }}
                          </q-badge>
                          <q-badge
                            v-if="cot.metodoPago || cot.metodo_pago"
                            color="blue-grey-1"
                            text-color="blue-grey-9"
                            class="text-caption text-weight-normal border-grey"
                          >
                            <q-icon name="credit_card" size="12px" class="q-mr-xs" />
                            {{ (cot.metodoPago || cot.metodo_pago).clave }}
                          </q-badge>
                          <q-badge
                            v-if="cot.usoCfdi || cot.uso_cfdi"
                            color="blue-grey-1"
                            text-color="blue-grey-9"
                            class="text-caption text-weight-normal border-grey"
                          >
                            <q-icon name="receipt_long" size="12px" class="q-mr-xs" />
                            {{ (cot.usoCfdi || cot.uso_cfdi).clave }}
                          </q-badge>
                        </div>
                      </td>
                      <td class="text-center font-mono">
                        {{ cot.cantidad || 1 }}
                      </td>
                      <td class="text-right">
                        {{ cot.precio_unitario ? formatCurrency(cot.precio_unitario) : "-" }}
                      </td>
                      <td class="text-right font-mono">
                        {{ formatCurrency(cot.subtotal) }}
                      </td>
                      <td class="text-right font-mono">
                        {{ formatCurrency(cot.iva) }}
                      </td>
                      <td class="text-right font-mono text-weight-bold text-positive text-subtitle2">
                        {{ formatCurrency(cot.total) }}
                      </td>
                      <td class="text-center" @click.stop>
                        <q-btn
                          v-if="cot.cotizacion_url || props.service?.cotizacion_url"
                          unelevated
                          dense
                          size="sm"
                          color="red-8"
                          icon="picture_as_pdf"
                          label="Ver PDF"
                          class="q-px-xs"
                          @click="openPdf(cot.cotizacion_url || props.service?.cotizacion_url)"
                        >
                          <q-tooltip>Abrir cotización PDF</q-tooltip>
                        </q-btn>
                        <span v-else class="text-caption text-grey-5">-</span>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-expansion-item>
            </q-card>
          </div>

          <!-- Pie con resumen total de la orden -->
          <div class="q-px-md q-py-sm bg-grey-1 row items-center justify-between border-top">
            <div class="text-caption text-grey-7">
              Total de conceptos: <strong>{{ conceptosAgrupados.length }}</strong> &bull; Total de cotizaciones: <strong>{{ detallesList.length }}</strong>
              <template v-if="canAuthorize && autorizacionForm.autorizado">
                &bull; Conceptos seleccionados para autorizar: <strong class="text-positive">{{ selectedQuotesList.length }}</strong>
              </template>
            </div>
            <div class="row q-gutter-x-md items-center">
              <span class="text-caption text-grey-8">
                {{ canAuthorize && autorizacionForm.autorizado ? 'Total Autorizado Seleccionado:' : 'Total de la Orden:' }}
              </span>
              <span
                class="text-subtitle1 text-weight-bolder"
                :class="canAuthorize && autorizacionForm.autorizado && selectedQuotesList.length > 0 ? 'text-positive' : (isTotalPending ? 'text-orange-9' : 'text-positive')"
              >
                {{
                  canAuthorize && autorizacionForm.autorizado
                    ? (selectedQuotesList.length > 0 ? formatCurrency(selectedQuotesTotals.total) : 'Pendiente de selección')
                    : (isTotalPending ? "Pendiente" : formatCurrency(orderTotals.total))
                }}
              </span>
            </div>
          </div>
        </q-expansion-item>
      </q-card>

      <!-- Desplegable: Historial de Servicios de la Unidad (Dashboard) -->
      <q-card flat bordered class="bg-white q-mb-md">
        <q-expansion-item
          default-opened
          header-class="bg-grey-2 text-primary"
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar
                :icon="onlyGasolina ? 'local_gas_station' : 'analytics'"
                :color="onlyGasolina ? 'amber-9' : 'indigo-8'"
                text-color="white"
                size="30px"
              />
            </q-item-section>
            <q-item-section>
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center"
              >
                {{
                  onlyGasolina
                    ? "Historial de Cargas de Gasolina de la Unidad (Dashboard)"
                    : "Historial de Servicios de la Unidad (Dashboard)"
                }}
                <q-badge
                  :color="onlyGasolina ? 'amber-9' : 'indigo-8'"
                  class="q-ml-sm"
                >
                  {{ dashboardOrdersCount }}
                  órdenes registradas
                </q-badge>
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="text-caption text-grey-8">
                Unidad:
                <strong class="text-primary">{{
                  service?.vehicle?.placas || "S/P"
                }}</strong>
              </div>
            </q-item-section>
          </template>

          <q-separator />

          <vehicle-services-dashboard
            :vehicle="vehicleHistory || service?.vehicle"
            :loading="loadingHistory"
            :only-gasolina="onlyGasolina"
            embedded
          />
        </q-expansion-item>
      </q-card>

      <!-- Desplegable: Bitácora de Acciones y Movimientos -->
      <q-card flat bordered class="bg-white q-mb-md">
        <q-expansion-item
          default-opened
          header-class="bg-grey-2 text-primary"
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar
                icon="history"
                color="blue-8"
                text-color="white"
                size="30px"
              />
            </q-item-section>
            <q-item-section>
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center"
              >
                Bitácora de Movimientos
                <q-badge color="blue-8" class="q-ml-sm">
                  {{ bitacoraList.length }}
                </q-badge>
              </div>
            </q-item-section>
            <q-item-section side>
              <div
                v-if="bitacoraList.length > 0"
                class="text-caption text-grey-7"
              >
                Último:
                <span class="text-weight-bold">{{
                  bitacoraList[0]?.estatus?.nombre || "Registrado"
                }}</span>
              </div>
            </q-item-section>
          </template>

          <q-separator />

          <div
            v-if="bitacoraList.length === 0"
            class="q-pa-md text-center text-grey-6"
          >
            <q-icon name="history_toggle_off" size="28px" class="q-mb-xs" />
            <div class="text-caption">
              No hay registros en la bitácora de esta orden.
            </div>
          </div>

          <q-markup-table v-else flat dense separator="horizontal">
            <thead>
              <tr class="bg-grey-1 text-grey-8">
                <th class="text-left" style="width: 175px">Fecha y Hora</th>
                <th class="text-left" style="width: 140px">Estatus</th>
                <th class="text-left" style="width: 250px">
                  Usuario / Empleado
                </th>
                <th class="text-left">Comentarios</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in bitacoraList" :key="item.id">
                <td class="text-caption font-mono">
                  <q-icon
                    name="schedule"
                    size="14px"
                    class="q-mr-xs text-grey-7"
                  />
                  {{ formatFechaHora(item.created_at) }}
                </td>
                <td>
                  <q-badge
                    :style="
                      item.estatus?.color
                        ? { backgroundColor: item.estatus.color }
                        : null
                    "
                    :color="!item.estatus?.color ? 'primary' : null"
                    class="q-px-sm"
                  >
                    {{ item.estatus?.nombre || "Sin estatus" }}
                  </q-badge>
                </td>
                <td>
                  <div class="text-weight-medium text-dark flex items-center">
                    <q-icon
                      :name="item.user?.empleado ? 'badge' : 'person'"
                      size="16px"
                      class="q-mr-xs text-grey-7"
                    />
                    <span>{{ getUsuarioNombre(item) }}</span>
                  </div>
                  <div
                    v-if="item.user?.empleado && item.user?.name"
                    class="text-caption text-grey-6 q-ml-md"
                  >
                    Usuario: {{ item.user.name }}
                  </div>
                </td>
                <td style="white-space: normal">
                  {{ item.comentarios || "-" }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-expansion-item>
      </q-card>

      <!-- SECCIÓN: Autorización de la Orden de Compra -->
      <q-card
        flat
        bordered
        class="bg-white q-mt-md shadow-1"
        v-if="checkPuesto(['Director administrativo'])"
      >
        <q-card-section
          class="q-py-xs q-px-md flex items-center justify-between"
          :class="autorizacionForm.autorizado ? 'bg-green-1' : 'bg-red-1'"
        >
          <div class="row items-center q-gutter-x-sm">
            <q-avatar
              :icon="autorizacionForm.autorizado ? 'verified' : 'gpp_bad'"
              :color="autorizacionForm.autorizado ? 'positive' : 'negative'"
              text-color="white"
              size="28px"
            />
            <div
              class="text-subtitle2 text-weight-bold"
              :class="
                autorizacionForm.autorizado ? 'text-positive' : 'text-negative'
              "
            >
              Autorización de la Orden de Compra
            </div>
          </div>
          <q-badge
            :color="autorizacionForm.autorizado ? 'positive' : 'negative'"
            class="text-weight-bold q-px-sm"
          >
            {{ autorizacionForm.autorizado ? "AUTORIZAR" : "NO AUTORIZAR" }}
          </q-badge>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-md">
          <q-form ref="autorizarFormRef" @submit.prevent="submitAutorizacion">
            <div class="row q-col-gutter-md items-center">
              <!-- Switch de Autorización (Verdadero o Falso) -->
              <div class="col-12 col-md-5">
                <div class="q-pa-sm rounded-borders bg-grey-1 border-grey">
                  <div
                    class="text-caption text-grey-8 text-weight-medium q-mb-xs"
                  >
                    Decisión de Autorización *
                  </div>
                  <q-toggle
                    v-model="autorizacionForm.autorizado"
                    :label="
                      autorizacionForm.autorizado
                        ? 'Autorizar compra'
                        : 'No autorizar compra'
                    "
                    :color="
                      autorizacionForm.autorizado ? 'positive' : 'negative'
                    "
                    keep-color
                    class="text-weight-bold"
                  />
                  <div class="text-caption text-grey-6 q-mt-xs">
                    {{
                      autorizacionForm.autorizado
                        ? 'Al marcar como verdadero, la orden pasará a estatus "Autorizado".'
                        : 'Al marcar como falso, la orden pasará a estatus "No Autorizado" y es obligatorio indicar los motivos o comentarios.'
                    }}
                  </div>
                </div>
              </div>

              <!-- TextInput para notas o comentario -->
              <div class="col-12 col-md-7">
                <q-input
                  v-model="autorizacionForm.comentarios"
                  type="textarea"
                  rows="2"
                  autogrow
                  outlined
                  dense
                  bg-color="white"
                  :label="
                    autorizacionForm.autorizado
                      ? 'Notas o comentarios (Opcional)'
                      : 'Notas o comentarios del motivo *'
                  "
                  :placeholder="
                    autorizacionForm.autorizado
                      ? 'Observaciones o notas opcionales...'
                      : 'Indique obligatoriamente el motivo por el cual no se autoriza la orden...'
                  "
                  :rules="[
                    (val) =>
                      autorizacionForm.autorizado ||
                      (val && String(val).trim().length > 0) ||
                      'El comentario es obligatorio cuando no se autoriza la orden',
                  ]"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon
                      name="comment"
                      :color="
                        autorizacionForm.autorizado ? 'primary' : 'negative'
                      "
                    />
                  </template>
                </q-input>
              </div>

              <!-- Banner informativo de selección para autorización -->
              <div v-if="autorizacionForm.autorizado" class="col-12">
                <q-banner
                  rounded
                  dense
                  :class="selectedQuotesList.length > 0 ? 'bg-green-1 text-green-10 border-positive' : 'bg-orange-1 text-orange-10 border-orange'"
                  class="q-pa-sm"
                >
                  <template v-slot:avatar>
                    <q-icon
                      :name="selectedQuotesList.length > 0 ? 'check_circle' : 'warning'"
                      :color="selectedQuotesList.length > 0 ? 'positive' : 'warning'"
                      size="20px"
                    />
                  </template>
                  <div class="row items-center justify-between">
                    <div>
                      <strong>{{ selectedQuotesList.length }} de {{ conceptosAgrupados.length }} conceptos seleccionados</strong> para autorizar.
                      <span v-if="selectedQuotesList.length === 0" class="text-weight-bold">
                        (Debes seleccionar al menos una cotización en los conceptos de arriba).
                      </span>
                      <span v-else class="text-caption text-grey-8 q-ml-sm">
                        Total a autorizar: <strong>{{ formatCurrency(selectedQuotesTotals.total) }}</strong> &bull; Las cotizaciones no elegidas se eliminarán de BD y S3.
                      </span>
                    </div>
                  </div>
                </q-banner>
              </div>

              <!-- Botón para confirmar -->
              <div class="col-12 text-right">
                <q-btn
                  unelevated
                  :color="autorizacionForm.autorizado ? 'positive' : 'negative'"
                  :icon="
                    autorizacionForm.autorizado ? 'check_circle' : 'cancel'
                  "
                  :label="
                    autorizacionForm.autorizado
                      ? 'Confirmar Autorización'
                      : 'Confirmar Rechazo'
                  "
                  :loading="submittingAuth"
                  type="submit"
                  class="q-px-md text-weight-bold"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>

  <!-- Modal de Decisión / Resumen para Autorización -->
  <q-dialog v-model="confirmAuthModal" persistent>
    <q-card style="width: 900px; max-width: 95vw;">
      <q-card-section class="bg-primary text-white row items-center q-py-sm">
        <q-avatar icon="verified" color="white" text-color="primary" size="32px" />
        <div class="text-subtitle1 text-weight-bold q-ml-sm">Confirmar Autorización de Orden de Compra</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup :disable="submittingAuth" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="text-h6 text-grey-9 text-weight-bold q-mb-xs">
          ¿Estás seguro de autorizar los siguientes conceptos?
        </div>
        <div class="text-caption text-grey-7 q-mb-md">
          Se autorizará la orden de compra con las cotizaciones seleccionadas a continuación:
        </div>

        <!-- Resumen de Órdenes a Generar por Proveedor -->
        <div class="q-mb-md">
          <!-- Caso 1: Todos del mismo proveedor -->
          <div
            v-if="proveedoresSeleccionados.length === 1"
            class="q-pa-sm rounded-borders bg-blue-1 text-blue-10 border-blue row items-center justify-between"
          >
            <div class="row items-center q-gutter-x-sm">
              <q-icon name="receipt_long" size="24px" color="primary" />
              <div>
                <div class="text-subtitle2 text-weight-bold">
                  Se generará 1 Orden de Compra
                </div>
                <div class="text-caption text-blue-9">
                  Todos los conceptos pertenecen al mismo proveedor:
                  <strong>{{ proveedoresSeleccionados[0].nombre }}</strong>.
                </div>
              </div>
            </div>
            <q-badge color="primary" class="text-subtitle2 text-weight-bolder q-px-sm">
              {{ formatCurrency(proveedoresSeleccionados[0].total) }}
            </q-badge>
          </div>

          <!-- Caso 2: Múltiples proveedores -->
          <div
            v-else-if="proveedoresSeleccionados.length > 1"
            class="q-pa-sm rounded-borders bg-indigo-1 text-indigo-10 border-indigo"
          >
            <div class="row items-center q-gutter-x-sm q-mb-xs">
              <q-icon name="alt_route" size="24px" color="indigo-8" />
              <div>
                <div class="text-subtitle2 text-weight-bold">
                  Se generarán {{ proveedoresSeleccionados.length }} Órdenes de Compra independientes
                </div>
                <div class="text-caption text-grey-8">
                  Al haber diferentes proveedores, se creará una orden de compra para cada uno. Todas compartirán el <strong>mismo folio de Autorización de Compras</strong>:
                </div>
              </div>
            </div>
            <div class="row q-col-gutter-xs q-mt-xs">
              <div
                v-for="(provGroup, pIdx) in proveedoresSeleccionados"
                :key="provGroup.id"
                class="col-12 col-sm-6"
              >
                <div class="q-pa-xs q-px-sm rounded-borders bg-white border-grey row items-center justify-between">
                  <div class="row items-center q-gutter-x-xs ellipsis" style="max-width: 70%;">
                    <q-badge color="indigo-8" outline class="text-weight-bold">
                      OC #{{ pIdx + 1 }}
                    </q-badge>
                    <span class="text-weight-bold ellipsis text-caption">{{ provGroup.nombre }}</span>
                    <span class="text-caption text-grey-7">({{ provGroup.conceptosCount }} concepto{{ provGroup.conceptosCount > 1 ? 's' : '' }})</span>
                  </div>
                  <div class="text-caption text-weight-bolder text-positive font-mono">
                    {{ formatCurrency(provGroup.total) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla resumen de cotizaciones seleccionadas -->
        <q-markup-table flat bordered dense separator="horizontal" class="q-mb-md">
          <thead>
            <tr class="bg-blue-grey-1 text-grey-8 text-caption">
              <th class="text-left" style="width: 220px;">Concepto</th>
              <th class="text-center" style="width: 120px;">Cotización</th>
              <th class="text-left">Proveedor / Taller</th>
              <th class="text-center">Cant.</th>
              <th class="text-right">P. Unitario</th>
              <th class="text-right">Subtotal</th>
              <th class="text-right">IVA</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in selectedQuotesList" :key="idx">
              <td class="text-left">
                <div class="text-weight-bold text-primary">
                  {{ item.concepto.servicio?.nombre || "Servicio" }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ item.concepto.descripcion || "Sin descripción" }}
                  <span v-if="item.concepto.llanta_anchura || item.concepto.llanta_altura || item.concepto.llanta_rin">
                    ({{ item.concepto.llanta_anchura || "-" }}/{{ item.concepto.llanta_altura || "-" }} R{{ item.concepto.llanta_rin || "-" }})
                  </span>
                </div>
              </td>
              <td class="text-center">
                <q-badge color="teal-8" outline class="text-weight-bold q-px-xs">
                  Cotización #{{ item.cotizacionIndex }}
                </q-badge>
              </td>
              <td class="text-left text-weight-medium">
                <div class="row items-center q-gutter-x-xs">
                  <q-icon name="storefront" color="primary" size="14px" />
                  <span>{{ item.cotizacion.proveedor?.nombre || "-" }}</span>
                </div>
                <div
                  v-if="item.cotizacion.forma_pago || item.cotizacion.formaPago || item.cotizacion.metodo_pago || item.cotizacion.metodoPago || item.cotizacion.uso_cfdi || item.cotizacion.usoCfdi"
                  class="row items-center q-gutter-x-xs q-mt-xs wrap"
                >
                  <q-badge
                    v-if="item.cotizacion.formaPago || item.cotizacion.forma_pago"
                    color="blue-grey-1"
                    text-color="blue-grey-9"
                    class="text-caption text-weight-normal border-grey"
                  >
                    <q-icon name="payments" size="11px" class="q-mr-xs" />
                    {{ (item.cotizacion.formaPago || item.cotizacion.forma_pago).clave }} - {{ (item.cotizacion.formaPago || item.cotizacion.forma_pago).nombre }}
                  </q-badge>
                  <q-badge
                    v-if="item.cotizacion.metodoPago || item.cotizacion.metodo_pago"
                    color="blue-grey-1"
                    text-color="blue-grey-9"
                    class="text-caption text-weight-normal border-grey"
                  >
                    <q-icon name="credit_card" size="11px" class="q-mr-xs" />
                    {{ (item.cotizacion.metodoPago || item.cotizacion.metodo_pago).clave }}
                  </q-badge>
                  <q-badge
                    v-if="item.cotizacion.usoCfdi || item.cotizacion.uso_cfdi"
                    color="blue-grey-1"
                    text-color="blue-grey-9"
                    class="text-caption text-weight-normal border-grey"
                  >
                    <q-icon name="receipt_long" size="11px" class="q-mr-xs" />
                    {{ (item.cotizacion.usoCfdi || item.cotizacion.uso_cfdi).clave }}
                  </q-badge>
                </div>
              </td>
              <td class="text-center font-mono">
                {{ item.cotizacion.cantidad || 1 }}
              </td>
              <td class="text-right font-mono">
                {{ item.cotizacion.precio_unitario ? formatCurrency(item.cotizacion.precio_unitario) : "-" }}
              </td>
              <td class="text-right font-mono">
                {{ formatCurrency(item.cotizacion.subtotal) }}
              </td>
              <td class="text-right font-mono">
                {{ formatCurrency(item.cotizacion.iva) }}
              </td>
              <td class="text-right font-mono text-weight-bold text-positive">
                {{ formatCurrency(item.cotizacion.total) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-grey-2 text-weight-bolder">
              <td colspan="5" class="text-right text-subtitle2">Total Autorizado:</td>
              <td class="text-right font-mono">{{ formatCurrency(selectedQuotesTotals.subtotal) }}</td>
              <td class="text-right font-mono">{{ formatCurrency(selectedQuotesTotals.iva) }}</td>
              <td class="text-right font-mono text-positive text-subtitle1">{{ formatCurrency(selectedQuotesTotals.total) }}</td>
            </tr>
          </tfoot>
        </q-markup-table>

        <!-- Banner de advertencia sobre eliminación permanente de S3 y BD -->
        <q-banner rounded class="bg-amber-1 text-amber-10 border-amber q-pa-sm">
          <template v-slot:avatar>
            <q-icon name="warning" color="amber-9" size="24px" />
          </template>
          <div class="text-weight-bold">Aviso importante sobre el almacenamiento:</div>
          <div class="text-caption">
            Al confirmar la autorización, todas las cotizaciones <strong>no seleccionadas</strong> se eliminarán permanentemente de la base de datos junto con sus archivos de cotización PDF en el almacenamiento S3 para liberar espacio. Esta acción no se puede revertir.
          </div>
        </q-banner>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn flat label="Cancelar" color="grey-8" v-close-popup :disable="submittingAuth" />
        <q-btn
          unelevated
          label="Sí, Autorizar Orden"
          color="positive"
          icon="check_circle"
          :loading="submittingAuth"
          @click="executeAuthorization"
          class="q-px-md text-weight-bold"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { date, useQuasar } from "quasar";
import { sendRequest, dataIncomplete, checkPuesto } from "src/boot/functions";
import VehicleServicesDashboard from "src/components/Vehicle/VehicleServicesDashboard.vue";

const props = defineProps({
  service: {
    type: Object,
    default: () => ({}),
  },
  authEndpoint: {
    type: String,
    default: "/api/service/autorizar",
  },
  onlyGasolina: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["authorized"]);

const vehicleHistory = ref(null);
const loadingHistory = ref(false);

const loadVehicleHistory = async (vehicleId) => {
  if (!vehicleId) {
    vehicleHistory.value = null;
    return;
  }
  loadingHistory.value = true;
  try {
    const res = await sendRequest("GET", null, `/api/vehicle/${vehicleId}`, "");
    if (res) {
      vehicleHistory.value = res;
    }
  } catch (e) {
    console.error("Error al cargar historial del vehículo:", e);
  } finally {
    loadingHistory.value = false;
  }
};

const isGasolinaDetalle = (det) => {
  const sName = (det.servicio?.nombre || "").toLowerCase();
  const tName = (
    det.servicio?.tipo_servicio?.nombre ||
    det.servicio?.tipoServicio?.nombre ||
    ""
  ).toLowerCase();
  const tId = Number(
    det.servicio?.tipo_servicio_id || det.servicio?.tipoServicio?.id || 0
  );
  return tName === "gasolina" || tId === 14 || sName.includes("gasolina");
};

const isGasolinaOrden = (orden) => {
  const detalles =
    orden.detalles ||
    orden.detalles_servicio ||
    orden.detallesServicio ||
    [];
  return detalles.some((d) => {
    const sName = (d.servicio?.nombre || "").toLowerCase();
    const tName = (
      d.servicio?.tipo_servicio?.nombre ||
      d.servicio?.tipoServicio?.nombre ||
      ""
    ).toLowerCase();
    const tId = Number(
      d.servicio?.tipo_servicio_id || d.servicio?.tipoServicio?.id || 0
    );
    return tName === "gasolina" || tId === 14 || sName.includes("gasolina");
  });
};

const dashboardOrdersCount = computed(() => {
  const raw =
    vehicleHistory.value?.ordenes_servicio ||
    vehicleHistory.value?.ordenesServicio ||
    props.service?.vehicle?.ordenes_servicio ||
    props.service?.vehicle?.ordenesServicio ||
    [];
  if (!props.onlyGasolina) {
    return raw.length;
  }
  return raw.filter(isGasolinaOrden).length;
});

watch(
  () => props.service?.vehicle_id || props.service?.vehicle?.id,
  (newId) => {
    if (newId) {
      loadVehicleHistory(newId);
    } else {
      vehicleHistory.value = null;
    }
  },
  { immediate: true }
);

const $q = useQuasar();
const autorizarFormRef = ref(null);
const submittingAuth = ref(false);

const autorizacionForm = ref({
  autorizado: true,
  comentarios: "",
});

const selectedQuotes = ref({});
const confirmAuthModal = ref(false);

const isTotalPending = computed(() => {
  const estatusNombre = (props.service?.estatus?.nombre || "").trim().toLowerCase();
  return estatusNombre === "solicitado" || estatusNombre === "no autorizado";
});

const canAuthorize = computed(() => {
  return checkPuesto(["Director administrativo"]) && isTotalPending.value;
});

const selectQuoteForConcept = (conceptKey, cotId) => {
  selectedQuotes.value[conceptKey] = cotId;
};

const initSelectedQuotes = () => {
  const next = { ...selectedQuotes.value };
  conceptosAgrupados.value.forEach((concepto) => {
    const currentVal = next[concepto.key];
    const quoteExists = concepto.cotizaciones?.some((q) => q.id === currentVal);
    if (!quoteExists) {
      if (concepto.cotizaciones && concepto.cotizaciones.length === 1) {
        next[concepto.key] = concepto.cotizaciones[0].id;
      } else {
        next[concepto.key] = null;
      }
    }
  });
  selectedQuotes.value = next;
};

const selectedQuotesList = computed(() => {
  const list = [];
  conceptosAgrupados.value.forEach((c, cIdx) => {
    const selId = selectedQuotes.value[c.key];
    if (selId) {
      const qIdx = c.cotizaciones.findIndex((q) => q.id === selId);
      if (qIdx !== -1) {
        list.push({
          concepto: c,
          conceptoIndex: cIdx + 1,
          cotizacion: c.cotizaciones[qIdx],
          cotizacionIndex: qIdx + 1,
        });
      }
    }
  });
  return list;
});

const selectedQuotesTotals = computed(() => {
  return selectedQuotesList.value.reduce(
    (acc, item) => {
      const q = item.cotizacion;
      acc.subtotal += Number(q.subtotal || 0);
      acc.iva += Number(q.iva || 0);
      acc.total += Number(q.total || 0);
      return acc;
    },
    { subtotal: 0, iva: 0, total: 0 }
  );
});

const proveedoresSeleccionados = computed(() => {
  const map = new Map();
  selectedQuotesList.value.forEach((item) => {
    const pId =
      item.cotizacion.proveedor_id ||
      item.cotizacion.proveedor?.id ||
      "sin_prov";
    const pNombre =
      item.cotizacion.proveedor?.nombre || "Proveedor no asignado";

    if (!map.has(pId)) {
      map.set(pId, {
        id: pId,
        nombre: pNombre,
        conceptosCount: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
        items: [],
      });
    }

    const group = map.get(pId);
    group.conceptosCount += 1;
    group.subtotal += Number(item.cotizacion.subtotal || 0);
    group.iva += Number(item.cotizacion.iva || 0);
    group.total += Number(item.cotizacion.total || 0);
    group.items.push(item);
  });
  return Array.from(map.values());
});

watch(
  () => props.service,
  (newSrv) => {
    if (newSrv) {
      const isNoAutorizado =
        (newSrv.estatus?.nombre || "").toLowerCase() === "no autorizado";
      autorizacionForm.value = {
        autorizado: !isNoAutorizado,
        comentarios: "",
      };
      if (autorizarFormRef.value) {
        autorizarFormRef.value.resetValidation();
      }
    }
  },
  { immediate: true }
);

watch(
  () => autorizacionForm.value.autorizado,
  (val) => {
    if (val && autorizarFormRef.value) {
      autorizarFormRef.value.resetValidation();
    }
  }
);

const submitAutorizacion = async () => {
  if (!props.service?.id) return;

  const isValid = await autorizarFormRef.value.validate();
  if (!isValid) {
    dataIncomplete();
    return;
  }

  // Rechazo de orden
  if (!autorizacionForm.value.autorizado) {
    submittingAuth.value = true;
    try {
      const payload = {
        orden_servicio_id: props.service.id,
        autorizado: false,
        comentarios: autorizacionForm.value.comentarios?.trim() || null,
      };

      const res = await sendRequest(
        "POST",
        payload,
        props.authEndpoint || "/api/service/autorizar"
      );
      emit("authorized", res || props.service);
    } finally {
      submittingAuth.value = false;
    }
    return;
  }

  // Autorización de compra: validar que haya al menos una cotización seleccionada
  if (selectedQuotesList.value.length === 0) {
    $q.notify({
      type: "warning",
      icon: "warning",
      message:
        "Debe seleccionar al menos una cotización en los conceptos para autorizar la orden de compra.",
      position: "top",
    });
    return;
  }

  confirmAuthModal.value = true;
};

const executeAuthorization = async () => {
  if (!props.service?.id) return;

  const selectedIds = selectedQuotesList.value.map((item) => item.cotizacion.id);

  submittingAuth.value = true;
  try {
    const payload = {
      orden_servicio_id: props.service.id,
      autorizado: true,
      comentarios: autorizacionForm.value.comentarios?.trim() || null,
      detalles_ids: selectedIds,
    };

    const res = await sendRequest(
      "POST",
      payload,
      props.authEndpoint || "/api/service/autorizar"
    );
    confirmAuthModal.value = false;
    emit("authorized", res || props.service);
  } finally {
    submittingAuth.value = false;
  }
};

const detallesList = computed(() => {
  return (
    props.service?.detalles ||
    props.service?.detalles_servicio ||
    props.service?.detallesServicio ||
    []
  );
});

const conceptosAgrupados = computed(() => {
  const map = new Map();
  detallesList.value.forEach((d) => {
    const srvId = d.servicio_id || d.servicio?.id || "sin_id";
    const desc = (d.descripcion || "").trim();
    const anchura = d.llanta_anchura ?? "";
    const altura = d.llanta_altura ?? "";
    const rin = d.llanta_rin ?? "";

    const key = `${srvId}_${desc}_${anchura}_${altura}_${rin}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        servicio: d.servicio,
        tipo_servicio:
          d.servicio?.tipo_servicio || d.servicio?.tipoServicio || null,
        descripcion: d.descripcion,
        km_evento: d.km_evento,
        llanta_anchura: d.llanta_anchura,
        llanta_altura: d.llanta_altura,
        llanta_rin: d.llanta_rin,
        cotizaciones: [],
      });
    }

    map.get(key).cotizaciones.push(d);
  });

  return Array.from(map.values());
});

watch(
  () => conceptosAgrupados.value,
  () => {
    initSelectedQuotes();
  },
  { immediate: true }
);

const getTipoColor = (tipoNombre = "") => {
  const lower = (tipoNombre || "").toLowerCase();
  if (lower.includes("preventivo")) return "teal-7";
  if (lower.includes("correctivo")) return "deep-orange-7";
  if (lower.includes("llanta") || lower.includes("neum")) return "indigo-7";
  if (lower.includes("estét") || lower.includes("carrocer")) return "purple-7";
  return "primary";
};

const formatKm = (val) => {
  if (val === null || val === undefined || val === "") return "N/A";
  const num = Number(val);
  if (isNaN(num)) return val;
  return `${num.toLocaleString("es-MX")} km`;
};

const orderTotals = computed(() => {
  return detallesList.value.reduce(
    (acc, d) => {
      acc.subtotal += Number(d.subtotal || 0);
      acc.iva += Number(d.iva || 0);
      acc.total += Number(d.total || 0);
      return acc;
    },
    { subtotal: 0, iva: 0, total: 0 }
  );
});

const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
};

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha";
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return date.formatDate(fechaStr, "DD/MM/YYYY");
};

const bitacoraList = computed(() => {
  const list = props.service?.bitacora || [];
  return [...list].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    if (timeB !== timeA) return timeB - timeA;
    return (b.id || 0) - (a.id || 0);
  });
});

const getUsuarioNombre = (item) => {
  const empleado = item?.user?.empleado;
  if (empleado) {
    if (empleado.nombreCompleto) return empleado.nombreCompleto;
    const partes = [
      empleado.nombre,
      empleado.segundo_nombre,
      empleado.apellido_paterno,
      empleado.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ");
    if (partes.trim()) return partes;
  }
  return item?.user?.name || "Sin usuario";
};

const formatFechaHora = (fechaStr) => {
  if (!fechaStr) return "-";
  return date.formatDate(fechaStr, "DD/MM/YYYY hh:mm A");
};

const openPdf = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
.border-grey {
  border: 1px dashed #b0bec5;
}
.border-concept {
  border-left: 4px solid var(--q-primary);
}
.border-top {
  border-top: 1px solid #e0e0e0;
}
.border-amber {
  border: 1px solid #ffe082;
}
.border-blue {
  border: 1px solid #90caf9;
}
.border-indigo {
  border: 1px solid #9fa8da;
}
.selected-quote-row {
  background-color: #e8f5e9 !important;
}
</style>
