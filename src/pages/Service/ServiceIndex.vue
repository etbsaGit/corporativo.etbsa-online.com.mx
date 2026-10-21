<template>
  <!-- Banner informativo cuando se visualiza desde "Servicios Unidad" -->
  <q-card
    v-if="onlyMyUnit"
    flat
    bordered
    class="q-ma-sm bg-blue-1 border-primary"
  >
    <q-card-section class="q-py-sm q-px-md">
      <div v-if="assignedVehicles.length > 0">
        <div
          class="text-subtitle2 text-weight-bold text-primary flex items-center q-mb-xs"
        >
          <q-icon name="directions_car" size="22px" class="q-mr-xs" />
          {{
            assignedVehicles.length === 1
              ? "Mi Unidad Asignada:"
              : `Mis Unidades Asignadas (${assignedVehicles.length}):`
          }}
        </div>

        <div class="row q-col-gutter-sm">
          <div
            v-for="veh in assignedVehicles"
            :key="veh.id"
            class="col-12 col-md-6"
          >
            <div
              class="q-pa-xs q-px-sm bg-white rounded-borders row items-center justify-between shadow-1 cursor-pointer"
              :class="
                Number(filterForm.vehicle_id) === Number(veh.id)
                  ? 'border-primary'
                  : ''
              "
              @click="toggleUnitFilter(veh.id)"
            >
              <div>
                <div class="row items-center q-gutter-x-xs">
                  <q-badge color="primary" class="text-weight-bold q-px-sm">
                    {{ veh.placas || "S/P" }}
                  </q-badge>
                  <span class="text-caption text-weight-medium text-grey-9">
                    {{ veh.estatus?.nombre || "Unidad" }}
                  </span>
                  <q-badge
                    v-if="
                      Number(authStore.authUser?.empleado?.vehicle_id) ===
                      Number(veh.id)
                    "
                    color="amber-9"
                    text-color="white"
                    label="Responsable"
                  />
                </div>
                <div class="text-caption text-grey-7">
                  Serie: <strong>{{ veh.serie || "N/A" }}</strong> &bull;
                  Sucursal:
                  <strong>{{ veh.sucursal?.nombre || "N/A" }}</strong> &bull;
                  Depto:
                  <strong>{{ veh.departamento?.nombre || "N/A" }}</strong>
                </div>
              </div>

              <q-badge color="orange-9" class="q-pa-xs text-caption">
                <q-icon name="speed" class="q-mr-xs" />
                Último KM: {{ formatKm(veh.ultimo_km || 0) }}
              </q-badge>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="!loading"
        class="row items-center text-negative q-gutter-x-sm"
      >
        <q-icon name="warning" size="24px" />
        <span class="text-subtitle2 text-weight-medium">
          Actualmente no tienes ninguna unidad vehicular asignada en el sistema.
        </span>
      </div>
    </q-card-section>
  </q-card>

  <!-- Barra Superior de Filtros -->
  <q-card flat bordered class="q-ma-sm bg-white">
    <q-card-section class="q-pa-sm">
      <div class="row q-col-gutter-sm items-center">
        <!-- Búsqueda General -->
        <div
          :class="
            !onlyMyUnit || assignedVehicles.length > 1
              ? 'col-12 col-md-3'
              : 'col-12 col-md-4'
          "
        >
          <q-input
            outlined
            dense
            clearable
            label="Buscar placa, serie, OC, factura, descripción..."
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Vehículo (visible en /services o cuando el empleado tiene más de 1 unidad asignada) -->
        <div
          v-if="!onlyMyUnit || assignedVehicles.length > 1"
          class="col-12 col-sm-6 col-md-2"
        >
          <q-select
            v-model="filterForm.vehicle_id"
            :options="filteredVehicles"
            label="Unidad (Placa)"
            option-value="id"
            :option-label="
              (v) =>
                v ? `${v.placas || 'S/P'} (${v.estatus?.nombre || ''})` : ''
            "
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="filterVehiclesFn"
            clearable
            outlined
            dense
            options-dense
            @update:model-value="getRows(1)"
          />
        </div>

        <!-- Proveedor -->
        <div
          :class="
            !onlyMyUnit || assignedVehicles.length > 1
              ? 'col-12 col-sm-6 col-md-2'
              : 'col-12 col-sm-4 col-md-3'
          "
        >
          <q-select
            v-model="filterForm.proveedor_id"
            :options="filteredProveedores"
            label="Proveedor"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="filterProveedoresFn"
            clearable
            outlined
            dense
            options-dense
            @update:model-value="getRows(1)"
          />
        </div>

        <!-- Tipo de Servicio -->
        <div
          :class="
            !onlyMyUnit || assignedVehicles.length > 1
              ? 'col-12 col-sm-6 col-md-2'
              : 'col-12 col-sm-4 col-md-2'
          "
        >
          <q-select
            v-model="filterForm.tipo_servicio_id"
            :options="filteredTiposServicio"
            label="Tipo de Servicio"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="filterTiposServicioFn"
            clearable
            outlined
            dense
            options-dense
            @update:model-value="onFilterTipoChange"
          />
        </div>

        <!-- Servicio Específico -->
        <div
          :class="
            !onlyMyUnit || assignedVehicles.length > 1
              ? 'col-12 col-sm-6 col-md-3'
              : 'col-12 col-sm-4 col-md-3'
          "
        >
          <div class="row no-wrap items-center q-gutter-x-xs">
            <q-select
              class="col"
              v-model="filterForm.servicio_id"
              :options="filteredServiciosCat"
              label="Servicio"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterServiciosCatFn"
              clearable
              outlined
              dense
              options-dense
              @update:model-value="getRows(1)"
            />
            <q-btn
              v-if="hasActiveFilters"
              flat
              round
              dense
              color="negative"
              icon="filter_alt_off"
              @click="clearFilters"
            >
              <q-tooltip>Limpiar filtros</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!onlyMyUnit || assignedVehicles.length > 0"
              unelevated
              dense
              color="primary"
              icon="add_circle"
              label="Nueva Orden de Compra"
              class="q-px-sm"
              @click="openCreate"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <!-- Tabla Principal de Órdenes de Servicio con Detalles Desplegables -->
  <q-item class="q-pt-none">
    <q-item-section>
      <q-table
        flat
        bordered
        title="Órdenes de Compra Registradas"
        :rows="rows"
        :columns="columns"
        row-key="id"
        dense
        :loading="loading"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top>
          <div class="row full-width items-center justify-between q-py-xs q-col-gutter-y-xs">
            <div class="row items-center q-gutter-x-sm wrap">
              <q-icon name="build_circle" color="primary" size="26px" />
              <span class="text-h6 text-weight-bold text-dark">
                {{
                  onlyMyUnit
                    ? assignedVehicles.length === 1
                      ? `Órdenes de Compra de mi Unidad (${
                          assignedVehicles[0]?.placas || "S/P"
                        })`
                      : "Órdenes de Compra de mis Unidades Asignadas"
                    : "Órdenes de Compra"
                }}
              </span>
              <q-badge
                color="primary"
                outline
                :label="`${totalRegistros} orden(es)`"
              />

              <q-separator vertical inset class="q-mx-xs gt-xs" />

              <!-- Botón 1: Por Revisar (Azul) con contador -->
              <q-btn
                dense
                no-caps
                :unelevated="isEstatusActive(estatusSolicitadoId)"
                :outline="!isEstatusActive(estatusSolicitadoId)"
                color="primary"
                class="q-px-sm text-weight-bold"
                @click="filterByStatus(estatusSolicitadoId)"
              >
                <span>Por Revisar</span>
                <q-badge
                  :color="isEstatusActive(estatusSolicitadoId) ? 'white' : 'primary'"
                  :text-color="isEstatusActive(estatusSolicitadoId) ? 'primary' : 'white'"
                  class="q-ml-xs text-weight-bolder"
                >
                  {{ countPorRevisar }}
                </q-badge>
                <q-tooltip>
                  {{
                    isEstatusActive(estatusSolicitadoId)
                      ? "Filtro activo: clic para mostrar todas"
                      : "Filtrar por solicitudes Por Revisar (Solicitado)"
                  }}
                </q-tooltip>
              </q-btn>

              <!-- Botón 2: Autorizadas (Verde) -->
              <q-btn
                dense
                no-caps
                :unelevated="isEstatusActive(estatusAutorizadoId)"
                :outline="!isEstatusActive(estatusAutorizadoId)"
                color="positive"
                class="q-px-sm text-weight-bold"
                @click="filterByStatus(estatusAutorizadoId)"
              >
                <span>Autorizadas</span>
                <q-tooltip>
                  {{
                    isEstatusActive(estatusAutorizadoId)
                      ? "Filtro activo: clic para mostrar todas"
                      : "Filtrar por solicitudes Autorizadas"
                  }}
                </q-tooltip>
              </q-btn>

              <!-- Botón 3: No Autorizadas (Rojo) -->
              <q-btn
                dense
                no-caps
                :unelevated="isEstatusActive(estatusNoAutorizadoId)"
                :outline="!isEstatusActive(estatusNoAutorizadoId)"
                color="negative"
                class="q-px-sm text-weight-bold"
                @click="filterByStatus(estatusNoAutorizadoId)"
              >
                <span>No Autorizadas</span>
                <q-tooltip>
                  {{
                    isEstatusActive(estatusNoAutorizadoId)
                      ? "Filtro activo: clic para mostrar todas"
                      : "Filtrar por solicitudes No Autorizadas"
                  }}
                </q-tooltip>
              </q-btn>

              <!-- Botón Quitar Filtro de Estatus -->
              <q-btn
                v-if="filterForm.estatus_id"
                flat
                dense
                round
                size="sm"
                color="grey-7"
                icon="close"
                @click="clearStatusFilter"
              >
                <q-tooltip>Quitar filtro de estatus (mostrar todas)</q-tooltip>
              </q-btn>
            </div>

            <div class="row items-center q-gutter-x-sm">
              <q-btn
                flat
                dense
                no-caps
                color="primary"
                :icon="allExpanded ? 'unfold_less' : 'unfold_more'"
                :label="
                  allExpanded
                    ? 'Contraer detalles'
                    : 'Desplegar todos los detalles'
                "
                @click="toggleExpandAll"
              />
            </div>
          </div>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props" class="bg-grey-2">
            <q-th auto-width class="text-center">Detalles</q-th>
            <q-th auto-width class="text-left">Acciones</q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-weight-bold"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="isExpanded(props.row.id) ? 'bg-blue-1' : ''"
          >
            <!-- Botón Desplegar Detalles -->
            <q-td auto-width class="text-center">
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                :flat="!isExpanded(props.row.id)"
                :unelevated="isExpanded(props.row.id)"
                :icon="
                  isExpanded(props.row.id)
                    ? 'keyboard_arrow_up'
                    : 'keyboard_arrow_down'
                "
                @click="toggleRowExpand(props.row.id)"
              >
                <q-tooltip>
                  {{
                    isExpanded(props.row.id)
                      ? "Ocultar servicios"
                      : "Ver servicios de la orden"
                  }}
                </q-tooltip>
              </q-btn>
              <q-badge
                color="blue-grey-7"
                class="q-ml-xs"
                :label="getDetalles(props.row).length"
              >
                <q-tooltip>
                  {{ getDetalles(props.row).length }} servicio(s) en esta orden
                </q-tooltip>
              </q-badge>
            </q-td>

            <!-- Acciones -->
            <q-td auto-width>
              <q-btn
                dense
                flat
                color="teal"
                icon="visibility"
                @click="openShow(props.row)"
              >
                <q-tooltip>Ver detalle de la orden</q-tooltip>
              </q-btn>
              <q-btn
                dense
                flat
                color="blue"
                icon="edit_square"
                @click="openEdit(props.row)"
              >
                <q-tooltip>Editar orden</q-tooltip>
              </q-btn>
              <q-btn
                dense
                flat
                color="negative"
                icon="delete"
                @click="openDelete(props.row)"
              >
                <q-tooltip>Eliminar orden</q-tooltip>
              </q-btn>
            </q-td>

            <!-- Folios (OC / Aut / Factura) -->
            <q-td key="folios" :props="props">
              <div
                v-if="props.row.orden_compra || props.row.id"
                class="text-caption"
              >
                <strong>OC:</strong>
                {{ props.row.orden_compra || props.row.id }}
              </div>
              <div
                v-if="props.row.autorizacion_compras"
                class="text-caption text-teal-9"
              >
                <strong>Aut:</strong> {{ props.row.autorizacion_compras }}
              </div>
              <div v-if="props.row.factura" class="text-caption text-purple-9">
                <strong>Fact:</strong> {{ props.row.factura }}
              </div>
            </q-td>

            <!-- Fecha -->
            <q-td key="fecha" :props="props" class="text-weight-bold">
              {{ formatFecha(props.row.fecha_elaboracion) }}
            </q-td>

            <!-- Estatus de la Orden -->
            <q-td key="estatus" :props="props" class="text-center">
              <q-badge
                v-if="getOrdenEstatus(props.row)"
                :style="
                  getOrdenEstatus(props.row)?.color
                    ? { backgroundColor: getOrdenEstatus(props.row).color }
                    : null
                "
                :color="!getOrdenEstatus(props.row)?.color ? 'primary' : null"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                {{ getOrdenEstatus(props.row)?.nombre }}
              </q-badge>
              <span v-else class="text-caption text-grey-5">-</span>
            </q-td>

            <!-- Unidad / Placas -->
            <q-td key="unidad" :props="props">
              <div class="row items-center no-wrap q-gutter-x-xs">
                <q-badge color="primary" class="text-weight-bold q-px-sm py-xs">
                  {{ props.row.vehicle?.placas || "S/P" }}
                </q-badge>
                <span class="text-caption text-grey-8">
                  {{ props.row.vehicle?.estatus?.nombre || "" }}
                </span>
              </div>
              <div
                v-if="props.row.vehicle?.serie"
                class="text-caption text-grey-6 font-mono"
              >
                {{ props.row.vehicle.serie }}
              </div>
            </q-td>

            <!-- Servicios Resumen -->
            <q-td
              key="servicios_resumen"
              :props="props"
              style="max-width: 280px; white-space: normal"
            >
              <div class="row q-gutter-xs">
                <q-badge
                  v-for="det in getDetalles(props.row).slice(0, 3)"
                  :key="det.id"
                  outline
                  color="primary"
                  class="ellipsis"
                  style="max-width: 220px"
                >
                  {{ det.servicio?.nombre || "Servicio" }}
                </q-badge>
                <q-badge
                  v-if="getDetalles(props.row).length > 3"
                  color="grey-7"
                  :label="`+${getDetalles(props.row).length - 3} más`"
                />
              </div>
            </q-td>

            <!-- KM Máximo en la Orden -->
            <q-td key="km" :props="props" class="text-right">
              <span
                v-if="getMaxKm(props.row)"
                class="text-weight-bold text-orange-10"
              >
                {{ formatKm(getMaxKm(props.row)) }}
              </span>
              <span v-else class="text-caption text-grey-5">No reg.</span>
            </q-td>

            <!-- Cargo (Sucursal / Depto) -->
            <q-td key="cargo" :props="props">
              <div class="text-caption text-weight-medium">
                {{
                  props.row.sucursal_cargo?.nombre ||
                  props.row.sucursalCargo?.nombre ||
                  "-"
                }}
              </div>
              <div class="text-caption text-grey-6">
                {{
                  props.row.departamento_cargo?.nombre ||
                  props.row.departamentoCargo?.nombre ||
                  ""
                }}
              </div>
            </q-td>

            <!-- Solicitante -->
            <q-td key="solicitante" :props="props">
              <div class="text-caption">
                {{ props.row.solicitante?.nombreCompleto || "-" }}
              </div>
            </q-td>

            <!-- Total de la Orden -->
            <q-td key="total" :props="props" class="text-right">
              <span class="text-subtitle2 text-weight-bolder text-positive">
                {{ formatCurrency(getOrderTotal(props.row)) }}
              </span>
            </q-td>
          </q-tr>

          <!-- Fila Desplegable: Detalles de Servicios y Bitácora de la Orden -->
          <q-tr
            v-show="isExpanded(props.row.id)"
            :props="props"
            class="bg-grey-1"
          >
            <q-td colspan="100%" class="q-pa-sm">
              <div class="q-mx-md q-gutter-y-sm">
                <!-- Desplegable 1: Servicios incluidos en la Orden -->
                <q-card flat bordered class="bg-white">
                  <q-expansion-item
                    default-opened
                    header-class="bg-blue-grey-1 text-blue-grey-9"
                    expand-icon-class="text-blue-grey-9"
                  >
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon name="handyman" color="primary" size="20px" />
                      </q-item-section>
                      <q-item-section>
                        <div
                          class="text-caption text-weight-bold text-blue-grey-9 flex items-center"
                        >
                          Conceptos de la Orden #{{ props.row.id }} (Placa:
                          {{ props.row.vehicle?.placas || "S/P" }})
                          <q-badge color="primary" class="q-ml-sm">
                            {{ getDetalles(props.row).length }}
                          </q-badge>
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <div class="text-caption text-grey-8">
                          Subtotal:
                          <strong>{{
                            formatCurrency(getOrderSubtotal(props.row))
                          }}</strong>
                          &bull; IVA:
                          <strong>{{
                            formatCurrency(getOrderIva(props.row))
                          }}</strong>
                          &bull; Total:
                          <strong class="text-positive">{{
                            formatCurrency(getOrderTotal(props.row))
                          }}</strong>
                        </div>
                      </q-item-section>
                    </template>

                    <q-separator />
                    <q-markup-table flat dense separator="horizontal">
                      <thead>
                        <tr class="bg-grey-2 text-grey-8">
                          <th class="text-left">Tipo de Servicio</th>
                          <th class="text-left">Conceptos</th>
                          <th class="text-left">Descripción / Detalle</th>
                          <th class="text-center">Medida Llanta</th>
                          <th class="text-right">Kilometraje (KM)</th>
                          <th class="text-center">Cant.</th>
                          <th class="text-right">P. Unitario</th>
                          <th class="text-right">Subtotal</th>
                          <th class="text-right">IVA</th>
                          <th class="text-right">Total Invertido</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="det in getDetalles(props.row)" :key="det.id">
                          <td>
                            <q-badge
                              :color="
                                getTipoColor(
                                  det.servicio?.tipo_servicio?.nombre ||
                                    det.servicio?.tipoServicio?.nombre
                                )
                              "
                              class="q-px-sm"
                            >
                              {{
                                det.servicio?.tipo_servicio?.nombre ||
                                det.servicio?.tipoServicio?.nombre ||
                                "General"
                              }}
                            </q-badge>
                          </td>
                          <td class="text-weight-bold text-primary">
                            {{ det.servicio?.nombre || "Servicio" }}
                          </td>
                          <td style="max-width: 340px; white-space: normal">
                            {{ det.descripcion }}
                          </td>
                          <td class="text-center">
                            <q-badge
                              v-if="
                                det.llanta_anchura ||
                                det.llanta_altura ||
                                det.llanta_rin
                              "
                              color="indigo-7"
                              outline
                            >
                              {{ det.llanta_anchura || "-" }}/{{
                                det.llanta_altura || "-"
                              }}
                              R{{ det.llanta_rin || "-" }}
                            </q-badge>
                            <span v-else class="text-caption text-grey-5"
                              >-</span
                            >
                          </td>
                          <td class="text-right text-weight-medium">
                            {{
                              det.km_evento
                                ? formatKm(det.km_evento)
                                : "No reg."
                            }}
                          </td>
                          <td class="text-center">
                            {{ det.cantidad || "-" }}
                          </td>
                          <td class="text-right">
                            {{
                              det.precio_unitario
                                ? formatCurrency(det.precio_unitario)
                                : "-"
                            }}
                          </td>
                          <td class="text-right">
                            {{ formatCurrency(det.subtotal) }}
                          </td>
                          <td class="text-right">
                            {{ formatCurrency(det.iva) }}
                          </td>
                          <td class="text-right text-weight-bold text-positive">
                            {{ formatCurrency(det.total) }}
                          </td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </q-expansion-item>
                </q-card>

                <!-- Desplegable 2: Bitácora de Acciones y Movimientos -->
                <q-card flat bordered class="bg-white">
                  <q-expansion-item
                    default-opened
                    header-class="bg-blue-grey-1 text-blue-grey-9"
                    expand-icon-class="text-blue-grey-9"
                  >
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon name="history" color="blue-8" size="20px" />
                      </q-item-section>
                      <q-item-section>
                        <div
                          class="text-caption text-weight-bold text-blue-grey-9 flex items-center"
                        >
                          Bitácora de Movimientos
                          <q-badge color="blue-8" class="q-ml-sm">
                            {{ getBitacora(props.row).length }}
                          </q-badge>
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <div
                          v-if="getBitacora(props.row).length > 0"
                          class="text-caption text-grey-7"
                        >
                          Último estatus:
                          <span class="text-weight-bold">{{
                            getBitacora(props.row)[0]?.estatus?.nombre ||
                            "Registrado"
                          }}</span>
                        </div>
                      </q-item-section>
                    </template>

                    <q-separator />

                    <div
                      v-if="getBitacora(props.row).length === 0"
                      class="q-pa-sm text-center text-caption text-grey-6"
                    >
                      No hay registros de bitácora para esta orden de servicio.
                    </div>
                    <q-markup-table v-else flat dense separator="horizontal">
                      <thead>
                        <tr class="bg-grey-2 text-grey-8">
                          <th class="text-left" style="width: 175px">
                            Fecha y Hora
                          </th>
                          <th class="text-left" style="width: 140px">
                            Estatus
                          </th>
                          <th class="text-left" style="width: 250px">
                            Usuario / Empleado
                          </th>
                          <th class="text-left">Comentarios</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="b in getBitacora(props.row)" :key="b.id">
                          <td class="text-caption font-mono">
                            <q-icon
                              name="schedule"
                              size="14px"
                              class="q-mr-xs text-grey-7"
                            />
                            {{ formatFechaHora(b.created_at) }}
                          </td>
                          <td>
                            <q-badge
                              :style="
                                b.estatus?.color
                                  ? { backgroundColor: b.estatus.color }
                                  : null
                              "
                              :color="!b.estatus?.color ? 'primary' : null"
                              class="q-px-sm"
                            >
                              {{ b.estatus?.nombre || "Sin estatus" }}
                            </q-badge>
                          </td>
                          <td>
                            <div
                              class="text-weight-medium text-dark flex items-center"
                            >
                              <q-icon
                                :name="b.user?.empleado ? 'badge' : 'person'"
                                size="16px"
                                class="q-mr-xs text-grey-7"
                              />
                              <span>{{ getUsuarioNombre(b) }}</span>
                            </div>
                            <div
                              v-if="b.user?.empleado && b.user?.name"
                              class="text-caption text-grey-6 q-ml-md"
                            >
                              Usuario: {{ b.user.name }}
                            </div>
                          </td>
                          <td style="white-space: normal">
                            {{ b.comentarios || "-" }}
                          </td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </q-expansion-item>
                </q-card>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom>
          <q-space />
          <td>
            <q-pagination
              color="primary"
              v-model="current_page"
              :max="last_page"
              :max-pages="6"
              direction-links
              boundary-links
              gutter="10px"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </td>
          <q-space />
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <!-- Modal: Registrar Nueva Orden de Servicio -->
  <q-dialog v-model="showAdd" persistent>
    <q-card style="width: 1050px; max-width: 96vw">
      <q-item class="bg-primary text-white">
        <q-item-section avatar>
          <q-icon name="add_circle" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6"
            >Registrar Nueva Orden de Compra</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <div class="row q-gutter-x-sm">
            <q-btn flat label="Cancelar" color="white" v-close-popup />
            <q-btn
              unelevated
              label="Guardar Orden"
              color="positive"
              icon="save"
              @click="postRow"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section class="scroll" style="max-height: 80vh">
        <service-form
          v-if="showAdd"
          ref="add"
          :catalogs="catalogs"
          :fixed-vehicle-id="
            onlyMyUnit && assignedVehicles.length === 1
              ? assignedVehicles[0]?.id
              : null
          "
          :allowed-vehicles="onlyMyUnit ? assignedVehicles : null"
          :default-solicitante-id="
            onlyMyUnit ? authStore.authUser?.empleado?.id : null
          "
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Modal: Editar Orden de Servicio -->
  <q-dialog v-model="showEdit" persistent>
    <q-card style="width: 1050px; max-width: 96vw">
      <q-item class="bg-primary text-white">
        <q-item-section avatar>
          <q-icon name="edit_square" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            Editar Orden de Servicio #{{ selectedRow?.id }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row q-gutter-x-sm">
            <q-btn flat label="Cancelar" color="white" v-close-popup />
            <q-btn
              unelevated
              label="Actualizar"
              color="positive"
              icon="save"
              @click="putRow"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section class="scroll" style="max-height: 80vh">
        <service-form
          v-if="showEdit"
          ref="edit"
          :service="selectedRow"
          :catalogs="catalogs"
          :fixed-vehicle-id="
            onlyMyUnit && assignedVehicles.length === 1
              ? assignedVehicles[0]?.id
              : null
          "
          :allowed-vehicles="onlyMyUnit ? assignedVehicles : null"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Modal: Ver Detalle de Orden de Servicio -->
  <q-dialog v-model="showShow">
    <q-card
      style="width: 980px; max-width: 96vw; max-height: 90vh"
      class="scroll"
    >
      <service-card
        :service="selectedRow"
        @authorized="handleOrderAuthorized"
      />
      <q-card-actions align="right" class="bg-grey-2">
        <q-btn flat label="Cerrar" color="grey-8" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Modal: Confirmar Eliminación -->
  <BaseDialog v-model="showDelete" mode="delete" @submit="deleteRow">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar esta orden de servicio y todos sus
      conceptos asociados?
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { date } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import BaseDialog from "src/bases/BaseDialog.vue";
import ServiceForm from "src/components/Service/ServiceForm.vue";
import ServiceCard from "src/components/Service/ServiceCard.vue";

