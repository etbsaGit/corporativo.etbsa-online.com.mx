<template>
  <q-card
    :style="embedded ? 'width: 100%' : 'width: 1180px; max-width: 96vw'"
    :flat="embedded"
    class="q-pa-none bg-grey-1"
  >
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
              {{
                onlyGasolina
                  ? "Dashboard de Historial de Cargas de Gasolina"
                  : "Dashboard de Historial de Servicios"
              }}
            </div>
            <q-badge
              :color="vehicle?.activo == 1 ? 'positive' : 'negative'"
              class="q-px-sm q-py-xs text-weight-bold"
            >
              {{ vehicle?.activo == 1 ? "Unidad Activa" : "Unidad Inactiva" }}
            </q-badge>
          </div>
          <div
            class="text-caption text-blue-1 q-mt-xs flex items-center q-gutter-x-md wrap"
          >
            <span>
              <q-icon name="pin" size="14px" class="q-mr-xs" />
              Placa Actual:
              <strong class="text-white">{{
                vehicle?.placas || "Sin placa"
              }}</strong>
            </span>
            <span v-if="vehicle?.serie">
              <q-icon name="qr_code" size="14px" class="q-mr-xs" />
              Serie:
              <strong class="text-white font-mono">{{ vehicle.serie }}</strong>
            </span>
            <span v-if="vehicle?.anio">
              <q-icon name="calendar_today" size="14px" class="q-mr-xs" />
              Año Modelo:
              <strong class="text-white">{{ vehicle.anio }}</strong>
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
              <strong class="text-white">{{
                vehicle.departamento.nombre
              }}</strong>
            </span>
          </div>
        </div>
        <q-btn
          v-if="!onlyGasolina"
          unelevated
          color="positive"
          icon="file_download"
          label="Exportar Excel"
          class="q-mr-sm text-weight-bold"
          :loading="exportingExcel"
          :disable="loading || !vehicle?.id"
          @click="exportToExcel"
        >
          <q-tooltip>
            Descargar Excel con Dashboard, Tabla Interactiva y Gráficas
          </q-tooltip>
        </q-btn>
        <q-btn v-if="!embedded" icon="close" flat round dense v-close-popup />
      </div>
    </q-card-section>

    <q-separator />

    <!-- Estado de Carga -->
    <div v-if="loading" class="q-pa-xl text-center">
      <q-spinner-dots color="primary" size="3.5em" />
      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        {{
          onlyGasolina
            ? "Cargando historial de gasolina de la unidad..."
            : "Cargando historial de servicios de la unidad..."
        }}
      </div>
    </div>

    <!-- Contenido del Dashboard -->
    <q-card-section
      v-else
      :class="embedded ? 'q-pa-md' : 'q-pa-md scroll'"
      :style="embedded ? '' : 'max-height: 82vh'"
    >
      <!-- Tarjetas de KPIs Principales -->
      <div class="row q-col-gutter-md q-mb-md">
        <!-- Total Dinero Invertido / Total Litros Dispersados -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-green">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-overline text-grey-7 leading-none">
                    {{
                      onlyGasolina
                        ? "TOTAL LITROS DISPERSADOS"
                        : "DINERO TOTAL INVERTIDO"
                    }}
                  </div>
                  <div class="text-h5 text-weight-bolder text-positive q-mt-xs">
                    {{
                      onlyGasolina
                        ? `${kpis.totalLtsDispersados.toLocaleString(
                            "es-MX"
                          )} Lts`
                        : formatCurrency(kpis.totalInvertido)
                    }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    <template v-if="onlyGasolina">
                      Solicitados:
                      {{ kpis.totalLtsSolicitados.toLocaleString("es-MX") }} Lts
                    </template>
                    <template v-else>
                      Subtotal: {{ formatCurrency(kpis.subtotalInvertido) }}
                      &bull; IVA:
                      {{ formatCurrency(kpis.ivaInvertido) }}
                    </template>
                  </div>
                </div>
                <q-avatar
                  color="green-1"
                  text-color="positive"
                  :icon="onlyGasolina ? 'local_gas_station' : 'paid'"
                  size="46px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Año de la Unidad / Dispersiones -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="full-height kpi-card kpi-border-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-overline text-grey-7 leading-none">
                    {{
                      onlyGasolina
                        ? "DISPERSIONES REGISTRADAS"
                        : "AÑO DE LA UNIDAD"
                    }}
                  </div>
                  <div class="text-h5 text-weight-bolder text-primary q-mt-xs">
                    <template v-if="onlyGasolina">
                      {{ kpis.totalServicios }}
                      <span
                        class="text-subtitle2 text-weight-regular text-grey-7"
                      >
                        registro(s)
                      </span>
                    </template>
                    <template v-else>
                      {{ vehicle?.anio ? vehicle.anio : "No especificado" }}
                    </template>
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    {{
                      onlyGasolina
                        ? "Solicitudes de combustible"
                        : vehicle?.anio
                        ? `Antigüedad actual: ${Math.max(
                            0,
                            new Date().getFullYear() - Number(vehicle.anio)
                          )} año(s)`
                        : "Sin año registrado en la BD"
                    }}
                  </div>
                </div>
                <q-avatar
                  color="blue-1"
                  text-color="primary"
                  :icon="onlyGasolina ? 'ev_station' : 'calendar_today'"
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
                    <span v-else>{{
                      onlyGasolina
                        ? "Kilometraje en dispersiones"
                        : "Kilometraje en servicios"
                    }}</span>
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
                    {{ onlyGasolina ? "ÚLTIMA DISPERSIÓN" : "ÚLTIMO SERVICIO" }}
                  </div>
                  <div
                    class="text-h6 text-weight-bolder text-deep-purple q-mt-xs ellipsis"
                  >
                    {{
                      kpis.ultimoServicioFecha
                        ? formatFecha(kpis.ultimoServicioFecha)
                        : "Sin registros"
                    }}
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs ellipsis">
                    {{
                      kpis.ultimoServicioNombre ||
                      (onlyGasolina
                        ? "Ninguna dispersión registrada"
                        : "Ningún servicio registrado")
                    }}
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

      <!-- Gráficas de Líneas de Tendencia: Antigüedad de la Unidad y Rango de KM (10,000 km) -->
      <div
        v-if="!onlyGasolina && flatServices.length > 0"
        class="row q-col-gutter-md q-mb-md"
      >
        <!-- Gráfica 1: Monto Gastado por Antigüedad de la Unidad -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section
              class="q-py-xs q-px-md bg-white flex items-center justify-between"
            >
              <div class="row items-center no-wrap">
                <q-icon
                  name="timeline"
                  color="primary"
                  size="19px"
                  class="q-mr-xs"
                />
                <div>
                  <div
                    class="text-subtitle2 text-weight-bold text-primary leading-tight"
                  >
                    Tendencia de Gasto por Antigüedad de la Unidad
                  </div>
                  <div class="text-caption text-grey-6">
                    <template v-if="vehicleModelYear">
                      Evolución de costos según los años de vida de la unidad (Modelo {{ vehicleModelYear }})
                    </template>
                    <template v-else>
                      Evolución anual de costos de mantenimiento de la unidad
                    </template>
                  </div>
                </div>
              </div>

              <div class="row items-center q-gutter-xs">
                <q-chip
                  v-if="filters.antiguedadKey !== null"
                  removable
                  dense
                  color="primary"
                  text-color="white"
                  icon="filter_alt"
                  class="text-weight-bold"
                  @remove="filters.antiguedadKey = null"
                >
                  {{ activeAntiguedadChipLabel }}
                </q-chip>
                <span v-else class="text-caption text-grey-6">
                  Clic en un punto para filtrar
                </span>
              </div>
            </q-card-section>

            <q-separator />

            <div
              v-if="tendenciaPorAntiguedad.peakTotal"
              class="row items-center justify-between q-px-md q-py-xs bg-blue-1 text-caption wrap"
            >
              <div class="row items-center">
                <q-icon
                  name="trending_up"
                  color="negative"
                  size="16px"
                  class="q-mr-xs"
                />
                <span class="text-grey-8 q-mr-xs">Mayor gasto en:</span>
                <strong class="text-negative q-mr-xs">
                  {{ tendenciaPorAntiguedad.peakTotal.fullLabel }}
                </strong>
                <span class="text-weight-bold text-dark">
                  ({{ formatCurrency(tendenciaPorAntiguedad.peakTotal.total) }} en
                  {{ tendenciaPorAntiguedad.peakTotal.servicios }} serv.)
                </span>
              </div>
            </div>

            <q-card-section class="q-pa-sm">
              <div
                v-if="tendenciaPorAntiguedad.items.length === 0"
                class="flex flex-center column text-grey-6"
                style="height: 245px"
              >
                <q-icon name="show_chart" size="38px" color="grey-4" />
                <div class="text-caption q-mt-xs">
                  Sin fechas de servicio registradas para graficar antigüedad.
                </div>
              </div>
              <div
                v-show="tendenciaPorAntiguedad.items.length > 0"
                ref="unitAntiguedadChartRef"
                class="unit-trend-chart"
              ></div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Gráfica 2: Monto Gastado por Rango de Kilometraje (Intervalos de 10,000 km) -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section
              class="q-py-xs q-px-md bg-white flex items-center justify-between"
            >
              <div class="row items-center no-wrap">
                <q-icon
                  name="insights"
                  color="teal-8"
                  size="19px"
                  class="q-mr-xs"
                />
                <div>
                  <div
                    class="text-subtitle2 text-weight-bold text-teal-9 leading-tight"
                  >
                    Tendencia de Gasto por Rango de KM (Intervalos de 10,000 km)
                  </div>
                  <div class="text-caption text-grey-6">
                    Identifica entre qué kilometrajes esta unidad ha requerido mayor mantenimiento
                  </div>
                </div>
              </div>

              <div class="row items-center q-gutter-xs">
                <q-chip
                  v-if="filters.kmBucket !== null"
                  removable
                  dense
                  color="teal-8"
                  text-color="white"
                  icon="filter_alt"
                  class="text-weight-bold"
                  @remove="filters.kmBucket = null"
                >
                  KM: {{ formatKmBucketFull(filters.kmBucket) }}
                </q-chip>
                <span v-else class="text-caption text-grey-6">
                  Clic en un rango para filtrar
                </span>
              </div>
            </q-card-section>

            <q-separator />

            <div
              v-if="tendenciaPorKm.peakTotal"
              class="row items-center justify-between q-px-md q-py-xs bg-teal-1 text-caption wrap"
            >
              <div class="row items-center">
                <q-icon
                  name="warning_amber"
                  color="deep-orange-9"
                  size="16px"
                  class="q-mr-xs"
                />
                <span class="text-grey-8 q-mr-xs">Mayor desgaste / gasto:</span>
                <strong class="text-deep-orange-9 q-mr-xs">
                  {{ tendenciaPorKm.peakTotal.fullLabel }}
                </strong>
                <span class="text-weight-bold text-dark">
                  ({{ formatCurrency(tendenciaPorKm.peakTotal.total) }} en
                  {{ tendenciaPorKm.peakTotal.servicios }} serv.)
                </span>
              </div>
            </div>

            <q-card-section class="q-pa-sm">
              <div
                v-if="tendenciaPorKm.items.length === 0"
                class="flex flex-center column text-grey-6"
                style="height: 245px"
              >
                <q-icon name="speed" size="38px" color="grey-4" />
                <div class="text-caption q-mt-xs">
                  No hay servicios con kilometraje capturado para graficar intervalos de 10,000 km.
                </div>
              </div>
              <div
                v-show="tendenciaPorKm.items.length > 0"
                ref="unitKmChartRef"
                class="unit-trend-chart"
              ></div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Desglose por Tipo de Servicio y Top Servicios (solo Servicios/Refacciones) -->
      <div
        v-if="!onlyGasolina && flatServices.length > 0"
        class="row q-col-gutter-md q-mb-md"
      >
        <!-- Distribución por Tipo de Servicio -->
        <div class="col-12 col-md-7">
          <q-card flat bordered class="full-height">
            <q-card-section
              class="q-py-sm q-px-md bg-white flex items-center justify-between"
            >
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center"
              >
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
                        {{ tipo.count }} serv. ({{
                          tipo.porcentaje.toFixed(1)
                        }}%)
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
            <q-card-section
              class="q-py-sm q-px-md bg-white flex items-center justify-between"
            >
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center"
              >
                <q-icon name="build_circle" class="q-mr-xs" size="18px" />
                Principales Servicios Realizados
              </div>
              <q-badge
                color="grey-7"
                outline
                :label="`${resumenPorServicio.length} categorías`"
              />
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
                    <q-item-label
                      class="text-weight-medium text-body2 ellipsis"
                    >
                      {{ serv.nombre }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ serv.tipo }} &bull; Último KM:
                      <strong>{{
                        serv.ultimoKm ? formatKm(serv.ultimoKm) : "N/A"
                      }}</strong>
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
            <div :class="onlyGasolina ? 'col-12' : 'col-12 col-sm-4'">
              <q-input
                v-model="filters.search"
                outlined
                dense
                clearable
                :placeholder="
                  onlyGasolina
                    ? 'Buscar por folio, notas, kilometraje, estatus, solicitante...'
                    : 'Buscar servicio, descripción, OC, factura, proveedor...'
                "
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div v-if="!onlyGasolina" class="col-12 col-sm-3">
              <q-select
                v-model="filters.tipoServicio"
                :options="filteredTipoServicioOptions"
                label="Tipo de Servicio"
                outlined
                dense
                options-dense
                clearable
                use-input
                input-debounce="0"
                behavior="menu"
                @filter="filterTipoServicioFn"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin opciones
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div v-if="!onlyGasolina" class="col-12 col-sm-3">
              <q-select
                v-model="filters.servicio"
                :options="filteredServicioOptions"
                label="Servicio"
                outlined
                dense
                options-dense
                clearable
                use-input
                input-debounce="0"
                behavior="menu"
                @filter="filterServicioFn"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin opciones
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div v-if="!onlyGasolina" class="col-12 col-sm-2 flex justify-end">
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

      <!-- VISTA GASOLINA: Tabla de Dispersiones de Gasolina -->
      <q-card v-if="onlyGasolina" flat bordered class="bg-white">
        <q-table
          flat
          :rows="filteredServices"
          :columns="gasolinaColumns"
          row-key="uid"
          dense
          :pagination="{ rowsPerPage: 15 }"
          :rows-per-page-options="[10, 15, 25, 50, 0]"
          no-data-label="No se encontraron dispersiones de gasolina registradas para esta unidad."
        >
          <template v-slot:top>
            <div class="row full-width items-center justify-between q-py-xs">
              <div
                class="text-subtitle1 text-weight-bold text-dark flex items-center"
              >
                <q-icon
                  name="local_gas_station"
                  color="primary"
                  size="sm"
                  class="q-mr-xs"
                />
                Historial de Dispersiones de Gasolina
                <q-badge
                  color="primary"
                  outline
                  class="q-ml-sm"
                  :label="`${filteredServices.length} registro(s)`"
                />
              </div>
              <div class="text-subtitle2 text-grey-8">
                Total dispersado filtrado:
                <span class="text-weight-bolder text-positive text-subtitle1">
                  {{ filteredTotalLtsDispersados.toLocaleString("es-MX") }} Lts
                </span>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-folio="props">
            <q-td :props="props">
              <div class="row items-center no-wrap q-gutter-x-xs">
                <span class="text-weight-bold text-primary font-mono">
                  #{{ props.row.id }}
                </span>
                <q-badge
                  v-if="props.row.is_urgente"
                  color="red-8"
                  text-color="white"
                  class="q-px-xs text-weight-bold"
                >
                  Urgente
                </q-badge>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">
              <div class="text-weight-bold text-dark">
                {{ formatFecha(props.row.fecha_elaboracion) }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-estatus="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.estatus?.color || 'grey-7'"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                {{ props.row.estatus?.nombre || "Sin estatus" }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-lts_solicitados="props">
            <q-td :props="props" class="text-right">
              <q-badge
                color="orange-1"
                text-color="orange-10"
                class="q-px-sm q-py-xs text-weight-bolder font-mono"
              >
                {{ props.row.lts_solicitados ?? 0 }} Lts
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-lts_dispersados="props">
            <q-td :props="props" class="text-right">
              <q-badge
                v-if="
                  props.row.lts_dispersados !== null &&
                  props.row.lts_dispersados !== undefined
                "
                color="green-1"
                text-color="positive"
                class="q-px-sm q-py-xs text-weight-bolder font-mono"
              >
                {{ props.row.lts_dispersados }} Lts
              </q-badge>
              <span v-else class="text-caption text-grey-5 italic"
                >Pendiente</span
              >
            </q-td>
          </template>

          <template v-slot:body-cell-km_evento="props">
            <q-td :props="props" class="text-right">
              <q-chip
                v-if="
                  props.row.km_evento !== null &&
                  props.row.km_evento !== undefined &&
                  props.row.km_evento !== ''
                "
                dense
                square
                color="orange-1"
                text-color="orange-10"
                icon="speed"
                class="text-weight-bold"
              >
                {{ formatKm(props.row.km_evento) }}
              </q-chip>
              <span v-else class="text-caption text-grey-5 italic"
                >No reg.</span
              >
            </q-td>
          </template>

          <template v-slot:body-cell-notas="props">
            <q-td :props="props" style="max-width: 280px; white-space: normal">
              <div class="text-body2 text-grey-9">
                {{ props.row.descripcion || "Sin notas" }}
              </div>
              <div
                v-if="props.row.solicitante_nombre"
                class="text-caption text-grey-6 q-mt-xs"
              >
                <q-icon name="person" size="12px" class="q-mr-xs" />
                {{ props.row.solicitante_nombre }}
              </div>
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
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- VISTA 1: Tabla Detallada de Servicios Realizados -->
      <q-card
        v-else-if="viewMode === 'detalles'"
        flat
        bordered
        class="bg-white"
      >
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
              <div
                class="text-subtitle1 text-weight-bold text-dark flex items-center"
              >
                <q-icon
                  name="history_edu"
                  color="primary"
                  size="sm"
                  class="q-mr-xs"
                />
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
              <div
                v-if="props.row.orden_compra"
                class="text-caption text-grey-7"
              >
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
                v-if="
                  props.row.intervalo_km_sugerido ||
                  props.row.intervalo_meses_sugerido
                "
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
              <div
                class="text-caption text-grey-6 q-mt-xs"
                v-if="props.row.proveedor_nombre"
              >
                <q-icon name="storefront" size="12px" class="q-mr-xs" />
                {{ props.row.proveedor_nombre }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-km_evento="props">
            <q-td :props="props" class="text-right">
              <q-chip
                v-if="
                  props.row.km_evento !== null &&
                  props.row.km_evento !== undefined &&
                  props.row.km_evento !== ''
                "
                dense
                square
                color="orange-1"
                text-color="orange-10"
                icon="speed"
                class="text-weight-bold"
              >
                {{ formatKm(props.row.km_evento) }}
              </q-chip>
              <span v-else class="text-caption text-grey-5 italic"
                >No reg.</span
              >
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
            No hay órdenes de servicio que coincidan con los filtros
            seleccionados.
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
                <q-item-label
                  class="text-weight-bold text-subtitle1 flex items-center q-gutter-x-sm"
                >
                  <span>Fecha: {{ formatFecha(orden.fecha_elaboracion) }}</span>
                  <q-badge v-if="orden.orden_compra" color="blue-8" outline>
                    OC: {{ orden.orden_compra }}
                  </q-badge>
                  <q-badge
                    v-if="orden.autorizacion_compras"
                    color="teal-8"
                    outline
                  >
                    Aut: {{ orden.autorizacion_compras }}
                  </q-badge>
                  <q-badge v-if="orden.factura" color="purple-8" outline>
                    Factura: {{ orden.factura }}
                  </q-badge>
                </q-item-label>
                <q-item-label caption class="text-grey-8">
                  <strong>Proveedor:</strong>
                  {{ orden.proveedor?.nombre || "No especificado" }}
                  <span
                    v-if="
                      orden.sucursal_cargo?.nombre ||
                      orden.sucursalCargo?.nombre
                    "
                  >
                    &bull; <strong>Suc. Cargo:</strong>
                    {{
                      orden.sucursal_cargo?.nombre ||
                      orden.sucursalCargo?.nombre
                    }}
                  </span>
                  <span
                    v-if="
                      orden.departamento_cargo?.nombre ||
                      orden.departamentoCargo?.nombre
                    "
                  >
                    &bull; <strong>Depto. Cargo:</strong>
                    {{
                      orden.departamento_cargo?.nombre ||
                      orden.departamentoCargo?.nombre
                    }}
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
      </div>
    </q-card-section>

    <q-separator />

    <!-- Pie del Modal -->
    <q-card-actions align="between" class="q-px-md q-py-sm bg-grey-2">
      <div class="text-caption text-grey-7">
        <q-icon name="info" size="14px" class="q-mr-xs" />
        Mostrando {{ filteredServices.length }} de {{ flatServices.length }}
        {{ onlyGasolina ? "dispersión(es)" : "servicio(s)" }}
        registrados para la unidad {{ vehicle?.placas || "" }}.
      </div>
      <div class="q-gutter-x-sm">
        <q-btn
          v-if="
            filters.search ||
            filters.tipoServicio ||
            filters.servicio ||
            filters.antiguedadKey !== null ||
            filters.kmBucket !== null
          "
          flat
          dense
          color="primary"
          icon="filter_alt_off"
          label="Limpiar filtros"
          @click="resetFilters"
        />
        <q-btn
          v-if="!onlyGasolina"
          outline
          dense
          color="positive"
          icon="table_view"
          label="Descargar Excel con Gráficas"
          :loading="exportingExcel"
          :disable="loading || !vehicle?.id"
          @click="exportToExcel"
        />
        <q-btn
          v-if="!embedded"
          flat
          label="Cerrar"
          color="grey-8"
          v-close-popup
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { date } from "quasar";
import * as echarts from "echarts";
import { sendRequest, show_notify } from "src/boot/functions";

const props = defineProps({
  vehicle: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  embedded: {
    type: Boolean,
    default: false,
  },
  onlyGasolina: {
    type: Boolean,
    default: false,
  },
});

const viewMode = ref("detalles");
const exportingExcel = ref(false);
const unitAntiguedadChartRef = ref(null);
const unitKmChartRef = ref(null);
let unitAntiguedadChartInstance = null;
let unitKmChartInstance = null;
let unitChartsResizeObserver = null;

const exportToExcel = async () => {
  if (!props.vehicle?.id) return;
  exportingExcel.value = true;
  try {
    const res = await sendRequest(
      "GET",
      null,
      `/api/vehicle/export-services/${props.vehicle.id}`
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
        res.file_name ||
          `Historial_Servicios_${props.vehicle.placas || props.vehicle.id}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      show_notify(
        "Archivo Excel con tabla y gráficas descargado correctamente",
        "check_circle",
        "positive"
      );
    }
  } finally {
    exportingExcel.value = false;
  }
};

const filters = ref({
  search: "",
  tipoServicio: null,
  servicio: null,
  antiguedadKey: null,
  kmBucket: null,
});

const resetFilters = () => {
  filters.value = {
    search: "",
    tipoServicio: null,
    servicio: null,
    antiguedadKey: null,
    kmBucket: null,
  };
  filteredTipoServicioOptions.value = tipoServicioOptions.value;
  filteredServicioOptions.value = servicioOptions.value;
};

const toggleTipoFilter = (nombre) => {
  filters.value.tipoServicio =
    filters.value.tipoServicio === nombre ? null : nombre;
};

const toggleServicioFilter = (nombre) => {
  filters.value.servicio = filters.value.servicio === nombre ? null : nombre;
};

// Helper para determinar si una orden es de gasolina (registros heredados)
const isGasolinaOrden = (orden) => {
  const detalles =
    orden.detalles || orden.detalles_servicio || orden.detallesServicio || [];
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

// Lista de dispersiones de gasolina de la nueva tabla
const dispersionesGasolinaList = computed(() => {
  return (
    props.vehicle?.dispersiones_gasolina ||
    props.vehicle?.dispersionesGasolina ||
    []
  );
});

// Lista de órdenes normalizada (solo para Servicios y Refacciones)
const ordenesList = computed(() => {
  if (props.onlyGasolina) {
    return dispersionesGasolinaList.value;
  }

  let raw =
    props.vehicle?.ordenes_servicio || props.vehicle?.ordenesServicio || [];

  raw = raw.filter((o) => !isGasolinaOrden(o));

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

// Lista plana de todos los servicios o dispersiones realizados
const flatServices = computed(() => {
  if (props.onlyGasolina) {
    return dispersionesGasolinaList.value.map((disp) => {
      const sucCargoObj = disp.sucursal_cargo || disp.sucursalCargo || {};
      const deptoCargoObj =
        disp.departamento_cargo || disp.departamentoCargo || {};

      return {
        uid: `gas-${disp.id}`,
        id: disp.id,
        orden_id: disp.id,
        fecha_elaboracion: disp.created_at,
        estatus: disp.estatus || null,
        is_urgente: Boolean(disp.is_urgente),
        solicitante_nombre: disp.solicitante?.nombreCompleto || null,
        sucursal_cargo_nombre: sucCargoObj?.nombre || null,
        depto_cargo_nombre: deptoCargoObj?.nombre || null,
        tipo_servicio_id: 14,
        tipo_servicio_nombre: "Gasolina",
        servicio_id: 62,
        servicio_nombre: "Dispersión de Gasolina",
        descripcion: disp.notas || null,
        lts_solicitados:
          disp.lts_solicitados !== null && disp.lts_solicitados !== undefined
            ? Number(disp.lts_solicitados)
            : 0,
        lts_dispersados:
          disp.lts_dispersados !== null && disp.lts_dispersados !== undefined
            ? Number(disp.lts_dispersados)
            : null,
        km_evento:
          disp.km_evento !== null && disp.km_evento !== undefined
            ? Number(disp.km_evento)
            : null,
        subtotal: 0,
        iva: 0,
        total: 0,
      };
    });
  }

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
        cantidad:
          det.cantidad !== null && det.cantidad !== undefined
            ? Number(det.cantidad)
            : null,
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

const filteredTipoServicioOptions = ref([]);
const filteredServicioOptions = ref([]);

watch(
  tipoServicioOptions,
  (val) => {
    filteredTipoServicioOptions.value = val;
  },
  { immediate: true }
);

watch(
  servicioOptions,
  (val) => {
    filteredServicioOptions.value = val;
  },
  { immediate: true }
);

watch(
  () => filters.value.tipoServicio,
  (newVal) => {
    if (newVal && filters.value.servicio) {
      if (!servicioOptions.value.includes(filters.value.servicio)) {
        filters.value.servicio = null;
      }
    }
  }
);

const filterTipoServicioFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredTipoServicioOptions.value = tipoServicioOptions.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredTipoServicioOptions.value = tipoServicioOptions.value.filter((t) =>
      t.toLowerCase().includes(q)
    );
  });
};

const filterServicioFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredServicioOptions.value = servicioOptions.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredServicioOptions.value = servicioOptions.value.filter((s) =>
      s.toLowerCase().includes(q)
    );
  });
};

// Año modelo de la unidad (si está capturado)
const vehicleModelYear = computed(() => {
  const parsed = parseInt(String(props.vehicle?.anio || "").trim(), 10);
  return !isNaN(parsed) && parsed >= 1970 && parsed <= 2100 ? parsed : null;
});

// Clave de antigüedad / año del servicio para una fila
const getItemAntiguedadKey = (item) => {
  const fechaStr = item.fecha_elaboracion ? String(item.fecha_elaboracion) : "";
  const srvYear = /^\d{4}/.test(fechaStr)
    ? parseInt(fechaStr.slice(0, 4), 10)
    : null;
  if (!srvYear) return null;
  if (vehicleModelYear.value) {
    return Math.max(0, srvYear - vehicleModelYear.value);
  }
  return srvYear;
};

// Bucket de kilometraje en intervalos de 10,000 km (0 = 0..10k, 1 = 10k..20k, etc.)
const getItemKmBucket = (item) => {
  const km = Number(item.km_evento || 0);
  if (!km || km <= 0) return null;
  return Math.floor((km - 1) / 10000);
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

const activeAntiguedadChipLabel = computed(() => {
  if (filters.value.antiguedadKey === null) return "";
  const k = Number(filters.value.antiguedadKey);
  if (vehicleModelYear.value) {
    const calYear = vehicleModelYear.value + k;
    return `Edad: ${k} ${k === 1 ? "año" : "años"} (${calYear})`;
  }
  return `Año: ${k}`;
});

// Servicios base filtrados por buscador, tipo y servicio (antes de filtros de puntos de gráficas)
const baseFilteredServices = computed(() => {
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
        String(item.id || "").includes(q) ||
        (item.servicio_nombre &&
          item.servicio_nombre.toLowerCase().includes(q)) ||
        (item.tipo_servicio_nombre &&
          item.tipo_servicio_nombre.toLowerCase().includes(q)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(q)) ||
        (item.estatus?.nombre &&
          item.estatus.nombre.toLowerCase().includes(q)) ||
        (item.solicitante_nombre &&
          item.solicitante_nombre.toLowerCase().includes(q)) ||
        (item.sucursal_cargo_nombre &&
          item.sucursal_cargo_nombre.toLowerCase().includes(q)) ||
        (item.depto_cargo_nombre &&
          item.depto_cargo_nombre.toLowerCase().includes(q)) ||
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

// Servicios filtrados finales (incluyendo selección en gráficas de Antigüedad y Rango de KM)
const filteredServices = computed(() => {
  return baseFilteredServices.value.filter((item) => {
    if (
      filters.value.antiguedadKey !== null &&
      filters.value.antiguedadKey !== undefined &&
      getItemAntiguedadKey(item) !== Number(filters.value.antiguedadKey)
    ) {
      return false;
    }
    if (
      filters.value.kmBucket !== null &&
      filters.value.kmBucket !== undefined &&
      getItemKmBucket(item) !== Number(filters.value.kmBucket)
    ) {
      return false;
    }
    return true;
  });
});

// Dataset 1: Tendencia de Gasto por Antigüedad de la Unidad
const tendenciaPorAntiguedad = computed(() => {
  if (props.onlyGasolina) return { items: [], peakTotal: null };

  const sourceList = baseFilteredServices.value.filter((item) => {
    if (
      filters.value.kmBucket !== null &&
      filters.value.kmBucket !== undefined &&
      getItemKmBucket(item) !== Number(filters.value.kmBucket)
    ) {
      return false;
    }
    return true;
  });

  const map = new Map();
  let minKey = Infinity;
  let maxKey = -Infinity;

  for (const s of sourceList) {
    const key = getItemAntiguedadKey(s);
    if (key === null) continue;

    if (key < minKey) minKey = key;
    if (key > maxKey) maxKey = key;

    if (!map.has(key)) {
      map.set(key, {
        key,
        total: 0,
        servicios: 0,
      });
    }
    const entry = map.get(key);
    entry.total += s.total;
    entry.servicios += 1;
  }

  if (map.size === 0) {
    return { items: [], peakTotal: null };
  }

  const keys = [];
  if (maxKey - minKey <= 25) {
    for (let k = minKey; k <= maxKey; k++) {
      keys.push(k);
    }
  } else {
    keys.push(...Array.from(map.keys()).sort((a, b) => a - b));
  }

  const hasModelYear = Boolean(vehicleModelYear.value);
  const items = keys.map((key) => {
    const data = map.get(key);
    const total = data ? data.total : 0;
    const servicios = data ? data.servicios : 0;
    const promedioPorServicio = servicios > 0 ? total / servicios : 0;

    let shortLabel = String(key);
    let fullLabel = `Año ${key}`;
    if (hasModelYear) {
      const calYear = vehicleModelYear.value + key;
      shortLabel =
        key === 0
          ? `0a (${calYear})`
          : key === 1
          ? `1a (${calYear})`
          : `${key}a (${calYear})`;
      fullLabel =
        key === 0
          ? `0 años - Nuevo (${calYear})`
          : key === 1
          ? `1 año (${calYear})`
          : `${key} años (${calYear})`;
    }

    return {
      key,
      shortLabel,
      fullLabel,
      total: Number(total.toFixed(2)),
      servicios,
      promedioPorServicio: Number(promedioPorServicio.toFixed(2)),
    };
  });

  let peakTotal = null;
  for (const it of items) {
    if (it.total > 0 && (!peakTotal || it.total > peakTotal.total)) {
      peakTotal = it;
    }
  }

  return { items, peakTotal };
});

// Dataset 2: Tendencia de Gasto por Rango de Kilometraje (Intervalos de 10,000 km)
const tendenciaPorKm = computed(() => {
  if (props.onlyGasolina) return { items: [], peakTotal: null };

  const sourceList = baseFilteredServices.value.filter((item) => {
    if (
      filters.value.antiguedadKey !== null &&
      filters.value.antiguedadKey !== undefined &&
      getItemAntiguedadKey(item) !== Number(filters.value.antiguedadKey)
    ) {
      return false;
    }
    return true;
  });

  const map = new Map();
  let minBucket = Infinity;
  let maxBucket = -Infinity;

  for (const s of sourceList) {
    const bucket = getItemKmBucket(s);
    if (bucket === null || bucket < 0 || bucket > 200) continue;

    if (bucket < minBucket) minBucket = bucket;
    if (bucket > maxBucket) maxBucket = bucket;

    if (!map.has(bucket)) {
      map.set(bucket, {
        bucket,
        total: 0,
        servicios: 0,
      });
    }
    const entry = map.get(bucket);
    entry.total += s.total;
    entry.servicios += 1;
  }

  if (map.size === 0) {
    return { items: [], peakTotal: null };
  }

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
    const promedioPorServicio = servicios > 0 ? total / servicios : 0;

    return {
      bucket,
      label: formatKmBucketShort(bucket),
      fullLabel: formatKmBucketFull(bucket),
      total: Number(total.toFixed(2)),
      servicios,
      promedioPorServicio: Number(promedioPorServicio.toFixed(2)),
    };
  });

  let peakTotal = null;
  for (const it of items) {
    if (it.total > 0 && (!peakTotal || it.total > peakTotal.total)) {
      peakTotal = it;
    }
  }

  return { items, peakTotal };
});

// Órdenes filtradas para la vista de órdenes
const filteredOrders = computed(() => {
  const allowedOrdenIds = new Set(
    filteredServices.value.map((s) => s.orden_id)
  );
  return ordenesList.value.filter((o) => allowedOrdenIds.has(o.id));
});

const filteredTotalAmount = computed(() => {
  return filteredServices.value.reduce((acc, s) => acc + s.total, 0);
});

const filteredTotalLtsDispersados = computed(() => {
  return filteredServices.value.reduce(
    (acc, s) => acc + Number(s.lts_dispersados || 0),
    0
  );
});

// KPIs Generales
const kpis = computed(() => {
  const totalInvertido = flatServices.value.reduce(
    (acc, s) => acc + s.total,
    0
  );
  const subtotalInvertido = flatServices.value.reduce(
    (acc, s) => acc + s.subtotal,
    0
  );
  const ivaInvertido = flatServices.value.reduce((acc, s) => acc + s.iva, 0);

  const totalLtsSolicitados = flatServices.value.reduce(
    (acc, s) => acc + Number(s.lts_solicitados || 0),
    0
  );
  const totalLtsDispersados = flatServices.value.reduce(
    (acc, s) => acc + Number(s.lts_dispersados || 0),
    0
  );

  const kms = flatServices.value
    .map((s) => s.km_evento)
    .filter((km) => km !== null && !isNaN(km) && km > 0);

  const maxKm = kms.length > 0 ? Math.max(...kms) : null;
  const minKm = kms.length > 0 ? Math.min(...kms) : null;

  const sortedByDate = [...flatServices.value].sort((a, b) => {
    return (
      new Date(b.fecha_elaboracion || 0) - new Date(a.fecha_elaboracion || 0)
    );
  });

  const ultimo = sortedByDate[0] || null;

  let ultimoServicioNombre = null;
  if (ultimo) {
    if (props.onlyGasolina) {
      const lts =
        ultimo.lts_dispersados !== null && ultimo.lts_dispersados !== undefined
          ? `${ultimo.lts_dispersados} Lts dispersados`
          : `${ultimo.lts_solicitados || 0} Lts solicitados`;
      ultimoServicioNombre = `Folio #${ultimo.id} • ${lts}`;
    } else {
      ultimoServicioNombre = `${ultimo.servicio_nombre} (${ultimo.tipo_servicio_nombre})`;
    }
  }

  return {
    totalInvertido,
    subtotalInvertido,
    ivaInvertido,
    totalLtsSolicitados,
    totalLtsDispersados,
    totalServicios: flatServices.value.length,
    totalOrdenes: ordenesList.value.length,
    maxKm,
    minKm,
    ultimoServicioFecha: ultimo?.fecha_elaboracion || null,
    ultimoServicioNombre,
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

const gasolinaColumns = [
  {
    name: "folio",
    label: "Folio",
    field: "id",
    align: "left",
    sortable: true,
  },
  {
    name: "fecha",
    label: "Fecha",
    field: "fecha_elaboracion",
    align: "left",
    sortable: true,
  },
  {
    name: "estatus",
    label: "Estatus",
    field: (row) => row.estatus?.nombre || "",
    align: "left",
    sortable: true,
  },
  {
    name: "lts_solicitados",
    label: "Lts Solicitados",
    field: "lts_solicitados",
    align: "right",
    sortable: true,
  },
  {
    name: "lts_dispersados",
    label: "Lts Dispersados",
    field: "lts_dispersados",
    align: "right",
    sortable: true,
  },
  {
    name: "km_evento",
    label: "Kilometraje",
    field: "km_evento",
    align: "right",
    sortable: true,
  },
  {
    name: "notas",
    label: "Notas / Solicitante",
    field: "descripcion",
    align: "left",
  },
  {
    name: "cargo",
    label: "Cargo (Suc. / Depto.)",
    field: "sucursal_cargo_nombre",
    align: "left",
  },
];

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

const formatCompactCurrency = (val) => {
  const num = Number(val || 0);
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
  return `$${num.toFixed(0)}`;
};

// Renderizado de Gráfica 1: Tendencia por Antigüedad de la Unidad
const renderUnitAntiguedadChart = () => {
  if (props.onlyGasolina) return;
  const el = unitAntiguedadChartRef.value;
  if (!el) return;

  const items = tendenciaPorAntiguedad.value.items;
  if (!items || items.length === 0) {
    if (unitAntiguedadChartInstance) {
      unitAntiguedadChartInstance.clear();
    }
    return;
  }

  if (
    unitAntiguedadChartInstance &&
    unitAntiguedadChartInstance.getDom() !== el
  ) {
    unitAntiguedadChartInstance.dispose();
    unitAntiguedadChartInstance = null;
  }

  if (!unitAntiguedadChartInstance) {
    unitAntiguedadChartInstance = echarts.init(el);
    unitAntiguedadChartInstance.on("click", (params) => {
      const idx = params?.dataIndex;
      const currentItems = tendenciaPorAntiguedad.value.items;
      if (idx !== undefined && currentItems[idx]) {
        const clickedKey = currentItems[idx].key;
        filters.value.antiguedadKey =
          filters.value.antiguedadKey === clickedKey ? null : clickedKey;
      }
    });
  }

  const selectedKey = filters.value.antiguedadKey;
  const labels = items.map((i) => i.shortLabel);
  const totalData = items.map((i) => ({
    value: i.total,
    itemStyle:
      selectedKey !== null && Number(selectedKey) === Number(i.key)
        ? { color: "#D32F2F", borderColor: "#FFFFFF", borderWidth: 3 }
        : undefined,
    symbolSize:
      selectedKey !== null && Number(selectedKey) === Number(i.key) ? 12 : 7,
  }));
  const avgData = items.map((i) => i.promedioPorServicio);

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
            ${item.fullLabel}
          </div>
          <div>Monto Total Gastado: <strong style="color:#4ADE80;">${formatCurrency(item.total)}</strong></div>
          <div>Promedio por Servicio: <strong style="color:#FBBF24;">${formatCurrency(item.promedioPorServicio)}</strong></div>
          <div style="margin-top:3px;font-size:11px;color:#CBD5E1;">
            Servicios realizados: <strong>${item.servicios}</strong>
          </div>
        `;
      },
    },
    legend: {
      top: 2,
      right: 10,
      textStyle: { fontSize: 11, color: "#475569" },
      data: ["Monto Total Gastado ($)", "Promedio por Servicio ($)"],
    },
    grid: {
      left: 56,
      right: 20,
      top: 36,
      bottom: items.length > 10 ? 50 : 32,
    },
    dataZoom:
      items.length > 10
        ? [
            { type: "inside", start: 0, end: 100 },
            { type: "slider", height: 15, bottom: 4, start: 0, end: 100 },
          ]
        : [],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: labels,
      axisLabel: {
        fontSize: 10,
        color: "#475569",
        rotate: items.length > 7 ? 22 : 0,
      },
      axisLine: { lineStyle: { color: "#CBD5E1" } },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 10,
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
          symbolSize: 42,
          label: {
            fontSize: 9,
            fontWeight: "bold",
            formatter: (p) => formatCompactCurrency(p.value),
          },
          itemStyle: { color: "#C62828" },
          data: [{ type: "max", name: "Pico de Gasto" }],
        },
      },
      {
        name: "Promedio por Servicio ($)",
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

  unitAntiguedadChartInstance.setOption(option, true);
  unitAntiguedadChartInstance.resize();
};

// Renderizado de Gráfica 2: Tendencia por Rango de Kilometraje (10,000 km)
const renderUnitKmChart = () => {
  if (props.onlyGasolina) return;
  const el = unitKmChartRef.value;
  if (!el) return;

  const items = tendenciaPorKm.value.items;
  if (!items || items.length === 0) {
    if (unitKmChartInstance) {
      unitKmChartInstance.clear();
    }
    return;
  }

  if (unitKmChartInstance && unitKmChartInstance.getDom() !== el) {
    unitKmChartInstance.dispose();
    unitKmChartInstance = null;
  }

  if (!unitKmChartInstance) {
    unitKmChartInstance = echarts.init(el);
    unitKmChartInstance.on("click", (params) => {
      const idx = params?.dataIndex;
      const currentItems = tendenciaPorKm.value.items;
      if (idx !== undefined && currentItems[idx]) {
        const clickedBucket = currentItems[idx].bucket;
        filters.value.kmBucket =
          filters.value.kmBucket === clickedBucket ? null : clickedBucket;
      }
    });
  }

  const selectedBucket = filters.value.kmBucket;
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
  const avgData = items.map((i) => i.promedioPorServicio);

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
          <div>Promedio por Servicio: <strong style="color:#C084FC;">${formatCurrency(item.promedioPorServicio)}</strong></div>
          <div style="margin-top:3px;font-size:11px;color:#CBD5E1;">
            Servicios en rango: <strong>${item.servicios}</strong>
          </div>
        `;
      },
    },
    legend: {
      top: 2,
      right: 10,
      textStyle: { fontSize: 11, color: "#475569" },
      data: ["Monto Total Gastado ($)", "Promedio por Servicio ($)"],
    },
    grid: {
      left: 56,
      right: 20,
      top: 36,
      bottom: items.length > 9 ? 50 : 34,
    },
    dataZoom:
      items.length > 9
        ? [
            { type: "inside", start: 0, end: 100 },
            { type: "slider", height: 15, bottom: 4, start: 0, end: 100 },
          ]
        : [],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: labels,
      axisLabel: {
        fontSize: 10,
        color: "#475569",
        rotate: items.length > 5 ? 22 : 0,
      },
      axisLine: { lineStyle: { color: "#CBD5E1" } },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 10,
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
          symbolSize: 42,
          label: {
            fontSize: 9,
            fontWeight: "bold",
            formatter: (p) => formatCompactCurrency(p.value),
          },
          itemStyle: { color: "#D84315" },
          data: [{ type: "max", name: "Pico de Desgaste" }],
        },
      },
      {
        name: "Promedio por Servicio ($)",
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

  unitKmChartInstance.setOption(option, true);
  unitKmChartInstance.resize();
};

const refreshUnitTrendCharts = async () => {
  if (props.loading || props.onlyGasolina) return;
  await nextTick();
  if (typeof ResizeObserver !== "undefined" && !unitChartsResizeObserver) {
    unitChartsResizeObserver = new ResizeObserver(() => {
      if (unitAntiguedadChartInstance) unitAntiguedadChartInstance.resize();
      if (unitKmChartInstance) unitKmChartInstance.resize();
    });
  }
  if (unitChartsResizeObserver) {
    if (unitAntiguedadChartRef.value) {
      unitChartsResizeObserver.observe(unitAntiguedadChartRef.value);
    }
    if (unitKmChartRef.value) {
      unitChartsResizeObserver.observe(unitKmChartRef.value);
    }
  }
  renderUnitAntiguedadChart();
  renderUnitKmChart();
};

watch(
  [
    tendenciaPorAntiguedad,
    tendenciaPorKm,
    () => filters.value.antiguedadKey,
    () => filters.value.kmBucket,
    () => props.loading,
    () => props.vehicle,
  ],
  () => {
    refreshUnitTrendCharts();
  },
  { deep: true }
);

onMounted(() => {
  refreshUnitTrendCharts();
});

onBeforeUnmount(() => {
  if (unitChartsResizeObserver) {
    unitChartsResizeObserver.disconnect();
    unitChartsResizeObserver = null;
  }
  if (unitAntiguedadChartInstance) {
    unitAntiguedadChartInstance.dispose();
    unitAntiguedadChartInstance = null;
  }
  if (unitKmChartInstance) {
    unitKmChartInstance.dispose();
    unitKmChartInstance = null;
  }
});
</script>

<style scoped>
.unit-trend-chart {
  width: 100%;
  height: 245px;
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
</style>
