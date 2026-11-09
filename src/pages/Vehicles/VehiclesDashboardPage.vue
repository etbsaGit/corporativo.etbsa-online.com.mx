<template>
  <div class="q-pa-sm bg-grey-1">
    <!-- Encabezado Principal -->
    <q-card flat bordered class="q-mb-sm bg-primary text-white">
      <q-card-section class="q-py-sm q-px-md">
        <div class="row items-center justify-between q-col-gutter-sm">
          <div class="row items-center no-wrap col-12 col-md-auto">
            <q-avatar
              icon="analytics"
              color="white"
              text-color="primary"
              size="44px"
              class="q-mr-md shadow-2"
            />
            <div>
              <div class="row items-center q-gutter-x-sm">
                <div class="text-h6 text-weight-bold leading-tight">
                  Dashboard General de Vehículos y Servicios
                </div>
                <q-badge
                  color="white"
                  text-color="primary"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  {{ filteredVehicles.length }} / {{ rawVehicles.length }} unidades
                </q-badge>
                <q-badge
                  v-if="activeFiltersCount > 0"
                  color="amber-9"
                  text-color="white"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  <q-icon name="filter_alt" size="13px" class="q-mr-xs" />
                  {{ activeFiltersCount }} filtro(s) activo(s)
                </q-badge>
              </div>
              <div class="text-caption text-blue-1 q-mt-xs">
                Visualización ejecutiva y consolidada de servicios, inversión, proveedores y estado de toda la flotilla vehicular
              </div>
            </div>
          </div>

          <div class="row items-center q-gutter-sm col-12 col-md-auto justify-end">
            <q-btn
              v-if="activeFiltersCount > 0"
              unelevated
              dense
              color="red-7"
              icon="filter_alt_off"
              label="Limpiar Filtros"
              class="q-px-sm text-weight-bold"
              @click="resetAllFilters"
            >
              <q-tooltip>Quitar todos los filtros aplicados</q-tooltip>
            </q-btn>
            <q-btn
              outline
              dense
              color="white"
              icon="sync"
              label="Actualizar"
              class="q-px-sm"
              :loading="loading"
              @click="loadDashboard"
            >
              <q-tooltip>Recargar información del servidor</q-tooltip>
            </q-btn>
            <q-btn
              unelevated
              dense
              color="positive"
              icon="file_download"
              label="Exportar Excel"
              class="q-px-md text-weight-bold"
              :loading="exportingExcel"
              :disable="loading"
              @click="exportToExcel"
            >
              <q-tooltip>
                Descargar Excel con Dashboard, Gráficas Interactivas, Historial de Servicios y Flotilla Filtrada
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Panel de Filtros Avanzados -->
    <q-card flat bordered class="q-mb-sm bg-white">
      <q-card-section class="q-pa-sm">
        <!-- Fila Principal de Filtros Rápidos -->
        <div class="row q-col-gutter-sm items-center">
          <!-- Búsqueda general -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model="filters.search"
              outlined
              dense
              clearable
              placeholder="Buscar placa, serie, OC, factura, servicio, proveedor..."
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>

          <!-- Unidad / Placa -->
          <div class="col-12 col-sm-6 col-md-2">
            <q-select
              v-model="filters.vehicle_id"
              :options="filteredVehicleOpts"
              label="Unidad (Placa / Serie)"
              option-value="id"
              :option-label="formatVehicleOptionLabel"
              emit-value
              map-options
              use-input
              input-debounce="0"
              clearable
              outlined
              dense
              options-dense
              behavior="menu"
              @filter="filterVehiclesFn"
            />
          </div>

          <!-- Sucursal Unidad -->
          <div class="col-12 col-sm-6 col-md-2">
            <q-select
              v-model="filters.sucursal_id"
              :options="catalogs.sucursales"
              label="Sucursal Unidad"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              clearable
              outlined
              dense
              options-dense
              behavior="menu"
            />
          </div>

          <!-- Tipo de Servicio -->
          <div class="col-12 col-sm-6 col-md-2">
            <q-select
              v-model="filters.tipo_servicio_id"
              :options="filteredTiposServicioOpts"
              label="Tipo de Servicio"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              use-input
              input-debounce="0"
              clearable
              outlined
              dense
              options-dense
              behavior="menu"
              @filter="filterTiposServicioFn"
              @update:model-value="onTipoServicioChange"
            />
          </div>

          <!-- Servicio Específico -->
          <div class="col-12 col-sm-6 col-md-2">
            <q-select
              v-model="filters.servicio_id"
              :options="filteredServiciosCatOpts"
              label="Servicio Específico"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              use-input
              input-debounce="0"
              clearable
              outlined
              dense
              options-dense
              behavior="menu"
              @filter="filterServiciosCatFn"
            />
          </div>

          <!-- Botón Más Filtros -->
          <div class="col-12 col-sm-6 col-md-1 flex justify-end">
            <q-btn
              :unelevated="showAdvancedFilters || advancedFiltersCount > 0"
              :outline="!showAdvancedFilters && advancedFiltersCount === 0"
              dense
              no-caps
              color="primary"
              class="full-width"
              :icon="showAdvancedFilters ? 'expand_less' : 'tune'"
              :label="advancedFiltersCount > 0 ? `Filtros (${advancedFiltersCount})` : 'Más'"
              @click="showAdvancedFilters = !showAdvancedFilters"
            >
              <q-tooltip>
                Mostrar/ocultar filtros de Marca, Modelo, Tipo, Línea, Departamento, Fechas, Proveedor y Estatus
              </q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Panel Desplegable con Todos los Filtros Específicos -->
        <q-slide-transition>
          <div v-show="showAdvancedFilters" class="q-mt-sm q-pt-sm border-top-dashed">
            <div class="row q-col-gutter-sm items-center">
              <!-- Filtros de Unidad -->
              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="filters.marca_id"
                  :options="filteredMarcasOpts"
                  label="Marca"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  use-input
                  input-debounce="0"
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                  @filter="filterMarcasFn"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="filters.modelo_id"
                  :options="filteredModelosOpts"
                  label="Modelo"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  use-input
                  input-debounce="0"
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                  @filter="filterModelosFn"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="filters.tipo_id"
                  :options="catalogs.tipos"
                  label="Tipo de Vehículo"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="filters.activo"
                  :options="activoOptions"
                  label="Estatus Unidad"
                  emit-value
                  map-options
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                />
              </div>

              <!-- Filtros de Asignación Organizacional -->
              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="filters.linea_id"
                  :options="catalogs.lineas"
                  label="Línea Unidad"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="filters.departamento_id"
                  :options="catalogs.departamentos"
                  label="Depto. Unidad"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                />
              </div>

              <!-- Responsable / Usuario Asignado -->
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  v-model="filters.responsable_id"
                  :options="filteredEmpleadosOpts"
                  label="Responsable / Encargado Unidad"
                  option-value="id"
                  option-label="nombreCompleto"
                  emit-value
                  map-options
                  use-input
                  input-debounce="0"
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                  @filter="filterEmpleadosFn"
                />
              </div>

              <!-- Proveedor -->
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  v-model="filters.proveedor_id"
                  :options="filteredProveedoresOpts"
                  label="Proveedor / Taller"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  use-input
                  input-debounce="0"
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                  @filter="filterProveedoresFn"
                />
              </div>

              <!-- Estatus de Orden -->
              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="filters.estatus_orden_id"
                  :options="catalogs.estatus_orden"
                  label="Estatus de Orden"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  clearable
                  outlined
                  dense
                  options-dense
                  behavior="menu"
                />
              </div>

              <!-- Rango de Fechas -->
              <div class="col-12 col-sm-6 col-md-2">
                <q-input
                  v-model="filters.fecha_desde"
                  type="date"
                  label="Fecha Desde"
                  stack-label
                  outlined
                  dense
                  clearable
                />
              </div>

              <div class="col-12 col-sm-6 col-md-2">
                <q-input
                  v-model="filters.fecha_hasta"
                  type="date"
                  label="Fecha Hasta"
                  stack-label
                  outlined
                  dense
                  clearable
                />
              </div>
            </div>
          </div>
        </q-slide-transition>

        <!-- Chips de Filtros Rápidos por Estatus de Orden -->
        <div class="row items-center justify-between q-mt-sm q-pt-xs border-top-light wrap q-col-gutter-y-xs">
          <div class="row items-center q-gutter-xs wrap">
            <span class="text-caption text-grey-7 text-weight-medium q-mr-xs">
              Estatus de Órdenes:
            </span>
            <q-btn
              dense
              no-caps
              size="sm"
              :unelevated="!filters.estatus_orden_id"
              :outline="Boolean(filters.estatus_orden_id)"
              color="blue-grey-8"
              class="q-px-sm text-weight-bold"
              label="Todas"
              @click="filters.estatus_orden_id = null"
            />
            <q-btn
              v-for="est in catalogs.estatus_orden"
              :key="est.id"
              dense
              no-caps
              size="sm"
              :unelevated="Number(filters.estatus_orden_id) === Number(est.id)"
              :outline="Number(filters.estatus_orden_id) !== Number(est.id)"
              :color="getEstatusBtnColor(est.nombre)"
              class="q-px-sm text-weight-bold"
              @click="toggleEstatusOrdenFilter(est.id)"
            >
              <span>{{ est.nombre }}</span>
              <q-badge
                :color="Number(filters.estatus_orden_id) === Number(est.id) ? 'white' : getEstatusBtnColor(est.nombre)"
                :text-color="Number(filters.estatus_orden_id) === Number(est.id) ? 'dark' : 'white'"
                class="q-ml-xs"
              >
                {{ countOrdenesByEstatus(est.id) }}
              </q-badge>
            </q-btn>
          </div>

          <!-- Selector de Vista Principal -->
          <div class="row items-center">
            <q-btn-toggle
              v-model="activeTab"
              no-caps
              dense
              unelevated
              toggle-color="primary"
              color="grey-3"
              text-color="grey-8"
              :options="[
                { label: 'Servicios Detallados', value: 'servicios', icon: 'list_alt' },
                { label: 'Órdenes de Compra', value: 'ordenes', icon: 'receipt_long' },
                { label: 'Resumen de Flotilla', value: 'flotilla', icon: 'directions_car' },
              ]"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Estado de Carga -->
    <div v-if="loading" class="q-pa-xl text-center bg-white rounded-borders bordered">
      <q-spinner-dots color="primary" size="3.5em" />
      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        Cargando información general de vehículos y servicios...
      </div>
    </div>

    <template v-else>
      <!-- Tarjetas de KPIs Ejecutivos -->
      <div class="row q-col-gutter-sm q-mb-sm">
        <!-- KPI 1: Dinero Total Invertido -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-green bg-white">
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

        <!-- KPI 2: Servicios y Órdenes -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-blue bg-white">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-overline text-grey-7 leading-none">
                    SERVICIOS REALIZADOS
                  </div>
                  <div class="text-h5 text-weight-bolder text-primary q-mt-xs">
                    {{ kpis.totalServicios.toLocaleString("es-MX") }}
                    <span class="text-subtitle2 text-weight-regular text-grey-7">
                      servicio(s)
                    </span>
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    En <strong>{{ kpis.totalOrdenes }}</strong> orden(es) &bull; Promedio:
                    <strong>{{ formatCurrency(kpis.promedioPorOrden) }}</strong>/orden
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

        <!-- KPI 3: Estado de la Flotilla -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-orange bg-white">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-overline text-grey-7 leading-none">
                    ESTADO DE LA FLOTILLA
                  </div>
                  <div class="text-h5 text-weight-bolder text-orange-9 q-mt-xs">
                    {{ kpis.totalUnidades }}
                    <span class="text-subtitle2 text-weight-regular text-grey-7">
                      unidad(es)
                    </span>
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    <span class="text-positive text-weight-bold">
                      {{ kpis.unidadesActivas }} Activas
                    </span>
                    &bull;
                    <span class="text-negative text-weight-bold">
                      {{ kpis.unidadesInactivas }} Inactivas
                    </span>
                    &bull; {{ kpis.unidadesConServicio }} con serv.
                  </div>
                </div>
                <q-avatar
                  color="orange-1"
                  text-color="orange-9"
                  icon="directions_car"
                  size="46px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- KPI 4: Unidad con Mayor Inversión / Último Servicio -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-purple bg-white">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col overflow-hidden">
                  <div class="text-overline text-grey-7 leading-none">
                    MAYOR INVERSIÓN EN UNIDAD
                  </div>
                  <div
                    v-if="kpis.topUnidad"
                    class="text-h6 text-weight-bolder text-deep-purple q-mt-xs ellipsis cursor-pointer"
                    @click="toggleVehicleFilter(kpis.topUnidad.vehicle_id)"
                  >
                    {{ kpis.topUnidad.placas }} — {{ formatCurrency(kpis.topUnidad.total) }}
                  </div>
                  <div v-else class="text-h6 text-weight-bolder text-grey-6 q-mt-xs">
                    Sin registros
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs ellipsis">
                    <template v-if="kpis.topUnidad">
                      {{ kpis.topUnidad.vehiculo_desc }} ({{ kpis.topUnidad.count }} serv.)
                    </template>
                    <template v-else>
                      Ningún servicio con los filtros actuales
                    </template>
                  </div>
                </div>
                <q-avatar
                  color="deep-purple-1"
                  text-color="deep-purple"
                  icon="workspace_premium"
                  size="46px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- GRÁFICAS DE LÍNEAS DE TENDENCIA: ANTIGÜEDAD Y RANGO DE KILOMETRAJE  -->
      <!-- =================================================================== -->
      <div class="row q-col-gutter-sm q-mb-sm containment-section">
        <!-- Gráfica 1: Monto Gastado por Antigüedad de la Unidad -->
        <div class="col-12 col-lg-6">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1">
              <div class="row items-center justify-between q-col-gutter-xs">
                <div class="row items-center no-wrap">
                  <q-icon
                    name="timeline"
                    color="primary"
                    size="20px"
                    class="q-mr-xs"
                  />
                  <div>
                    <div class="text-subtitle2 text-weight-bold text-primary leading-tight">
                      Tendencia de Gasto por Antigüedad de la Unidad
                    </div>
                    <div class="text-caption text-grey-7">
                      Identifica a partir de qué año de antigüedad se disparan los costos de mantenimiento
                    </div>
                  </div>
                </div>

                <div class="row items-center q-gutter-xs">
                  <q-chip
                    v-if="filters.antiguedad_anios !== null"
                    removable
                    dense
                    color="primary"
                    text-color="white"
                    icon="filter_alt"
                    class="text-weight-bold"
                    @remove="filters.antiguedad_anios = null"
                  >
                    Edad: {{ filters.antiguedad_anios }}
                    {{ Number(filters.antiguedad_anios) === 1 ? "año" : "años" }}
                  </q-chip>
                  <q-btn-toggle
                    v-model="antiguedadMode"
                    dense
                    no-caps
                    unelevated
                    size="sm"
                    toggle-color="primary"
                    color="grey-3"
                    text-color="grey-8"
                    :options="[
                      { label: 'Edad al Servicio', value: 'servicio' },
                      { label: 'Edad Actual (Modelo)', value: 'actual' },
                    ]"
                    @update:model-value="filters.antiguedad_anios = null"
                  >
                    <q-tooltip>
                      "Edad al Servicio" calcula los años que tenía la unidad cuando ocurrió cada gasto;
                      "Edad Actual" agrupa por la antigüedad actual (año modelo) de la unidad
                    </q-tooltip>
                  </q-btn-toggle>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Cintillo de Hallazgos / Picos de Antigüedad -->
            <div
              v-if="tendenciaPorAntiguedad.items.length > 0"
              class="row items-center justify-between q-px-md q-py-xs bg-blue-1 text-caption q-col-gutter-x-sm wrap"
            >
              <div v-if="tendenciaPorAntiguedad.peakTotal" class="row items-center">
                <q-icon
                  name="trending_up"
                  color="negative"
                  size="16px"
                  class="q-mr-xs"
                />
                <span class="text-grey-8 q-mr-xs">Mayor gasto total:</span>
                <strong class="text-negative q-mr-xs">
                  {{ tendenciaPorAntiguedad.peakTotal.label }}
                </strong>
                <span class="text-weight-bold text-dark">
                  ({{ formatCurrency(tendenciaPorAntiguedad.peakTotal.total) }} en
                  {{ tendenciaPorAntiguedad.peakTotal.servicios }} serv.)
                </span>
              </div>
              <div v-if="tendenciaPorAntiguedad.peakAvg" class="row items-center">
                <q-icon
                  name="speed"
                  color="deep-orange-8"
                  size="15px"
                  class="q-mr-xs"
                />
                <span class="text-grey-8 q-mr-xs">Mayor prom./unidad:</span>
                <strong class="text-deep-orange-9 q-mr-xs">
                  {{ tendenciaPorAntiguedad.peakAvg.label }}
                </strong>
                <span class="text-weight-bold text-dark">
                  ({{ formatCurrency(tendenciaPorAntiguedad.peakAvg.promedioPorUnidad) }}/u)
                </span>
              </div>
              <div class="text-grey-7">
                Clic en un punto para filtrar
              </div>
            </div>

            <q-card-section class="q-pa-sm position-relative">
              <div
                v-if="tendenciaPorAntiguedad.items.length === 0"
                class="flex flex-center column text-grey-6"
                style="height: 290px"
              >
                <q-icon name="show_chart" size="42px" color="grey-4" />
                <div class="text-caption q-mt-xs">
                  No hay servicios con año de modelo de unidad registrado para graficar antigüedad.
                </div>
              </div>
              <div
                v-show="tendenciaPorAntiguedad.items.length > 0"
                ref="antiguedadChartRef"
                class="trend-chart-canvas"
              ></div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Gráfica 2: Monto Gastado por Rango de Kilometraje (Intervalos de 10,000 km) -->
        <div class="col-12 col-lg-6">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1">
              <div class="row items-center justify-between q-col-gutter-xs">
                <div class="row items-center no-wrap">
                  <q-icon
                    name="insights"
                    color="teal-8"
                    size="20px"
                    class="q-mr-xs"
                  />
                  <div>
                    <div class="text-subtitle2 text-weight-bold text-teal-9 leading-tight">
                      Tendencia de Gasto por Rango de KM (Intervalos de 10,000 km)
                    </div>
                    <div class="text-caption text-grey-7">
                      Detecta entre qué kilometrajes las unidades presentan mayor desgaste e inversión
                    </div>
                  </div>
                </div>

                <div class="row items-center q-gutter-xs">
                  <q-chip
                    v-if="filters.km_bucket !== null"
                    removable
                    dense
                    color="teal-8"
                    text-color="white"
                    icon="filter_alt"
                    class="text-weight-bold"
                    @remove="filters.km_bucket = null"
                  >
                    KM: {{ formatKmBucketFull(filters.km_bucket) }}
                  </q-chip>
                  <q-btn-toggle
                    v-model="kmSourceMode"
                    dense
                    no-caps
                    unelevated
                    size="sm"
                    toggle-color="teal-8"
                    color="grey-3"
                    text-color="grey-8"
                    :options="[
                      { label: 'KM del Servicio', value: 'evento' },
                      { label: 'KM Serv. + Actual', value: 'mixto' },
                    ]"
                    @update:model-value="filters.km_bucket = null"
                  >
                    <q-tooltip>
                      "KM del Servicio" usa el kilometraje registrado en cada servicio;
                      "KM Serv. + Actual" usa el último KM de la unidad cuando el servicio no tiene KM capturado
                    </q-tooltip>
                  </q-btn-toggle>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Cintillo de Hallazgos / Picos de Kilometraje -->
            <div
              v-if="tendenciaPorKm.items.length > 0"
              class="row items-center justify-between q-px-md q-py-xs bg-teal-1 text-caption q-col-gutter-x-sm wrap"
            >
              <div v-if="tendenciaPorKm.peakTotal" class="row items-center">
                <q-icon
                  name="warning_amber"
                  color="deep-orange-9"
                  size="16px"
                  class="q-mr-xs"
                />
                <span class="text-grey-8 q-mr-xs">Pico de desgaste (Total):</span>
                <strong class="text-deep-orange-9 q-mr-xs">
                  {{ tendenciaPorKm.peakTotal.fullLabel }}
                </strong>
                <span class="text-weight-bold text-dark">
                  ({{ formatCurrency(tendenciaPorKm.peakTotal.total) }} en
                  {{ tendenciaPorKm.peakTotal.servicios }} serv.)
                </span>
              </div>
              <div v-if="tendenciaPorKm.peakAvg" class="row items-center">
                <q-icon
                  name="analytics"
                  color="purple-9"
                  size="15px"
                  class="q-mr-xs"
                />
                <span class="text-grey-8 q-mr-xs">Mayor prom./unidad:</span>
                <strong class="text-purple-9 q-mr-xs">
                  {{ tendenciaPorKm.peakAvg.label }}
                </strong>
                <span class="text-weight-bold text-dark">
                  ({{ formatCurrency(tendenciaPorKm.peakAvg.promedioPorUnidad) }}/u)
                </span>
              </div>
              <div class="text-grey-7">
                Clic en un rango para filtrar
              </div>
            </div>

            <q-card-section class="q-pa-sm position-relative">
              <div
                v-if="tendenciaPorKm.items.length === 0"
                class="flex flex-center column text-grey-6"
                style="height: 290px"
              >
                <q-icon name="speed" size="42px" color="grey-4" />
                <div class="text-caption q-mt-xs">
                  No hay servicios con kilometraje registrado para los filtros actuales.
                </div>
              </div>
              <div
                v-show="tendenciaPorKm.items.length > 0"
                ref="kmChartRef"
                class="trend-chart-canvas"
              ></div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Paneles Analíticos Interactivos (Servicios / Refacciones y Top Unidades/Proveedores) -->
      <div
        v-if="activeTab !== 'flotilla'"
        class="row q-col-gutter-sm q-mb-sm containment-section"
      >
        <!-- Columna 1: Inversión por Tipo de Servicio -->
        <div class="col-12 col-md-4">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1 flex items-center justify-between">
              <div class="text-subtitle2 text-weight-bold text-primary flex items-center">
                <q-icon name="pie_chart" class="q-mr-xs" size="18px" />
                Inversión por Tipo de Servicio
              </div>
              <span class="text-caption text-grey-6">Clic para filtrar</span>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm scroll" style="max-height: 215px">
              <div v-if="resumenPorTipo.length === 0" class="q-pa-md text-center text-grey-6 text-caption">
                Sin servicios registrados para mostrar distribución.
              </div>
              <div class="row q-col-gutter-xs" v-else>
                <div
                  v-for="tipo in resumenPorTipo"
                  :key="tipo.nombre"
                  class="col-12 col-sm-6"
                >
                  <div
                    class="q-pa-sm rounded-borders cursor-pointer tipo-summary-box"
                    :class="
                      Number(filters.tipo_servicio_id) === Number(tipo.id)
                        ? 'bg-blue-1 border-primary'
                        : 'bg-grey-1'
                    "
                    @click="toggleTipoFilterById(tipo.id)"
                  >
                    <div class="row items-center justify-between q-mb-xs no-wrap">
                      <q-badge
                        :color="getTipoColor(tipo.nombre)"
                        class="text-weight-bold q-px-xs ellipsis"
                      >
                        {{ tipo.nombre }}
                      </q-badge>
                      <span class="text-caption text-weight-bold text-grey-8">
                        {{ tipo.count }} ({{ tipo.porcentaje.toFixed(0) }}%)
                      </span>
                    </div>
                    <div class="text-subtitle2 text-weight-bolder text-dark">
                      {{ formatCurrency(tipo.total) }}
                    </div>
                    <q-linear-progress
                      :value="tipo.porcentaje / 100"
                      :color="getTipoColor(tipo.nombre)"
                      rounded
                      size="5px"
                      class="q-mt-xs"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Columna 2: Top Unidades con Mayor Inversión -->
        <div class="col-12 col-md-4">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1 flex items-center justify-between">
              <div class="text-subtitle2 text-weight-bold text-primary flex items-center">
                <q-icon name="directions_car" class="q-mr-xs" size="18px" />
                Unidades con Mayor Inversión
              </div>
              <q-badge
                color="primary"
                outline
                :label="`${resumenPorUnidad.length} unidad(es)`"
              />
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-xs scroll" style="max-height: 215px">
              <div v-if="resumenPorUnidad.length === 0" class="q-pa-md text-center text-grey-6 text-caption">
                Sin inversión registrada en unidades.
              </div>
              <q-list v-else dense separator>
                <q-item
                  v-for="uni in resumenPorUnidad"
                  :key="uni.vehicle_id"
                  clickable
                  v-ripple
                  @click="toggleVehicleFilter(uni.vehicle_id)"
                  :class="Number(filters.vehicle_id) === Number(uni.vehicle_id) ? 'bg-blue-1' : ''"
                >
                  <q-item-section>
                    <q-item-label class="row items-center q-gutter-x-xs">
                      <q-badge color="primary" class="text-weight-bold">
                        {{ uni.placas }}
                      </q-badge>
                      <span class="text-weight-medium text-body2 ellipsis">
                        {{ uni.vehiculo_desc }}
                      </span>
                    </q-item-label>
                    <q-item-label caption>
                      {{ uni.sucursal || "Sin suc." }} &bull;
                      {{ uni.departamento || "Sin depto." }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-right">
                    <q-item-label class="text-weight-bold text-positive">
                      {{ formatCurrency(uni.total) }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ uni.count }} serv. &bull; {{ uni.porcentaje.toFixed(1) }}%
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Columna 3: Principales Servicios / Proveedores -->
        <div class="col-12 col-md-4">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1 flex items-center justify-between">
              <div class="text-subtitle2 text-weight-bold text-primary flex items-center">
                <q-icon
                  :name="rightPanelMode === 'servicios' ? 'build_circle' : 'storefront'"
                  class="q-mr-xs"
                  size="18px"
                />
                {{ rightPanelMode === "servicios" ? "Top Servicios" : "Top Proveedores" }}
              </div>
              <q-btn-toggle
                v-model="rightPanelMode"
                dense
                no-caps
                unelevated
                size="sm"
                toggle-color="primary"
                color="grey-3"
                text-color="grey-8"
                :options="[
                  { label: 'Servicios', value: 'servicios' },
                  { label: 'Proveedores', value: 'proveedores' },
                ]"
              />
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-xs scroll" style="max-height: 215px">
              <!-- Lista de Servicios -->
              <template v-if="rightPanelMode === 'servicios'">
                <div v-if="resumenPorServicio.length === 0" class="q-pa-md text-center text-grey-6 text-caption">
                  Sin servicios registrados.
                </div>
                <q-list v-else dense separator>
                  <q-item
                    v-for="serv in resumenPorServicio"
                    :key="serv.id || serv.nombre"
                    clickable
                    v-ripple
                    @click="toggleServicioFilterById(serv.id)"
                    :class="Number(filters.servicio_id) === Number(serv.id) ? 'bg-blue-1' : ''"
                  >
                    <q-item-section>
                      <q-item-label class="text-weight-medium text-body2 ellipsis">
                        {{ serv.nombre }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ serv.tipo }}
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
              </template>

              <!-- Lista de Proveedores -->
              <template v-else>
                <div v-if="resumenPorProveedor.length === 0" class="q-pa-md text-center text-grey-6 text-caption">
                  Sin proveedores registrados.
                </div>
                <q-list v-else dense separator>
                  <q-item
                    v-for="prov in resumenPorProveedor"
                    :key="prov.id || prov.nombre"
                    clickable
                    v-ripple
                    @click="toggleProveedorFilterById(prov.id)"
                    :class="Number(filters.proveedor_id) === Number(prov.id) ? 'bg-blue-1' : ''"
                  >
                    <q-item-section>
                      <q-item-label class="text-weight-medium text-body2 ellipsis">
                        {{ prov.nombre }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ prov.count }} servicio(s)
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side class="text-right">
                      <q-item-label class="text-weight-bold text-positive">
                        {{ formatCurrency(prov.total) }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ prov.porcentaje.toFixed(1) }}% del total
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Paneles de Distribución de Flotilla (Visible siempre en pestaña Flotilla o desplegable) -->
      <div class="row q-col-gutter-sm q-mb-sm containment-section">
        <!-- Por Sucursal -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1 flex items-center justify-between">
              <div class="text-caption text-weight-bold text-primary flex items-center">
                <q-icon name="store" class="q-mr-xs" size="16px" />
                Flotilla e Inversión por Sucursal
              </div>
              <span class="text-caption text-grey-6">Clic filtra</span>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-xs scroll" style="max-height: 180px">
              <q-list dense separator>
                <q-item
                  v-for="item in flotillaPorSucursal"
                  :key="item.id || item.nombre"
                  clickable
                  v-ripple
                  @click="toggleSucursalFilter(item.id)"
                  :class="Number(filters.sucursal_id) === Number(item.id) ? 'bg-blue-1' : ''"
                >
                  <q-item-section>
                    <q-item-label class="text-caption text-weight-bold">
                      {{ item.nombre }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ item.unidades }} unidad(es) &bull; {{ item.servicios }} serv.
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-right">
                    <q-item-label class="text-caption text-weight-bold text-positive">
                      {{ formatCurrency(item.total) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Por Línea -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1 flex items-center justify-between">
              <div class="text-caption text-weight-bold text-primary flex items-center">
                <q-icon name="category" class="q-mr-xs" size="16px" />
                Flotilla e Inversión por Línea
              </div>
              <span class="text-caption text-grey-6">Clic filtra</span>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-xs scroll" style="max-height: 180px">
              <q-list dense separator>
                <q-item
                  v-for="item in flotillaPorLinea"
                  :key="item.id || item.nombre"
                  clickable
                  v-ripple
                  @click="toggleLineaFilter(item.id)"
                  :class="Number(filters.linea_id) === Number(item.id) ? 'bg-blue-1' : ''"
                >
                  <q-item-section>
                    <q-item-label class="text-caption text-weight-bold">
                      {{ item.nombre }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ item.unidades }} unidad(es) &bull; {{ item.servicios }} serv.
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-right">
                    <q-item-label class="text-caption text-weight-bold text-positive">
                      {{ formatCurrency(item.total) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Por Departamento -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1 flex items-center justify-between">
              <div class="text-caption text-weight-bold text-primary flex items-center">
                <q-icon name="domain" class="q-mr-xs" size="16px" />
                Flotilla e Inversión por Depto.
              </div>
              <span class="text-caption text-grey-6">Clic filtra</span>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-xs scroll" style="max-height: 180px">
              <q-list dense separator>
                <q-item
                  v-for="item in flotillaPorDepartamento"
                  :key="item.id || item.nombre"
                  clickable
                  v-ripple
                  @click="toggleDepartamentoFilter(item.id)"
                  :class="Number(filters.departamento_id) === Number(item.id) ? 'bg-blue-1' : ''"
                >
                  <q-item-section>
                    <q-item-label class="text-caption text-weight-bold">
                      {{ item.nombre }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ item.unidades }} unidad(es) &bull; {{ item.servicios }} serv.
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-right">
                    <q-item-label class="text-caption text-weight-bold text-positive">
                      {{ formatCurrency(item.total) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Por Marca -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section class="q-py-xs q-px-md bg-grey-1 flex items-center justify-between">
              <div class="text-caption text-weight-bold text-primary flex items-center">
                <q-icon name="verified" class="q-mr-xs" size="16px" />
                Flotilla e Inversión por Marca
              </div>
              <span class="text-caption text-grey-6">Clic filtra</span>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-xs scroll" style="max-height: 180px">
              <q-list dense separator>
                <q-item
                  v-for="item in flotillaPorMarca"
                  :key="item.id || item.nombre"
                  clickable
                  v-ripple
                  @click="toggleMarcaFilter(item.id)"
                  :class="Number(filters.marca_id) === Number(item.id) ? 'bg-blue-1' : ''"
                >
                  <q-item-section>
                    <q-item-label class="text-caption text-weight-bold">
                      {{ item.nombre }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ item.unidades }} unidad(es) &bull; {{ item.servicios }} serv.
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-right">
                    <q-item-label class="text-caption text-weight-bold text-positive">
                      {{ formatCurrency(item.total) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- PESTAÑA 1: TABLA GENERAL DETALLADA DE SERVICIOS REALIZADOS          -->
      <!-- =================================================================== -->
      <q-card
        v-if="activeTab === 'servicios'"
        flat
        bordered
        class="bg-white containment-section"
      >
        <div
          tabindex="0"
          role="region"
          aria-label="Tabla general de servicios de vehículos"
        >
          <q-table
            flat
            :rows="filteredServices"
            :columns="serviceColumns"
            row-key="uid"
            dense
            :pagination="{ rowsPerPage: 20 }"
            :rows-per-page-options="[15, 20, 35, 50, 100, 0]"
            no-data-label="No se encontraron servicios con los filtros seleccionados."
          >
            <template v-slot:top>
              <div class="row full-width items-center justify-between q-py-xs">
                <div class="text-subtitle1 text-weight-bold text-dark flex items-center">
                  <q-icon
                    name="history_edu"
                    color="primary"
                    size="sm"
                    class="q-mr-xs"
                  />
                  Historial Consolidado de Servicios y Refacciones
                  <q-badge
                    color="primary"
                    outline
                    class="q-ml-sm"
                    :label="`${filteredServices.length} servicio(s)`"
                  />
                </div>
                <div class="text-subtitle2 text-grey-8">
                  Total filtrado:
                  <span class="text-weight-bolder text-positive text-subtitle1">
                    {{ formatCurrency(kpis.totalInvertido) }}
                  </span>
                </div>
              </div>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" auto-width>
                <q-btn
                  dense
                  flat
                  round
                  size="sm"
                  color="teal"
                  icon="visibility"
                  @click="openOrderDetail(props.row.orden_raw)"
                >
                  <q-tooltip>Ver Orden de Compra #{{ props.row.orden_id }}</q-tooltip>
                </q-btn>
                <q-btn
                  dense
                  flat
                  round
                  size="sm"
                  color="deep-purple"
                  icon="analytics"
                  @click="openUnitDashboard(props.row.vehicle_id)"
                >
                  <q-tooltip>Abrir Dashboard individual de {{ props.row.placas }}</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:body-cell-unidad="props">
              <q-td :props="props">
                <div class="row items-center no-wrap q-gutter-x-xs">
                  <q-badge
                    color="primary"
                    class="text-weight-bold q-px-sm py-xs cursor-pointer"
                    @click="toggleVehicleFilter(props.row.vehicle_id)"
                  >
                    {{ props.row.placas }}
                    <q-tooltip>Clic para filtrar por esta unidad</q-tooltip>
                  </q-badge>
                  <span class="text-weight-medium text-caption text-dark">
                    {{ props.row.vehiculo_desc }}
                  </span>
                </div>
                <div class="text-caption text-grey-6">
                  {{ props.row.sucursal_vehiculo }}
                  <span v-if="props.row.depto_vehiculo && props.row.depto_vehiculo !== '-'">
                    &bull; {{ props.row.depto_vehiculo }}
                  </span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-fecha="props">
              <q-td :props="props">
                <div class="text-weight-bold text-dark">
                  {{ formatFecha(props.row.fecha_elaboracion) }}
                </div>
                <div class="text-caption text-grey-7">
                  OC: <strong>#{{ props.row.orden_compra || props.row.orden_id }}</strong>
                  <span v-if="props.row.autorizacion_compras">
                    &bull; {{ props.row.autorizacion_compras }}
                  </span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-estatus="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  :color="getEstatusBtnColor(props.row.estatus_nombre)"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  {{ props.row.estatus_nombre }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-tipo_servicio="props">
              <q-td :props="props">
                <q-badge
                  :color="getTipoColor(props.row.tipo_servicio_nombre)"
                  class="q-px-sm q-py-xs text-weight-bold cursor-pointer"
                  @click="toggleTipoFilterById(props.row.tipo_servicio_id)"
                >
                  {{ props.row.tipo_servicio_nombre }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-servicio="props">
              <q-td :props="props">
                <div
                  class="text-weight-bold text-primary cursor-pointer"
                  @click="toggleServicioFilterById(props.row.servicio_id)"
                >
                  {{ props.row.servicio_nombre }}
                </div>
                <div
                  v-if="props.row.llanta_medida"
                  class="text-caption text-indigo-8"
                >
                  <q-icon name="tire_repair" size="12px" />
                  {{ props.row.llanta_medida }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-descripcion="props">
              <q-td :props="props" style="max-width: 280px; white-space: normal">
                <div class="text-body2 text-grey-9">
                  {{ props.row.descripcion || "Sin descripción" }}
                </div>
                <div
                  v-if="props.row.proveedor_nombre"
                  class="text-caption text-grey-7 q-mt-xs"
                >
                  <q-icon name="storefront" size="12px" class="q-mr-xs text-primary" />
                  <strong>{{ props.row.proveedor_nombre }}</strong>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-km_evento="props">
              <q-td :props="props" class="text-right">
                <q-chip
                  v-if="props.row.km_evento"
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
                <div v-if="props.row.solicitante_nombre" class="text-caption text-blue-grey-7">
                  Solic: {{ props.row.solicitante_nombre }}
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card>

      <!-- =================================================================== -->
      <!-- PESTAÑA 2: VISTA AGRUPADA POR ÓRDENES DE COMPRA                     -->
      <!-- =================================================================== -->
      <div
        v-else-if="activeTab === 'ordenes'"
        class="q-gutter-y-sm containment-section"
      >
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
          v-for="orden in paginatedOrders"
          :key="orden.id"
          flat
          bordered
          class="bg-white"
        >
          <q-expansion-item
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
                <q-item-label class="text-weight-bold text-subtitle2 flex items-center q-gutter-x-sm wrap">
                  <q-badge color="primary" class="text-weight-bold q-px-sm py-xs">
                    {{ orden.vehicle?.placas || "S/P" }}
                  </q-badge>
                  <span>
                    Orden #{{ orden.orden_compra || orden.id }} &bull;
                    {{ formatFecha(orden.fecha_elaboracion) }}
                  </span>
                  <q-badge
                    :color="getEstatusBtnColor(orden.estatus?.nombre)"
                    class="q-px-sm"
                  >
                    {{ orden.estatus?.nombre || "Registrado" }}
                  </q-badge>
                  <q-badge
                    v-if="orden.autorizacion_compras"
                    color="teal-8"
                    outline
                  >
                    Aut: {{ orden.autorizacion_compras }}
                  </q-badge>
                  <q-badge v-if="orden.factura" color="purple-8" outline>
                    Fact: {{ orden.factura }}
                  </q-badge>
                </q-item-label>
                <q-item-label caption class="text-grey-8 q-mt-xs">
                  <strong>Vehículo:</strong>
                  {{
                    [orden.vehicle?.marca?.nombre, orden.vehicle?.modelo?.nombre]
                      .filter(Boolean)
                      .join(" ") || "Unidad"
                  }}
                  ({{ orden.vehicle?.sucursal?.nombre || "Sin suc." }}) &bull;
                  <strong>Proveedor:</strong>
                  {{ orden.proveedor?.nombre || "Múltiples / En cotización" }} &bull;
                  <strong>Solicitante:</strong>
                  {{ orden.solicitante?.nombreCompleto || "-" }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center q-gutter-x-sm">
                  <div class="text-right">
                    <div class="text-caption text-grey-7">
                      {{ orden.detallesList.length }} concepto(s)
                    </div>
                    <div class="text-subtitle1 text-weight-bolder text-positive">
                      {{ formatCurrency(orden.totalOrden) }}
                    </div>
                  </div>
                  <q-btn
                    dense
                    flat
                    round
                    color="teal"
                    icon="visibility"
                    @click.stop="openOrderDetail(orden)"
                  >
                    <q-tooltip>Abrir ficha completa de la Orden</q-tooltip>
                  </q-btn>
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
                    <th class="text-left">Proveedor</th>
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
                    <td style="max-width: 300px; white-space: normal">
                      {{ det.descripcion }}
                    </td>
                    <td>
                      {{ det.proveedor?.nombre || orden.proveedor?.nombre || "-" }}
                    </td>
                    <td class="text-right text-weight-medium">
                      {{ det.km_evento ? formatKm(det.km_evento) : "No reg." }}
                    </td>
                    <td class="text-right">
                      {{ formatCurrency(det.subtotal) }}
                    </td>
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

        <div v-if="ordersMaxPage > 1" class="flex justify-center q-py-md">
          <q-pagination
            v-model="ordersPage"
            :max="ordersMaxPage"
            :max-pages="7"
            direction-links
            boundary-links
            color="primary"
          />
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- PESTAÑA 3: RESUMEN GENERAL DE LA FLOTILLA VEHICULAR                 -->
      <!-- =================================================================== -->
      <q-card v-else flat bordered class="bg-white containment-section">
        <div
          tabindex="0"
          role="region"
          aria-label="Tabla de padrón y resumen de flotilla vehicular"
        >
          <q-table
            flat
            :rows="fleetRows"
            :columns="fleetColumns"
            row-key="id"
            dense
            :pagination="{ rowsPerPage: 20, sortBy: 'total_invertido', descending: true }"
            :rows-per-page-options="[15, 20, 35, 50, 0]"
            no-data-label="No se encontraron unidades con los filtros seleccionados."
          >
            <template v-slot:top>
              <div class="row full-width items-center justify-between q-py-xs">
                <div class="text-subtitle1 text-weight-bold text-dark flex items-center">
                  <q-icon
                    name="directions_car"
                    color="primary"
                    size="sm"
                    class="q-mr-xs"
                  />
                  Padrón General de Flotilla y Resumen por Unidad
                  <q-badge
                    color="primary"
                    outline
                    class="q-ml-sm"
                    :label="`${fleetRows.length} unidad(es)`"
                  />
                </div>
                <div class="text-caption text-grey-7">
                  Haz clic en el ícono de historial de cualquier unidad para abrir su Dashboard individual
                </div>
              </div>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" auto-width>
                <q-btn
                  dense
                  flat
                  color="teal"
                  icon="visibility"
                  @click="openVehicleInfo(props.row)"
                >
                  <q-tooltip>Ver Ficha de la Unidad</q-tooltip>
                </q-btn>
                <q-btn
                  dense
                  flat
                  color="deep-purple"
                  icon="build_circle"
                  @click="openUnitDashboard(props.row.id)"
                >
                  <q-tooltip>Ver Dashboard de Servicios de esta Unidad</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:body-cell-placas="props">
              <q-td :props="props">
                <div class="text-weight-bold text-primary">
                  {{ props.row.placas || "S/P" }}
                </div>
                <div class="text-caption text-grey-6 font-mono">
                  {{ props.row.serie || "-" }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-vehiculo="props">
              <q-td :props="props">
                <div class="text-weight-medium">
                  {{ props.row.vehiculo_desc }}
                </div>
                <div class="text-caption text-grey-7">
                  {{
                    [props.row.tipo?.nombre, props.row.version, props.row.anio]
                      .filter(Boolean)
                      .join(" • ")
                  }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-ubicacion="props">
              <q-td :props="props">
                <div class="text-weight-medium text-caption">
                  {{ props.row.sucursal?.nombre || "-" }}
                </div>
                <div class="text-caption text-grey-6">
                  {{
                    [props.row.linea?.nombre, props.row.departamento?.nombre]
                      .filter(Boolean)
                      .join(" • ")
                  }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-responsable="props">
              <q-td :props="props">
                <div v-if="props.row.responsable?.nombreCompleto" class="text-caption text-weight-bold text-primary">
                  {{ props.row.responsable.nombreCompleto }}
                </div>
                <div v-else class="text-caption text-grey-5 italic">
                  Sin responsable
                </div>
                <div v-if="props.row.empleados?.length > 1" class="text-caption text-grey-6">
                  +{{ props.row.empleados.length - 1 }} usuario(s)
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-ultimo_km="props">
              <q-td :props="props" class="text-right">
                <q-chip
                  v-if="props.row.ultimo_km > 0"
                  dense
                  square
                  color="orange-1"
                  text-color="orange-10"
                  icon="speed"
                  class="text-weight-bold"
                >
                  {{ formatKm(props.row.ultimo_km) }}
                </q-chip>
                <span v-else class="text-caption text-grey-5">Sin reg.</span>
              </q-td>
            </template>

            <template v-slot:body-cell-servicios_count="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  :color="props.row.servicios_count > 0 ? 'primary' : 'grey-5'"
                  class="q-px-sm text-weight-bold"
                >
                  {{ props.row.servicios_count }} serv. ({{ props.row.ordenes_count }} OC)
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-total_invertido="props">
              <q-td :props="props" class="text-right">
                <span
                  :class="
                    props.row.total_invertido > 0
                      ? 'text-weight-bolder text-positive text-subtitle2'
                      : 'text-grey-5'
                  "
                >
                  {{ formatCurrency(props.row.total_invertido) }}
                </span>
              </q-td>
            </template>

            <template v-slot:body-cell-activo="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  :color="props.row.activo == 1 ? 'positive' : 'negative'"
                  class="q-px-sm py-xs text-weight-bold"
                >
                  {{ props.row.activo == 1 ? "Activo" : "Inactivo" }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card>
    </template>

    <!-- Modal: Ficha de la Unidad -->
    <q-dialog v-model="showVehicleInfo" transition-show="scale" transition-hide="scale">
      <vehicle-card :vehicle="selectedVehicleInfo" />
    </q-dialog>

    <!-- Modal: Dashboard Individual de Servicios de una Unidad -->
    <q-dialog v-model="showUnitDashboard" transition-show="scale" transition-hide="scale">
      <vehicle-services-dashboard
        :vehicle="selectedUnitDashboard"
        :loading="loadingUnitDashboard"
      />
    </q-dialog>

    <!-- Modal: Detalle Completo de Orden de Compra -->
    <q-dialog v-model="showOrderDialog" transition-show="scale" transition-hide="scale">
      <q-card style="width: 1050px; max-width: 96vw" class="q-pa-none">
        <q-card-section class="row items-center justify-between bg-grey-2 q-py-xs q-px-md">
          <div class="text-subtitle2 text-grey-8">
            Vista Detallada de Orden de Compra
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none scroll" style="max-height: 85vh">
          <service-card
            v-if="selectedOrder"
            :service="selectedOrder"
            @authorized="onOrderUpdated"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { date } from "quasar";
import * as echarts from "echarts";
import { sendRequest, show_notify } from "src/boot/functions";
import VehicleCard from "src/components/Vehicle/VehicleCard.vue";
import VehicleServicesDashboard from "src/components/Vehicle/VehicleServicesDashboard.vue";
import ServiceCard from "src/components/CoordinacionCompras/ServiceCard.vue";

const loading = ref(false);
const exportingExcel = ref(false);
const showAdvancedFilters = ref(false);
const activeTab = ref("servicios");
const rightPanelMode = ref("servicios");

// Modos y referencias para Gráficas de Líneas (Antigüedad y Rango de KM)
const antiguedadMode = ref("servicio");
const kmSourceMode = ref("evento");
const antiguedadChartRef = ref(null);
const kmChartRef = ref(null);
let antiguedadChartInstance = null;
let kmChartInstance = null;
let chartsResizeObserver = null;

const rawVehicles = ref([]);
const rawOrdenes = ref([]);
const catalogs = ref({
  sucursales: [],
  lineas: [],
  departamentos: [],
  marcas: [],
  modelos: [],
  tipos: [],
  empleados: [],
  proveedores: [],
  tipos_servicio: [],
  servicios_cat: [],
  sucursales_cargo: [],
  deptos_cargo: [],
  estatus_orden: [],
});

const defaultFilters = () => ({
  search: "",
  vehicle_id: null,
  marca_id: null,
  modelo_id: null,
  tipo_id: null,
  activo: null,
  sucursal_id: null,
  linea_id: null,
  departamento_id: null,
  responsable_id: null,
  fecha_desde: null,
  fecha_hasta: null,
  tipo_servicio_id: null,
  servicio_id: null,
  proveedor_id: null,
  estatus_orden_id: null,
  antiguedad_anios: null,
  km_bucket: null,
});

const filters = ref(defaultFilters());

const activoOptions = [
  { label: "Activos", value: 1 },
  { label: "Inactivos", value: 0 },
];

// Opciones filtrables para selects con buscador
const filteredVehicleOpts = ref([]);
const filteredTiposServicioOpts = ref([]);
const filteredServiciosCatOpts = ref([]);
const filteredMarcasOpts = ref([]);
const filteredModelosOpts = ref([]);
const filteredEmpleadosOpts = ref([]);
const filteredProveedoresOpts = ref([]);

const formatVehicleOptionLabel = (v) => {
  if (!v) return "";
  const desc = [v.marca?.nombre, v.modelo?.nombre].filter(Boolean).join(" ");
  return `${v.placas || "S/P"} ${desc ? `- ${desc}` : ""} (${v.sucursal?.nombre || "Sin suc."})`;
};

const filterVehiclesFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredVehicleOpts.value = rawVehicles.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredVehicleOpts.value = rawVehicles.value.filter(
      (v) =>
        (v.placas && v.placas.toLowerCase().includes(q)) ||
        (v.serie && v.serie.toLowerCase().includes(q)) ||
        (v.marca?.nombre && v.marca.nombre.toLowerCase().includes(q)) ||
        (v.modelo?.nombre && v.modelo.nombre.toLowerCase().includes(q))
    );
  });
};

const filterTiposServicioFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredTiposServicioOpts.value = catalogs.value.tipos_servicio;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredTiposServicioOpts.value = catalogs.value.tipos_servicio.filter((t) =>
      t.nombre?.toLowerCase().includes(q)
    );
  });
};

const baseServiciosCatOptions = computed(() => {
  if (!filters.value.tipo_servicio_id) {
    return catalogs.value.servicios_cat || [];
  }
  return (catalogs.value.servicios_cat || []).filter(
    (s) => Number(s.tipo_servicio_id) === Number(filters.value.tipo_servicio_id)
  );
});

const filterServiciosCatFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredServiciosCatOpts.value = baseServiciosCatOptions.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredServiciosCatOpts.value = baseServiciosCatOptions.value.filter((s) =>
      s.nombre?.toLowerCase().includes(q)
    );
  });
};

const filterMarcasFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredMarcasOpts.value = catalogs.value.marcas;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredMarcasOpts.value = catalogs.value.marcas.filter((m) =>
      m.nombre?.toLowerCase().includes(q)
    );
  });
};

const filterModelosFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredModelosOpts.value = catalogs.value.modelos;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredModelosOpts.value = catalogs.value.modelos.filter((m) =>
      m.nombre?.toLowerCase().includes(q)
    );
  });
};

const filterEmpleadosFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredEmpleadosOpts.value = catalogs.value.empleados;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredEmpleadosOpts.value = catalogs.value.empleados.filter((e) =>
      e.nombreCompleto?.toLowerCase().includes(q)
    );
  });
};

const filterProveedoresFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredProveedoresOpts.value = catalogs.value.proveedores;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredProveedoresOpts.value = catalogs.value.proveedores.filter((p) =>
      p.nombre?.toLowerCase().includes(q)
    );
  });
};

const onTipoServicioChange = () => {
  if (filters.value.servicio_id) {
    const stillValid = baseServiciosCatOptions.value.some(
      (s) => Number(s.id) === Number(filters.value.servicio_id)
    );
    if (!stillValid) {
      filters.value.servicio_id = null;
    }
  }
};

// Contadores de filtros activos
const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(
    (v) => v !== null && v !== undefined && v !== ""
  ).length;
});

const advancedFiltersCount = computed(() => {
  const keys = [
    "marca_id",
    "modelo_id",
    "tipo_id",
    "activo",
    "linea_id",
    "departamento_id",
    "responsable_id",
    "proveedor_id",
    "estatus_orden_id",
    "fecha_desde",
    "fecha_hasta",
  ];
  return keys.filter(
    (k) =>
      filters.value[k] !== null &&
      filters.value[k] !== undefined &&
      filters.value[k] !== ""
  ).length;
});