const props = defineProps({
  onlyMyUnit: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const authStore = useAuthStore();

const onlyMyUnit = computed(() => {
  return props.onlyMyUnit || route.path === "/serviciosUnidad";
});

const assignedVehicle = ref(null);
const assignedVehicles = ref([]);

const rows = ref([]);
const loading = ref(false);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);
const showDelete = ref(false);
const showShow = ref(false);

const expandedIds = ref([]);
const allExpanded = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);
const totalRegistros = ref(0);

const catalogs = ref({
  vehicles: [],
  empleados: [],
  proveedores: [],
  tipos_servicio: [],
  servicios_cat: [],
  sucursales_cargo: [],
  deptos_cargo: [],
  estatus: [],
});

const filteredVehicles = ref([]);
const filteredProveedores = ref([]);
const filteredTiposServicio = ref([]);
const servicioCatSearch = ref("");

const filterForm = ref({
  search: null,
  vehicle_id: null,
  proveedor_id: null,
  tipo_servicio_id: null,
  servicio_id: null,
  suc_cargo_id: null,
  depto_cargo_id: null,
  estatus_id: null,
});

const statusCounts = ref({
  solicitado: 0,
  autorizado: 0,
  no_autorizado: 0,
  solicitado_id: 176,
  autorizado_id: 177,
  no_autorizado_id: 178,
});

