<template>
  <q-page class="q-pa-sm bg-grey-1">
    <!-- Encabezado y Resumen de Mis Unidades -->
    <q-card flat bordered class="q-ma-xs bg-white shadow-1">
      <q-card-section class="q-py-sm q-px-md">
        <div class="row items-center justify-between q-col-gutter-sm">
          <div class="row items-center q-gutter-x-sm">
            <q-avatar
              size="44px"
              font-size="24px"
              color="primary"
              text-color="white"
              icon="directions_car"
            />
            <div>
              <div class="row items-center q-gutter-x-sm wrap">
                <div class="text-h6 text-weight-bold text-dark">
                  Mis Unidades
                </div>
                <q-badge
                  color="primary"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  {{ rows.length }}
                  {{ rows.length === 1 ? "unidad asignada" : "unidades asignadas" }}
                </q-badge>
                <q-badge
                  v-if="rows.length > 0"
                  :color="pendingChecklistCount > 0 ? 'deep-orange-8' : 'positive'"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  <q-icon
                    :name="pendingChecklistCount > 0 ? 'pending_actions' : 'fact_check'"
                    size="13px"
                    class="q-mr-xs"
                  />
                  {{
                    pendingChecklistCount > 0
                      ? `${pendingChecklistCount} pendiente(s) de checklist T${serverTrimestreActual} (${serverAnioActual})`
                      : `Checklist T${serverTrimestreActual} (${serverAnioActual}) al corriente`
                  }}
                </q-badge>
              </div>
              <div class="text-caption text-grey-7">
                Unidades asignadas como responsable o usuario autorizado. Consulta detalles, sube documentos al expediente de vigencias, realiza el checklist trimestral y solicita dispersión de gasolina.
              </div>
            </div>
          </div>

          <div class="row items-center q-gutter-sm">
            <q-btn
              outline
              dense
              color="primary"
              icon="refresh"
              label="Actualizar"
              class="q-px-sm"
              :loading="loading"
              @click="getRows"
            />
            <q-btn
              v-if="rows.length > 0"
              unelevated
              dense
              color="amber-9"
              icon="local_gas_station"
              label="Solicitar Dispersión de Gasolina"
              class="q-px-md text-weight-bold"
              @click="openGasolinaModal()"
            >
              <q-tooltip>
                Registrar una nueva solicitud de dispersión de gasolina para tus unidades
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tarjetas de Acceso Rápido de Unidades Asignadas -->
    <q-card
      v-if="rows.length > 0"
      flat
      bordered
      class="q-ma-xs bg-blue-1 border-primary"
    >
      <q-card-section class="q-py-sm q-px-md">
        <div
          class="text-subtitle2 text-weight-bold text-primary flex items-center q-mb-xs"
        >
          <q-icon name="verified_user" size="20px" class="q-mr-xs" />
          {{
            rows.length === 1
              ? "Mi Unidad Asignada:"
              : `Mis Unidades Asignadas (${rows.length}):`
          }}
        </div>

        <div class="row q-col-gutter-sm">
          <div
            v-for="veh in rows"
            :key="veh.id"
            class="col-12 col-md-6"
          >
            <div
              class="q-pa-sm bg-white rounded-borders row items-center justify-between shadow-1 q-col-gutter-xs"
            >
              <div class="col">
                <div class="row items-center q-gutter-x-xs">
                  <q-badge color="primary" class="text-weight-bold q-px-sm">
                    {{ veh.placas || "S/P" }}
                  </q-badge>
                  <span class="text-body2 text-weight-bold text-grey-9">
                    {{ getVehicleNombre(veh) }}
                  </span>
                  <q-badge
                    v-if="isResponsableOf(veh)"
                    color="amber-9"
                    text-color="white"
                    label="Responsable"
                  />
                  <q-badge
                    v-else
                    color="blue-grey-6"
                    text-color="white"
                    label="Usuario"
                  />
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  Serie: <strong>{{ veh.serie || "N/A" }}</strong> &bull;
                  Sucursal:
                  <strong>{{ veh.sucursal?.nombre || "N/A" }}</strong> &bull;
                  Depto:
                  <strong>{{ veh.departamento?.nombre || "N/A" }}</strong>
                </div>
              </div>

              <div class="row items-center q-gutter-xs">
                <q-badge color="orange-9" class="q-pa-xs text-caption">
                  <q-icon name="speed" class="q-mr-xs" />
                  Último KM: {{ formatKm(veh.ultimo_km || 0) }}
                </q-badge>

                <!-- Estado / Acción rápida de Checklist Trimestral en la tarjeta -->
                <q-badge
                  v-if="getCurrentQuarterChecklist(veh)"
                  :color="
                    isChecklistComplete(getCurrentQuarterChecklist(veh))
                      ? 'positive'
                      : 'amber-9'
                  "
                  class="q-pa-xs text-caption cursor-pointer text-weight-bold"
                  @click="
                    openChecklistDetail(getCurrentQuarterChecklist(veh), veh)
                  "
                >
                  <q-icon name="task_alt" class="q-mr-xs" />
                  Checklist T{{ serverTrimestreActual }} ({{
                    getCountPresent(getCurrentQuarterChecklist(veh))
                  }}/{{ getTotalDocs(getCurrentQuarterChecklist(veh)) }})
                  <q-tooltip>
                    Checklist del trimestre actual realizado. Clic para ver detalle.
                  </q-tooltip>
                </q-badge>

                <q-btn
                  v-else
                  unelevated
                  dense
                  no-caps
                  size="sm"
                  color="deep-orange-8"
                  icon="fact_check"
                  :label="`Hacer Checklist T${serverTrimestreActual}`"
                  class="q-px-sm text-weight-bold"
                  @click="openCreateChecklist(veh)"
                >
                  <q-tooltip>
                    Pendiente en T{{ serverTrimestreActual }} ({{
                      serverAnioActual
                    }}): clic para realizar el checklist físico ahora
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Estado Vacío cuando no tiene unidades asignadas -->
    <q-card
      v-else-if="!loading"
      flat
      bordered
      class="q-ma-xs bg-white"
    >
      <q-card-section class="row items-center text-negative q-gutter-x-sm">
        <q-icon name="warning" size="24px" />
        <span class="text-subtitle2 text-weight-medium">
          Actualmente no tienes ninguna unidad vehicular asignada como responsable o usuario en el sistema.
        </span>
      </q-card-section>
    </q-card>

    <!-- Filtros de Búsqueda -->
    <q-card v-if="rows.length > 0" flat bordered class="q-ma-xs bg-white">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              outlined
              dense
              clearable
              label="Buscar en mis unidades (placa, serie, marca, modelo, sucursal...)"
              v-model="searchQuery"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="estatusExpedienteFilter"
              :options="estatusExpedienteOptions"
              label="Filtrar por Expediente / Vigencias"
              emit-value
              map-options
              clearable
              outlined
              dense
              options-dense
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="checklistFilter"
              :options="[
                {
                  label: `Checklist T${serverTrimestreActual} Realizado`,
                  value: 'realizado',
                },
                {
                  label: `Checklist T${serverTrimestreActual} Pendiente`,
                  value: 'pendiente',
                },
              ]"
              :label="`Checklist T${serverTrimestreActual} (${serverAnioActual})`"
              emit-value
              map-options
              clearable
              outlined
              dense
              options-dense
            />
          </div>

          <div class="col-12 col-md-2 flex justify-end">
            <q-btn
              v-if="searchQuery || estatusExpedienteFilter || checklistFilter"
              flat
              dense
              color="negative"
              icon="filter_alt_off"
              label="Limpiar filtros"
              @click="clearFilters"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla de Mis Unidades (Solo lectura + Expediente + Checklist + Gasolina) -->
    <q-card flat bordered class="q-ma-xs bg-white">
      <q-table
        flat
        title="Listado de Mis Unidades"
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        dense
        :loading="loading"
        :rows-per-page-options="[0]"
        no-data-label="No tienes unidades asignadas que coincidan con la búsqueda."
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row items-center no-wrap q-gutter-x-xs">
              <!-- Ver ficha informativa (Solo lectura) -->
              <q-btn
                dense
                color="teal"
                flat
                icon="visibility"
                @click="openInfo(props.row)"
              >
                <q-tooltip>Ver detalles de la unidad</q-tooltip>
              </q-btn>

              <!-- Expediente de Papeleo y Vigencias -->
              <q-btn
                dense
                color="amber-9"
                flat
                icon="folder_shared"
                @click="openExpediente(props.row)"
              >
                <q-tooltip>
                  Subir / Consultar Expediente de Papeleo (Seguro, Tarjeta, Verificación)
                </q-tooltip>
              </q-btn>

              <!-- Historial de Servicios (Solo lectura) -->
              <q-btn
                dense
                color="deep-purple"
                flat
                icon="build_circle"
                @click="openServices(props.row)"
              >
                <q-tooltip>Ver Historial de Servicios</q-tooltip>
              </q-btn>

              <!-- Checklist Trimestral: Ver si ya está o Realizar si falta -->
              <q-btn
                v-if="getCurrentQuarterChecklist(props.row)"
                dense
                color="positive"
                flat
                icon="fact_check"
                @click="
                  openChecklistDetail(
                    getCurrentQuarterChecklist(props.row),
                    props.row
                  )
                "
              >
                <q-tooltip>
                  Ver Checklist realizado de T{{ serverTrimestreActual }} ({{
                    serverAnioActual
                  }})
                </q-tooltip>
              </q-btn>
              <q-btn
                v-else
                dense
                color="deep-orange-8"
                unelevated
                size="sm"
                icon="fact_check"
                label="Checklist"
                class="q-px-sm"
                @click="openCreateChecklist(props.row)"
              >
                <q-tooltip>
                  Realizar Checklist físico de T{{ serverTrimestreActual }} ({{
                    serverAnioActual
                  }}) para {{ props.row.placas || "esta unidad" }}
                </q-tooltip>
              </q-btn>

              <!-- Solicitar Dispersión de Gasolina para esta unidad -->
              <q-btn
                dense
                color="primary"
                unelevated
                size="sm"
                icon="local_gas_station"
                label="Gasolina"
                class="q-px-sm"
                @click="openGasolinaModal(props.row)"
              >
                <q-tooltip>
                  Solicitar dispersión de gasolina para {{ props.row.placas || "esta unidad" }}
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-placas_serie="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-x-xs">
              <span class="text-weight-bold text-primary">
                {{ props.row.placas || "S/P" }}
              </span>
              <q-badge
                v-if="isResponsableOf(props.row)"
                color="amber-9"
                text-color="white"
                label="Mi Resp."
              />
            </div>
            <div class="text-caption text-grey-7 font-mono">
              {{ props.row.serie || "Sin serie" }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-vehiculo="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{
                [props.row.marca?.nombre, props.row.modelo?.nombre]
                  .filter(Boolean)
                  .join(" ") || "Unidad"
              }}
            </div>
            <div class="text-caption text-grey-7">
              {{
                [props.row.tipo?.nombre, props.row.version]
                  .filter(Boolean)
                  .join(" • ")
              }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-ultimo_km="props">
          <q-td :props="props">
            <q-badge color="orange-9" class="q-px-sm q-py-xs text-weight-bold">
              <q-icon name="speed" size="13px" class="q-mr-xs" />
              {{ formatKm(props.row.ultimo_km || 0) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            {{ props.row.sucursal?.nombre || "—" }}
          </q-td>
        </template>

        <template v-slot:body-cell-linea="props">
          <q-td :props="props">
            {{ props.row.linea?.nombre || "—" }}
          </q-td>
        </template>

        <template v-slot:body-cell-departamento="props">
          <q-td :props="props">
            {{ props.row.departamento?.nombre || "—" }}
          </q-td>
        </template>

        <template v-slot:body-cell-empleados="props">
          <q-td :props="props">
            <div
              v-for="emp in getVehicleEmpleadosList(props.row)"
              :key="emp.id"
              class="row items-center no-wrap q-gutter-x-xs"
            >
              <span
                :class="
                  props.row.responsable?.id === emp.id ||
                  emp.vehicle_id === props.row.id
                    ? 'text-weight-bold text-primary'
                    : ''
                "
              >
                {{ emp.nombreCompleto }}
              </span>
              <q-badge
                v-if="
                  props.row.responsable?.id === emp.id ||
                  emp.vehicle_id === props.row.id
                "
                color="primary"
                label="Responsable"
              />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-expediente="props">
          <q-td :props="props">
            <div
              class="row items-center no-wrap q-gutter-x-xs cursor-pointer"
              @click="openExpediente(props.row)"
            >
              <q-badge
                v-for="docItem in getRowExpedienteBadges(props.row)"
                :key="docItem.tipo"
                :color="docItem.color"
                class="q-px-xs q-py-xs text-weight-bold"
              >
                <q-icon :name="docItem.icon" size="12px" class="q-mr-xs" />
                {{ docItem.shortLabel }}
                <q-tooltip class="bg-grey-10 text-body2">
                  <div class="text-weight-bold">{{ docItem.titulo }}</div>
                  <div>
                    Estatus: <strong>{{ docItem.statusLabel }}</strong>
                  </div>
                  <div v-if="docItem.folio">
                    Folio/Póliza: {{ docItem.folio }}
                  </div>
                  <div v-if="docItem.detalle">
                    Detalle: {{ docItem.detalle }}
                  </div>
                  <div v-if="docItem.vencimiento">
                    Vence: {{ docItem.vencimiento }}
                  </div>
                  <div v-if="docItem.subidoPor">
                    Subido por: <strong>{{ docItem.subidoPor }}</strong>
                  </div>
                  <div class="text-caption text-amber-2 q-mt-xs">
                    Clic para abrir y subir documentos al expediente
                  </div>
                </q-tooltip>
              </q-badge>
            </div>
          </q-td>
        </template>

        <!-- Columna: Checklist Trimestre Actual -->
        <template v-slot:body-cell-checklist_trimestre="props">
          <q-td :props="props">
            <template v-if="getCurrentQuarterChecklist(props.row)">
              <div
                class="column q-gutter-y-xs cursor-pointer"
                @click="
                  openChecklistDetail(
                    getCurrentQuarterChecklist(props.row),
                    props.row
                  )
                "
              >
                <div class="row items-center no-wrap q-gutter-x-xs">
                  <q-badge
                    :color="
                      isChecklistComplete(getCurrentQuarterChecklist(props.row))
                        ? 'positive'
                        : 'amber-9'
                    "
                    class="q-px-sm q-py-xs text-weight-bold"
                  >
                    <q-icon
                      :name="
                        isChecklistComplete(
                          getCurrentQuarterChecklist(props.row)
                        )
                          ? 'task_alt'
                          : 'warning_amber'
                      "
                      size="13px"
                      class="q-mr-xs"
                    />
                    Realizado ({{
                      getCountPresent(getCurrentQuarterChecklist(props.row))
                    }}/{{
                      getTotalDocs(getCurrentQuarterChecklist(props.row))
                    }})
                  </q-badge>
                </div>
                <div class="row items-center q-gutter-xs">
                  <q-badge
                    v-for="docItem in getChecklistDisplayItems(
                      getCurrentQuarterChecklist(props.row)
                    )"
                    :key="docItem.documento"
                    :color="docItem.existencia ? 'green-7' : 'negative'"
                    class="q-px-xs text-weight-bold"
                  >
                    <q-icon
                      :name="docItem.existencia ? 'check' : 'close'"
                      size="10px"
                      class="q-mr-xs"
                    />
                    {{ docItem.shortLabel }}
                  </q-badge>
                </div>
                <div class="text-caption text-grey-7">
                  Fecha:
                  {{
                    formatDate(
                      getCurrentQuarterChecklist(props.row).fecha_revision
                    )
                  }}
                </div>
                <q-tooltip class="bg-grey-10 text-body2">
                  <div class="text-weight-bold">
                    Revisión T{{ serverTrimestreActual }} ({{
                      serverAnioActual
                    }}) — Folio #{{ getCurrentQuarterChecklist(props.row).id }}
                  </div>
                  <div>
                    Verificado por:
                    <strong>{{
                      getVerificadorName(
                        getCurrentQuarterChecklist(props.row).verificador
                      )
                    }}</strong>
                  </div>
                  <div class="text-caption text-amber-2 q-mt-xs">
                    Clic para ver el detalle completo del checklist
                  </div>
                </q-tooltip>
              </div>
            </template>

            <template v-else>
              <div class="row items-center no-wrap q-gutter-x-xs">
                <q-badge
                  outline
                  color="deep-orange-8"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  <q-icon name="schedule" size="13px" class="q-mr-xs" />
                  Pendiente T{{ serverTrimestreActual }}
                </q-badge>
                <q-btn
                  unelevated
                  dense
                  no-caps
                  size="sm"
                  color="deep-orange-8"
                  icon="fact_check"
                  label="Realizar"
                  class="q-px-sm text-weight-bold"
                  @click="openCreateChecklist(props.row)"
                >
                  <q-tooltip>
                    Registrar el checklist físico del trimestre T{{
                      serverTrimestreActual
                    }}
                    ({{ serverAnioActual }})
                  </q-tooltip>
                </q-btn>
              </div>
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-activo="props">
          <q-td :props="props" class="text-center">
            <q-icon
              :name="props.row.activo == 1 ? 'check_circle' : 'cancel'"
              :color="props.row.activo == 1 ? 'positive' : 'negative'"
              size="md"
            >
              <q-tooltip>
                {{ props.row.activo == 1 ? "Activo" : "Inactivo" }}
              </q-tooltip>
            </q-icon>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- DIALOG 1: Ver Ficha Informativa de la Unidad (Solo Lectura) -->
    <q-dialog
      v-model="showInfo"
      transition-show="scale"
      transition-hide="scale"
    >
      <vehicle-card :vehicle="infoVehicle" />
    </q-dialog>

    <!-- DIALOG 2: Ver Historial de Servicios de la Unidad (Solo Lectura) -->
    <q-dialog
      v-model="showServices"
      transition-show="scale"
      transition-hide="scale"
    >
      <vehicle-services-dashboard
        :vehicle="servicesVehicle"
        :loading="loadingServices"
      />
    </q-dialog>

    <!-- DIALOG 3: Expediente de Papeleo y Vigencias (Permite subir / renovar documentos, sin editar datos previos) -->
    <q-dialog
      v-model="showExpediente"
      transition-show="scale"
      transition-hide="scale"
    >
      <vehicle-expediente
        v-if="expedienteVehicle"
        :vehicle="expedienteVehicle"
        readonly-mode
        @updated="getRows"
      />
    </q-dialog>

    <!-- DIALOG 4: Registrar Nueva Solicitud de Dispersión de Gasolina -->
    <q-dialog v-model="showAddGasolina" persistent>
      <q-card style="width: 960px; max-width: 96vw">
        <q-item class="bg-primary text-white">
          <q-item-section avatar>
            <q-icon name="local_gas_station" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">
              Registrar Solicitud de Dispersión de Gasolina
            </q-item-label>
            <q-item-label
              v-if="gasolinaFixedVehicle"
              caption
              class="text-blue-1"
            >
              Unidad seleccionada:
              <strong>{{ gasolinaFixedVehicle.placas || "S/P" }}</strong> —
              {{ getVehicleNombre(gasolinaFixedVehicle) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row q-gutter-x-sm">
              <q-btn flat label="Cancelar" color="white" v-close-popup />
              <q-btn
                unelevated
                label="Enviar Solicitud"
                color="positive"
                icon="save"
                :loading="savingGasolina"
                @click="postGasolinaRow"
              />
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <gasolina-form
            v-if="showAddGasolina"
            ref="addGasolinaRef"
            :catalogs="gasolinaCatalogs"
            :fixed-vehicle-id="
              gasolinaFixedVehicle
                ? gasolinaFixedVehicle.id
                : rows.length === 1
                ? rows[0]?.id
                : null
            "
            :allowed-vehicles="rows"
            :default-solicitante-id="authStore.authUser?.empleado?.id || null"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG 5: Realizar Checklist Físico del Trimestre Actual -->
    <q-dialog v-model="showChecklistFormModal" persistent>
      <q-card style="width: 680px; max-width: 96vw" class="q-pa-none">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="row items-center no-wrap">
            <q-avatar
              icon="fact_check"
              color="white"
              text-color="primary"
              size="md"
              class="q-mr-sm"
            />
            <div class="col">
              <div class="text-h6 leading-tight">
                Realizar Checklist Trimestral (T{{ serverTrimestreActual }} -
                {{ serverAnioActual }})
              </div>
              <div class="text-caption text-blue-1">
                Verifique físicamente los documentos y placas de su unidad asignada
              </div>
            </div>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-separator />

        <q-form ref="checklistFormRef" @submit="submitChecklist">
          <q-card-section class="q-pa-md scroll" style="max-height: 76vh">
            <!-- Banner de Información Automática (Verificador, Fecha y Trimestre) -->
            <q-card
              flat
              bordered
              class="bg-blue-1 border-blue q-pa-sm q-mb-md"
            >
              <div class="row q-col-gutter-sm items-center">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Verificado por:</div>
                  <div
                    class="text-subtitle2 text-weight-bold text-primary row items-center"
                  >
                    <q-icon name="person" size="16px" class="q-mr-xs" />
                    {{ currentUserDisplayName }}
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="text-caption text-grey-7">Fecha (Automática):</div>
                  <div
                    class="text-subtitle2 text-weight-bold text-dark row items-center"
                  >
                    <q-icon
                      name="event"
                      size="16px"
                      class="q-mr-xs text-primary"
                    />
                    {{ formatDate(serverFechaActual) }}
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="text-caption text-grey-7">Trimestre:</div>
                  <q-badge
                    color="indigo-7"
                    class="q-px-sm q-py-xs text-weight-bold"
                  >
                    Trimestre {{ serverTrimestreActual }} ({{
                      serverAnioActual
                    }})
                  </q-badge>
                </div>
              </div>
            </q-card>

            <!-- 1. Unidad Vehicular a Revisar -->
            <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">
              1. Unidad Vehicular a Revisar
            </div>
            <q-card
              v-if="checklistTargetVehicle"
              flat
              bordered
              class="bg-grey-1 q-pa-sm q-mb-md"
            >
              <div class="row q-col-gutter-xs text-caption">
                <div class="col-12 col-sm-6">
                  <strong>Placas:</strong>
                  <q-badge color="primary" class="q-ml-xs text-weight-bold">
                    {{ checklistTargetVehicle.placas || "S/P" }}
                  </q-badge>
                </div>
                <div class="col-12 col-sm-6">
                  <strong>Serie:</strong>
                  {{ checklistTargetVehicle.serie || "N/A" }}
                </div>
                <div class="col-12 col-sm-6">
                  <strong>Unidad:</strong>
                  {{ getVehicleNombre(checklistTargetVehicle) }}
                </div>
                <div class="col-12 col-sm-6">
                  <strong>Sucursal / Depto:</strong>
                  {{ checklistTargetVehicle.sucursal?.nombre || "-" }} /
                  {{ checklistTargetVehicle.departamento?.nombre || "-" }}
                </div>
                <div
                  v-if="checklistTargetVehicle.responsable"
                  class="col-12 text-primary text-weight-medium"
                >
                  <strong>Responsable asignado:</strong>
                  {{ checklistTargetVehicle.responsable.nombreCompleto }}
                </div>
              </div>
            </q-card>

            <!-- 2. Checklist de Documentos en Físico -->
            <div class="row items-center justify-between q-mt-sm q-mb-xs">
              <div class="text-subtitle2 text-weight-bold text-primary">
                2. Checklist de Documentos y Placas en Físico *
              </div>
              <div class="row q-gutter-x-xs">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="positive"
                  icon="done_all"
                  label="Marcar todos Sí"
                  @click="setAllChecklist(true)"
                />
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="grey-7"
                  icon="remove_done"
                  label="Marcar todos No"
                  @click="setAllChecklist(false)"
                />
              </div>
            </div>

            <div class="text-caption text-grey-7 q-mb-sm">
              Indique si la unidad cuenta físicamente con cada uno de los siguientes elementos:
            </div>

            <div class="column q-gutter-y-sm q-mb-md">
              <q-card
                v-for="(item, idx) in checklistForm.detalles"
                :key="item.documento"
                flat
                bordered
                class="q-pa-sm transition-generic"
                :class="
                  item.existencia
                    ? 'bg-green-1 border-positive'
                    : 'bg-red-1 border-negative'
                "
              >
                <div class="row items-center justify-between no-wrap">
                  <div class="row items-center no-wrap q-gutter-x-sm">
                    <q-avatar
                      size="34px"
                      :color="item.existencia ? 'positive' : 'negative'"
                      text-color="white"
                      :icon="getDocIcon(item.documento)"
                    />
                    <div>
                      <div class="text-subtitle2 text-weight-bold text-dark">
                        {{ idx + 1 }}. {{ item.documento }}
                      </div>
                      <div class="text-caption text-grey-8">
                        {{ getDocDescription(item.documento) }}
                      </div>
                    </div>
                  </div>

                  <div class="row items-center q-gutter-x-xs no-wrap">
                    <q-btn-toggle
                      v-model="item.existencia"
                      unelevated
                      rounded
                      dense
                      toggle-color="primary"
                      :options="[
                        {
                          label: 'Sí tiene',
                          value: true,
                          icon: 'check_circle',
                        },
                        {
                          label: 'No tiene',
                          value: false,
                          icon: 'cancel',
                        },
                      ]"
                      :toggle-text-color="'white'"
                      color="white"
                      text-color="grey-8"
                      class="shadow-1"
                    />
                  </div>
                </div>
              </q-card>
            </div>

            <!-- 3. Observaciones / Notas -->
            <div class="row items-center justify-between q-mb-xs">
              <div
                class="text-subtitle2 text-weight-bold"
                :class="hasMissingDocuments ? 'text-negative' : 'text-primary'"
              >
                3. Notas u Observaciones
                {{
                  hasMissingDocuments
                    ? "(Obligatorio por documento faltante) *"
                    : "(Opcional)"
                }}
              </div>
              <q-badge
                v-if="hasMissingDocuments"
                color="negative"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                <q-icon name="warning" size="13px" class="q-mr-xs" />
                Justificar faltante(s)
              </q-badge>
            </div>
            <q-input
              v-model="checklistForm.notas"
              type="textarea"
              rows="2"
              outlined
              dense
              maxlength="255"
              counter
              :placeholder="
                hasMissingDocuments
                  ? 'Describe obligatoriamente el motivo por el cual no se cuenta con el/los documento(s) en físico...'
                  : 'Ej. Observaciones sobre el estado físico de las placas, tarjeta de circulación o holograma de verificación...'
              "
              :rules="[
                (val) =>
                  !hasMissingDocuments ||
                  (val && val.trim().length > 0) ||
                  'Debes escribir un comentario explicando por qué falta al menos un documento en físico',
              ]"
            />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-sm bg-grey-2">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              color="primary"
              icon="save"
              label="Guardar Revisión"
              :loading="submittingChecklist"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- DIALOG 6: Ver Detalle de Revisión del Trimestre Actual -->
    <q-dialog v-model="showChecklistDetailModal">
      <q-card style="width: 600px; max-width: 95vw" class="q-pa-none">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="row items-center no-wrap">
            <q-avatar
              icon="fact_check"
              color="white"
              text-color="primary"
              size="md"
              class="q-mr-sm"
            />
            <div class="col">
              <div class="text-h6 leading-tight">
                Detalle de Revisión #{{ selectedRevision?.id }}
              </div>
              <div class="text-caption text-blue-1" v-if="selectedRevision">
                Fecha: {{ formatDate(selectedRevision.fecha_revision) }} &bull;
                Trimestre {{ selectedRevision.trimestre_revision }} ({{
                  serverAnioActual
                }})
              </div>
            </div>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-card-section v-if="selectedRevision" class="q-pa-md">
          <!-- Datos del Vehículo y Verificador -->
          <q-card flat bordered class="bg-grey-1 q-pa-sm q-mb-md">
            <div class="row q-col-gutter-sm text-body2">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-7">Vehículo:</div>
                <div class="row items-center q-gutter-x-xs">
                  <q-badge color="primary" class="text-weight-bold">
                    {{ selectedRevisionVehicle?.placas || "S/P" }}
                  </q-badge>
                  <span class="text-weight-bold">
                    {{ getVehicleNombre(selectedRevisionVehicle) }}
                  </span>
                </div>
                <div class="text-caption text-grey-7">
                  Serie: {{ selectedRevisionVehicle?.serie || "N/A" }}
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-7">Verificado por:</div>
                <div class="text-weight-bold text-dark">
                  {{ getVerificadorName(selectedRevision.verificador) }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ selectedRevision.verificador?.email || "" }}
                </div>
              </div>

              <div class="col-6">
                <div class="text-caption text-grey-7">Fecha de Revisión:</div>
                <div class="text-weight-medium">
                  {{ formatDate(selectedRevision.fecha_revision) }}
                </div>
              </div>

              <div class="col-6">
                <div class="text-caption text-grey-7">Trimestre del Año:</div>
                <q-badge color="indigo-7" class="text-weight-bold">
                  Trimestre {{ selectedRevision.trimestre_revision }}
                </q-badge>
              </div>
            </div>
          </q-card>

          <!-- Lista de Documentos Revisados -->
          <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">
            Resultado del Checklist Físico:
          </div>

          <q-list bordered separator class="rounded-borders q-mb-md">
            <q-item
              v-for="det in selectedRevision.detalles"
              :key="det.id || det.documento"
              class="q-py-sm"
            >
              <q-item-section avatar>
                <q-avatar
                  size="32px"
                  :color="det.existencia ? 'positive' : 'negative'"
                  text-color="white"
                  :icon="det.existencia ? 'check' : 'close'"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ det.documento }}
                </q-item-label>
                <q-item-label caption>
                  {{ getDocDescription(det.documento) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  :color="det.existencia ? 'positive' : 'negative'"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  {{ det.existencia ? "En Físico (Sí)" : "Faltante (No)" }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Notas -->
          <div v-if="selectedRevision.notas">
            <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">
              Notas u Observaciones:
            </div>
            <q-card flat bordered class="bg-amber-1 q-pa-sm text-body2">
              {{ selectedRevision.notas }}
            </q-card>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-sm bg-grey-2">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import VehicleCard from "src/components/Vehicle/VehicleCard.vue";
import VehicleServicesDashboard from "src/components/Vehicle/VehicleServicesDashboard.vue";
import VehicleExpediente from "src/components/Vehicle/VehicleExpediente.vue";
import GasolinaForm from "src/components/CoordinacionCompras/GasolinaForm.vue";

const $q = useQuasar();
const authStore = useAuthStore();

const DEFAULT_DOCUMENTS = [
  "Placa delantera",
  "Placa trasera",
  "Tarjeta de circulación",
  "Verificación",
];

const rows = ref([]);
const loading = ref(false);

const serverFechaActual = ref(new Date().toISOString().slice(0, 10));
const serverTrimestreActual = ref(Math.ceil((new Date().getMonth() + 1) / 3));
const serverAnioActual = ref(new Date().getFullYear());
const documentosCatalog = ref([...DEFAULT_DOCUMENTS]);

const searchQuery = ref("");
const estatusExpedienteFilter = ref(null);
const checklistFilter = ref(null);

const infoVehicle = ref(null);
const showInfo = ref(false);

const servicesVehicle = ref(null);
const showServices = ref(false);
const loadingServices = ref(false);

const expedienteVehicle = ref(null);
const showExpediente = ref(false);

const showAddGasolina = ref(false);
const savingGasolina = ref(false);
const addGasolinaRef = ref(null);
const gasolinaFixedVehicle = ref(null);
const gasolinaCatalogs = ref({
  next_id: null,
  vehicles: [],
  empleados: [],
  sucursales_cargo: [],
  deptos_cargo: [],
  estatus: [],
});

const showChecklistFormModal = ref(false);
const submittingChecklist = ref(false);
const checklistFormRef = ref(null);
const checklistTargetVehicle = ref(null);
const checklistForm = ref({
  vehicle_id: null,
  notas: "",
  detalles: DEFAULT_DOCUMENTS.map((doc) => ({
    documento: doc,
    existencia: true,
  })),
});

const showChecklistDetailModal = ref(false);
const selectedRevision = ref(null);
const selectedRevisionVehicle = ref(null);

const estatusExpedienteOptions = [
  {
    label: "Requiere atención (Vencido / Por vencer / Incompleto)",
    value: "atencion",
  },
  { label: "Con documentos vencidos", value: "vencido" },
  { label: "Próximos a vencer (≤ 30 días)", value: "por_vencer" },
  { label: "Expediente incompleto", value: "incompleto" },
  { label: "Expediente al corriente (3/3)", value: "al_corriente" },
];

const columns = computed(() => [
  {
    name: "actions",
    align: "left",
    field: "actions",
    label: "Acciones",
  },
  {
    name: "placas_serie",
    align: "left",
    field: "placas_serie",
    label: "Placas / Serie",
  },
  {
    name: "vehiculo",
    align: "left",
    field: "vehiculo",
    label: "Vehículo (Marca / Modelo / Tipo / Versión)",
  },
  {
    name: "anio",
    align: "left",
    field: "anio",
    label: "Año",
  },
  {
    name: "ultimo_km",
    align: "left",
    field: "ultimo_km",
    label: "Último KM",
  },
  {
    name: "sucursal",
    align: "left",
    field: "sucursal",
    label: "Sucursal",
  },
  {
    name: "linea",
    align: "left",
    field: "linea",
    label: "Línea",
  },
  {
    name: "departamento",
    align: "left",
    field: "departamento",
    label: "Departamento",
  },
  {
    name: "empleados",
    align: "left",
    field: "empleados",
    label: "Encargados",
  },
  {
    name: "expediente",
    align: "left",
    field: "expediente",
    label: "Expediente (Seg. / Tarj. / Verif.)",
  },
  {
    name: "checklist_trimestre",
    align: "left",
    field: "checklist_trimestre",
    label: `Checklist T${serverTrimestreActual.value} (${serverAnioActual.value})`,
  },
  {
    name: "activo",
    align: "center",
    field: "activo",
    label: "Activo",
  },
]);

const currentUserDisplayName = computed(() => {
  const u = authStore.authUser;
  return u?.empleado?.nombreCompleto || u?.name || "Usuario Actual";
});

const getCurrentQuarterChecklist = (row) => {
  if (!row) return null;
  if (row.checklist_trimestre_actual) {
    return row.checklist_trimestre_actual;
  }
  if (Array.isArray(row.checklist) && row.checklist.length > 0) {
    return row.checklist[0];
  }
  return null;
};

const pendingChecklistCount = computed(() => {
  return rows.value.filter((r) => !getCurrentQuarterChecklist(r)).length;
});

const hasMissingDocuments = computed(() => {
  const detalles = Array.isArray(checklistForm.value.detalles)
    ? checklistForm.value.detalles
    : [];
  return detalles.some((d) => !d.existencia);
});

const isChecklistComplete = (checklist) => {
  const detalles = Array.isArray(checklist?.detalles) ? checklist.detalles : [];
  if (detalles.length === 0) return false;
  return detalles.every((d) => Boolean(d.existencia));
};

const getCountPresent = (checklist) => {
  const detalles = Array.isArray(checklist?.detalles) ? checklist.detalles : [];
  return detalles.filter((d) => Boolean(d.existencia)).length;
};

const getTotalDocs = (checklist) => {
  const detalles = Array.isArray(checklist?.detalles) ? checklist.detalles : [];
  return detalles.length || documentosCatalog.value.length || 4;
};

const getShortDocLabel = (docName) => {
  const lower = (docName || "").toLowerCase();
  if (lower.includes("delantera")) return "Placa Del.";
  if (lower.includes("trasera")) return "Placa Tras.";
  if (lower.includes("placas")) return "2 Placas";
  if (lower.includes("tarjeta")) return "Tarjeta Circ.";
  if (lower.includes("verificaci")) return "Verificación";
  return docName;
};

const getDocIcon = (docName) => {
  const lower = (docName || "").toLowerCase();
  if (lower.includes("placa")) return "pin";
  if (lower.includes("tarjeta")) return "badge";
  if (lower.includes("verificaci")) return "verified";
  return "description";
};

const getDocDescription = (docName) => {
  const lower = (docName || "").toLowerCase();
  if (lower.includes("delantera"))
    return "Placa metálica delantera instalada y visible en la unidad";
  if (lower.includes("trasera"))
    return "Placa metálica trasera instalada y visible en la unidad";
  if (lower.includes("tarjeta"))
    return "Tarjeta de circulación física presente dentro del vehículo";
  if (lower.includes("verificaci"))
    return "Certificado / holograma de verificación vehicular en físico";
  return "Documento físico requerido en la unidad";
};

const getChecklistDisplayItems = (checklist) => {
  const detalles = Array.isArray(checklist?.detalles) ? checklist.detalles : [];
  return detalles.map((d) => ({
    documento: d.documento,
    existencia: Boolean(d.existencia),
    shortLabel: getShortDocLabel(d.documento),
  }));
};

const getVerificadorName = (verificador) => {
  if (!verificador) return "No especificado";
  return (
    verificador.empleado?.nombreCompleto ||
    verificador.name ||
    verificador.email ||
    `Usuario #${verificador.id}`
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const clean = String(dateStr).slice(0, 10);
  const parts = clean.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return clean;
};

const setAllChecklist = (state) => {
  checklistForm.value.detalles.forEach((d) => {
    d.existencia = Boolean(state);
  });
};

const openCreateChecklist = (vehicle) => {
  if (!vehicle) return;
  checklistTargetVehicle.value = vehicle;
  checklistForm.value = {
    vehicle_id: vehicle.id,
    notas: "",
    detalles: documentosCatalog.value.map((doc) => ({
      documento: doc,
      existencia: true,
    })),
  };
  showChecklistFormModal.value = true;
};

const openChecklistDetail = (checklist, vehicle) => {
  if (!checklist) return;
  selectedRevision.value = checklist;
  selectedRevisionVehicle.value = vehicle || checklist.vehicle || null;
  showChecklistDetailModal.value = true;
};

const submitChecklist = async () => {
  const valid = await checklistFormRef.value.validate();
  if (!valid) return;

  submittingChecklist.value = true;
  try {
    const payload = {
      vehicle_id: checklistForm.value.vehicle_id,
      notas: checklistForm.value.notas,
      detalles: checklistForm.value.detalles,
    };

    const res = await sendRequest("POST", payload, "/api/vehicleChecklist", "");
    if (res) {
      showChecklistFormModal.value = false;
      $q.notify({
        type: "positive",
        message: "Checklist del trimestre actual registrado correctamente.",
        position: "top",
      });
      await getRows();
    }
  } finally {
    submittingChecklist.value = false;
  }
};

const isResponsableOf = (veh) => {
  if (!veh) return false;
  const empId = authStore.authUser?.empleado?.id;
  const empVehicleId = authStore.authUser?.empleado?.vehicle_id;
  return (
    (empVehicleId && Number(empVehicleId) === Number(veh.id)) ||
    (empId && Number(veh.responsable?.id) === Number(empId))
  );
};

const getVehicleNombre = (veh) => {
  if (!veh) return "";
  if (veh.nombre_unidad && veh.nombre_unidad !== "Unidad") {
    return veh.nombre_unidad;
  }
  const parts = [
    veh.marca?.nombre,
    veh.modelo?.nombre,
    veh.tipo?.nombre,
    veh.version,
  ]
    .map((p) => (p ? String(p).trim() : ""))
    .filter(Boolean);
  if (parts.length > 0) return parts.join(" ");
  return veh.estatus?.nombre || "Unidad";
};

const formatKm = (val) => {
  if (val === null || val === undefined || val === "") return "0 km";
  const num = Number(val);
  if (isNaN(num)) return `${val} km`;
  return `${num.toLocaleString("es-MX")} km`;
};

const getVehicleEmpleadosList = (row) => {
  const list = [...(row?.empleados || [])];
  if (
    row?.responsable &&
    !list.some((e) => Number(e.id) === Number(row.responsable.id))
  ) {
    list.unshift(row.responsable);
  }
  return list;
};

const getRowExpedienteBadges = (row) => {
  const vigentes = row?.documentos_vigentes || row?.documentosVigentes || [];
  const defs = [
    {
      tipo: "seguro",
      shortLabel: "Seg",
      titulo: "Seguro Vehicular",
      icon: "shield",
    },
    {
      tipo: "tarjeta_circulacion",
      shortLabel: "Tarj",
      titulo: "Tarjeta de Circulación",
      icon: "badge",
    },
    {
      tipo: "verificacion",
      shortLabel: "Verif",
      titulo: "Verificación Vehicular",
      icon: "eco",
    },
  ];

  return defs.map((def) => {
    const doc = vigentes.find((d) => d.tipo_documento === def.tipo);
    if (!doc) {
      return {
        ...def,
        status: "sin_registro",
        color: "grey-5",
        statusLabel: "Sin registro",
        folio: null,
        detalle: null,
        vencimiento: null,
      };
    }

    let status = "vigente";
    let color = "positive";
    let statusLabel = "Vigente";

    if (doc.estatus_vigencia === "vencido") {
      status = "vencido";
      color = "negative";
      statusLabel =
        doc.dias_restantes !== null
          ? `Vencido (hace ${Math.abs(doc.dias_restantes)} días)`
          : "Vencido";
    } else if (doc.estatus_vigencia === "por_vencer") {
      status = "por_vencer";
      color = "amber-9";
      statusLabel =
        doc.dias_restantes === 0
          ? "Por vencer (vence hoy)"
          : `Por vencer (faltan ${doc.dias_restantes} días)`;
    } else if (!doc.fecha_vencimiento) {
      statusLabel = "Vigente (Permanente)";
    } else if (doc.dias_restantes !== null) {
      statusLabel = `Vigente (${doc.dias_restantes} días restantes)`;
    }

    const cleanDate = doc.fecha_vencimiento
      ? String(doc.fecha_vencimiento)
          .substring(0, 10)
          .split("-")
          .reverse()
          .join("/")
      : "Permanente";

    const reg = doc.registrador;
    const subidoPor = reg
      ? reg.empleado?.nombreCompleto ||
        reg.name ||
        reg.email ||
        `Usuario #${reg.id}`
      : null;

    return {
      ...def,
      status,
      color,
      statusLabel,
      folio: doc.folio_o_poliza,
      detalle: doc.detalle_extra,
      vencimiento: cleanDate,
      subidoPor,
    };
  });
};

const matchesExpedienteFilter = (row, filterVal) => {
  if (!filterVal) return true;
  const badges = getRowExpedienteBadges(row);
  const hasVencido = badges.some((b) => b.status === "vencido");
  const hasPorVencer = badges.some((b) => b.status === "por_vencer");
  const hasSinRegistro = badges.some((b) => b.status === "sin_registro");
  const allVigente = badges.every((b) => b.status === "vigente");

  if (filterVal === "vencido") return hasVencido;
  if (filterVal === "por_vencer") return hasPorVencer;
  if (filterVal === "incompleto") return hasSinRegistro;
  if (filterVal === "al_corriente") return allVigente;
  if (filterVal === "atencion") {
    return hasVencido || hasPorVencer || hasSinRegistro;
  }
  return true;
};

const filteredRows = computed(() => {
  const q = (searchQuery.value || "").trim().toLowerCase();
  return rows.value.filter((row) => {
    if (!matchesExpedienteFilter(row, estatusExpedienteFilter.value)) {
      return false;
    }
    if (checklistFilter.value === "realizado" && !getCurrentQuarterChecklist(row)) {
      return false;
    }
    if (checklistFilter.value === "pendiente" && getCurrentQuarterChecklist(row)) {
      return false;
    }
    if (!q) return true;
    const target = [
      row.placas,
      row.serie,
      row.marca?.nombre,
      row.modelo?.nombre,
      row.tipo?.nombre,
      row.version,
      row.anio,
      row.sucursal?.nombre,
      row.linea?.nombre,
      row.departamento?.nombre,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return target.includes(q);
  });
});

const clearFilters = () => {
  searchQuery.value = "";
  estatusExpedienteFilter.value = null;
  checklistFilter.value = null;
};

const openInfo = async (item) => {
  infoVehicle.value = item;
  showInfo.value = true;
  const res = await sendRequest("GET", null, "/api/vehicle/" + item.id, "");
  if (res) {
    infoVehicle.value = res;
  }
};

const openServices = async (item) => {
  servicesVehicle.value = item;
  loadingServices.value = true;
  showServices.value = true;
  try {
    const res = await sendRequest("GET", null, "/api/vehicle/" + item.id, "");
    if (res) {
      servicesVehicle.value = res;
    }
  } finally {
    loadingServices.value = false;
  }
};

const openExpediente = (item) => {
  expedienteVehicle.value = item;
  showExpediente.value = true;
};

const getGasolinaForms = async () => {
  const res = await sendRequest("GET", null, "/api/gasolina/forms", "");
  if (res) {
    gasolinaCatalogs.value = {
      next_id: res.next_id || null,
      vehicles: res.vehicles || [],
      empleados: res.empleados || [],
      sucursales_cargo: res.sucursales_cargo || [],
      deptos_cargo: res.deptos_cargo || [],
      estatus: res.estatus || [],
    };
  }
};

const openGasolinaModal = (vehicle = null) => {
  gasolinaFixedVehicle.value = vehicle || null;
  getGasolinaForms();
  showAddGasolina.value = true;
};

const postGasolinaRow = async () => {
  const valid = await addGasolinaRef.value.validate();
  if (!valid) {
    dataIncomplete();
    return;
  }
  savingGasolina.value = true;
  try {
    const payload = addGasolinaRef.value.formGasolina;
    const res = await sendRequest("POST", payload, "/api/gasolina", "");
    if (res) {
      showAddGasolina.value = false;
      $q.notify({
        type: "positive",
        message: "Solicitud de dispersión de gasolina enviada correctamente.",
        position: "top",
      });
      await getRows();
    }
  } finally {
    savingGasolina.value = false;
  }
};

const getRows = async () => {
  loading.value = true;
  try {
    const res = await sendRequest("POST", {}, "/api/vehicles/auth", "");
    if (res) {
      if (Array.isArray(res.data)) {
        rows.value = res.data;
      } else if (Array.isArray(res)) {
        rows.value = res;
      } else {
        rows.value = [];
      }
      if (res.fecha_actual) serverFechaActual.value = res.fecha_actual;
      if (res.trimestre_actual) serverTrimestreActual.value = res.trimestre_actual;
      if (res.anio_actual) serverAnioActual.value = res.anio_actual;
      if (
        Array.isArray(res.documentos_checklist) &&
        res.documentos_checklist.length > 0
      ) {
        documentosCatalog.value = res.documentos_checklist;
      }
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getRows();
});
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
.border-primary {
  border: 1px solid var(--q-primary);
}
.border-positive {
  border: 1px solid #21ba45 !important;
}
.border-negative {
  border: 1px solid #c10015 !important;
}
.border-blue {
  border: 1px solid #90caf9 !important;
}
</style>
