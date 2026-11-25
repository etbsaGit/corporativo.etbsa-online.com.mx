<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Encabezado del Módulo -->
    <q-card flat bordered class="q-mb-md bg-white shadow-1">
      <q-card-section class="q-py-md q-px-lg">
        <div class="row items-center justify-between q-col-gutter-md">
          <div class="row items-center q-gutter-x-md">
            <q-avatar
              size="48px"
              font-size="28px"
              color="primary"
              text-color="white"
              icon="fact_check"
            />
            <div>
              <div class="row items-center q-gutter-x-sm">
                <div class="text-h6 text-weight-bold text-dark">
                  Revisión de Flotillas
                </div>
                <q-badge
                  :color="isFullAccess ? 'deep-purple' : 'primary'"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  <q-icon
                    :name="isFullAccess ? 'admin_panel_settings' : 'person'"
                    size="13px"
                    class="q-mr-xs"
                  />
                  {{
                    isFullAccess
                      ? "Vista General (Todas las revisiones)"
                      : "Mis Revisiones"
                  }}
                </q-badge>
              </div>
              <div class="text-caption text-grey-7">
                Verificación física trimestral de documentos y placas en unidades vehiculares (Placa delantera, Placa trasera, Tarjeta de circulación y Verificación)
              </div>
            </div>
          </div>

          <div class="row q-gutter-x-sm items-center">
            <q-btn
              :unelevated="Boolean(filters.sin_revisar_trimestre)"
              :outline="!filters.sin_revisar_trimestre"
              color="deep-orange-8"
              icon="pending_actions"
              no-caps
              dense
              class="q-px-sm text-weight-bold"
              @click="toggleSinRevisarTrimestre"
            >
              <span>
                Sin revisar en T{{ serverTrimestreActual }} ({{
                  serverAnioActual
                }})
              </span>
              <q-badge
                :color="
                  filters.sin_revisar_trimestre ? 'white' : 'deep-orange-8'
                "
                :text-color="
                  filters.sin_revisar_trimestre ? 'deep-orange-8' : 'white'
                "
                class="q-ml-xs text-weight-bolder"
              >
                {{ pendingCurrentQuarterCount }}
              </q-badge>
              <q-tooltip>
                {{
                  filters.sin_revisar_trimestre
                    ? "Filtro activo: clic para volver al listado de revisiones"
                    : "Ver unidades activas que aún no tienen revisión registrada en el trimestre actual"
                }}
              </q-tooltip>
            </q-btn>

            <q-btn
              outline
              color="primary"
              icon="refresh"
              label="Actualizar"
              dense
              class="q-px-sm"
              :loading="loading"
              @click="getRows(pagination.page)"
            />
            <q-btn
              unelevated
              color="primary"
              icon="add_circle"
              label="Nueva Revisión"
              class="q-px-md text-weight-bold"
              @click="openCreate()"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Barra de Filtros -->
    <q-card flat bordered class="q-mb-md bg-white shadow-1">
      <q-card-section class="q-py-sm q-px-md">
        <div class="row q-col-gutter-sm items-center">
          <!-- Búsqueda General -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model="filters.search"
              placeholder="Buscar placa, serie, marca, verificador, notas..."
              outlined
              dense
              clearable
              debounce="350"
              bg-color="white"
              @update:model-value="getRows(1)"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="grey-6" />
              </template>
            </q-input>
          </div>

          <!-- Vehículo -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.vehicle_id"
              :options="filteredVehicleOptions"
              label="Vehículo (Placas / Unidad)"
              option-value="id"
              :option-label="formatVehicleOptionLabel"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterVehiclesFn"
              clearable
              outlined
              dense
              options-dense
              behavior="menu"
              bg-color="white"
              @update:model-value="getRows(1)"
            >
              <template v-slot:prepend>
                <q-icon name="directions_car" color="grey-6" size="18px" />
              </template>
            </q-select>
          </div>

          <!-- Trimestre -->
          <div class="col-12 col-sm-4 col-md-2">
            <q-select
              v-model="filters.trimestre_revision"
              :options="trimestreOptions"
              label="Trimestre"
              emit-value
              map-options
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              :disable="Boolean(filters.sin_revisar_trimestre)"
              @update:model-value="getRows(1)"
            />
          </div>

          <!-- Año -->
          <div class="col-12 col-sm-4 col-md-1">
            <q-select
              v-model="filters.anio"
              :options="anioOptions"
              label="Año"
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              :disable="Boolean(filters.sin_revisar_trimestre)"
              @update:model-value="getRows(1)"
            />
          </div>

          <!-- Estado del Checklist / Sin revisar -->
          <div class="col-12 col-sm-4 col-md-2">
            <q-select
              v-model="filters.estatus_checklist"
              :options="[
                { label: 'Documentación Completa (4/4)', value: 'completo' },
                { label: 'Con Faltantes (< 4)', value: 'incompleto' },
                {
                  label: `Sin revisar en T${serverTrimestreActual} (${serverAnioActual})`,
                  value: 'sin_revisar_trimestre',
                },
              ]"
              label="Estado / Revisión"
              emit-value
              map-options
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              @update:model-value="onEstatusFilterChange"
            />
          </div>

          <!-- Limpiar Filtros -->
          <div class="col-12 col-md-1 flex justify-end">
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
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla Principal de Revisiones -->
    <q-card flat bordered class="shadow-1 bg-white">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        flat
        dense
        :rows-per-page-options="[10, 15, 25, 50]"
        no-data-label="No se encontraron revisiones registradas"
        loading-label="Cargando revisiones de flotillas..."
      >
        <!-- Columna: Folio / Fecha / Trimestre -->
        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            <template v-if="props.row.is_pending_vehicle">
              <q-badge
                color="deep-orange-8"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                <q-icon name="schedule" size="13px" class="q-mr-xs" />
                Pendiente T{{ serverTrimestreActual }} ({{ serverAnioActual }})
              </q-badge>
              <div
                v-if="props.row.ultima_revision"
                class="text-caption text-grey-7 q-mt-xs"
              >
                Últ. rev:
                {{ formatDate(props.row.ultima_revision.fecha_revision) }} (T{{
                  props.row.ultima_revision.trimestre_revision
                }})
              </div>
              <div v-else class="text-caption text-grey-5 text-italic q-mt-xs">
                Sin revisiones previas
              </div>
            </template>
            <template v-else>
              <div class="row items-center q-gutter-x-xs">
                <span class="text-weight-bold text-dark">
                  {{ formatDate(props.row.fecha_revision) }}
                </span>
                <q-badge
                  color="indigo-7"
                  class="q-px-xs text-weight-bold"
                  :label="`T${props.row.trimestre_revision || '-'}`"
                >
                  <q-tooltip>
                    Trimestre {{ props.row.trimestre_revision }} del año
                  </q-tooltip>
                </q-badge>
              </div>
              <div class="text-caption text-grey-6">
                Folio #{{ props.row.id }}
              </div>
            </template>
          </q-td>
        </template>

        <!-- Columna: Vehículo -->
        <template v-slot:body-cell-vehiculo="props">
          <q-td :props="props">
            <div class="row items-center no-wrap q-gutter-x-sm">
              <q-badge
                color="primary"
                class="text-weight-bold q-px-sm q-py-xs text-body2"
              >
                {{ props.row.vehicle?.placas || "S/P" }}
              </q-badge>
              <div>
                <div class="text-weight-bold text-dark">
                  {{ getVehicleTitle(props.row.vehicle) }}
                </div>
                <div class="text-caption text-grey-7">
                  Serie: <strong>{{ props.row.vehicle?.serie || "N/A" }}</strong>
                  <span v-if="props.row.vehicle?.anio">
                    &bull; Año: <strong>{{ props.row.vehicle.anio }}</strong>
                  </span>
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Columna: Verificador -->
        <template v-slot:body-cell-verificador="props">
          <q-td :props="props">
            <template v-if="props.row.is_pending_vehicle">
              <span class="text-caption text-grey-5 text-italic">
                Pendiente por verificar
              </span>
            </template>
            <template v-else>
              <div class="row items-center no-wrap q-gutter-x-xs">
                <q-avatar
                  size="26px"
                  color="blue-1"
                  text-color="primary"
                  icon="verified_user"
                />
                <div class="text-weight-medium text-dark text-caption">
                  {{ getVerificadorName(props.row.verificador) }}
                </div>
              </div>
            </template>
          </q-td>
        </template>

        <!-- Columna: Checklist de Documentos en Físico -->
        <template v-slot:body-cell-documentos="props">
          <q-td :props="props">
            <template v-if="props.row.is_pending_vehicle">
              <q-badge
                outline
                color="deep-orange-8"
                class="q-px-sm q-py-xs text-weight-bold"
              >
                <q-icon name="pending_actions" size="13px" class="q-mr-xs" />
                No revisado en el trimestre actual
              </q-badge>
            </template>
            <template v-else>
              <div class="row items-center q-gutter-xs">
                <q-badge
                  v-for="docItem in getChecklistDisplayItems(props.row)"
                  :key="docItem.documento"
                  :color="docItem.existencia ? 'positive' : 'negative'"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  <q-icon
                    :name="docItem.existencia ? 'check_circle' : 'cancel'"
                    size="13px"
                    class="q-mr-xs"
                  />
                  {{ docItem.shortLabel }}
                  <q-tooltip>
                    {{ docItem.documento }}:
                    <strong>{{
                      docItem.existencia
                        ? "Sí cuenta en físico"
                        : "No cuenta en físico"
                    }}</strong>
                  </q-tooltip>
                </q-badge>
              </div>
            </template>
          </q-td>
        </template>

        <!-- Columna: Resumen Cumplimiento -->
        <template v-slot:body-cell-cumplimiento="props">
          <q-td :props="props" class="text-center">
            <template v-if="props.row.is_pending_vehicle">
              <q-chip
                dense
                color="orange-1"
                text-color="deep-orange-9"
                icon="pending"
                class="text-weight-bold"
              >
                Sin revisión
              </q-chip>
            </template>
            <template v-else>
              <q-chip
                dense
                :color="isAllComplete(props.row) ? 'green-1' : 'orange-1'"
                :text-color="
                  isAllComplete(props.row) ? 'positive' : 'deep-orange-9'
                "
                :icon="isAllComplete(props.row) ? 'task_alt' : 'warning_amber'"
                class="text-weight-bold"
              >
                {{ getCountPresent(props.row) }} / {{ getTotalDocs(props.row) }}
              </q-chip>
            </template>
          </q-td>
        </template>

        <!-- Columna: Notas -->
        <template v-slot:body-cell-notas="props">
          <q-td :props="props" style="max-width: 200px">
            <template v-if="props.row.is_pending_vehicle">
              <div
                v-if="props.row.vehicle?.sucursal?.nombre"
                class="text-caption text-grey-7"
              >
                Suc: <strong>{{ props.row.vehicle.sucursal.nombre }}</strong>
              </div>
              <span v-else class="text-caption text-grey-4">-</span>
            </template>
            <template v-else>
              <div
                v-if="props.row.notas"
                class="text-caption text-grey-8 ellipsis"
              >
                {{ props.row.notas }}
                <q-tooltip>{{ props.row.notas }}</q-tooltip>
              </div>
              <span v-else class="text-caption text-grey-4 text-italic">
                Sin observaciones
              </span>
            </template>
          </q-td>
        </template>

        <!-- Columna: Acciones -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <template v-if="props.row.is_pending_vehicle">
              <q-btn
                unelevated
                dense
                no-caps
                size="sm"
                color="primary"
                icon="fact_check"
                label="Revisar Unidad"
                class="q-px-sm text-weight-bold"
                @click="openCreate(props.row.vehicle_id)"
              >
                <q-tooltip>
                  Registrar revisión para
                  {{ props.row.vehicle?.placas || "esta unidad" }}
                </q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              <div class="row items-center justify-center q-gutter-x-xs no-wrap">
                <q-btn
                  dense
                  flat
                  round
                  color="teal"
                  icon="visibility"
                  @click="openDetail(props.row)"
                >
                  <q-tooltip>Ver detalle de la revisión</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="canModifyRow(props.row)"
                  dense
                  flat
                  round
                  color="primary"
                  icon="edit_square"
                  @click="openEdit(props.row)"
                >
                  <q-tooltip>Editar revisión</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="canModifyRow(props.row)"
                  dense
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmDelete(props.row)"
                >
                  <q-tooltip>Eliminar revisión</q-tooltip>
                </q-btn>
              </div>
            </template>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- =============================================================== -->
    <!-- MODAL 1: CREAR / EDITAR REVISIÓN DE FLOTILLA                    -->
    <!-- =============================================================== -->
    <q-dialog v-model="showFormModal" persistent>
      <q-card style="width: 680px; max-width: 96vw" class="q-pa-none">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="row items-center no-wrap">
            <q-avatar
              :icon="isEditing ? 'edit_square' : 'fact_check'"
              color="white"
              text-color="primary"
              size="md"
              class="q-mr-sm"
            />
            <div class="col">
              <div class="text-h6 leading-tight">
                {{
                  isEditing
                    ? `Editar Revisión #${editingId}`
                    : "Nueva Revisión de Vehículo"
                }}
              </div>
              <div class="text-caption text-blue-1">
                Verifique físicamente los documentos y placas de la unidad
              </div>
            </div>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-separator />

        <q-form ref="checklistFormRef" @submit="submitChecklist">
          <q-card-section
            class="q-pa-md scroll"
            style="max-height: 76vh"
          >
            <!-- Banner de Información Automática (Verificador, Fecha y Trimestre) -->
            <q-card
              flat
              bordered
              class="bg-blue-1 border-blue q-pa-sm q-mb-md"
            >
              <div class="row q-col-gutter-sm items-center">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Verificado por:</div>
                  <div class="text-subtitle2 text-weight-bold text-primary row items-center">
                    <q-icon name="person" size="16px" class="q-mr-xs" />
                    {{ currentUserDisplayName }}
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="text-caption text-grey-7">Fecha (Automática):</div>
                  <div class="text-subtitle2 text-weight-bold text-dark row items-center">
                    <q-icon name="event" size="16px" class="q-mr-xs text-primary" />
                    {{ formatDate(displayFecha) }}
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="text-caption text-grey-7">Trimestre:</div>
                  <q-badge
                    color="indigo-7"
                    class="q-px-sm q-py-xs text-weight-bold"
                  >
                    Trimestre {{ displayTrimestre }} ({{ displayAnio }})
                  </q-badge>
                </div>
              </div>
            </q-card>

            <!-- 1. Selección del Vehículo -->
            <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">
              1. Unidad Vehicular a Revisar *
            </div>
            <q-select
              v-model="form.vehicle_id"
              :options="filteredModalVehicles"
              label="Seleccionar Vehículo (Buscar por placa, serie, marca o modelo) *"
              option-value="id"
              :option-label="formatVehicleOptionLabel"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterModalVehiclesFn"
              outlined
              dense
              options-dense
              clearable
              behavior="menu"
              :rules="[(val) => !!val || 'Debes seleccionar un vehículo']"
            >
              <template v-slot:prepend>
                <q-icon name="directions_car" color="primary" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-badge color="primary" class="text-weight-bold q-px-sm">
                      {{ scope.opt.placas || "S/P" }}
                    </q-badge>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ getVehicleTitle(scope.opt) }}
                    </q-item-label>
                    <q-item-label caption>
                      Serie: {{ scope.opt.serie || "N/A" }} &bull; Sucursal:
                      {{ scope.opt.sucursal?.nombre || "N/A" }}
                      <span v-if="scope.opt.responsable">
                        &bull; Resp: {{ scope.opt.responsable.nombreCompleto }}
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!-- Tarjeta resumen del vehículo seleccionado -->
            <q-card
              v-if="selectedVehicleInfo"
              flat
              bordered
              class="bg-grey-1 q-pa-sm q-mb-md"
            >
              <div class="row q-col-gutter-xs text-caption">
                <div class="col-12 col-sm-6">
                  <strong>Placas:</strong>
                  <q-badge color="primary" class="q-ml-xs text-weight-bold">
                    {{ selectedVehicleInfo.placas || "S/P" }}
                  </q-badge>
                </div>
                <div class="col-12 col-sm-6">
                  <strong>Serie:</strong> {{ selectedVehicleInfo.serie || "N/A" }}
                </div>
                <div class="col-12 col-sm-6">
                  <strong>Unidad:</strong> {{ getVehicleTitle(selectedVehicleInfo) }}
                </div>
                <div class="col-12 col-sm-6">
                  <strong>Sucursal / Depto:</strong>
                  {{ selectedVehicleInfo.sucursal?.nombre || "-" }} /
                  {{ selectedVehicleInfo.departamento?.nombre || "-" }}
                </div>
                <div
                  v-if="selectedVehicleInfo.responsable"
                  class="col-12 text-primary text-weight-medium"
                >
                  <strong>Responsable asignado:</strong>
                  {{ selectedVehicleInfo.responsable.nombreCompleto }}
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
                v-for="(item, idx) in form.detalles"
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
                {{ hasMissingDocuments ? "(Obligatorio por documento faltante) *" : "(Opcional)" }}
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
              v-model="form.notas"
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
              :label="isEditing ? 'Actualizar Revisión' : 'Guardar Revisión'"
              :loading="submitting"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- =============================================================== -->
    <!-- MODAL 2: VER DETALLE DE LA REVISIÓN                             -->
    <!-- =============================================================== -->
    <q-dialog v-model="showDetailModal">
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
                Trimestre {{ selectedRevision.trimestre_revision }}
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
                    {{ selectedRevision.vehicle?.placas || "S/P" }}
                  </q-badge>
                  <span class="text-weight-bold">
                    {{ getVehicleTitle(selectedRevision.vehicle) }}
                  </span>
                </div>
                <div class="text-caption text-grey-7">
                  Serie: {{ selectedRevision.vehicle?.serie || "N/A" }}
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
              :key="det.id"
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
import {
  sendRequest,
  checkRole,
  checkPermissions,
} from "src/boot/functions";

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
const submitting = ref(false);