const resetAllFilters = () => {
  filters.value = defaultFilters();
};

// Toggles interactivos desde los widgets del Dashboard
const toggleVehicleFilter = (vehicleId) => {
  if (!vehicleId) return;
  filters.value.vehicle_id =
    Number(filters.value.vehicle_id) === Number(vehicleId) ? null : vehicleId;
};

const toggleTipoFilterById = (tipoId) => {
  if (!tipoId) return;
  filters.value.tipo_servicio_id =
    Number(filters.value.tipo_servicio_id) === Number(tipoId) ? null : tipoId;
  onTipoServicioChange();
};

const toggleServicioFilterById = (servicioId) => {
  if (!servicioId) return;
  filters.value.servicio_id =
    Number(filters.value.servicio_id) === Number(servicioId) ? null : servicioId;
};

const toggleProveedorFilterById = (proveedorId) => {
  if (!proveedorId) return;
  filters.value.proveedor_id =
    Number(filters.value.proveedor_id) === Number(proveedorId)
      ? null
      : proveedorId;
};

const toggleSucursalFilter = (sucursalId) => {
  if (!sucursalId) return;
  filters.value.sucursal_id =
    Number(filters.value.sucursal_id) === Number(sucursalId) ? null : sucursalId;
};

const toggleLineaFilter = (lineaId) => {
  if (!lineaId) return;
  filters.value.linea_id =
    Number(filters.value.linea_id) === Number(lineaId) ? null : lineaId;
};

