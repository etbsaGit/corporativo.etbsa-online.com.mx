<template>
  <q-card style="width: 1180px; max-width: 96vw" class="q-pa-none bg-grey-1">
    <!-- Encabezado Principal -->
    <q-card-section class="bg-primary text-white q-py-md q-px-lg">
      <div class="row items-center no-wrap">
        <q-avatar
          icon="analytics"
          color="white"
          text-color="primary"
          size="48px"
          class="q-mr-md shadow-2"
        />
        <div class="col">
          <div class="row items-center q-gutter-x-sm">
            <div class="text-h6 text-weight-bold leading-tight">
              Dashboard de Historial de Servicios
            </div>
            <q-badge
              :color="vehicle?.activo == 1 ? 'positive' : 'negative'"
              class="q-px-sm q-py-xs text-weight-bold"
            >
              {{ vehicle?.activo == 1 ? "Unidad Activa" : "Unidad Inactiva" }}
            </q-badge>
          </div>
          <div class="text-caption text-blue-1 q-mt-xs flex items-center q-gutter-x-md wrap">
            <span>
              <q-icon name="pin" size="14px" class="q-mr-xs" />
              Placa Actual:
              <strong class="text-white">{{ vehicle?.placas || "Sin placa" }}</strong>
            </span>
            <span v-if="vehicle?.serie">
              <q-icon name="qr_code" size="14px" class="q-mr-xs" />
              Serie:
              <strong class="text-white font-mono">{{ vehicle.serie }}</strong>
            </span>
            <span v-if="vehicle?.estatus?.nombre">
              <q-icon name="directions_car" size="14px" class="q-mr-xs" />
              Tipo:
              <strong class="text-white">{{ vehicle.estatus.nombre }}</strong>
            </span>
            <span v-if="vehicle?.sucursal?.nombre">
              <q-icon name="store" size="14px" class="q-mr-xs" />
              Sucursal:
              <strong class="text-white">{{ vehicle.sucursal.nombre }}</strong>
            </span>
            <span v-if="vehicle?.departamento?.nombre">
              <q-icon name="domain" size="14px" class="q-mr-xs" />
              Depto:
              <strong class="text-white">{{ vehicle.departamento.nombre }}</strong>
            </span>
          </div>
        </div>
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
    </q-card-section>

    <q-separator />

    <!-- Estado de Carga -->
    <div v-if="loading" class="q-pa-xl text-center">
      <q-spinner-dots color="primary" size="3.5em" />
      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        Cargando historial de servicios de la unidad...
      </div>
    </div>

    <!-- Contenido del Dashboard -->
    <q-card-section
      v-else
      class="q-pa-md scroll"
      style="max-height: 82vh"
    >
      <!-- Tarjetas de KPIs Principales -->
      <div class="row q-col-gutter-md q-mb-md">
        <!-- Total Dinero Invertido -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-green">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-overline text-grey-7 leading-none">
                    DINERO TOTAL INVERTIDO
                  </div>
                  <div class="text-h5 text-weight-bolder text-positive q-mt-xs">
                    {{ formatCurrency(kpis.totalInvertido) }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    Subtotal: {{ formatCurrency(kpis.subtotalInvertido) }} &bull; IVA:
                    {{ formatCurrency(kpis.ivaInvertido) }}
                  </div>
                </div>
                <q-avatar
                  color="green-1"
                  text-color="positive"
                  icon="paid"
                  size="46px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Total Servicios Realizados -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-overline text-grey-7 leading-none">
                    SERVICIOS REALIZADOS
                  </div>
                  <div class="text-h5 text-weight-bolder text-primary q-mt-xs">
                    {{ kpis.totalServicios }}
                    <span class="text-subtitle2 text-weight-regular text-grey-7">
                      servicio(s)
                    </span>
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    En {{ kpis.totalOrdenes }} orden(es) de servicio
                  </div>
                </div>
                <q-avatar
                  color="blue-1"
                  text-color="primary"
                  icon="handyman"
                  size="46px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Último Kilometraje Registrado -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-orange">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-overline text-grey-7 leading-none">
                    MAYOR KM REGISTRADO
                  </div>
                  <div class="text-h5 text-weight-bolder text-orange-9 q-mt-xs">
                    {{ kpis.maxKm ? formatKm(kpis.maxKm) : "Sin registro" }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    <span v-if="kpis.minKm && kpis.minKm !== kpis.maxKm">
                      Inicial: {{ formatKm(kpis.minKm) }}
                    </span>
                    <span v-else>Kilometraje en servicios</span>
                  </div>
                </div>
                <q-avatar
                  color="orange-1"
                  text-color="orange-9"
                  icon="speed"
                  size="46px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Último Servicio Realizado -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-purple">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col overflow-hidden">
                  <div class="text-overline text-grey-7 leading-none">
                    ÚLTIMO SERVICIO
                  </div>
                  <div class="text-h6 text-weight-bolder text-deep-purple q-mt-xs ellipsis">
                    {{
                      kpis.ultimoServicioFecha
                        ? formatFecha(kpis.ultimoServicioFecha)
                        : "Sin registros"
                    }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs ellipsis">
                    {{ kpis.ultimoServicioNombre || "Ningún servicio registrado" }}
                  </div>
                </div>
                <q-avatar
                  color="deep-purple-1"
                  text-color="deep-purple"
                  icon="event_available"
                  size="46px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Desglose por Tipo de Servicio y Top Servicios -->
      <div v-if="flatServices.length > 0" class="row q-col-gutter-md q-mb-md">
        <!-- Distribución por Tipo de Servicio -->
        <div class="col-12 col-md-7">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-py-sm q-px-md bg-white flex items-center justify-between">
              <div class="text-subtitle2 text-weight-bold text-primary flex items-center">
                <q-icon name="pie_chart" class="q-mr-xs" size="18px" />
                Inversión por Tipo de Servicio
              </div>
              <span class="text-caption text-grey-6">
                Clic en un tipo para filtrar
              </span>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-md">
              <div class="row q-col-gutter-sm">
                <div
                  v-for="tipo in resumenPorTipo"
                  :key="tipo.nombre"
                  class="col-12 col-sm-6"
                >
                  <div
                    class="q-pa-sm rounded-borders cursor-pointer tipo-summary-box"
                    :class="
                      filters.tipoServicio === tipo.nombre
                        ? 'bg-blue-1 border-primary'
                        : 'bg-grey-1'
                    "
                    @click="toggleTipoFilter(tipo.nombre)"
                  >
                    <div class="row items-center justify-between q-mb-xs">
                      <q-badge
                        :color="getTipoColor(tipo.nombre)"
                        class="text-weight-bold q-px-sm py-xs"
                      >
                        {{ tipo.nombre }}
                      </q-badge>
                      <span class="text-caption text-weight-bold text-grey-8">
                        {{ tipo.count }} serv. ({{ tipo.porcentaje.toFixed(1) }}%)
                      </span>
                    </div>
                    <div class="text-subtitle1 text-weight-bolder text-dark">
                      {{ formatCurrency(tipo.total) }}
                    </div>
                    <q-linear-progress
                      :value="tipo.porcentaje / 100"
                      :color="getTipoColor(tipo.nombre)"
                      rounded
                      size="6px"
                      class="q-mt-xs"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Servicios Más Frecuentes / Mayor Inversión -->
        <div class="col-12 col-md-5">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-py-sm q-px-md bg-white flex items-center justify-between">
              <div class="text-subtitle2 text-weight-bold text-primary flex items-center">
                <q-icon name="build_circle" class="q-mr-xs" size="18px" />
                Principales Servicios Realizados
              </div>
              <q-badge color="grey-7" outline :label="`${resumenPorServicio.length} categorías`" />
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm scroll" style="max-height: 175px">
              <q-list dense separator>
                <q-item
                  v-for="serv in resumenPorServicio"
                  :key="serv.nombre"
                  clickable
                  v-ripple
                  @click="toggleServicioFilter(serv.nombre)"
                  :class="filters.servicio === serv.nombre ? 'bg-blue-1' : ''"
                >
                  <q-item-section>
                    <q-item-label class="text-weight-medium text-body2 ellipsis">
                      {{ serv.nombre }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ serv.tipo }} &bull; Último KM:
                      <strong>{{ serv.ultimoKm ? formatKm(serv.ultimoKm) : "N/A" }}</strong>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-right">
                    <q-item-label class="text-weight-bold text-positive">
                      {{ formatCurrency(serv.total) }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ serv.count }} {{ serv.count === 1 ? "vez" : "veces" }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Barra de Filtros y Selector de Vista -->
      <q-card flat bordered class="q-mb-md bg-white">
        <q-card-section class="q-pa-sm">
          <div class="row q-col-gutter-sm items-center">
            <div class="col-12 col-sm-4">
              <q-input
                v-model="filters.search"
                outlined
                dense
                clearable
                placeholder="Buscar servicio, descripción, OC, factura, proveedor..."
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-3">
              <q-select
                v-model="filters.tipoServicio"
                :options="tipoServicioOptions"
                label="Tipo de Servicio"
                outlined
                dense
                options-dense
                clearable
              />
            </div>

            <div class="col-12 col-sm-3">
              <q-select
                v-model="filters.servicio"
                :options="servicioOptions"
                label="Servicio"
                outlined
                dense
                options-dense
                clearable
              />
            </div>

            <div class="col-12 col-sm-2 flex justify-end">
              <q-btn-toggle
                v-model="viewMode"
                spread
                no-caps
                dense
                unelevated
                toggle-color="primary"
                color="grey-3"
                text-color="grey-8"
                class="full-width"
                :options="[
                  { label: 'Servicios', value: 'detalles', icon: 'list_alt' },
                  { label: 'Órdenes', value: 'ordenes', icon: 'receipt_long' },
                ]"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- VISTA 1: Tabla Detallada de Servicios Realizados -->
      <q-card v-if="viewMode === 'detalles'" flat bordered class="bg-white">
        <q-table
          flat
          :rows="filteredServices"
          :columns="serviceColumns"
          row-key="uid"
          dense
          :pagination="{ rowsPerPage: 15 }"
          :rows-per-page-options="[10, 15, 25, 50, 0]"
          no-data-label="No se encontraron servicios registrados para esta unidad."
        >
          <template v-slot:top>
            <div class="row full-width items-center justify-between q-py-xs">
              <div class="text-subtitle1 text-weight-bold text-dark flex items-center">
                <q-icon name="history_edu" color="primary" size="sm" class="q-mr-xs" />
                Historial Detallado de Servicios Realizados
                <q-badge
                  color="primary"
                  outline
                  class="q-ml-sm"
                  :label="`${filteredServices.length} registro(s)`"
                />
              </div>
              <div class="text-subtitle2 text-grey-8">
                Total filtrado:
                <span class="text-weight-bolder text-positive text-subtitle1">
                  {{ formatCurrency(filteredTotalAmount) }}
                </span>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">
              <div class="text-weight-bold text-dark">
                {{ formatFecha(props.row.fecha_elaboracion) }}
              </div>
              <div v-if="props.row.orden_compra" class="text-caption text-grey-7">
                OC: {{ props.row.orden_compra }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-tipo_servicio="props">
            <q-td :props="props">
              <q-badge
                :color="getTipoColor(props.row.tipo_servicio_nombre)"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                {{ props.row.tipo_servicio_nombre }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-servicio="props">
            <q-td :props="props">
              <div class="text-weight-bold text-primary">
                {{ props.row.servicio_nombre }}
              </div>
              <div
                v-if="props.row.intervalo_km_sugerido || props.row.intervalo_meses_sugerido"
                class="text-caption text-grey-6"
              >
                <q-icon name="update" size="12px" class="q-mr-xs" />
                Sugerido:
                <span v-if="props.row.intervalo_km_sugerido">
                  cada {{ formatKm(props.row.intervalo_km_sugerido) }}
                </span>
                <span v-if="props.row.intervalo_meses_sugerido">
                  / {{ props.row.intervalo_meses_sugerido }} mes(es)
                </span>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-descripcion="props">
            <q-td :props="props" style="max-width: 280px; white-space: normal">
              <div class="text-body2 text-grey-9">
                {{ props.row.descripcion || "Sin descripción" }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs" v-if="props.row.proveedor_nombre">
                <q-icon name="storefront" size="12px" class="q-mr-xs" />
                {{ props.row.proveedor_nombre }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-km_evento="props">
            <q-td :props="props" class="text-right">
              <q-chip
                v-if="props.row.km_evento !== null && props.row.km_evento !== undefined && props.row.km_evento !== ''"
                dense
                square
                color="orange-1"
                text-color="orange-10"
                icon="speed"
                class="text-weight-bold"
              >
                {{ formatKm(props.row.km_evento) }}
              </q-chip>
              <span v-else class="text-caption text-grey-5 italic">No reg.</span>
            </q-td>
          </template>

          <template v-slot:body-cell-subtotal="props">
            <q-td :props="props" class="text-right text-grey-8">
              {{ formatCurrency(props.row.subtotal) }}
            </q-td>
          </template>

          <template v-slot:body-cell-iva="props">
            <q-td :props="props" class="text-right text-grey-8">
              {{ formatCurrency(props.row.iva) }}
            </q-td>
          </template>

          <template v-slot:body-cell-total="props">
            <q-td :props="props" class="text-right">
              <span class="text-weight-bolder text-positive text-subtitle2">
                {{ formatCurrency(props.row.total) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-cargo="props">
            <q-td :props="props">
              <div class="text-caption text-weight-medium text-grey-9">
                {{ props.row.sucursal_cargo_nombre || "-" }}
              </div>
              <div class="text-caption text-grey-6">
                {{ props.row.depto_cargo_nombre || "" }}
              </div>
              <div v-if="props.row.factura" class="text-caption text-blue-8">
                Fact: {{ props.row.factura }}
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- VISTA 2: Agrupado por Órdenes de Servicio -->
      <div v-else class="q-gutter-y-sm">
        <div
          v-if="filteredOrders.length === 0"
          class="q-pa-xl text-center bg-white rounded-borders bordered"
        >
          <q-icon name="receipt_long" size="48px" color="grey-4" />
          <div class="text-subtitle1 text-grey-6 q-mt-sm">
            No hay órdenes de servicio que coincidan con los filtros seleccionados.
          </div>
        </div>

        <q-card
          v-for="orden in filteredOrders"
          :key="orden.id"
          flat
          bordered
          class="bg-white"
        >
          <q-expansion-item
            default-opened
            header-class="bg-grey-2"
            expand-icon-class="text-primary"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="receipt_long"
                  size="38px"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-subtitle1 flex items-center q-gutter-x-sm">
                  <span>Fecha: {{ formatFecha(orden.fecha_elaboracion) }}</span>
                  <q-badge v-if="orden.orden_compra" color="blue-8" outline>
                    OC: {{ orden.orden_compra }}
                  </q-badge>
                  <q-badge v-if="orden.autorizacion_compras" color="teal-8" outline>
                    Aut: {{ orden.autorizacion_compras }}
                  </q-badge>
                  <q-badge v-if="orden.factura" color="purple-8" outline>
                    Factura: {{ orden.factura }}
                  </q-badge>
                </q-item-label>
                <q-item-label caption class="text-grey-8">
                  <strong>Proveedor:</strong>
                  {{ orden.proveedor?.nombre || "No especificado" }}
                  <span v-if="orden.sucursal_cargo?.nombre || orden.sucursalCargo?.nombre">
                    &bull; <strong>Suc. Cargo:</strong>
                    {{ orden.sucursal_cargo?.nombre || orden.sucursalCargo?.nombre }}
                  </span>
                  <span v-if="orden.departamento_cargo?.nombre || orden.departamentoCargo?.nombre">
                    &bull; <strong>Depto. Cargo:</strong>
                    {{ orden.departamento_cargo?.nombre || orden.departamentoCargo?.nombre }}
                  </span>
                  <span v-if="orden.solicitante?.nombreCompleto">
                    &bull; <strong>Solicitante:</strong>
                    {{ orden.solicitante.nombreCompleto }}
                  </span>
                </q-item-label>
              </q-item-section>

              <q-item-section side class="text-right">
                <div class="text-caption text-grey-7">Total de la Orden</div>
                <div class="text-subtitle1 text-weight-bolder text-positive">
                  {{ formatCurrency(orden.totalOrden) }}
                </div>
              </q-item-section>
            </template>

            <q-separator />

            <q-card-section class="q-pa-none">
              <q-markup-table flat dense separator="horizontal">
                <thead>
                  <tr class="bg-grey-1 text-grey-8">
                    <th class="text-left">Tipo de Servicio</th>
                    <th class="text-left">Servicio</th>
                    <th class="text-left">Descripción</th>
                    <th class="text-right">Kilometraje</th>
                    <th class="text-right">Subtotal</th>
                    <th class="text-right">IVA</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="det in orden.detallesList" :key="det.id">
                    <td>
                      <q-badge
                        :color="
                          getTipoColor(
                            det.servicio?.tipo_servicio?.nombre ||
                              det.servicio?.tipoServicio?.nombre ||
                              'General'
                          )
                        "
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
                    <td style="max-width: 320px; white-space: normal">
                      {{ det.descripcion }}
                    </td>
                    <td class="text-right text-weight-medium">
                      {{ det.km_evento ? formatKm(det.km_evento) : "No reg." }}
                    </td>
                    <td class="text-right">{{ formatCurrency(det.subtotal) }}</td>
                    <td class="text-right">{{ formatCurrency(det.iva) }}</td>
                    <td class="text-right text-weight-bold text-positive">
                      {{ formatCurrency(det.total) }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-expansion-item>
        </q-card>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Pie del Modal -->
    <q-card-actions align="between" class="q-px-md q-py-sm bg-grey-2">
      <div class="text-caption text-grey-7">
        <q-icon name="info" size="14px" class="q-mr-xs" />
        Mostrando {{ filteredServices.length }} de {{ flatServices.length }} servicio(s)
        registrados para la unidad {{ vehicle?.placas || "" }}.
      </div>
      <div class="q-gutter-x-sm">
        <q-btn
          v-if="filters.search || filters.tipoServicio || filters.servicio"
          flat
          dense
          color="primary"
          icon="filter_alt_off"
          label="Limpiar filtros"
          @click="resetFilters"
        />
        <q-btn flat label="Cerrar" color="grey-8" v-close-popup />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { date } from "quasar";

const props = defineProps({
  vehicle: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const viewMode = ref("detalles");

const filters = ref({
  search: "",
  tipoServicio: null,
  servicio: null,
});

const resetFilters = () => {
  filters.value = {
    search: "",
    tipoServicio: null,
    servicio: null,
  };
};

const toggleTipoFilter = (nombre) => {
  filters.value.tipoServicio =
    filters.value.tipoServicio === nombre ? null : nombre;
};

const toggleServicioFilter = (nombre) => {
  filters.value.servicio = filters.value.servicio === nombre ? null : nombre;
};

// Lista de órdenes normalizada
const ordenesList = computed(() => {
  const raw =
    props.vehicle?.ordenes_servicio || props.vehicle?.ordenesServicio || [];
  return raw.map((orden) => {
    const detallesList =
      orden.detalles ||
      orden.detalles_servicio ||
      orden.detallesServicio ||
      [];
    const totalOrden = detallesList.reduce(
      (acc, d) => acc + Number(d.total || 0),
      0
    );
    return {
      ...orden,
      detallesList,
      totalOrden,
    };
  });
});

// Lista plana de todos los servicios realizados en cada orden
const flatServices = computed(() => {
  const items = [];
  for (const orden of ordenesList.value) {
    for (const det of orden.detallesList) {
      const servicioObj = det.servicio || {};
      const tipoObj =
        servicioObj.tipo_servicio || servicioObj.tipoServicio || {};
      const sucCargoObj = orden.sucursal_cargo || orden.sucursalCargo || {};
      const deptoCargoObj =
        orden.departamento_cargo || orden.departamentoCargo || {};

      items.push({
        uid: `${orden.id}-${det.id}`,
        id: det.id,
        orden_id: orden.id,
        fecha_elaboracion: orden.fecha_elaboracion,
        orden_compra: orden.orden_compra,
        autorizacion_compras: orden.autorizacion_compras,
        factura: orden.factura,
        proveedor_nombre: orden.proveedor?.nombre || null,
        solicitante_nombre: orden.solicitante?.nombreCompleto || null,
        sucursal_cargo_nombre: sucCargoObj?.nombre || null,
        depto_cargo_nombre: deptoCargoObj?.nombre || null,
        tipo_servicio_id: tipoObj?.id || null,
        tipo_servicio_nombre: tipoObj?.nombre || "Sin tipo",
        servicio_id: servicioObj?.id || det.servicio_id,
        servicio_nombre: servicioObj?.nombre || "Servicio general",
        intervalo_km_sugerido: servicioObj?.intervalo_km_sugerido || null,
        intervalo_meses_sugerido: servicioObj?.intervalo_meses_sugerido || null,
        descripcion: det.descripcion,
        km_evento:
          det.km_evento !== null && det.km_evento !== undefined
            ? Number(det.km_evento)
            : null,
        subtotal: Number(det.subtotal || 0),
        iva: Number(det.iva || 0),
        total: Number(det.total || 0),
      });
    }
  }
  return items;
});

// Opciones de filtros dinámicas
const tipoServicioOptions = computed(() => {
  const set = new Set(flatServices.value.map((s) => s.tipo_servicio_nombre));
  return Array.from(set).sort();
});

const servicioOptions = computed(() => {
  let base = flatServices.value;
  if (filters.value.tipoServicio) {
    base = base.filter(
      (s) => s.tipo_servicio_nombre === filters.value.tipoServicio
    );
  }
  const set = new Set(base.map((s) => s.servicio_nombre));
  return Array.from(set).sort();
});

// Servicios filtrados
const filteredServices = computed(() => {
  return flatServices.value.filter((item) => {
    if (
      filters.value.tipoServicio &&
      item.tipo_servicio_nombre !== filters.value.tipoServicio
    ) {
      return false;
    }
    if (
      filters.value.servicio &&
      item.servicio_nombre !== filters.value.servicio
    ) {
      return false;
    }
    if (filters.value.search) {
      const q = filters.value.search.toLowerCase();
      const match =
        (item.servicio_nombre &&
          item.servicio_nombre.toLowerCase().includes(q)) ||
        (item.tipo_servicio_nombre &&
          item.tipo_servicio_nombre.toLowerCase().includes(q)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(q)) ||
        (item.proveedor_nombre &&
          item.proveedor_nombre.toLowerCase().includes(q)) ||
        (item.orden_compra && item.orden_compra.toLowerCase().includes(q)) ||
        (item.factura && item.factura.toLowerCase().includes(q)) ||
        (item.autorizacion_compras &&
          item.autorizacion_compras.toLowerCase().includes(q)) ||
        (item.km_evento && String(item.km_evento).includes(q));
      if (!match) return false;
    }
    return true;
  });
});

// Órdenes filtradas para la vista de órdenes
const filteredOrders = computed(() => {
  const allowedOrdenIds = new Set(filteredServices.value.map((s) => s.orden_id));
  return ordenesList.value.filter((o) => allowedOrdenIds.has(o.id));
});

const filteredTotalAmount = computed(() => {
  return filteredServices.value.reduce((acc, s) => acc + s.total, 0);
});

// KPIs Generales
const kpis = computed(() => {
  const totalInvertido = flatServices.value.reduce((acc, s) => acc + s.total, 0);
  const subtotalInvertido = flatServices.value.reduce(
    (acc, s) => acc + s.subtotal,
    0
  );
  const ivaInvertido = flatServices.value.reduce((acc, s) => acc + s.iva, 0);

  const kms = flatServices.value
    .map((s) => s.km_evento)
    .filter((km) => km !== null && !isNaN(km) && km > 0);

  const maxKm = kms.length > 0 ? Math.max(...kms) : null;
  const minKm = kms.length > 0 ? Math.min(...kms) : null;

  const sortedByDate = [...flatServices.value].sort((a, b) => {
    return new Date(b.fecha_elaboracion || 0) - new Date(a.fecha_elaboracion || 0);
  });

  const ultimo = sortedByDate[0] || null;

  return {
    totalInvertido,
    subtotalInvertido,
    ivaInvertido,
    totalServicios: flatServices.value.length,
    totalOrdenes: ordenesList.value.length,
    maxKm,
    minKm,
    ultimoServicioFecha: ultimo?.fecha_elaboracion || null,
    ultimoServicioNombre: ultimo
      ? `${ultimo.servicio_nombre} (${ultimo.tipo_servicio_nombre})`
      : null,
  };
});

// Resumen por Tipo de Servicio
const resumenPorTipo = computed(() => {
  const map = {};
  const grandTotal = kpis.value.totalInvertido || 1;

  for (const s of flatServices.value) {
    const key = s.tipo_servicio_nombre;
    if (!map[key]) {
      map[key] = {
        nombre: key,
        count: 0,
        total: 0,
      };
    }
    map[key].count += 1;
    map[key].total += s.total;
  }

  return Object.values(map)
    .map((item) => ({
      ...item,
      porcentaje: (item.total / grandTotal) * 100,
    }))
    .sort((a, b) => b.total - a.total);
});

// Resumen por Servicio específico
const resumenPorServicio = computed(() => {
  const map = {};
  for (const s of flatServices.value) {
    const key = s.servicio_nombre;
    if (!map[key]) {
      map[key] = {
        nombre: key,
        tipo: s.tipo_servicio_nombre,
        count: 0,
        total: 0,
        ultimoKm: null,
      };
    }
    map[key].count += 1;
    map[key].total += s.total;
    if (
      s.km_evento &&
      (!map[key].ultimoKm || s.km_evento > map[key].ultimoKm)
    ) {
      map[key].ultimoKm = s.km_evento;
    }
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
});

const serviceColumns = [
  {
    name: "fecha",
    label: "Cuándo se realizó",
    field: "fecha_elaboracion",
    align: "left",
    sortable: true,
  },
  {
    name: "tipo_servicio",
    label: "Tipo de Servicio",
    field: "tipo_servicio_nombre",
    align: "left",
    sortable: true,
  },
  {
    name: "servicio",
    label: "Servicio",
    field: "servicio_nombre",
    align: "left",
    sortable: true,
  },
  {
    name: "descripcion",
    label: "Descripción / Proveedor",
    field: "descripcion",
    align: "left",
  },
  {
    name: "km_evento",
    label: "KM del Servicio",
    field: "km_evento",
    align: "right",
    sortable: true,
  },
  {
    name: "subtotal",
    label: "Subtotal",
    field: "subtotal",
    align: "right",
    sortable: true,
  },
  {
    name: "iva",
    label: "IVA",
    field: "iva",
    align: "right",
    sortable: true,
  },
  {
    name: "total",
    label: "Dinero Invertido (Total)",
    field: "total",
    align: "right",
    sortable: true,
  },
  {
    name: "cargo",
    label: "Cargo / Factura",
    field: "sucursal_cargo_nombre",
    align: "left",
  },
];

const getTipoColor = (tipoNombre = "") => {
  const lower = tipoNombre.toLowerCase();
  if (lower.includes("preventivo")) return "teal-7";
  if (lower.includes("correctivo")) return "deep-orange-7";
  if (lower.includes("llanta") || lower.includes("neum")) return "indigo-7";
  if (lower.includes("estét") || lower.includes("carrocer") || lower.includes("hojalat"))
    return "purple-7";
  if (lower.includes("administrativo") || lower.includes("trámite") || lower.includes("seguro"))
    return "blue-grey-7";
  return "primary";
};

const formatCurrency = (val) => {
  const num = Number(val || 0);
  return num.toLocaleString("es-MX", {
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
  // Evitar desfase de zona horaria cuando viene YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return date.formatDate(fechaStr, "DD/MM/YYYY");
};
</script>

<style scoped>
.font-mono {
  font-family: monospace;
  letter-spacing: 0.5px;
}
.kpi-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.kpi-card:hover {
  transform: translateY(-2px);
}
.kpi-border-green {
  border-left: 4px solid var(--q-positive);
}
.kpi-border-blue {
  border-left: 4px solid var(--q-primary);
}
.kpi-border-orange {
  border-left: 4px solid #ef6c00;
}
.kpi-border-purple {
  border-left: 4px solid #673ab7;
}
.tipo-summary-box {
  border: 1px solid #e0e0e0;
  transition: all 0.15s ease;
}
.tipo-summary-box:hover {
  border-color: var(--q-primary);
}
.border-primary {
  border: 1.5px solid var(--q-primary) !important;
}
</style>