const vehiclesCatalog = ref([]);
const filteredVehicleOptions = ref([]);
const filteredModalVehicles = ref([]);
const documentosCatalog = ref([...DEFAULT_DOCUMENTS]);
const canViewAllBackend = ref(false);

const serverFechaActual = ref(new Date().toISOString().slice(0, 10));
const serverTrimestreActual = ref(Math.ceil((new Date().getMonth() + 1) / 3));
const serverAnioActual = ref(new Date().getFullYear());
const pendingCurrentQuarterCount = ref(0);

const showFormModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const editingRow = ref(null);
const checklistFormRef = ref(null);

const showDetailModal = ref(false);
const selectedRevision = ref(null);

const filters = ref({
  search: null,
  vehicle_id: null,
  trimestre_revision: null,
  anio: null,
  estatus_checklist: null,
  sin_revisar_trimestre: false,
});

const pagination = ref({
  sortBy: "id",
  descending: true,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
});

const trimestreOptions = [
  { label: "1er Trimestre (Ene - Mar)", value: 1 },
  { label: "2do Trimestre (Abr - Jun)", value: 2 },
  { label: "3er Trimestre (Jul - Sep)", value: 3 },
  { label: "4to Trimestre (Oct - Dic)", value: 4 },
];

const anioOptions = computed(() => {
  const currentYear = serverAnioActual.value || new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 4; y--) {
    years.push(y);
  }
  return years;
});