const toggleDepartamentoFilter = (deptoId) => {
  if (!deptoId) return;
  filters.value.departamento_id =
    Number(filters.value.departamento_id) === Number(deptoId) ? null : deptoId;
};

const toggleMarcaFilter = (marcaId) => {
  if (!marcaId) return;
  filters.value.marca_id =
    Number(filters.value.marca_id) === Number(marcaId) ? null : marcaId;
};

const toggleEstatusOrdenFilter = (estatusId) => {
  filters.value.estatus_orden_id =
    Number(filters.value.estatus_orden_id) === Number(estatusId)
      ? null
      : estatusId;
};

// 1. Filtrado de Vehículos (según filtros de unidad y asignación)
const filteredVehicles = computed(() => {
  const f = filters.value;
  return rawVehicles.value.filter((v) => {
    if (f.vehicle_id && Number(v.id) !== Number(f.vehicle_id)) return false;
    if (f.marca_id && Number(v.marca_id) !== Number(f.marca_id)) return false;
    if (f.modelo_id && Number(v.modelo_id) !== Number(f.modelo_id)) return false;
    if (f.tipo_id && Number(v.tipo_id) !== Number(f.tipo_id)) return false;
    if (f.activo !== null && f.activo !== "" && Number(v.activo) !== Number(f.activo))
      return false;
    if (f.sucursal_id && Number(v.sucursal_id) !== Number(f.sucursal_id))
      return false;
    if (f.linea_id && Number(v.linea_id) !== Number(f.linea_id)) return false;
    if (
      f.departamento_id &&
      Number(v.departamento_id) !== Number(f.departamento_id)
    )
      return false;
    if (f.responsable_id) {
      const respMatch =
        Number(v.responsable?.id) === Number(f.responsable_id) ||
        (v.empleados || []).some((e) => Number(e.id) === Number(f.responsable_id));
      if (!respMatch) return false;
    }
    return true;
  });
});