const estatusSolicitadoId = computed(() => {
  return (
    statusCounts.value?.solicitado_id ||
    catalogs.value?.estatus?.find(
      (e) => (e.nombre || "").trim().toLowerCase() === "solicitado"
    )?.id ||
    176
  );
});

const estatusAutorizadoId = computed(() => {
  return (
    statusCounts.value?.autorizado_id ||
    catalogs.value?.estatus?.find(
      (e) => (e.nombre || "").trim().toLowerCase() === "autorizado"
    )?.id ||
    177
  );
});

const estatusNoAutorizadoId = computed(() => {
  return (
    statusCounts.value?.no_autorizado_id ||
    catalogs.value?.estatus?.find(
      (e) => (e.nombre || "").trim().toLowerCase() === "no autorizado"
    )?.id ||
    178
  );
});

const countPorRevisar = computed(() => {
  if (
    statusCounts.value &&
    statusCounts.value.solicitado !== undefined &&
    statusCounts.value.solicitado !== null
  ) {
    return Number(statusCounts.value.solicitado);
  }
  return rows.value.filter(
    (r) =>
      Number(r.estatus_id) === Number(estatusSolicitadoId.value) ||
      (r.estatus?.nombre || "").trim().toLowerCase() === "solicitado"
  ).length;
});