const isFullAccess = computed(() => {
  return (
    canViewAllBackend.value ||
    checkRole("Admin") ||
    checkRole("vehicles.checklist") ||
    checkPermissions("vehicles.checklist")
  );
});

const currentUserDisplayName = computed(() => {
  if (isEditing.value && editingRow.value?.verificador) {
    return getVerificadorName(editingRow.value.verificador);
  }
  const u = authStore.authUser;
  return u?.empleado?.nombreCompleto || u?.name || "Usuario Actual";
});

const displayFecha = computed(() => {
  if (isEditing.value && editingRow.value?.fecha_revision) {
    return editingRow.value.fecha_revision;
  }
  return serverFechaActual.value;
});

const displayTrimestre = computed(() => {
  if (isEditing.value && editingRow.value?.trimestre_revision) {
    return editingRow.value.trimestre_revision;
  }
  return serverTrimestreActual.value;
});

const displayAnio = computed(() => {
  if (isEditing.value && editingRow.value?.fecha_revision) {
    return String(editingRow.value.fecha_revision).slice(0, 4);
  }
  return serverAnioActual.value;
});

const form = ref({
  vehicle_id: null,
  notas: "",
  detalles: DEFAULT_DOCUMENTS.map((doc) => ({
    documento: doc,
    existencia: false,
  })),
});