const allowedVehicleIdsSet = computed(() => {
  return new Set(filteredVehicles.value.map((v) => Number(v.id)));
});

// Mapa rápido de vehículos por ID
const vehiclesMap = computed(() => {
  const map = new Map();
  for (const v of rawVehicles.value) {
    map.set(Number(v.id), v);
  }
  return map;
});

// 2. Lista plana base de todos los servicios de las órdenes filtradas (antes de filtros de puntos de gráfica)
const baseFilteredServices = computed(() => {
  const f = filters.value;
  const search = f.search ? f.search.trim().toLowerCase() : "";
  const items = [];

  for (const orden of rawOrdenes.value) {
    const vehId = Number(orden.vehicle_id || orden.vehicle?.id || 0);
    if (!allowedVehicleIdsSet.value.has(vehId)) continue;

    if (
      f.estatus_orden_id &&
      Number(orden.estatus_id) !== Number(f.estatus_orden_id)
    ) {
      continue;
    }

    const fechaOrden = orden.fecha_elaboracion
      ? String(orden.fecha_elaboracion).slice(0, 10)
      : "";
    if (f.fecha_desde && (!fechaOrden || fechaOrden < f.fecha_desde)) {
      continue;
    }
    if (f.fecha_hasta && (!fechaOrden || fechaOrden > f.fecha_hasta)) {
      continue;
    }

    const veh = vehiclesMap.value.get(vehId) || orden.vehicle || {};
    const vehDesc =
      [veh.marca?.nombre, veh.modelo?.nombre].filter(Boolean).join(" ") ||
      veh.tipo?.nombre ||
      "Unidad";

    const anioParsed = parseInt(String(veh.anio || "").trim(), 10);
    const anioVehiculo =
      !isNaN(anioParsed) && anioParsed >= 1970 && anioParsed <= 2100
        ? anioParsed
        : null;
    const ultimoKmVehiculo = Number(veh.ultimo_km || 0);

    const detalles =
      orden.detalles || orden.detalles_servicio || orden.detallesServicio || [];

    for (const det of detalles) {
      const servicioObj = det.servicio || {};
      const tipoObj =
        servicioObj.tipo_servicio || servicioObj.tipoServicio || {};
      const tipoId = tipoObj?.id || servicioObj.tipo_servicio_id || null;
      const srvId = servicioObj?.id || det.servicio_id || null;
      const provObj = det.proveedor || orden.proveedor || null;
      const provId = det.proveedor_id || orden.proveedor_id || provObj?.id || null;

      if (f.tipo_servicio_id && Number(tipoId) !== Number(f.tipo_servicio_id)) {
        continue;
      }
      if (f.servicio_id && Number(srvId) !== Number(f.servicio_id)) {
        continue;
      }
      if (f.proveedor_id && Number(provId) !== Number(f.proveedor_id)) {
        continue;
      }

      const sucCargoObj = orden.sucursal_cargo || orden.sucursalCargo || {};
      const deptoCargoObj =
        orden.departamento_cargo || orden.departamentoCargo || {};

      const llantaMedida =
        det.llanta_anchura || det.llanta_altura || det.llanta_rin
          ? `${det.llanta_anchura || "-"}/${det.llanta_altura || "-"} R${
              det.llanta_rin || "-"
            }`
          : null;

      const rowItem = {
        uid: `${orden.id}-${det.id}`,
        id: det.id,
        orden_id: orden.id,
        orden_raw: orden,
        vehicle_id: vehId,
        placas: veh.placas || "S/P",
        serie: veh.serie || "",
        vehiculo_desc: vehDesc,
        anio_vehiculo: anioVehiculo,
        ultimo_km_vehiculo: ultimoKmVehiculo,
        sucursal_vehiculo: veh.sucursal?.nombre || "-",
        linea_vehiculo: veh.linea?.nombre || "-",
        depto_vehiculo: veh.departamento?.nombre || "-",
        fecha_elaboracion: orden.fecha_elaboracion,
        orden_compra: orden.orden_compra || String(orden.id),
        autorizacion_compras: orden.autorizacion_compras || null,
        factura: orden.factura || null,
        estatus_id: orden.estatus_id,
        estatus_nombre: orden.estatus?.nombre || "Registrado",
        proveedor_id: provId,
        proveedor_nombre: provObj?.nombre || null,
        solicitante_nombre: orden.solicitante?.nombreCompleto || null,
        sucursal_cargo_nombre: sucCargoObj?.nombre || null,
        depto_cargo_nombre: deptoCargoObj?.nombre || null,
        tipo_servicio_id: tipoId,
        tipo_servicio_nombre: tipoObj?.nombre || "General",
        servicio_id: srvId,
        servicio_nombre: servicioObj?.nombre || "Servicio general",
        descripcion: det.descripcion || "",
        llanta_medida: llantaMedida,
        km_evento:
          det.km_evento !== null && det.km_evento !== undefined
            ? Number(det.km_evento)
            : null,
        subtotal: Number(det.subtotal || 0),
        iva: Number(det.iva || 0),
        total: Number(det.total || 0),
      };

      if (search) {
        const match =
          rowItem.placas.toLowerCase().includes(search) ||
          rowItem.serie.toLowerCase().includes(search) ||
          rowItem.vehiculo_desc.toLowerCase().includes(search) ||
          rowItem.servicio_nombre.toLowerCase().includes(search) ||
          rowItem.tipo_servicio_nombre.toLowerCase().includes(search) ||
          rowItem.descripcion.toLowerCase().includes(search) ||
          (rowItem.proveedor_nombre &&
            rowItem.proveedor_nombre.toLowerCase().includes(search)) ||
          (rowItem.solicitante_nombre &&
            rowItem.solicitante_nombre.toLowerCase().includes(search)) ||
          String(rowItem.orden_compra || "").toLowerCase().includes(search) ||
          (rowItem.autorizacion_compras &&
            rowItem.autorizacion_compras.toLowerCase().includes(search)) ||
          (rowItem.factura && rowItem.factura.toLowerCase().includes(search));

        if (!match) continue;
      }

      items.push(rowItem);
    }
  }

  return items;
});