const isEstatusActive = (estatusId) => {
  return (
    filterForm.value.estatus_id !== null &&
    filterForm.value.estatus_id !== undefined &&
    Number(filterForm.value.estatus_id) === Number(estatusId)
  );
};

const filterByStatus = (estatusId) => {
  if (isEstatusActive(estatusId)) {
    filterForm.value.estatus_id = null;
  } else {
    filterForm.value.estatus_id = estatusId;
  }
  getRows(1);
};

const clearStatusFilter = () => {
  filterForm.value.estatus_id = null;
  getRows(1);
};

const hasActiveFilters = computed(() => {
  return Boolean(
    filterForm.value.search ||
      filterForm.value.vehicle_id ||
      filterForm.value.proveedor_id ||
      filterForm.value.tipo_servicio_id ||
      filterForm.value.servicio_id ||
      filterForm.value.suc_cargo_id ||
      filterForm.value.depto_cargo_id ||
      filterForm.value.estatus_id
  );
});

const toggleUnitFilter = (vehicleId) => {
  if (assignedVehicles.value.length <= 1) return;
  if (Number(filterForm.value.vehicle_id) === Number(vehicleId)) {
    filterForm.value.vehicle_id = null;
  } else {
    filterForm.value.vehicle_id = vehicleId;
  }
  getRows(1);
};