const selectedVehicleInfo = computed(() => {
  if (!form.value.vehicle_id) return null;
  return (
    vehiclesCatalog.value.find(
      (v) => Number(v.id) === Number(form.value.vehicle_id)
    ) || null
  );
});

const hasMissingDocuments = computed(() => {
  const detalles = Array.isArray(form.value.detalles)
    ? form.value.detalles
    : [];
  return detalles.some((d) => !d.existencia);
});

const hasActiveFilters = computed(() => {
  return Boolean(
    filters.value.search ||
      filters.value.vehicle_id ||
      filters.value.trimestre_revision ||
      filters.value.anio ||
      filters.value.estatus_checklist ||
      filters.value.sin_revisar_trimestre
  );
});

const toggleSinRevisarTrimestre = () => {
  const nextState = !filters.value.sin_revisar_trimestre;
  filters.value.sin_revisar_trimestre = nextState;
  if (nextState) {
    filters.value.estatus_checklist = "sin_revisar_trimestre";
    filters.value.trimestre_revision = null;
    filters.value.anio = null;
  } else if (filters.value.estatus_checklist === "sin_revisar_trimestre") {
    filters.value.estatus_checklist = null;
  }
  getRows(1);
};

const onEstatusFilterChange = (val) => {
  if (val === "sin_revisar_trimestre") {
    filters.value.sin_revisar_trimestre = true;
    filters.value.trimestre_revision = null;
    filters.value.anio = null;
  } else {
    filters.value.sin_revisar_trimestre = false;
  }
  getRows(1);
};

