<template>
  <q-card style="width: 1080px; max-width: 96vw" class="q-pa-none bg-grey-1">
    <!-- Encabezado Principal -->
    <q-card-section class="bg-primary text-white q-py-sm q-px-md">
      <div class="row items-center no-wrap">
        <q-avatar
          icon="folder_shared"
          color="white"
          text-color="primary"
          size="42px"
          class="q-mr-md shadow-2"
        />
        <div class="col">
          <div class="row items-center q-gutter-x-sm">
            <div class="text-h6 text-weight-bold leading-tight">
              Expediente de Papeleo y Vigencias
            </div>
            <q-badge
              :color="resumenGeneral.color"
              class="q-px-sm q-py-xs text-weight-bold"
            >
              <q-icon :name="resumenGeneral.icon" size="14px" class="q-mr-xs" />
              {{ resumenGeneral.label }}
            </q-badge>
          </div>
          <div
            class="text-caption text-blue-1 q-mt-xs flex items-center q-gutter-x-md wrap"
          >
            <span>
              <q-icon name="pin" size="14px" class="q-mr-xs" />
              Placa:
              <strong class="text-white">{{
                vehicle?.placas || "Sin placa"
              }}</strong>
            </span>
            <span v-if="vehicle?.serie">
              <q-icon name="tag" size="14px" class="q-mr-xs" />
              Serie:
              <strong class="text-white font-mono">{{ vehicle.serie }}</strong>
            </span>
            <span v-if="vehicleNombre">
              <q-icon name="directions_car" size="14px" class="q-mr-xs" />
              Unidad:
              <strong class="text-white">{{ vehicleNombre }}</strong>
            </span>
            <span v-if="vehicle?.sucursal?.nombre">
              <q-icon name="store" size="14px" class="q-mr-xs" />
              Sucursal:
              <strong class="text-white">{{ vehicle.sucursal.nombre }}</strong>
            </span>
          </div>
        </div>

        <div class="row items-center q-gutter-x-sm">
          <q-btn
            unelevated
            color="white"
            text-color="primary"
            icon="add_circle"
            label="Registrar Documento"
            class="text-weight-bold"
            @click="openCreateDialog()"
          />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Estado de Carga -->
    <div v-if="loading" class="q-pa-xl text-center">
      <q-spinner-dots color="primary" size="3em" />
      <div class="text-subtitle2 text-grey-7 q-mt-sm">
        Cargando expediente documental de la unidad...
      </div>
    </div>

    <q-card-section
      v-else
      class="q-pa-md scroll"
      style="max-height: 82vh"
    >
      <!-- SECCIÓN 1: Tarjetas de Semáforo de Vigencias Actuales -->
      <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm flex items-center justify-between">
        <div class="flex items-center">
          <q-icon name="verified_user" size="18px" class="q-mr-xs" />
          Estado Actual de Documentos Obligatorios
        </div>
        <div class="text-caption text-grey-7">
          Semáforo automático:
          <q-badge color="positive" label="Vigente (> 30 días)" class="q-mx-xs" />
          <q-badge color="amber-9" label="Por vencer (≤ 30 días)" class="q-mx-xs" />
          <q-badge color="negative" label="Vencido" class="q-mx-xs" />
          <q-badge color="grey-6" label="Sin registro" class="q-ml-xs" />
        </div>
      </div>

      <div class="row q-col-gutter-md q-mb-lg">
        <div
          v-for="cat in categoriasConfig"
          :key="cat.tipo"
          class="col-12 col-md-4"
        >
          <q-card
            flat
            bordered
            class="full-height column justify-between doc-status-card bg-white"
            :class="`border-top-${getSemaforoInfo(vigentesMap[cat.tipo]).color}`"
          >
            <q-card-section class="q-pa-md">
              <!-- Cabecera de la categoría -->
              <div class="row items-start justify-between no-wrap q-mb-sm">
                <div class="row items-center no-wrap">
                  <q-avatar
                    :color="`${getSemaforoInfo(vigentesMap[cat.tipo]).bgSoft}`"
                    :text-color="getSemaforoInfo(vigentesMap[cat.tipo]).color"
                    :icon="cat.icon"
                    size="42px"
                    class="q-mr-sm"
                  />
                  <div>
                    <div class="text-subtitle1 text-weight-bold text-dark leading-tight">
                      {{ cat.titulo }}
                    </div>
                    <div class="text-caption text-grey-6">
                      {{ cat.subtitulo }}
                    </div>
                  </div>
                </div>

                <q-badge
                  :color="getSemaforoInfo(vigentesMap[cat.tipo]).color"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  <q-icon
                    :name="getSemaforoInfo(vigentesMap[cat.tipo]).icon"
                    size="13px"
                    class="q-mr-xs"
                  />
                  {{ getSemaforoInfo(vigentesMap[cat.tipo]).badge }}
                </q-badge>
              </div>

              <q-separator class="q-my-sm" />

              <!-- Cuerpo con datos del documento vigente -->
              <template v-if="vigentesMap[cat.tipo]">
                <div class="q-gutter-y-xs text-body2">
                  <div class="row justify-between items-center">
                    <span class="text-caption text-grey-7">{{ cat.labelFolio }}:</span>
                    <span class="text-weight-bold text-dark font-mono">
                      {{ vigentesMap[cat.tipo].folio_o_poliza || "No especificado" }}
                    </span>
                  </div>

                  <div class="row justify-between items-center">
                    <span class="text-caption text-grey-7">{{ cat.labelDetalle }}:</span>
                    <span class="text-weight-medium text-grey-9 ellipsis" style="max-width: 190px">
                      {{ vigentesMap[cat.tipo].detalle_extra || "No especificado" }}
                    </span>
                  </div>

                  <div class="row justify-between items-center">
                    <span class="text-caption text-grey-7">{{ cat.labelEmision }}:</span>
                    <span class="text-weight-medium text-dark">
                      {{ formatFecha(vigentesMap[cat.tipo].fecha_emision) }}
                    </span>
                  </div>

                  <div class="row justify-between items-center">
                    <span class="text-caption text-grey-7">{{ cat.labelVencimiento }}:</span>
                    <span
                      class="text-weight-bold"
                      :class="`text-${getSemaforoInfo(vigentesMap[cat.tipo]).color}`"
                    >
                      {{
                        vigentesMap[cat.tipo].fecha_vencimiento
                          ? formatFecha(vigentesMap[cat.tipo].fecha_vencimiento)
                          : "Permanente (Sin vencimiento)"
                      }}
                    </span>
                  </div>

                  <!-- Banner de días restantes / vencidos -->
                  <div
                    class="q-mt-sm q-pa-xs rounded-borders text-center text-caption text-weight-bold"
                    :class="`bg-${getSemaforoInfo(vigentesMap[cat.tipo]).bgSoft} text-${getSemaforoInfo(vigentesMap[cat.tipo]).color}`"
                  >
                    {{ getSemaforoInfo(vigentesMap[cat.tipo]).mensajeDias }}
                  </div>

                  <div
                    v-if="vigentesMap[cat.tipo].observaciones"
                    class="text-caption text-grey-7 q-mt-xs bg-grey-1 q-pa-xs rounded-borders"
                  >
                    <q-icon name="notes" size="13px" class="q-mr-xs" />
                    {{ vigentesMap[cat.tipo].observaciones }}
                  </div>
                </div>
              </template>

              <!-- Estado vacío si aún no se ha registrado este documento -->
              <template v-else>
                <div class="text-center q-py-md text-grey-6">
                  <q-icon name="error_outline" size="32px" color="grey-5" />
                  <div class="text-body2 text-weight-medium q-mt-xs">
                    Sin {{ cat.titulo.toLowerCase() }} registrado
                  </div>
                  <div class="text-caption text-grey-5">
                    Registra el documento actual para activar el control de vigencia.
                  </div>
                </div>
              </template>
            </q-card-section>

            <!-- Acciones de la tarjeta -->
            <q-card-actions
              align="between"
              class="q-px-md q-py-sm bg-grey-1 border-top-light"
            >
              <template v-if="vigentesMap[cat.tipo]">
                <div class="row q-gutter-x-xs">
                  <q-btn
                    v-if="vigentesMap[cat.tipo].archivo_url"
                    dense
                    unelevated
                    color="teal-7"
                    icon="visibility"
                    label="Ver Archivo"
                    size="sm"
                    class="q-px-sm"
                    @click="openPreview(vigentesMap[cat.tipo])"
                  >
                    <q-tooltip>Ver o descargar documento adjunto</q-tooltip>
                  </q-btn>
                  <q-badge
                    v-else
                    color="grey-4"
                    text-color="grey-8"
                    label="Sin archivo adjunto"
                    class="q-py-xs"
                  />

                  <q-btn
                    dense
                    flat
                    color="primary"
                    icon="edit"
                    size="sm"
                    @click="openEditDialog(vigentesMap[cat.tipo])"
                  >
                    <q-tooltip>Editar datos de este registro</q-tooltip>
                  </q-btn>
                </div>

                <q-btn
                  dense
                  unelevated
                  color="primary"
                  icon="autorenew"
                  :label="cat.btnRenovar"
                  size="sm"
                  class="q-px-sm"
                  @click="openCreateDialog(cat.tipo, true)"
                >
                  <q-tooltip>
                    Registrar renovación (el documento actual pasará al historial)
                  </q-tooltip>
                </q-btn>
              </template>

              <template v-else>
                <q-space />
                <q-btn
                  dense
                  unelevated
                  color="primary"
                  icon="add"
                  :label="`Registrar ${cat.titulo}`"
                  size="sm"
                  class="full-width q-py-xs"
                  @click="openCreateDialog(cat.tipo, false)"
                />
              </template>
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- SECCIÓN 2: Historial Completo de Documentos del Vehículo -->
      <q-card flat bordered class="bg-white">
        <q-card-section class="q-py-sm q-px-md row items-center justify-between wrap q-col-gutter-sm">
          <div class="row items-center">
            <q-icon name="history" color="primary" size="20px" class="q-mr-xs" />
            <span class="text-subtitle2 text-weight-bold text-primary">
              Historial de Expediente de la Unidad
            </span>
            <q-badge
              color="primary"
              outline
              class="q-ml-sm"
              :label="`${filteredDocumentos.length} registro(s)`"
            />
          </div>

          <div class="row items-center q-gutter-sm">
            <q-btn-toggle
              v-model="filtroTipo"
              unelevated
              dense
              no-caps
              toggle-color="primary"
              color="grey-2"
              text-color="grey-8"
              :options="[
                { label: 'Todos', value: 'todos' },
                { label: 'Seguros', value: 'seguro' },
                { label: 'Tarjetas Circ.', value: 'tarjeta_circulacion' },
                { label: 'Verificaciones', value: 'verificacion' },
              ]"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-table
          flat
          :rows="filteredDocumentos"
          :columns="historialColumns"
          row-key="id"
          dense
          :pagination="{ rowsPerPage: 10 }"
          :rows-per-page-options="[10, 20, 0]"
          no-data-label="No hay documentos registrados en esta categoría."
        >
          <template v-slot:body-cell-tipo_documento="props">
            <q-td :props="props">
              <div class="row items-center no-wrap q-gutter-x-xs">
                <q-icon
                  :name="getCategoriaMeta(props.row.tipo_documento).icon"
                  color="primary"
                  size="18px"
                />
                <span class="text-weight-bold text-dark">
                  {{ getCategoriaMeta(props.row.tipo_documento).titulo }}
                </span>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-folio_detalle="props">
            <q-td :props="props">
              <div class="text-weight-bold text-dark font-mono">
                {{ props.row.folio_o_poliza || "S/F" }}
              </div>
              <div class="text-caption text-grey-7">
                {{ props.row.detalle_extra || "—" }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-fecha_emision="props">
            <q-td :props="props">
              {{ formatFecha(props.row.fecha_emision) }}
            </q-td>
          </template>

          <template v-slot:body-cell-fecha_vencimiento="props">
            <q-td :props="props">
              <span v-if="props.row.fecha_vencimiento" class="text-weight-medium">
                {{ formatFecha(props.row.fecha_vencimiento) }}
              </span>
              <q-badge
                v-else
                color="teal-7"
                outline
                label="Permanente"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-estatus="props">
            <q-td :props="props">
              <template v-if="props.row.es_vigente">
                <q-badge
                  :color="getSemaforoInfo(props.row).color"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  <q-icon
                    :name="getSemaforoInfo(props.row).icon"
                    size="12px"
                    class="q-mr-xs"
                  />
                  Actual: {{ getSemaforoInfo(props.row).badge }}
                </q-badge>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ getSemaforoInfo(props.row).mensajeDias }}
                </div>
              </template>
              <template v-else>
                <q-badge
                  color="grey-6"
                  text-color="white"
                  class="q-px-sm q-py-xs"
                >
                  <q-icon name="inventory_2" size="12px" class="q-mr-xs" />
                  Histórico / Anterior
                </q-badge>
              </template>
            </q-td>
          </template>

          <template v-slot:body-cell-observaciones="props">
            <q-td :props="props" style="max-width: 220px">
              <div class="ellipsis text-caption text-grey-8">
                {{ props.row.observaciones || "—" }}
              </div>
              <q-tooltip v-if="props.row.observaciones">
                {{ props.row.observaciones }}
              </q-tooltip>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="text-right">
              <q-btn
                v-if="props.row.archivo_url"
                dense
                flat
                color="teal-7"
                icon="visibility"
                @click="openPreview(props.row)"
              >
                <q-tooltip>Ver archivo adjunto</q-tooltip>
              </q-btn>

              <q-btn
                v-if="!props.row.es_vigente"
                dense
                flat
                color="positive"
                icon="check_circle_outline"
                @click="setComoVigente(props.row)"
              >
                <q-tooltip>Marcar este registro como el documento vigente actual</q-tooltip>
              </q-btn>

              <q-btn
                dense
                flat
                color="primary"
                icon="edit"
                @click="openEditDialog(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn
                dense
                flat
                color="negative"
                icon="delete"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Eliminar registro</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </q-card-section>

    <!-- DIALOG: Crear / Renovar / Editar Documento -->
    <q-dialog v-model="showFormDialog" persistent>
      <q-card style="width: 600px; max-width: 95vw" class="q-pa-none">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="row items-center no-wrap">
            <q-avatar
              :icon="isEditing ? 'edit' : isRenewal ? 'autorenew' : 'note_add'"
              color="white"
              text-color="primary"
              size="md"
              class="q-mr-sm"
            />
            <div class="col">
              <div class="text-subtitle1 text-weight-bold leading-tight">
                {{
                  isEditing
                    ? `Editar ${activeCatMeta.titulo}`
                    : isRenewal
                    ? `${activeCatMeta.btnRenovar} (${activeCatMeta.titulo})`
                    : `Registrar ${activeCatMeta.titulo}`
                }}
              </div>
              <div class="text-caption text-blue-1">
                Unidad: <strong>{{ vehicle?.placas }}</strong>
              </div>
            </div>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-md scroll" style="max-height: 75vh">
          <q-form ref="docFormRef" greedy class="q-gutter-y-sm">
            <!-- Selector de Tipo de Documento -->
            <q-select
              v-model="formDoc.tipo_documento"
              :options="tipoDocOptions"
              label="Tipo de Documento *"
              emit-value
              map-options
              outlined
              dense
              options-dense
              :disable="isEditing"
              :rules="[(val) => !!val || 'Seleccione el tipo de documento']"
            >
              <template v-slot:prepend>
                <q-icon :name="activeCatMeta.icon" color="primary" />
              </template>
            </q-select>

            <div class="row q-col-gutter-sm">
              <!-- Folio o Póliza -->
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formDoc.folio_o_poliza"
                  :label="activeCatMeta.labelFolio"
                  :placeholder="activeCatMeta.placeholderFolio"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="tag" color="primary" />
                  </template>
                </q-input>
              </div>

              <!-- Aseguradora / Entidad / Holograma y Periodo -->
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formDoc.detalle_extra"
                  :label="activeCatMeta.labelDetalle"
                  :placeholder="activeCatMeta.placeholderDetalle"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="business" color="primary" />
                  </template>
                </q-input>

                <!-- Botones rápidos de 1er / 2do Semestre (Solo Verificación Vehicular) -->
                <div
                  v-if="formDoc.tipo_documento === 'verificacion'"
                  class="row items-center q-gutter-x-xs q-mt-xs"
                >
                  <q-btn
                    dense
                    no-caps
                    size="sm"
                    :unelevated="isSemestreSelected('1er')"
                    :outline="!isSemestreSelected('1er')"
                    :color="isSemestreSelected('1er') ? 'primary' : 'grey-7'"
                    icon="looks_one"
                    :label="`1er Semestre ${anioVerificacion}`"
                    class="col"
                    @click="selectSemestreVerificacion('1er')"
                  />
                  <q-btn
                    dense
                    no-caps
                    size="sm"
                    :unelevated="isSemestreSelected('2do')"
                    :outline="!isSemestreSelected('2do')"
                    :color="isSemestreSelected('2do') ? 'primary' : 'grey-7'"
                    icon="looks_two"
                    :label="`2do Semestre ${anioVerificacion}`"
                    class="col"
                    @click="selectSemestreVerificacion('2do')"
                  />
                </div>
              </div>
            </div>

            <!-- Toggle Permanente (Solo para Tarjeta de Circulación) -->
            <div
              v-if="formDoc.tipo_documento === 'tarjeta_circulacion'"
              class="bg-blue-1 q-px-sm q-py-xs rounded-borders"
            >
              <q-checkbox
                v-model="formDoc.es_permanente"
                color="primary"
                dense
                label="Esta tarjeta de circulación es permanente (sin fecha de vencimiento)"
                @update:model-value="onTogglePermanente"
              />
            </div>

            <div class="row q-col-gutter-sm items-start">
              <!-- Fecha de Emisión / Realización -->
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formDoc.fecha_emision"
                  type="date"
                  :label="`${activeCatMeta.labelEmision} *`"
                  outlined
                  dense
                  stack-label
                  :rules="[(val) => !!val || 'La fecha es obligatoria']"
                  @update:model-value="onEmisionChange"
                />
              </div>

              <!-- Fecha de Vencimiento / Próxima Renovación -->
              <div v-if="!formDoc.es_permanente" class="col-12 col-sm-6">
                <q-input
                  v-model="formDoc.fecha_vencimiento"
                  type="date"
                  :label="`${activeCatMeta.labelVencimiento} *`"
                  outlined
                  dense
                  stack-label
                  :rules="[
                    (val) =>
                      formDoc.es_permanente ||
                      !!val ||
                      'La fecha de vencimiento es obligatoria',
                  ]"
                />
              </div>
            </div>

            <!-- Archivo Adjunto (Solo PDF) -->
            <div class="q-mt-sm">
              <q-file
                v-model="selectedFile"
                outlined
                dense
                clearable
                accept="application/pdf,.pdf"
                max-file-size="10485760"
                :label="
                  isEditing && formDoc.archivo_url
                    ? 'Reemplazar archivo PDF (Opcional)'
                    : 'Archivo PDF (Póliza / Tarjeta / Talón de Verificación)'
                "
                @update:model-value="onFileSelected"
                @rejected="onFileRejected"
              >
                <template v-slot:prepend>
                  <q-icon name="picture_as_pdf" color="negative" />
                </template>
              </q-file>

              <div
                v-if="isEditing && formDoc.archivo_url && !selectedFile"
                class="row items-center justify-between bg-grey-2 q-pa-xs q-mt-xs rounded-borders text-caption"
              >
                <div class="row items-center">
                  <q-icon name="check_circle" color="positive" class="q-mr-xs" />
                  <span>Ya cuenta con un archivo PDF guardado en el expediente.</span>
                </div>
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="teal-7"
                  icon="open_in_new"
                  label="Ver PDF actual"
                  @click="openUrlInNewTab(formDoc.archivo_url)"
                />
              </div>
            </div>

            <!-- Observaciones -->
            <q-input
              v-model="formDoc.observaciones"
              type="textarea"
              rows="2"
              outlined
              dense
              label="Observaciones / Notas adicionales"
              :placeholder="activeCatMeta.placeholderObs"
            />

            <!-- Marcar como documento vigente actual -->
            <div class="bg-grey-2 q-pa-sm rounded-borders">
              <q-toggle
                v-model="formDoc.es_vigente"
                color="positive"
                dense
                label="Marcar como documento vigente actual (los anteriores de este tipo pasan al historial)"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-sm bg-grey-2">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            icon="save"
            :label="isEditing ? 'Actualizar Documento' : 'Guardar en Expediente'"
            :loading="saving"
            @click="saveDocumento"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG: Confirmar Eliminación -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 360px">
        <q-card-section class="bg-negative text-white row items-center">
          <q-icon name="warning" size="md" class="q-mr-sm" />
          <div class="text-h6">Eliminar Documento</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          ¿Estás seguro de eliminar este registro de
          <strong>{{
            docToDelete ? getCategoriaMeta(docToDelete.tipo_documento).titulo : ""
          }}</strong>
          <span v-if="docToDelete?.folio_o_poliza">
            ({{ docToDelete.folio_o_poliza }})
          </span>
          del expediente?
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-2">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="Eliminar"
            color="negative"
            :loading="deleting"
            @click="deleteDocumento"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG: Visor de Archivo Adjunto (PDF / Imagen) -->
    <q-dialog v-model="showPreviewDialog" maximized>
      <q-card class="column full-height bg-grey-10 text-white">
        <q-card-section class="row items-center justify-between q-py-sm bg-primary">
          <div class="row items-center no-wrap">
            <q-icon name="description" size="24px" class="q-mr-sm" />
            <div>
              <div class="text-subtitle1 text-weight-bold">
                {{
                  previewDoc
                    ? getCategoriaMeta(previewDoc.tipo_documento).titulo
                    : "Documento"
                }}
                <span v-if="previewDoc?.folio_o_poliza">
                  — {{ previewDoc.folio_o_poliza }}
                </span>
              </div>
              <div class="text-caption text-blue-1">
                Unidad: {{ vehicle?.placas }}
              </div>
            </div>
          </div>

          <div class="row items-center q-gutter-sm">
            <q-btn
              v-if="previewDoc?.archivo_url"
              unelevated
              color="white"
              text-color="primary"
              icon="open_in_new"
              label="Abrir en pestaña nueva"
              size="sm"
              @click="openUrlInNewTab(previewDoc.archivo_url)"
            />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="col q-pa-none flex flex-center bg-grey-9">
          <template v-if="previewDoc?.archivo_url">
            <iframe
              :src="previewDoc.archivo_url"
              class="full-width full-height"
              style="border: none; min-height: 88vh; background: white"
            />
          </template>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar, date } from "quasar";