const filteredServiciosCat = computed(() => {
  let list = catalogs.value.servicios_cat || [];
  if (filterForm.value.tipo_servicio_id) {
    list = list.filter(
      (s) =>
        Number(s.tipo_servicio_id) === Number(filterForm.value.tipo_servicio_id)
    );
  }
  if (servicioCatSearch.value) {
    const q = servicioCatSearch.value.toLowerCase();
    list = list.filter((s) => s.nombre && s.nombre.toLowerCase().includes(q));
  }
  return list;
});

const onFilterTipoChange = () => {
  filterForm.value.servicio_id = null;
  getRows(1);
};

const clearFilters = () => {
  filterForm.value = {
    search: null,
    vehicle_id: null,
    proveedor_id: null,
    tipo_servicio_id: null,
    servicio_id: null,
    suc_cargo_id: null,
    depto_cargo_id: null,
    estatus_id: null,
  };
  getRows(1);
};

const columns = [
  {
    name: "folios",
    align: "left",
    field: "orden_compra",
    label: "OC / Aut / Factura",
  },
  {
    name: "fecha",
    align: "left",
    field: "fecha_elaboracion",
    label: "Fecha",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    field: "estatus",
    label: "Estatus",
  },
  {
    name: "unidad",
    align: "left",
    field: "unidad",
    label: "Unidad / Placas",
  },
  {
    name: "servicios_resumen",
    align: "left",
    field: "servicios_resumen",
    label: "Resumen",
  },
  {
    name: "km",
    align: "right",
    field: "km",
    label: "KM Evento",
  },
  {
    name: "cargo",
    align: "left",
    field: "cargo",
    label: "Sucursal / Depto Cargo",
  },
  {
    name: "solicitante",
    align: "left",
    field: "solicitante",
    label: "Solicitante",
  },
  {
    name: "total",
    align: "right",
    field: "total",
    label: "Total Orden",
  },
];