// Cálculo de Antigüedad (en años) de un registro de servicio según el modo activo
const currentCalendarYear = new Date().getFullYear();

const getServiceAntiguedadAnios = (srv) => {
  if (!srv.anio_vehiculo) return null;
  if (antiguedadMode.value === "actual") {
    return Math.max(0, currentCalendarYear - srv.anio_vehiculo);
  }
  const fechaStr = srv.fecha_elaboracion ? String(srv.fecha_elaboracion) : "";
  const srvYear = /^\d{4}/.test(fechaStr)
    ? parseInt(fechaStr.slice(0, 4), 10)
    : currentCalendarYear;
  return Math.max(0, srvYear - srv.anio_vehiculo);
};

// Cálculo de Bucket de Kilometraje (intervalos de 10,000 km: 0 = 0..10,000, 1 = 10,001..20,000, etc.)
const getServiceKmBucket = (srv) => {
  const kmVal =
    srv.km_evento && srv.km_evento > 0
      ? srv.km_evento
      : kmSourceMode.value === "mixto" && srv.ultimo_km_vehiculo > 0
      ? srv.ultimo_km_vehiculo
      : null;

  if (!kmVal || kmVal <= 0) return null;
  return Math.floor((kmVal - 1) / 10000);
};

const formatKmBucketShort = (bucket) => {
  const b = Number(bucket);
  return `${b * 10}k - ${(b + 1) * 10}k km`;
};

const formatKmBucketFull = (bucket) => {
  if (bucket === null || bucket === undefined) return "";
  const b = Number(bucket);
  const start = b === 0 ? 0 : b * 10000 + 1;
  const end = (b + 1) * 10000;
  return `${start.toLocaleString("es-MX")} - ${end.toLocaleString("es-MX")} km`;
};

// Lista final de servicios filtrados (incluyendo clic en puntos de las gráficas de Antigüedad y KM)
const filteredServices = computed(() => {
  const f = filters.value;
  return baseFilteredServices.value.filter((s) => {
    if (
      f.antiguedad_anios !== null &&
      f.antiguedad_anios !== undefined &&
      getServiceAntiguedadAnios(s) !== Number(f.antiguedad_anios)
    ) {
      return false;
    }
    if (
      f.km_bucket !== null &&
      f.km_bucket !== undefined &&
      getServiceKmBucket(s) !== Number(f.km_bucket)
    ) {
      return false;
    }
    return true;
  });
});

// Dataset 1: Tendencia de Gasto por Antigüedad de la Unidad
const tendenciaPorAntiguedad = computed(() => {
  const f = filters.value;
  const sourceList = baseFilteredServices.value.filter((s) => {
    if (
      f.km_bucket !== null &&
      f.km_bucket !== undefined &&
      getServiceKmBucket(s) !== Number(f.km_bucket)
    ) {
      return false;
    }
    return true;
  });

  const map = new Map();
  let minAnio = Infinity;
  let maxAnio = -Infinity;

  for (const s of sourceList) {
    const anios = getServiceAntiguedadAnios(s);
    if (anios === null || anios > 50) continue;

    if (anios < minAnio) minAnio = anios;
    if (anios > maxAnio) maxAnio = anios;

    if (!map.has(anios)) {
      map.set(anios, {
        anios,
        total: 0,
        servicios: 0,
        vehiclesSet: new Set(),
        modelosSet: new Set(),
      });
    }
    const entry = map.get(anios);
    entry.total += s.total;
    entry.servicios += 1;
    entry.vehiclesSet.add(s.vehicle_id);
    if (s.anio_vehiculo) entry.modelosSet.add(s.anio_vehiculo);
  }

  if (map.size === 0) {
    return { items: [], peakTotal: null, peakAvg: null };
  }

  // Rellenar años continuos para apreciar la curva real de tendencia cuando el rango es razonable
  const keys = [];
  if (maxAnio - minAnio <= 25) {
    for (let a = minAnio; a <= maxAnio; a++) {
      keys.push(a);
    }
  } else {
    keys.push(...Array.from(map.keys()).sort((a, b) => a - b));
  }

  const items = keys.map((anios) => {
    const data = map.get(anios);
    const total = data ? data.total : 0;
    const servicios = data ? data.servicios : 0;
    const unidades = data ? data.vehiclesSet.size : 0;
    const promedioPorUnidad = unidades > 0 ? total / unidades : 0;
    const promedioPorServicio = servicios > 0 ? total / servicios : 0;
    const modelos = data
      ? Array.from(data.modelosSet).sort((a, b) => b - a)
      : [];

    const baseLabel =
      anios === 0 ? "0 años (Nuevo)" : anios === 1 ? "1 año" : `${anios} años`;
    const shortLabel =
      antiguedadMode.value === "actual"
        ? `${anios}a (${currentCalendarYear - anios})`
        : anios === 0
        ? "0 años"
        : anios === 1
        ? "1 año"
        : `${anios} años`;

    return {
      anios,
      label: baseLabel,
      shortLabel,
      total: Number(total.toFixed(2)),
      servicios,
      unidades,
      promedioPorUnidad: Number(promedioPorUnidad.toFixed(2)),
      promedioPorServicio: Number(promedioPorServicio.toFixed(2)),
      modelosStr: modelos.join(", ") || "-",
    };
  });

  let peakTotal = null;
  let peakAvg = null;
  for (const it of items) {
    if (it.total > 0 && (!peakTotal || it.total > peakTotal.total)) {
      peakTotal = it;
    }
    if (
      it.promedioPorUnidad > 0 &&
      (!peakAvg || it.promedioPorUnidad > peakAvg.promedioPorUnidad)
    ) {
      peakAvg = it;
    }
  }

  return { items, peakTotal, peakAvg };
});

// Dataset 2: Tendencia de Gasto por Rango de Kilometraje (Intervalos de 10,000 km)
const tendenciaPorKm = computed(() => {
  const f = filters.value;
  const sourceList = baseFilteredServices.value.filter((s) => {
    if (
      f.antiguedad_anios !== null &&
      f.antiguedad_anios !== undefined &&
      getServiceAntiguedadAnios(s) !== Number(f.antiguedad_anios)
    ) {
      return false;
    }
    return true;
  });

  const map = new Map();
  let minBucket = Infinity;
  let maxBucket = -Infinity;

  for (const s of sourceList) {
    const bucket = getServiceKmBucket(s);
    if (bucket === null || bucket < 0 || bucket > 200) continue;

    if (bucket < minBucket) minBucket = bucket;
    if (bucket > maxBucket) maxBucket = bucket;

    if (!map.has(bucket)) {
      map.set(bucket, {
        bucket,
        total: 0,
        servicios: 0,
        vehiclesSet: new Set(),
      });
    }
    const entry = map.get(bucket);
    entry.total += s.total;
    entry.servicios += 1;
    entry.vehiclesSet.add(s.vehicle_id);
  }

  if (map.size === 0) {
    return { items: [], peakTotal: null, peakAvg: null };
  }

  // Rellenar intervalos continuos de 10,000 km cuando el span sea <= 30 intervalos (300,000 km)
  const buckets = [];
  if (maxBucket - minBucket <= 30) {
    for (let b = minBucket; b <= maxBucket; b++) {
      buckets.push(b);
    }
  } else {
    buckets.push(...Array.from(map.keys()).sort((a, b) => a - b));
  }

  const items = buckets.map((bucket) => {
    const data = map.get(bucket);
    const total = data ? data.total : 0;
    const servicios = data ? data.servicios : 0;
    const unidades = data ? data.vehiclesSet.size : 0;
    const promedioPorUnidad = unidades > 0 ? total / unidades : 0;
    const promedioPorServicio = servicios > 0 ? total / servicios : 0;

    return {
      bucket,
      label: formatKmBucketShort(bucket),
      fullLabel: formatKmBucketFull(bucket),
      total: Number(total.toFixed(2)),
      servicios,
      unidades,
      promedioPorUnidad: Number(promedioPorUnidad.toFixed(2)),
      promedioPorServicio: Number(promedioPorServicio.toFixed(2)),
    };
  });

  let peakTotal = null;
  let peakAvg = null;
  for (const it of items) {
    if (it.total > 0 && (!peakTotal || it.total > peakTotal.total)) {
      peakTotal = it;
    }
    if (
      it.promedioPorUnidad > 0 &&
      (!peakAvg || it.promedioPorUnidad > peakAvg.promedioPorUnidad)
    ) {
      peakAvg = it;
    }
  }

  return { items, peakTotal, peakAvg };
});

// Conteo de órdenes por estatus (respetando filtros de vehículo/fecha pero antes del filtro de estatus)
const countOrdenesByEstatus = (estatusId) => {
  return rawOrdenes.value.filter((o) => {
    const vehId = Number(o.vehicle_id || o.vehicle?.id || 0);
    if (!allowedVehicleIdsSet.value.has(vehId)) return false;
    return Number(o.estatus_id) === Number(estatusId);
  }).length;
};

// 3. Órdenes filtradas para la pestaña de Órdenes
const filteredOrders = computed(() => {
  const mapByOrden = new Map();
  for (const s of filteredServices.value) {
    if (!mapByOrden.has(s.orden_id)) {
      mapByOrden.set(s.orden_id, {
        ...s.orden_raw,
        detallesList: [],
        totalOrden: 0,
      });
    }
    const entry = mapByOrden.get(s.orden_id);
    entry.detallesList.push({
      id: s.id,
      servicio: {
        id: s.servicio_id,
        nombre: s.servicio_nombre,
        tipo_servicio: { id: s.tipo_servicio_id, nombre: s.tipo_servicio_nombre },
      },
      proveedor: { id: s.proveedor_id, nombre: s.proveedor_nombre },
      descripcion: s.descripcion,
      km_evento: s.km_evento,
      subtotal: s.subtotal,
      iva: s.iva,
      total: s.total,
    });
    entry.totalOrden += s.total;
  }
  return Array.from(mapByOrden.values());
});

const ordersPage = ref(1);
const ordersPerPage = 15;
const ordersMaxPage = computed(() =>
  Math.max(1, Math.ceil(filteredOrders.value.length / ordersPerPage))
);
const paginatedOrders = computed(() => {
  const start = (ordersPage.value - 1) * ordersPerPage;
  return filteredOrders.value.slice(start, start + ordersPerPage);
});