const columns = [
  {
    name: "fecha",
    label: "Fecha / Trimestre",
    align: "left",
    field: "fecha_revision",
  },
  {
    name: "vehiculo",
    label: "Vehículo (Placas / Unidad)",
    align: "left",
    field: "vehicle_id",
  },
  {
    name: "verificador",
    label: "Verificado por",
    align: "left",
    field: "verificador_id",
  },
  {
    name: "documentos",
    label: "Checklist Físico (Placas, Tarjeta y Verificación)",
    align: "left",
    field: "documentos",
  },
  {
    name: "cumplimiento",
    label: "Cumplimiento",
    align: "center",
    field: "cumplimiento",
  },
  {
    name: "notas",
    label: "Notas",
    align: "left",
    field: "notas",
  },
  {
    name: "actions",
    label: "Acciones",
    align: "center",
    field: "actions",
  },
];

const getVehicleTitle = (v) => {
  if (!v) return "Unidad";
  const parts = [
    v.marca?.nombre,
    v.modelo?.nombre,
    v.tipo?.nombre,
    v.version,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : v.nombre_unidad || "Unidad";
};

const formatVehicleOptionLabel = (v) => {
  if (!v) return "";
  const placa = v.placas || "S/P";
  const title = getVehicleTitle(v);
  const suc = v.sucursal?.nombre ? ` - ${v.sucursal.nombre}` : "";
  return `${placa} (${title})${suc}`;
};

const filterVehiclesFn = (val, update) => {
  update(() => {
    if (!val) {
      filteredVehicleOptions.value = vehiclesCatalog.value;
      return;
    }
    const needle = val.toLowerCase();
    filteredVehicleOptions.value = vehiclesCatalog.value.filter((v) =>
      formatVehicleOptionLabel(v).toLowerCase().includes(needle) ||
      (v.serie && v.serie.toLowerCase().includes(needle))
    );
  });
};

const filterModalVehiclesFn = (val, update) => {
  update(() => {
    if (!val) {
      filteredModalVehicles.value = vehiclesCatalog.value;
      return;
    }
    const needle = val.toLowerCase();
    filteredModalVehicles.value = vehiclesCatalog.value.filter(
      (v) =>
        formatVehicleOptionLabel(v).toLowerCase().includes(needle) ||
        (v.serie && v.serie.toLowerCase().includes(needle)) ||
        (v.responsable?.nombreCompleto &&
          v.responsable.nombreCompleto.toLowerCase().includes(needle))
    );
  });
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

const getChecklistDisplayItems = (row) => {
  const detalles = Array.isArray(row?.detalles) ? row.detalles : [];
  return detalles.map((d) => ({
    documento: d.documento,
    existencia: Boolean(d.existencia),
    shortLabel: getShortDocLabel(d.documento),
  }));
};

const getCountPresent = (row) => {
  const detalles = Array.isArray(row?.detalles) ? row.detalles : [];
  return detalles.filter((d) => Boolean(d.existencia)).length;
};

const getTotalDocs = (row) => {
  const detalles = Array.isArray(row?.detalles) ? row.detalles : [];
  return detalles.length || documentosCatalog.value.length || 4;
};

const isAllComplete = (row) => {
  const detalles = Array.isArray(row?.detalles) ? row.detalles : [];
  if (detalles.length === 0) return false;
  return detalles.every((d) => Boolean(d.existencia));
};

const canModifyRow = () => {
  return isFullAccess.value;
};

const setAllChecklist = (state) => {
  form.value.detalles.forEach((d) => {
    d.existencia = Boolean(state);
  });
};

const loadForms = async () => {
  try {
    const res = await sendRequest("GET", null, "/api/vehicleChecklist/forms", "");
    if (res) {
      vehiclesCatalog.value = res.vehicles || [];
      filteredVehicleOptions.value = vehiclesCatalog.value;
      filteredModalVehicles.value = vehiclesCatalog.value;
      if (
        Array.isArray(res.documentos_checklist) &&
        res.documentos_checklist.length > 0
      ) {
        documentosCatalog.value = res.documentos_checklist;
      }
      canViewAllBackend.value = Boolean(res.can_view_all);
      if (res.fecha_actual) serverFechaActual.value = res.fecha_actual;
      if (res.trimestre_actual) serverTrimestreActual.value = res.trimestre_actual;
      if (res.anio_actual) serverAnioActual.value = res.anio_actual;
      if (typeof res.pending_current_quarter_count === "number") {
        pendingCurrentQuarterCount.value = res.pending_current_quarter_count;
      }
    }
  } catch (e) {
    // Error manejado por sendRequest
  }
};

const getRows = async (page = 1) => {
  loading.value = true;
  try {
    const payload = {
      ...filters.value,
      estatus_checklist:
        filters.value.estatus_checklist === "sin_revisar_trimestre"
          ? null
          : filters.value.estatus_checklist,
      page,
      per_page: pagination.value.rowsPerPage,
    };
    const res = await sendRequest(
      "POST",
      payload,
      `/api/vehiclesChecklists?page=${page}`,
      ""
    );
    if (res) {
      rows.value = res.data || [];
      pagination.value.page = res.current_page || page;
      pagination.value.rowsNumber = res.total || 0;
      if (typeof res.pending_current_quarter_count === "number") {
        pendingCurrentQuarterCount.value = res.pending_current_quarter_count;
      }
    }
  } finally {
    loading.value = false;
  }
};

const onRequest = (props) => {
  const { page, rowsPerPage } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  getRows(page);
};

const clearFilters = () => {
  filters.value = {
    search: null,
    vehicle_id: null,
    trimestre_revision: null,
    anio: null,
    estatus_checklist: null,
    sin_revisar_trimestre: false,
  };
  getRows(1);
};

const openCreate = (preselectedVehicleId = null) => {
  isEditing.value = false;
  editingId.value = null;
  editingRow.value = null;
  form.value = {
    vehicle_id:
      typeof preselectedVehicleId === "number" ? preselectedVehicleId : null,
    notas: "",
    detalles: documentosCatalog.value.map((doc) => ({
      documento: doc,
      existencia: true,
    })),
  };
  showFormModal.value = true;
};

const openEdit = (row) => {
  isEditing.value = true;
  editingId.value = row.id;
  editingRow.value = row;

  const existingDetalles = Array.isArray(row.detalles) ? row.detalles : [];
  const mappedDetalles = documentosCatalog.value.map((docName) => {
    const found = existingDetalles.find(
      (d) =>
        (d.documento || "").toLowerCase().trim() ===
        docName.toLowerCase().trim()
    );
    return {
      documento: docName,
      existencia: found ? Boolean(found.existencia) : false,
    };
  });

  // Incluir cualquier otro documento guardado que no esté en el catálogo base
  existingDetalles.forEach((d) => {
    const existsInMapped = mappedDetalles.some(
      (m) =>
        m.documento.toLowerCase().trim() ===
        (d.documento || "").toLowerCase().trim()
    );
    if (!existsInMapped && d.documento) {
      mappedDetalles.push({
        documento: d.documento,
        existencia: Boolean(d.existencia),
      });
    }
  });

  form.value = {
    vehicle_id: row.vehicle_id,
    notas: row.notas || "",
    detalles: mappedDetalles,
  };

  showFormModal.value = true;
};

const openDetail = (row) => {
  selectedRevision.value = row;
  showDetailModal.value = true;
};

const submitChecklist = async () => {
  const valid = await checklistFormRef.value.validate();
  if (!valid) return;

  submitting.value = true;
  try {
    const payload = {
      vehicle_id: form.value.vehicle_id,
      notas: form.value.notas,
      detalles: form.value.detalles,
    };

    if (isEditing.value && editingId.value) {
      await sendRequest(
        "PUT",
        payload,
        `/api/vehicleChecklist/${editingId.value}`,
        ""
      );
    } else {
      await sendRequest("POST", payload, "/api/vehicleChecklist", "");
    }

    showFormModal.value = false;
    await getRows(isEditing.value ? pagination.value.page : 1);
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (row) => {
  $q.dialog({
    title: "Eliminar Revisión",
    message: `¿Estás seguro de eliminar la revisión #${row.id} del vehículo ${
      row.vehicle?.placas || ""
    }?`,
    cancel: {
      label: "Cancelar",
      flat: true,
      color: "grey-8",
    },
    ok: {
      label: "Eliminar",
      color: "negative",
      unelevated: true,
    },
    persistent: true,
  }).onOk(async () => {
    await sendRequest("DELETE", null, `/api/vehicleChecklist/${row.id}`, "");
    getRows(pagination.value.page);
  });
};

onMounted(async () => {
  await loadForms();
  await getRows(1);
});
</script>

<style scoped>
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