const getOrdenEstatus = (row) => {
  if (row?.estatus) return row.estatus;
  const bitacora = getBitacora(row);
  if (bitacora.length > 0 && bitacora[0]?.estatus) {
    return bitacora[0].estatus;
  }
  return null;
};

const getDetalles = (row) => {
  return row?.detalles || row?.detalles_servicio || row?.detallesServicio || [];
};

const getOrderSubtotal = (row) => {
  return getDetalles(row).reduce((acc, d) => acc + Number(d.subtotal || 0), 0);
};

const getOrderIva = (row) => {
  return getDetalles(row).reduce((acc, d) => acc + Number(d.iva || 0), 0);
};

const getOrderTotal = (row) => {
  return getDetalles(row).reduce((acc, d) => acc + Number(d.total || 0), 0);
};

const getMaxKm = (row) => {
  const kms = getDetalles(row)
    .map((d) => Number(d.km_evento || 0))
    .filter((k) => k > 0);
  return kms.length > 0 ? Math.max(...kms) : null;
};

const getBitacora = (row) => {
  const list = row?.bitacora || [];
  return [...list].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    if (timeB !== timeA) return timeB - timeA;
    return (b.id || 0) - (a.id || 0);
  });
};

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

const isExpanded = (id) => {
  return expandedIds.value.includes(id);
};