watch(filteredOrders, () => {
  ordersPage.value = 1;
});

// 4. Filas para la pestaña de Flotilla
const fleetRows = computed(() => {
  const statsMap = new Map();
  for (const s of filteredServices.value) {
    if (!statsMap.has(s.vehicle_id)) {
      statsMap.set(s.vehicle_id, {
        servicios_count: 0,
        ordenes_set: new Set(),
        total_invertido: 0,
      });
    }
    const st = statsMap.get(s.vehicle_id);
    st.servicios_count += 1;
    st.ordenes_set.add(s.orden_id);
    st.total_invertido += s.total;
  }

  const q = filters.value.search ? filters.value.search.trim().toLowerCase() : "";

  return filteredVehicles.value
    .map((v) => {
      const st = statsMap.get(Number(v.id));
      const vehiculo_desc =
        [v.marca?.nombre, v.modelo?.nombre].filter(Boolean).join(" ") ||
        v.tipo?.nombre ||
        "Sin definir";

      return {
        ...v,
        vehiculo_desc,
        servicios_count: st ? st.servicios_count : 0,
        ordenes_count: st ? st.ordenes_set.size : 0,
        total_invertido: st ? st.total_invertido : 0,
      };
    })
    .filter((v) => {
      if (!q) return true;
      return (
        (v.placas && v.placas.toLowerCase().includes(q)) ||
        (v.serie && v.serie.toLowerCase().includes(q)) ||
        v.vehiculo_desc.toLowerCase().includes(q) ||
        (v.sucursal?.nombre && v.sucursal.nombre.toLowerCase().includes(q)) ||
        (v.departamento?.nombre &&
          v.departamento.nombre.toLowerCase().includes(q)) ||
        (v.responsable?.nombreCompleto &&
          v.responsable.nombreCompleto.toLowerCase().includes(q)) ||
        v.servicios_count > 0
      );
    });
});