import { sendRequest, dataIncomplete } from "src/boot/functions";

const props = defineProps({
  vehicle: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updated"]);

const $q = useQuasar();

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const documentos = ref([]);
const filtroTipo = ref("todos");

const showFormDialog = ref(false);
const isEditing = ref(false);
const isRenewal = ref(false);
const editingId = ref(null);
const docFormRef = ref(null);
const selectedFile = ref(null);

const showDeleteDialog = ref(false);
const docToDelete = ref(null);

const showPreviewDialog = ref(false);
const previewDoc = ref(null);

const categoriasConfig = [
  {
    tipo: "seguro",
    titulo: "Seguro Vehicular",
    subtitulo: "Póliza de seguro y cobertura",
    icon: "shield",
    labelFolio: "No. de Póliza",
    placeholderFolio: "Ej. POL-995431",
    labelDetalle: "Aseguradora / Cobertura",
    placeholderDetalle: "Ej. Qualitas - Cobertura Amplia",
    labelEmision: "Inicio de vigencia",
    labelVencimiento: "Fin de vigencia (Vencimiento)",
    placeholderObs: "Ej. Teléfono de siniestros 800-123-4567, deducible 5%...",
    btnRenovar: "Renovar Póliza",
  },
  {
    tipo: "tarjeta_circulacion",
    titulo: "Tarjeta de Circulación",
    subtitulo: "Permiso estatal de circulación",
    icon: "badge",
    labelFolio: "Folio de Tarjeta",
    placeholderFolio: "Ej. TC-4501928",
    labelDetalle: "Entidad / Estado",
    placeholderDetalle: "Ej. Guanajuato, Querétaro...",
    labelEmision: "Fecha de expedición",
    labelVencimiento: "Fecha de vencimiento",
    placeholderObs: "Ej. Placa asociada, propietario registrado...",
    btnRenovar: "Renovar Tarjeta",
  },
  {
    tipo: "verificacion",
    titulo: "Verificación Vehicular",
    subtitulo: "Control semestral de emisiones",
    icon: "eco",
    labelFolio: "Folio / Certificado",
    placeholderFolio: "Ej. CERT-11029",
    labelDetalle: "Periodo / Holograma",
    placeholderDetalle: "Ej. 1er Semestre 2026 - Holograma 0",
    labelEmision: "Fecha en que se verificó",
    labelVencimiento: "Próxima verificación (Límite)",
    placeholderObs: "Ej. Verificentro donde se realizó, engomado...",
    btnRenovar: "Nueva Verificación",
  },
];

const tipoDocOptions = categoriasConfig.map((c) => ({
  label: c.titulo,
  value: c.tipo,
}));

const getCategoriaMeta = (tipo) => {
  return (
    categoriasConfig.find((c) => c.tipo === tipo) || categoriasConfig[0]
  );
};

const vehicleNombre = computed(() => {
  return [
    props.vehicle?.marca?.nombre,
    props.vehicle?.modelo?.nombre,
    props.vehicle?.anio,
  ]
    .filter(Boolean)
    .join(" ");
});

const vigentesMap = computed(() => {
  const map = {
    seguro: null,
    tarjeta_circulacion: null,
    verificacion: null,
  };
  for (const doc of documentos.value) {
    if (doc.es_vigente && map[doc.tipo_documento] === null) {
      map[doc.tipo_documento] = doc;
    }
  }
  return map;
});

/**
 * Calcula color, ícono, etiqueta y mensaje de días para cualquier documento.
 */
const getSemaforoInfo = (doc) => {
  if (!doc) {
    return {
      status: "sin_registro",
      color: "grey-6",
      bgSoft: "grey-2",
      icon: "help_outline",
      badge: "Sin registro",
      mensajeDias: "Pendiente de registrar en el expediente",
    };
  }

  if (!doc.fecha_vencimiento) {
    return {
      status: "vigente",
      color: "positive",
      bgSoft: "green-1",
      icon: "verified",
      badge: "Vigente",
      mensajeDias: "Vigencia permanente (sin vencimiento)",
    };
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const parts = String(doc.fecha_vencimiento).substring(0, 10).split("-");
  const vence = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );
  vence.setHours(0, 0, 0, 0);

  const diffMs = vence.getTime() - hoy.getTime();
  const dias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (dias < 0) {
    const absDias = Math.abs(dias);
    return {
      status: "vencido",
      color: "negative",
      bgSoft: "red-1",
      icon: "error",
      badge: "Vencido",
      mensajeDias:
        absDias === 1
          ? "Venció ayer — Requiere renovación"
          : `Venció hace ${absDias} días — Requiere renovación`,
    };
  }

  if (dias <= 30) {
    return {
      status: "por_vencer",
      color: "amber-9",
      bgSoft: "amber-1",
      icon: "schedule",
      badge: "Por vencer",
      mensajeDias:
        dias === 0
          ? "¡Vence el día de hoy!"
          : dias === 1
          ? "Vence mañana (falta 1 día)"
          : `Próximo a vencer (faltan ${dias} días)`,
    };
  }

  return {
    status: "vigente",
    color: "positive",
    bgSoft: "green-1",
    icon: "check_circle",
    badge: "Vigente",
    mensajeDias: `Al corriente (${dias} días restantes)`,
  };
};

const resumenGeneral = computed(() => {
  const docs = [
    vigentesMap.value.seguro,
    vigentesMap.value.tarjeta_circulacion,
    vigentesMap.value.verificacion,
  ];
  const infos = docs.map((d) => getSemaforoInfo(d));

  const vencidos = infos.filter((i) => i.status === "vencido").length;
  const porVencer = infos.filter((i) => i.status === "por_vencer").length;
  const sinRegistro = infos.filter((i) => i.status === "sin_registro").length;

  if (vencidos > 0) {
    return {
      color: "negative",
      icon: "error",
      label: `${vencidos} documento(s) vencido(s)`,
    };
  }
  if (porVencer > 0) {
    return {
      color: "amber-9",
      icon: "warning",
      label: `${porVencer} próximo(s) a vencer`,
    };
  }
  if (sinRegistro === 3) {
    return {
      color: "grey-7",
      icon: "folder_open",
      label: "Expediente sin documentos",
    };
  }
  if (sinRegistro > 0) {
    return {
      color: "blue-grey-6",
      icon: "info",
      label: `${3 - sinRegistro}/3 documentos registrados`,
    };
  }
  return {
    color: "positive",
    icon: "verified",
    label: "Expediente al corriente (3/3)",
  };
});

const filteredDocumentos = computed(() => {
  if (filtroTipo.value === "todos") {
    return documentos.value;
  }
  return documentos.value.filter((d) => d.tipo_documento === filtroTipo.value);
});

const historialColumns = [
  {
    name: "tipo_documento",
    align: "left",
    label: "Documento",
    field: "tipo_documento",
    sortable: true,
  },
  {
    name: "folio_detalle",
    align: "left",
    label: "Folio / Póliza y Detalle",
    field: "folio_o_poliza",
  },
  {
    name: "fecha_emision",
    align: "left",
    label: "Fecha Realización / Emisión",
    field: "fecha_emision",
    sortable: true,
  },
  {
    name: "fecha_vencimiento",
    align: "left",
    label: "Fecha Vencimiento / Próxima",
    field: "fecha_vencimiento",
    sortable: true,
  },
  {
    name: "estatus",
    align: "left",
    label: "Vigencia / Estado",
    field: "es_vigente",
  },
  {
    name: "observaciones",
    align: "left",
    label: "Observaciones",
    field: "observaciones",
  },
  {
    name: "acciones",
    align: "right",
    label: "Acciones",
    field: "acciones",
  },
];

const formDoc = ref({
  tipo_documento: "seguro",
  folio_o_poliza: "",
  detalle_extra: "",
  fecha_emision: date.formatDate(new Date(), "YYYY-MM-DD"),
  fecha_vencimiento: "",
  es_permanente: false,
  es_vigente: true,
  observaciones: "",
  base64: null,
  archivo_url: null,
});

const activeCatMeta = computed(() =>
  getCategoriaMeta(formDoc.value.tipo_documento)
);

const anioVerificacion = computed(() => {
  if (formDoc.value.fecha_emision) {
    const yearPart = String(formDoc.value.fecha_emision).substring(0, 4);
    if (/^\d{4}$/.test(yearPart)) {
      return yearPart;
    }
  }
  return String(new Date().getFullYear());
});

const isSemestreSelected = (numStr) => {
  const current = String(formDoc.value.detalle_extra || "").toLowerCase();
  return current.includes(`${numStr.toLowerCase()} semestre`);
};

const selectSemestreVerificacion = (numStr) => {
  const targetLabel = `${numStr} Semestre ${anioVerificacion.value}`;
  const current = String(formDoc.value.detalle_extra || "").trim();

  if (!current) {
    formDoc.value.detalle_extra = targetLabel;
    return;
  }

  const semestreRegex = /(1er|2do)\s+semestre(\s+\d{4})?/i;
  if (semestreRegex.test(current)) {
    formDoc.value.detalle_extra = current.replace(semestreRegex, targetLabel);
  } else {
    formDoc.value.detalle_extra = `${targetLabel} - ${current}`;
  }
};

const loadDocumentos = async () => {
  if (!props.vehicle?.id) return;
  loading.value = true;
  try {
    const res = await sendRequest(
      "GET",
      null,
      `/api/vehicle/${props.vehicle.id}/documentos`,
      ""
    );
    if (res && Array.isArray(res.documentos)) {
      documentos.value = res.documentos;
    }
  } finally {
    loading.value = false;
  }
};

const addMonthsToDateStr = (dateStr, months) => {
  if (!dateStr) return "";
  const parts = String(dateStr).substring(0, 10).split("-");
  if (parts.length !== 3) return "";
  const d = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );
  d.setMonth(d.getMonth() + months);
  return date.formatDate(d, "YYYY-MM-DD");
};

const addMonthsToEmision = (months) => {
  if (!formDoc.value.fecha_emision) {
    formDoc.value.fecha_emision = date.formatDate(new Date(), "YYYY-MM-DD");
  }
  formDoc.value.fecha_vencimiento = addMonthsToDateStr(
    formDoc.value.fecha_emision,
    months
  );
};

const onEmisionChange = (val) => {
  if (!val || formDoc.value.es_permanente || isEditing.value) return;
  if (formDoc.value.tipo_documento === "seguro") {
    formDoc.value.fecha_vencimiento = addMonthsToDateStr(val, 12);
  } else if (formDoc.value.tipo_documento === "verificacion") {
    formDoc.value.fecha_vencimiento = addMonthsToDateStr(val, 6);
  }
};

const onTogglePermanente = (val) => {
  if (val) {
    formDoc.value.fecha_vencimiento = null;
  }
};

const openCreateDialog = (tipo = "seguro", renewal = false) => {
  isEditing.value = false;
  isRenewal.value = renewal;
  editingId.value = null;
  selectedFile.value = null;

  const todayStr = date.formatDate(new Date(), "YYYY-MM-DD");
  const defaultMonths = tipo === "verificacion" ? 6 : 12;
  const prevDoc = vigentesMap.value[tipo];

  formDoc.value = {
    tipo_documento: tipo,
    folio_o_poliza: "",
    detalle_extra: renewal && prevDoc?.detalle_extra ? prevDoc.detalle_extra : "",
    fecha_emision: todayStr,
    fecha_vencimiento: addMonthsToDateStr(todayStr, defaultMonths),
    es_permanente: false,
    es_vigente: true,
    observaciones: "",
    base64: null,
    archivo_url: null,
  };

  showFormDialog.value = true;
};

const openEditDialog = (doc) => {
  isEditing.value = true;
  isRenewal.value = false;
  editingId.value = doc.id;
  selectedFile.value = null;

  formDoc.value = {
    tipo_documento: doc.tipo_documento,
    folio_o_poliza: doc.folio_o_poliza || "",
    detalle_extra: doc.detalle_extra || "",
    fecha_emision: doc.fecha_emision
      ? String(doc.fecha_emision).substring(0, 10)
      : "",
    fecha_vencimiento: doc.fecha_vencimiento
      ? String(doc.fecha_vencimiento).substring(0, 10)
      : "",
    es_permanente:
      doc.tipo_documento === "tarjeta_circulacion" && !doc.fecha_vencimiento,
    es_vigente: Boolean(doc.es_vigente),
    observaciones: doc.observaciones || "",
    base64: null,
    archivo_url: doc.archivo_url || null,
  };

  showFormDialog.value = true;
};

const onFileSelected = (file) => {
  if (!file) {
    formDoc.value.base64 = null;
    return;
  }
  const isPdf =
    file.type === "application/pdf" ||
    /\.pdf$/i.test(file.name || "");
  if (!isPdf) {
    selectedFile.value = null;
    formDoc.value.base64 = null;
    onFileRejected();
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    formDoc.value.base64 = reader.result;
  };
  reader.readAsDataURL(file);
};

const onFileRejected = () => {
  $q.notify({
    type: "negative",
    message:
      "Archivo no válido. Solo se permiten documentos en formato PDF menores a 10 MB.",
  });
};

const saveDocumento = async () => {
  const valid = await docFormRef.value.validate();
  if (!valid) {
    dataIncomplete();
    return;
  }

  saving.value = true;
  try {
    const payload = {
      vehicle_id: props.vehicle.id,
      tipo_documento: formDoc.value.tipo_documento,
      folio_o_poliza: formDoc.value.folio_o_poliza,
      detalle_extra: formDoc.value.detalle_extra,
      fecha_emision: formDoc.value.fecha_emision,
      es_permanente: formDoc.value.es_permanente,
      fecha_vencimiento: formDoc.value.es_permanente
        ? null
        : formDoc.value.fecha_vencimiento,
      es_vigente: formDoc.value.es_vigente,
      observaciones: formDoc.value.observaciones,
      base64: formDoc.value.base64,
    };

    let res = null;
    if (isEditing.value && editingId.value) {
      res = await sendRequest(
        "PUT",
        payload,
        `/api/vehicleDocumento/${editingId.value}`,
        ""
      );
    } else {
      res = await sendRequest("POST", payload, "/api/vehicleDocumento", "");
    }

    if (res) {
      showFormDialog.value = false;
      await loadDocumentos();
      emit("updated");
    }
  } finally {
    saving.value = false;
  }
};

const setComoVigente = async (doc) => {
  const res = await sendRequest(
    "PUT",
    {},
    `/api/vehicleDocumento/${doc.id}/vigente`,
    ""
  );
  if (res) {
    await loadDocumentos();
    emit("updated");
  }
};

const confirmDelete = (doc) => {
  docToDelete.value = doc;
  showDeleteDialog.value = true;
};

const deleteDocumento = async () => {
  if (!docToDelete.value) return;
  deleting.value = true;
  try {
    const res = await sendRequest(
      "DELETE",
      null,
      `/api/vehicleDocumento/${docToDelete.value.id}`,
      ""
    );
    if (res !== undefined) {
      showDeleteDialog.value = false;
      docToDelete.value = null;
      await loadDocumentos();
      emit("updated");
    }
  } finally {
    deleting.value = false;
  }
};

const openPreview = (doc) => {
  previewDoc.value = doc;
  showPreviewDialog.value = true;
};

const openUrlInNewTab = (url) => {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

const isImageUrl = (url) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url);
};

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha";
  const clean = String(fechaStr).substring(0, 10);
  const parts = clean.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return date.formatDate(fechaStr, "DD/MM/YYYY");
};

watch(
  () => props.vehicle?.id,
  (newId) => {
    if (newId) {
      loadDocumentos();
    }
  }
);

onMounted(() => {
  loadDocumentos();
});
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
.doc-status-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.doc-status-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
.border-top-positive {
  border-top: 4px solid var(--q-positive);
}
.border-top-amber-9 {
  border-top: 4px solid #ff6f00;
}
.border-top-negative {
  border-top: 4px solid var(--q-negative);
}
.border-top-grey-6 {
  border-top: 4px solid #757575;
}
.border-top-light {
  border-top: 1px solid rgba(0, 0, 0, 0.07);
}
</style>