const toggleRowExpand = (id) => {
  const idx = expandedIds.value.indexOf(id);
  if (idx > -1) {
    expandedIds.value.splice(idx, 1);
  } else {
    expandedIds.value.push(id);
  }
};

const toggleExpandAll = () => {
  if (allExpanded.value) {
    expandedIds.value = [];
    allExpanded.value = false;
  } else {
    expandedIds.value = rows.value.map((r) => r.id);
    allExpanded.value = true;
  }
};

const filterVehiclesFn = (val, update) => {
  const baseList = onlyMyUnit.value
    ? assignedVehicles.value
    : catalogs.value.vehicles || [];
  if (val === "") {
    update(() => {
      filteredVehicles.value = baseList;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredVehicles.value = baseList.filter(
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
      filteredProveedores.value = catalogs.value.proveedores || [];
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredProveedores.value = (catalogs.value.proveedores || []).filter(
      (p) => p.nombre && p.nombre.toLowerCase().includes(q)
    );
  });
};

const filterTiposServicioFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredTiposServicio.value = catalogs.value.tipos_servicio || [];
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredTiposServicio.value = (catalogs.value.tipos_servicio || []).filter(
      (t) => t.nombre && t.nombre.toLowerCase().includes(q)
    );
  });
};

const filterServiciosCatFn = (val, update) => {
  update(() => {
    servicioCatSearch.value = val || "";
  });
};