// 5. Resúmenes Analíticos
const resumenPorTipo = computed(() => {
  const map = {};
  const grandTotal =
    filteredServices.value.reduce((acc, s) => acc + s.total, 0) || 1;

  for (const s of filteredServices.value) {
    const key = s.tipo_servicio_nombre;
    if (!map[key]) {
      map[key] = {
        id: s.tipo_servicio_id,
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

const resumenPorUnidad = computed(() => {
  const map = {};
  const grandTotal =
    filteredServices.value.reduce((acc, s) => acc + s.total, 0) || 1;

  for (const s of filteredServices.value) {
    const key = s.vehicle_id;
    if (!map[key]) {
      map[key] = {
        vehicle_id: s.vehicle_id,
        placas: s.placas,
        vehiculo_desc: s.vehiculo_desc,
        sucursal: s.sucursal_vehiculo,
        departamento: s.depto_vehiculo,
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

const resumenPorServicio = computed(() => {
  const map = {};
  for (const s of filteredServices.value) {
    const key = s.servicio_id || s.servicio_nombre;
    if (!map[key]) {
      map[key] = {
        id: s.servicio_id,
        nombre: s.servicio_nombre,
        tipo: s.tipo_servicio_nombre,
        count: 0,
        total: 0,
      };
    }
    map[key].count += 1;
    map[key].total += s.total;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
});

const resumenPorProveedor = computed(() => {
  const map = {};
  const grandTotal =
    filteredServices.value.reduce((acc, s) => acc + s.total, 0) || 1;

  for (const s of filteredServices.value) {
    const key = s.proveedor_id || s.proveedor_nombre || "Sin proveedor";
    if (!map[key]) {
      map[key] = {
        id: s.proveedor_id,
        nombre: s.proveedor_nombre || "Sin proveedor especificado",
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

// Distribución de Flotilla + Inversión por Sucursal, Línea, Depto y Marca
const buildGroupBreakdown = (idField, objField, emptyLabel) => {
  const map = {};
  for (const v of filteredVehicles.value) {
    const id = v[idField] || 0;
    const nombre = v[objField]?.nombre || emptyLabel;
    if (!map[id]) {
      map[id] = { id, nombre, unidades: 0, servicios: 0, total: 0 };
    }
    map[id].unidades += 1;
  }
  for (const s of filteredServices.value) {
    const v = vehiclesMap.value.get(Number(s.vehicle_id));
    const id = v?.[idField] || 0;
    const nombre = v?.[objField]?.nombre || emptyLabel;
    if (!map[id]) {
      map[id] = { id, nombre, unidades: 0, servicios: 0, total: 0 };
    }
    map[id].servicios += 1;
    map[id].total += s.total;
  }
  return Object.values(map).sort(
    (a, b) => b.total - a.total || b.unidades - a.unidades
  );
};

const flotillaPorSucursal = computed(() =>
  buildGroupBreakdown("sucursal_id", "sucursal", "Sin sucursal")
);
const flotillaPorLinea = computed(() =>
  buildGroupBreakdown("linea_id", "linea", "Sin línea")
);
const flotillaPorDepartamento = computed(() =>
  buildGroupBreakdown("departamento_id", "departamento", "Sin depto.")
);
const flotillaPorMarca = computed(() =>
  buildGroupBreakdown("marca_id", "marca", "Sin marca")
);

// 6. KPIs Generales
const kpis = computed(() => {
  const totalInvertido = filteredServices.value.reduce(
    (acc, s) => acc + s.total,
    0
  );
  const subtotalInvertido = filteredServices.value.reduce(
    (acc, s) => acc + s.subtotal,
    0
  );
  const ivaInvertido = filteredServices.value.reduce((acc, s) => acc + s.iva, 0);

  const totalServicios = filteredServices.value.length;
  const totalOrdenes = filteredOrders.value.length;
  const promedioPorOrden = totalOrdenes > 0 ? totalInvertido / totalOrdenes : 0;

  const totalUnidades = filteredVehicles.value.length;
  const unidadesActivas = filteredVehicles.value.filter(
    (v) => Number(v.activo) === 1
  ).length;
  const unidadesInactivas = totalUnidades - unidadesActivas;
  const unidadesConServicio = resumenPorUnidad.value.length;

  const topUnidad = resumenPorUnidad.value[0] || null;

  return {
    totalInvertido,
    subtotalInvertido,
    ivaInvertido,
    totalServicios,
    totalOrdenes,
    promedioPorOrden,
    totalUnidades,
    unidadesActivas,
    unidadesInactivas,
    unidadesConServicio,
    topUnidad,
  };
});

// Columnas de Tablas
const serviceColumns = [
  {
    name: "acciones",
    label: "Ver",
    field: "acciones",
    align: "center",
  },
  {
    name: "unidad",
    label: "Unidad (Placa / Sucursal)",
    field: "placas",
    align: "left",
    sortable: true,
  },
  {
    name: "fecha",
    label: "Fecha / Orden",
    field: "fecha_elaboracion",
    align: "left",
    sortable: true,
  },
  {
    name: "estatus",
    label: "Estatus",
    field: "estatus_nombre",
    align: "center",
    sortable: true,
  },
  {
    name: "tipo_servicio",
    label: "Tipo",
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
    label: "KM Evento",
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
    label: "Total Invertido",
    field: "total",
    align: "right",
    sortable: true,
  },
  {
    name: "cargo",
    label: "Cargo / Solicitante",
    field: "sucursal_cargo_nombre",
    align: "left",
  },
];

const fleetColumns = [
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    align: "center",
  },
  {
    name: "placas",
    label: "Placas / Serie",
    field: "placas",
    align: "left",
    sortable: true,
  },
  {
    name: "vehiculo",
    label: "Vehículo (Marca / Modelo / Año)",
    field: "vehiculo_desc",
    align: "left",
    sortable: true,
  },
  {
    name: "ubicacion",
    label: "Sucursal / Línea / Depto.",
    field: (row) => row.sucursal?.nombre || "",
    align: "left",
    sortable: true,
  },
  {
    name: "responsable",
    label: "Responsable Asignado",
    field: (row) => row.responsable?.nombreCompleto || "",
    align: "left",
    sortable: true,
  },
  {
    name: "ultimo_km",
    label: "Mayor KM Reg.",
    field: "ultimo_km",
    align: "right",
    sortable: true,
  },
  {
    name: "servicios_count",
    label: "Servicios / OC",
    field: "servicios_count",
    align: "center",
    sortable: true,
  },
  {
    name: "total_invertido",
    label: "Dinero Invertido",
    field: "total_invertido",
    align: "right",
    sortable: true,
  },
  {
    name: "activo",
    label: "Estatus",
    field: "activo",
    align: "center",
    sortable: true,
  },
];

// Modales y Acciones
const showVehicleInfo = ref(false);
const selectedVehicleInfo = ref(null);

const showUnitDashboard = ref(false);
const selectedUnitDashboard = ref(null);
const loadingUnitDashboard = ref(false);

const showOrderDialog = ref(false);
const selectedOrder = ref(null);

const openVehicleInfo = async (vehicleRow) => {
  selectedVehicleInfo.value = vehicleRow;
  showVehicleInfo.value = true;
  const res = await sendRequest("GET", null, `/api/vehicle/${vehicleRow.id}`, "");
  if (res) {
    selectedVehicleInfo.value = res;
  }
};

const openUnitDashboard = async (vehicleId) => {
  if (!vehicleId) return;
  const baseVeh = vehiclesMap.value.get(Number(vehicleId)) || { id: vehicleId };
  selectedUnitDashboard.value = baseVeh;
  loadingUnitDashboard.value = true;
  showUnitDashboard.value = true;
  try {
    const res = await sendRequest("GET", null, `/api/vehicle/${vehicleId}`, "");
    if (res) {
      selectedUnitDashboard.value = res;
    }
  } finally {
    loadingUnitDashboard.value = false;
  }
};

const openOrderDetail = async (orden) => {
  if (!orden?.id) return;
  selectedOrder.value = orden;
  showOrderDialog.value = true;
  const res = await sendRequest("GET", null, `/api/service/${orden.id}`, "");
  if (res) {
    selectedOrder.value = res;
  }
};

const onOrderUpdated = () => {
  showOrderDialog.value = false;
  loadDashboard();
};

// Carga inicial del Dashboard General
const loadDashboard = async () => {
  loading.value = true;
  try {
    const res = await sendRequest("GET", null, "/api/vehicles/dashboard", "");
    if (res) {
      rawVehicles.value = res.vehicles || [];
      rawOrdenes.value = res.ordenes || [];
      if (res.catalogs) {
        catalogs.value = {
          ...catalogs.value,
          ...res.catalogs,
        };
      }
      filteredVehicleOpts.value = rawVehicles.value;
      filteredTiposServicioOpts.value = catalogs.value.tipos_servicio || [];
      filteredServiciosCatOpts.value = catalogs.value.servicios_cat || [];
      filteredMarcasOpts.value = catalogs.value.marcas || [];
      filteredModelosOpts.value = catalogs.value.modelos || [];
      filteredEmpleadosOpts.value = catalogs.value.empleados || [];
      filteredProveedoresOpts.value = catalogs.value.proveedores || [];
    }
  } finally {
    loading.value = false;
  }
};

// Exportación a Excel general con filtros activos
const exportToExcel = async () => {
  exportingExcel.value = true;
  try {
    const res = await sendRequest(
      "POST",
      { ...filters.value },
      "/api/vehicles/dashboard/export",
      ""
    );
    if (res && res.file_base64) {
      const byteCharacters = atob(res.file_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute(
        "download",
        res.file_name || "Dashboard_General_Vehiculos.xlsx"
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      show_notify(
        "Excel del Dashboard General descargado correctamente",
        "check_circle",
        "positive"
      );
    }
  } finally {
    exportingExcel.value = false;
  }
};

// Helpers de formato y color
const getTipoColor = (tipoNombre = "") => {
  const lower = (tipoNombre || "").toLowerCase();
  if (lower.includes("preventivo")) return "teal-7";
  if (lower.includes("correctivo")) return "deep-orange-7";
  if (lower.includes("llanta") || lower.includes("neum")) return "indigo-7";
  if (
    lower.includes("estét") ||
    lower.includes("carrocer") ||
    lower.includes("hojalat")
  )
    return "purple-7";
  if (
    lower.includes("administrativo") ||
    lower.includes("trámite") ||
    lower.includes("seguro")
  )
    return "blue-grey-7";
  return "primary";
};

const getEstatusBtnColor = (nombre = "") => {
  const lower = (nombre || "").trim().toLowerCase();
  if (lower === "autorizado") return "positive";
  if (lower === "no autorizado") return "negative";
  if (lower === "solicitado") return "primary";
  return "blue-grey-7";
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
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return date.formatDate(fechaStr, "DD/MM/YYYY");
};

const formatCompactCurrency = (val) => {
  const num = Number(val || 0);
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
  return `$${num.toFixed(0)}`;
};

// =========================================================================
// RENDERIZADO DE GRÁFICAS DE LÍNEAS (ECHARTS)
// =========================================================================
const renderAntiguedadChart = () => {
  const el = antiguedadChartRef.value;
  if (!el) return;

  const items = tendenciaPorAntiguedad.value.items;
  if (!items || items.length === 0) {
    if (antiguedadChartInstance) {
      antiguedadChartInstance.clear();
    }
    return;
  }

  if (antiguedadChartInstance && antiguedadChartInstance.getDom() !== el) {
    antiguedadChartInstance.dispose();
    antiguedadChartInstance = null;
  }

  if (!antiguedadChartInstance) {
    antiguedadChartInstance = echarts.init(el);
    antiguedadChartInstance.on("click", (params) => {
      const idx = params?.dataIndex;
      const currentItems = tendenciaPorAntiguedad.value.items;
      if (idx !== undefined && currentItems[idx]) {
        const clickedAnios = currentItems[idx].anios;
        filters.value.antiguedad_anios =
          filters.value.antiguedad_anios === clickedAnios ? null : clickedAnios;
      }
    });
  }

  const selectedAnios = filters.value.antiguedad_anios;
  const labels = items.map((i) => i.shortLabel);
  const totalData = items.map((i) => ({
    value: i.total,
    itemStyle:
      selectedAnios !== null && Number(selectedAnios) === Number(i.anios)
        ? { color: "#D32F2F", borderColor: "#FFFFFF", borderWidth: 3 }
        : undefined,
    symbolSize:
      selectedAnios !== null && Number(selectedAnios) === Number(i.anios)
        ? 12
        : 7,
  }));
  const avgData = items.map((i) => i.promedioPorUnidad);

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.94)",
      borderColor: "#334155",
      textStyle: { color: "#F8FAFC", fontSize: 12 },
      formatter: (params) => {
        const idx = params?.[0]?.dataIndex ?? 0;
        const item = items[idx];
        if (!item) return "";
        return `
          <div style="font-weight:700;font-size:13px;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:3px;">
            Antigüedad: ${item.label}
          </div>
          <div>Monto Total Gastado: <strong style="color:#4ADE80;">${formatCurrency(item.total)}</strong></div>
          <div>Promedio por Unidad: <strong style="color:#FBBF24;">${formatCurrency(item.promedioPorUnidad)}</strong></div>
          <div>Promedio por Servicio: <strong>${formatCurrency(item.promedioPorServicio)}</strong></div>
          <div style="margin-top:3px;font-size:11px;color:#CBD5E1;">
            Servicios: <strong>${item.servicios}</strong> &bull; Unidades: <strong>${item.unidades}</strong>
          </div>
          <div style="font-size:11px;color:#94A3B8;">
            Modelo(s): ${item.modelosStr}
          </div>
        `;
      },
    },
    legend: {
      top: 2,
      right: 10,
      textStyle: { fontSize: 11, color: "#475569" },
      data: ["Monto Total Gastado ($)", "Promedio por Unidad ($)"],
    },
    grid: {
      left: 58,
      right: 22,
      top: 38,
      bottom: items.length > 12 ? 52 : 34,
    },
    dataZoom:
      items.length > 12
        ? [
            { type: "inside", start: 0, end: 100 },
            { type: "slider", height: 16, bottom: 6, start: 0, end: 100 },
          ]
        : [],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: labels,
      axisLabel: {
        fontSize: 11,
        color: "#475569",
        rotate: items.length > 9 ? 25 : 0,
      },
      axisLine: { lineStyle: { color: "#CBD5E1" } },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 11,
        color: "#64748B",
        formatter: (val) => formatCompactCurrency(val),
      },
      splitLine: {
        lineStyle: { type: "dashed", color: "#E2E8F0" },
      },
    },
    series: [
      {
        name: "Monto Total Gastado ($)",
        type: "line",
        smooth: 0.35,
        symbol: "circle",
        symbolSize: 7,
        data: totalData,
        itemStyle: { color: "#1565C0" },
        lineStyle: { width: 3, color: "#1565C0" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(21, 101, 192, 0.32)" },
            { offset: 1, color: "rgba(21, 101, 192, 0.02)" },
          ]),
        },
        markPoint: {
          symbolSize: 44,
          label: {
            fontSize: 10,
            fontWeight: "bold",
            formatter: (p) => formatCompactCurrency(p.value),
          },
          itemStyle: { color: "#C62828" },
          data: [{ type: "max", name: "Pico de Gasto" }],
        },
      },
      {
        name: "Promedio por Unidad ($)",
        type: "line",
        smooth: 0.35,
        symbol: "diamond",
        symbolSize: 6,
        data: avgData,
        itemStyle: { color: "#EF6C00" },
        lineStyle: { width: 2, type: "dashed", color: "#EF6C00" },
      },
    ],
  };

  antiguedadChartInstance.setOption(option, true);
  antiguedadChartInstance.resize();
};

const renderKmChart = () => {
  const el = kmChartRef.value;
  if (!el) return;

  const items = tendenciaPorKm.value.items;
  if (!items || items.length === 0) {
    if (kmChartInstance) {
      kmChartInstance.clear();
    }
    return;
  }

  if (kmChartInstance && kmChartInstance.getDom() !== el) {
    kmChartInstance.dispose();
    kmChartInstance = null;
  }

  if (!kmChartInstance) {
    kmChartInstance = echarts.init(el);
    kmChartInstance.on("click", (params) => {
      const idx = params?.dataIndex;
      const currentItems = tendenciaPorKm.value.items;
      if (idx !== undefined && currentItems[idx]) {
        const clickedBucket = currentItems[idx].bucket;
        filters.value.km_bucket =
          filters.value.km_bucket === clickedBucket ? null : clickedBucket;
      }
    });
  }

  const selectedBucket = filters.value.km_bucket;
  const labels = items.map((i) => i.label);
  const totalData = items.map((i) => ({
    value: i.total,
    itemStyle:
      selectedBucket !== null && Number(selectedBucket) === Number(i.bucket)
        ? { color: "#D84315", borderColor: "#FFFFFF", borderWidth: 3 }
        : undefined,
    symbolSize:
      selectedBucket !== null && Number(selectedBucket) === Number(i.bucket)
        ? 12
        : 7,
  }));
  const avgData = items.map((i) => i.promedioPorUnidad);

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.94)",
      borderColor: "#334155",
      textStyle: { color: "#F8FAFC", fontSize: 12 },
      formatter: (params) => {
        const idx = params?.[0]?.dataIndex ?? 0;
        const item = items[idx];
        if (!item) return "";
        return `
          <div style="font-weight:700;font-size:13px;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:3px;">
            Rango: ${item.fullLabel}
          </div>
          <div>Monto Total Gastado: <strong style="color:#4ADE80;">${formatCurrency(item.total)}</strong></div>
          <div>Promedio por Unidad: <strong style="color:#C084FC;">${formatCurrency(item.promedioPorUnidad)}</strong></div>
          <div>Promedio por Servicio: <strong>${formatCurrency(item.promedioPorServicio)}</strong></div>
          <div style="margin-top:3px;font-size:11px;color:#CBD5E1;">
            Servicios en rango: <strong>${item.servicios}</strong> &bull; Unidades: <strong>${item.unidades}</strong>
          </div>
        `;
      },
    },
    legend: {
      top: 2,
      right: 10,
      textStyle: { fontSize: 11, color: "#475569" },
      data: ["Monto Total Gastado ($)", "Promedio por Unidad ($)"],
    },
    grid: {
      left: 58,
      right: 22,
      top: 38,
      bottom: items.length > 10 ? 54 : 38,
    },
    dataZoom:
      items.length > 10
        ? [
            { type: "inside", start: 0, end: 100 },
            { type: "slider", height: 16, bottom: 6, start: 0, end: 100 },
          ]
        : [],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: labels,
      axisLabel: {
        fontSize: 10,
        color: "#475569",
        rotate: items.length > 6 ? 25 : 0,
      },
      axisLine: { lineStyle: { color: "#CBD5E1" } },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 11,
        color: "#64748B",
        formatter: (val) => formatCompactCurrency(val),
      },
      splitLine: {
        lineStyle: { type: "dashed", color: "#E2E8F0" },
      },
    },
    series: [
      {
        name: "Monto Total Gastado ($)",
        type: "line",
        smooth: 0.35,
        symbol: "circle",
        symbolSize: 7,
        data: totalData,
        itemStyle: { color: "#00796B" },
        lineStyle: { width: 3, color: "#00796B" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(0, 121, 107, 0.32)" },
            { offset: 1, color: "rgba(0, 121, 107, 0.02)" },
          ]),
        },
        markPoint: {
          symbolSize: 44,
          label: {
            fontSize: 10,
            fontWeight: "bold",
            formatter: (p) => formatCompactCurrency(p.value),
          },
          itemStyle: { color: "#D84315" },
          data: [{ type: "max", name: "Pico de Desgaste" }],
        },
      },
      {
        name: "Promedio por Unidad ($)",
        type: "line",
        smooth: 0.35,
        symbol: "diamond",
        symbolSize: 6,
        data: avgData,
        itemStyle: { color: "#6A1B9A" },
        lineStyle: { width: 2, type: "dashed", color: "#6A1B9A" },
      },
    ],
  };

  kmChartInstance.setOption(option, true);
  kmChartInstance.resize();
};

const refreshTrendCharts = async () => {
  if (loading.value) return;
  await nextTick();
  if (typeof ResizeObserver !== "undefined" && !chartsResizeObserver) {
    chartsResizeObserver = new ResizeObserver(() => {
      if (antiguedadChartInstance) antiguedadChartInstance.resize();
      if (kmChartInstance) kmChartInstance.resize();
    });
  }
  if (chartsResizeObserver) {
    if (antiguedadChartRef.value) {
      chartsResizeObserver.observe(antiguedadChartRef.value);
    }
    if (kmChartRef.value) {
      chartsResizeObserver.observe(kmChartRef.value);
    }
  }
  renderAntiguedadChart();
  renderKmChart();
};

watch(
  [
    tendenciaPorAntiguedad,
    tendenciaPorKm,
    () => filters.value.antiguedad_anios,
    () => filters.value.km_bucket,
    loading,
  ],
  () => {
    refreshTrendCharts();
  },
  { deep: true }
);

onMounted(() => {
  loadDashboard();
});

onBeforeUnmount(() => {
  if (chartsResizeObserver) {
    chartsResizeObserver.disconnect();
    chartsResizeObserver = null;
  }
  if (antiguedadChartInstance) {
    antiguedadChartInstance.dispose();
    antiguedadChartInstance = null;
  }
  if (kmChartInstance) {
    kmChartInstance.dispose();
    kmChartInstance = null;
  }
});
</script>

<style scoped>
.trend-chart-canvas {
  width: 100%;
  height: 290px;
}
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
.border-top-dashed {
  border-top: 1px dashed #d0d7de;
}
.border-top-light {
  border-top: 1px solid #eef2f6;
}
.containment-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 320px;
}
@supports not (content-visibility: auto) {
  .containment-section {
    contain: layout style paint;
  }
}
</style>