const openCreate = () => {
  selectedRow.value = null;
  getForms();
  showAdd.value = true;
};

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const openDelete = (item) => {
  selectedRow.value = item;
  showDelete.value = true;
};

const openShow = (item) => {
  selectedRow.value = item;
  showShow.value = true;
};

const handleOrderAuthorized = (updatedOrden) => {
  if (updatedOrden && typeof updatedOrden === "object") {
    selectedRow.value = updatedOrden;
  }
  showShow.value = false;
  getRows(current_page.value);
  getForms();
};

const getForms = async () => {
  const res = await sendRequest("GET", null, "/api/service/forms", "");
  if (res) {
    catalogs.value = {
      next_id: res.next_id || null,
      vehicles: res.vehicles || [],
      empleados: res.empleados || [],
      proveedores: res.proveedores || [],
      tipos_servicio: res.tipos_servicio || [],
      servicios_cat: res.servicios_cat || [],
      sucursales_cargo: res.sucursales_cargo || [],
      deptos_cargo: res.deptos_cargo || [],
      estatus: res.estatus || [],
    };
    if (res.status_counts) {
      statusCounts.value = {
        ...statusCounts.value,
        ...res.status_counts,
      };
    }
    filteredVehicles.value = onlyMyUnit.value
      ? assignedVehicles.value
      : catalogs.value.vehicles;
    filteredProveedores.value = catalogs.value.proveedores;
    filteredTiposServicio.value = catalogs.value.tipos_servicio;
  }
};

const getRows = async (page = 1) => {
  loading.value = true;
  try {
    const final = {
      ...filterForm.value,
      page,
    };
    const endpoint = onlyMyUnit.value ? "/api/services/auth" : "/api/services";
    const res = await sendRequest("POST", final, endpoint, "");
    if (res) {
      rows.value = res.data || [];
      current_page.value = res.current_page || 1;
      next_page_url.value = res.next_page_url;
      prev_page_url.value = res.prev_page_url;
      last_page.value = res.last_page || 1;
      totalRegistros.value = res.total || rows.value.length;
      if (res.status_counts) {
        statusCounts.value = {
          ...statusCounts.value,
          ...res.status_counts,
        };
      }
      if (onlyMyUnit.value) {
        if (Array.isArray(res.assigned_vehicles)) {
          assignedVehicles.value = res.assigned_vehicles;
        } else if (res.assigned_vehicle) {
          assignedVehicles.value = [res.assigned_vehicle];
        } else {
          assignedVehicles.value = [];
        }
        assignedVehicle.value = assignedVehicles.value[0] || null;
      }
    }
  } finally {
    loading.value = false;
  }
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formService,
  };
  await sendRequest("POST", final, "/api/service", "");
  showAdd.value = false;
  getRows(current_page.value);
  getForms();
};

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formService,
  };
  await sendRequest("PUT", final, "/api/service/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
  getForms();
};

const deleteRow = async () => {
  await sendRequest("DELETE", null, "/api/service/" + selectedRow.value.id, "");
  selectedRow.value = null;
  showDelete.value = false;
  getRows(current_page.value);
  getForms();
};

const getTipoColor = (tipoNombre = "") => {
  const lower = (tipoNombre || "").toLowerCase();
  if (lower.includes("preventivo")) return "teal-7";
  if (lower.includes("correctivo")) return "deep-orange-7";
  if (lower.includes("llanta") || lower.includes("neum")) return "indigo-7";
  if (lower.includes("estét") || lower.includes("carrocer")) return "purple-7";
  return "primary";
};

const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
};

const formatKm = (val) => {
  if (val === null || val === undefined || val === "") return "N/A";
  const num = Number(val);
  if (isNaN(num)) return val;
  return `${num.toLocaleString("es-MX")} km`;
};

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha";
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return date.formatDate(fechaStr, "DD/MM/YYYY");
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

watch(
  () => route.path,
  () => {
    clearFilters();
  }
);

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    getRows(1);
  }, 600);
};

onMounted(() => {
  getRows();
  getForms();
});
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
.border-primary {
  border: 1px solid var(--q-primary);
}
</style>
