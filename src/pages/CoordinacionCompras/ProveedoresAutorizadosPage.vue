<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header de la Página -->
    <q-card flat bordered class="q-mb-md bg-white shadow-1">
      <q-card-section class="q-py-md q-px-lg">
        <div class="row items-center justify-between q-col-gutter-md">
          <div class="row items-center q-gutter-x-md">
            <q-avatar
              size="48px"
              font-size="28px"
              color="primary"
              text-color="white"
              icon="verified_user"
            />
            <div>
              <div class="text-h6 text-weight-bold text-dark">
                Proveedores Autorizados
              </div>
              <div class="text-caption text-grey-7">
                Expediente digital, alta y gestión documental de proveedores (Opinión positiva, Constancia fiscal, Domicilio y Carátula bancaria)
              </div>
            </div>
          </div>

          <div class="row q-gutter-x-sm">
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
              label="Nuevo Proveedor"
              class="q-px-md text-weight-bold"
              @click="openCreate"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Barra de Filtros y Búsqueda -->
    <q-card flat bordered class="q-mb-md bg-white shadow-1">
      <q-card-section class="q-py-sm q-px-md">
        <div class="row q-col-gutter-sm items-center">
          <!-- Búsqueda por texto -->
          <div class="col-12 col-sm-6 col-md-5">
            <q-input
              v-model="filters.search"
              placeholder="Buscar por razón social, RFC, teléfono o correo..."
              outlined
              dense
              clearable
              debounce="300"
              bg-color="white"
              @update:model-value="onSearchChange"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="grey-6" />
              </template>
            </q-input>
          </div>

          <!-- Tipo de Persona -->
          <div class="col-12 col-sm-3 col-md-3">
            <q-select
              v-model="filters.tipo_persona"
              :options="[
                { label: 'Todos los tipos', value: null },
                { label: 'Persona Moral', value: 'Moral' },
                { label: 'Persona Física', value: 'Física' },
              ]"
              emit-value
              map-options
              outlined
              dense
              label="Tipo de Persona"
              clearable
              bg-color="white"
              @update:model-value="getRows(1)"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" color="grey-6" />
              </template>
            </q-select>
          </div>

          <!-- Filtro Expediente Completo -->
          <div class="col-12 col-sm-3 col-md-4 flex items-center justify-end">
            <q-toggle
              v-model="filters.con_docs_completos"
              label="Solo con 4 docs completos"
              color="positive"
              dense
              @update:model-value="getRows(1)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla Principal de Proveedores -->
    <q-card flat bordered class="shadow-1 bg-white">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        binary-state-sort
        flat
        dense
        :rows-per-page-options="[10, 15, 25, 50]"
        no-data-label="No se encontraron proveedores registrados"
        loading-label="Cargando proveedores..."
      >
        <!-- Columna: Razón Social -->
        <template v-slot:body-cell-razon_social="props">
          <q-td :props="props">
            <div class="row items-center no-wrap q-gutter-x-sm">
              <q-avatar
                size="34px"
                :color="props.row.tipo_persona === 'Física' ? 'purple-1' : 'blue-1'"
                :text-color="props.row.tipo_persona === 'Física' ? 'purple-9' : 'primary'"
                icon="storefront"
              />
              <div>
                <div class="text-weight-bold text-dark text-subtitle2">
                  {{ props.row.razon_social }}
                </div>
                <div class="text-caption text-grey-7">
                  <span v-if="props.row.rfc" class="q-mr-xs text-weight-medium">
                    RFC: <strong>{{ props.row.rfc }}</strong>
                  </span>
                  <span v-else class="text-italic text-grey-5">Sin RFC</span>
                  <div v-if="props.row.registrador" class="text-caption text-grey-6 row items-center q-mt-xs">
                    <q-icon name="person" size="13px" class="q-mr-xs text-primary" />
                    Reg. por: <span class="text-weight-medium text-dark q-ml-xs">{{ getRegistradorName(props.row) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Columna: Tipo Persona -->
        <template v-slot:body-cell-tipo_persona="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.tipo_persona === 'Física' ? 'purple' : 'primary'"
              class="q-px-sm q-py-xs text-weight-medium"
            >
              {{ props.row.tipo_persona || 'Moral' }}
            </q-badge>
          </q-td>
        </template>

        <!-- Columna: Contacto -->
        <template v-slot:body-cell-contacto="props">
          <q-td :props="props">
            <div class="text-caption">
              <div v-if="props.row.telefono" class="row items-center q-gutter-x-xs">
                <q-icon name="phone" size="14px" color="grey-6" />
                <a :href="`tel:${props.row.telefono}`" class="text-primary text-weight-medium text-decoration-none">
                  {{ props.row.telefono }}
                </a>
              </div>
              <div v-if="props.row.correo" class="row items-center q-gutter-x-xs">
                <q-icon name="email" size="14px" color="grey-6" />
                <a :href="`mailto:${props.row.correo}`" class="text-grey-9 text-decoration-none">
                  {{ props.row.correo }}
                </a>
              </div>
              <div v-if="props.row.domicilio" class="row items-center q-gutter-x-xs text-grey-7 ellipsis" style="max-width: 250px;">
                <q-icon name="place" size="14px" color="grey-6" />
                <span :title="props.row.domicilio">{{ props.row.domicilio }}</span>
              </div>
              <div v-if="!props.row.telefono && !props.row.correo && !props.row.domicilio" class="text-grey-5 text-italic">
                Sin datos de contacto
              </div>
            </div>
          </q-td>
        </template>

        <!-- Columna: Días de Crédito -->
        <template v-slot:body-cell-dias_credito="props">
          <q-td :props="props" class="text-center">
            <q-badge
              v-if="props.row.dias_credito"
              color="teal-8"
              class="q-px-sm text-weight-bold"
            >
              {{ props.row.dias_credito }} días
            </q-badge>
            <span v-else class="text-grey-5 text-caption">Contado</span>
          </q-td>
        </template>

        <!-- Columna: Expediente Digital (4 Documentos Requeridos) -->
        <template v-slot:body-cell-expediente="props">
          <q-td :props="props">
            <div class="column q-gutter-y-xs" style="min-width: 220px;">
              <div
                v-for="docType in REQUIRED_DOCS"
                :key="docType.key"
                class="row items-center justify-between no-wrap q-py-xs q-px-sm rounded-borders"
                :class="getDocBgClass(getDocRecord(props.row, docType.nombre))"
              >
                <div class="row items-center no-wrap q-gutter-x-xs">
                  <q-icon
                    :name="getDocIcon(getDocRecord(props.row, docType.nombre))"
                    :color="getDocIconColor(getDocRecord(props.row, docType.nombre))"
                    size="16px"
                  />
                  <span class="text-caption text-weight-medium ellipsis" style="max-width: 130px;" :title="docType.nombre">
                    {{ docType.labelShort }}
                  </span>
                </div>

                <div class="row items-center no-wrap q-gutter-x-xs">
                  <!-- Badge de Estatus -->
                  <q-badge
                    dense
                    :color="getDocBadgeColor(getDocRecord(props.row, docType.nombre))"
                    :label="getDocBadgeLabel(getDocRecord(props.row, docType.nombre))"
                    class="text-weight-bold text-caption"
                  />

                  <!-- Botón Ver PDF si existe -->
                  <q-btn
                    v-if="getDocRecord(props.row, docType.nombre)?.documento_url"
                    dense
                    flat
                    round
                    size="sm"
                    color="primary"
                    icon="picture_as_pdf"
                    @click.stop="openPdf(getDocRecord(props.row, docType.nombre)?.documento_url)"
                  >
                    <q-tooltip>Ver documento PDF</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Columna: Acciones -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <div class="row items-center justify-center q-gutter-x-xs no-wrap">
              <!-- Ver Expediente Completo (Público para consulta) -->
              <q-btn
                dense
                flat
                round
                color="primary"
                icon="folder_shared"
                @click="openExpediente(props.row)"
              >
                <q-tooltip>Expediente de Documentos</q-tooltip>
              </q-btn>

              <!-- Subir / Reemplazar Documento (Solo registrador o rol Proveedores) -->
              <q-btn
                v-if="canEditProveedor(props.row)"
                dense
                flat
                round
                color="indigo"
                icon="upload_file"
                @click="openUploadSingleDoc(props.row)"
              >
                <q-tooltip>Subir o actualizar documento</q-tooltip>
              </q-btn>

              <!-- Editar Datos Generales (Solo registrador o rol Proveedores) -->
              <q-btn
                v-if="canEditProveedor(props.row)"
                dense
                flat
                round
                color="teal-8"
                icon="edit_square"
                @click="openEdit(props.row)"
              >
                <q-tooltip>Editar proveedor</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- ================================================================= -->
    <!-- MODAL 1: REGISTRAR NUEVO PROVEEDOR CON SUS 4 DOCUMENTOS (PDF)   -->
    <!-- ================================================================= -->
    <q-dialog v-model="showCreateModal" persistent full-width>
      <q-card style="width: 100%; max-width: 900px; max-height: 94vh" class="scroll">
        <q-item class="bg-primary text-white q-py-md">
          <q-item-section avatar>
            <q-icon name="verified_user" size="32px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Dar de Alta Proveedor Autorizado
            </q-item-label>
            <q-item-label caption class="text-white text-caption">
              Ingrese los datos generales y cargue los 4 documentos requeridos en formato PDF
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="close" color="white" v-close-popup />
          </q-item-section>
        </q-item>

        <q-form ref="createFormRef" @submit="submitCreate">
          <q-card-section class="q-pa-md">
            <!-- SECCIÓN 1: DATOS FISCALES Y GENERALES -->
            <div class="row items-center q-mb-sm">
              <q-icon name="business" color="primary" size="20px" class="q-mr-xs" />
              <div class="text-subtitle2 text-weight-bold text-primary">
                1. Información General del Proveedor
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mb-md">
              <!-- Razón Social -->
              <div class="col-12 col-sm-8">
                <q-input
                  v-model="createForm.razon_social"
                  label="Razón Social / Nombre Comercial *"
                  outlined
                  dense
                  :rules="[(val) => !!val?.trim() || 'La razón social es obligatoria']"
                />
              </div>

              <!-- Tipo de Persona -->
              <div class="col-12 col-sm-4">
                <q-select
                  v-model="createForm.tipo_persona"
                  :options="['Moral', 'Física']"
                  label="Tipo de Persona *"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'Seleccione el tipo de persona']"
                />
              </div>

              <!-- RFC -->
              <div class="col-12 col-sm-4">
                <q-input
                  ref="createRfcInputRef"
                  v-model="createForm.rfc"
                  label="RFC *"
                  outlined
                  dense
                  maxlength="13"
                  class="uppercase-input"
                  :loading="checkingRfcCreate"
                  :error="createRfcDuplicate"
                  :error-message="createRfcDuplicate ? `Este RFC ya está registrado con: ${createRfcDuplicateName}` : ''"
                  :rules="[
                    (val) => !!val || 'El RFC es obligatorio',
                    (val) => (val && val.length >= 12 && val.length <= 13) || 'El RFC debe tener 12 o 13 caracteres',
                    (val) => /^[A-Z&Ññ]{3,4}[0-9]{6}[A-Z0-9]{3}$/i.test(val) || 'Formato de RFC inválido (Ej. PTD240101ABC)',
                    () => !createRfcDuplicate || `Este RFC ya está registrado con: ${createRfcDuplicateName}`,
                  ]"
                  lazy-rules
                  hint="Ej. PTD240101ABC"
                  @update:model-value="onCreateRfcChange"
                  @blur="checkCreateRfcDuplicate"
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="createRfcChecked && !createRfcDuplicate"
                      name="check_circle"
                      color="positive"
                    >
                      <q-tooltip>RFC disponible</q-tooltip>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <!-- Teléfono -->
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="createForm.telefono"
                  label="Teléfono"
                  outlined
                  dense
                  mask="(###) ### - ####"
                  unmasked-value
                />
              </div>

              <!-- Correo -->
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="createForm.correo"
                  label="Correo Electrónico"
                  type="email"
                  outlined
                  dense
                />
              </div>

              <!-- Domicilio -->
              <div class="col-12 col-sm-8">
                <q-input
                  v-model="createForm.domicilio"
                  label="Domicilio Fiscal / Comercial"
                  outlined
                  dense
                  placeholder="Calle, Número, Colonia, Municipio, C.P., Estado"
                />
              </div>

              <!-- Días de crédito -->
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="createForm.dias_credito"
                  label="Días de Crédito"
                  outlined
                  dense
                  placeholder="Ej. 15, 30 días o Contado"
                />
              </div>

              <!-- Descripción / Notas -->
              <div class="col-12">
                <q-input
                  v-model="createForm.descripcion"
                  label="Descripción de Bienes o Servicios que suministra"
                  type="textarea"
                  rows="2"
                  outlined
                  dense
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- SECCIÓN 2: DOCUMENTOS REQUERIDOS (PDF) -->
            <div class="row items-center q-mb-md">
              <q-icon name="picture_as_pdf" color="primary" size="20px" class="q-mr-xs" />
              <div class="text-subtitle2 text-weight-bold text-primary">
                2. Expediente Digital (Documentos en Formato PDF)
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <!-- 1. Opinión Positiva -->
              <div class="col-12 col-sm-6">
                <q-card flat bordered class="q-pa-sm bg-blue-1 border-blue">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-subtitle2 text-weight-bold text-dark">
                      1. Opinión positiva
                    </span>
                    <q-badge color="primary" label="PDF" />
                  </div>
                  <div class="text-caption text-grey-7 q-mb-xs">
                    Opinión del cumplimiento de obligaciones fiscales (SAT 32-D)
                  </div>
                  <q-file
                    v-model="docFiles.opinion_positiva"
                    accept=".pdf,application/pdf"
                    max-file-size="15728640"
                    label="Seleccionar Opinión positiva (PDF)"
                    outlined
                    dense
                    bg-color="white"
                    clearable
                    @rejected="onFileRejected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" color="primary" />
                    </template>
                  </q-file>
                  <q-input
                    v-model="docVencimientos.opinion_positiva"
                    label="Fecha de Vencimiento (opcional)"
                    outlined
                    dense
                    type="date"
                    stack-label
                    bg-color="white"
                    clearable
                    class="q-mt-xs"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" size="18px" color="primary" />
                    </template>
                  </q-input>
                </q-card>
              </div>

              <!-- 2. Constancia de Situación Fiscal -->
              <div class="col-12 col-sm-6">
                <q-card flat bordered class="q-pa-sm bg-blue-1 border-blue">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-subtitle2 text-weight-bold text-dark">
                      2. Constancia de situación fiscal
                    </span>
                    <q-badge color="primary" label="PDF" />
                  </div>
                  <div class="text-caption text-grey-7 q-mb-xs">
                    Constancia emitida por el SAT no mayor a 3 meses
                  </div>
                  <q-file
                    v-model="docFiles.constancia_fiscal"
                    accept=".pdf,application/pdf"
                    max-file-size="15728640"
                    label="Seleccionar Constancia fiscal (PDF)"
                    outlined
                    dense
                    bg-color="white"
                    clearable
                    @rejected="onFileRejected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" color="primary" />
                    </template>
                  </q-file>
                  <q-input
                    v-model="docVencimientos.constancia_fiscal"
                    label="Fecha de Vencimiento (opcional)"
                    outlined
                    dense
                    type="date"
                    stack-label
                    bg-color="white"
                    clearable
                    class="q-mt-xs"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" size="18px" color="primary" />
                    </template>
                  </q-input>
                </q-card>
              </div>

              <!-- 3. Comprobante de Domicilio -->
              <div class="col-12 col-sm-6">
                <q-card flat bordered class="q-pa-sm bg-blue-1 border-blue">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-subtitle2 text-weight-bold text-dark">
                      3. Comprobante de domicilio
                    </span>
                    <q-badge color="primary" label="PDF" />
                  </div>
                  <div class="text-caption text-grey-7 q-mb-xs">
                    Recibo de luz, agua o teléfono no mayor a 3 meses
                  </div>
                  <q-file
                    v-model="docFiles.comprobante_domicilio"
                    accept=".pdf,application/pdf"
                    max-file-size="15728640"
                    label="Seleccionar Comprobante de domicilio (PDF)"
                    outlined
                    dense
                    bg-color="white"
                    clearable
                    @rejected="onFileRejected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" color="primary" />
                    </template>
                  </q-file>
                  <q-input
                    v-model="docVencimientos.comprobante_domicilio"
                    label="Fecha de Vencimiento (opcional)"
                    outlined
                    dense
                    type="date"
                    stack-label
                    bg-color="white"
                    clearable
                    class="q-mt-xs"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" size="18px" color="primary" />
                    </template>
                  </q-input>
                </q-card>
              </div>

              <!-- 4. Carátula Bancaria -->
              <div class="col-12 col-sm-6">
                <q-card flat bordered class="q-pa-sm bg-blue-1 border-blue">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-subtitle2 text-weight-bold text-dark">
                      4. Carátula bancaria
                    </span>
                    <q-badge color="primary" label="PDF" />
                  </div>
                  <div class="text-caption text-grey-7 q-mb-xs">
                    Estado de cuenta con CLABE interbancaria visible
                  </div>
                  <q-file
                    v-model="docFiles.caratula_bancaria"
                    accept=".pdf,application/pdf"
                    max-file-size="15728640"
                    label="Seleccionar Carátula bancaria (PDF)"
                    outlined
                    dense
                    bg-color="white"
                    clearable
                    @rejected="onFileRejected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" color="primary" />
                    </template>
                  </q-file>
                  <q-input
                    v-model="docVencimientos.caratula_bancaria"
                    label="Fecha de Vencimiento (opcional)"
                    outlined
                    dense
                    type="date"
                    stack-label
                    bg-color="white"
                    clearable
                    class="q-mt-xs"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" size="18px" color="primary" />
                    </template>
                  </q-input>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              color="positive"
              icon="save"
              label="Guardar Proveedor y Documentos"
              :loading="submittingCreate"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- ================================================================= -->
    <!-- MODAL 2: EXPEDIENTE DIGITAL COMPLETO DEL PROVEEDOR               -->
    <!-- ================================================================= -->
    <q-dialog v-model="showExpedienteModal" full-width>
      <q-card style="width: 100%; max-width: 950px; max-height: 94vh" class="scroll">
        <q-item class="bg-primary text-white q-py-md">
          <q-item-section avatar>
            <q-icon name="folder_shared" size="32px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Expediente Digital: {{ selectedProveedor?.razon_social }}
            </q-item-label>
            <q-item-label caption class="text-white text-caption">
              RFC: {{ selectedProveedor?.rfc || 'S/N' }} &bull; Tipo: {{ selectedProveedor?.tipo_persona || 'Moral' }}
              <span v-if="selectedProveedor?.registrador">
                &bull; Registrado por: <strong>{{ getRegistradorName(selectedProveedor) }}</strong>
              </span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="close" color="white" v-close-popup />
          </q-item-section>
        </q-item>

        <q-card-section class="q-pa-md">
          <!-- Banner modo consulta si no tiene permisos de edición -->
          <q-banner
            v-if="!canEditProveedor(selectedProveedor)"
            dense
            rounded
            class="bg-blue-grey-1 text-blue-grey-9 q-mb-md border-grey"
          >
            <template v-slot:avatar>
              <q-icon name="info" color="blue-grey-7" size="20px" />
            </template>
            <div class="text-caption">
              <strong>Modo consulta:</strong> Este proveedor solo puede ser modificado por el usuario que lo registró o por usuarios con rol <strong>Proveedores</strong>.
            </div>
          </q-banner>

          <div class="row q-col-gutter-md">
            <div
              v-for="docType in REQUIRED_DOCS"
              :key="docType.key"
              class="col-12 col-sm-6"
            >
              <q-card flat bordered class="q-pa-md full-height">
                <!-- Título del Documento -->
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-subtitle1 text-weight-bold text-dark">
                    {{ docType.nombre }}
                  </div>
                  <q-badge
                    :color="getDocBadgeColor(getDocRecord(selectedProveedor, docType.nombre))"
                    :label="getDocBadgeLabel(getDocRecord(selectedProveedor, docType.nombre))"
                    class="q-px-sm q-py-xs text-weight-bold"
                  />
                </div>

                <div class="text-caption text-grey-7 q-mb-md">
                  {{ docType.descripcion }}
                </div>

                <!-- Si el documento ya está cargado -->
                <div
                  v-if="getDocRecord(selectedProveedor, docType.nombre)"
                  class="q-pa-sm rounded-borders bg-grey-2 q-mb-sm"
                >
                  <div class="row items-center justify-between">
                    <div class="row items-center q-gutter-x-xs">
                      <q-icon name="picture_as_pdf" color="red-8" size="20px" />
                      <span class="text-caption text-weight-medium">Documento PDF cargado</span>
                    </div>

                    <q-btn
                      unelevated
                      dense
                      size="sm"
                      color="primary"
                      icon="open_in_new"
                      label="Abrir PDF"
                      @click="openPdf(getDocRecord(selectedProveedor, docType.nombre)?.documento_url)"
                    />
                  </div>

                  <!-- Información de subida y validación -->
                  <div class="text-caption text-grey-8 q-mt-xs">
                    Subido:
                    <strong>{{ formatDate(getDocRecord(selectedProveedor, docType.nombre)?.created_at) }}</strong>
                    <span v-if="getDocRecord(selectedProveedor, docType.nombre)?.uploader?.empleado?.nombreCompleto">
                      por {{ getDocRecord(selectedProveedor, docType.nombre)?.uploader?.empleado?.nombreCompleto }}
                    </span>
                  </div>

                  <!-- Fecha de vencimiento si existe -->
                  <div
                    v-if="getDocRecord(selectedProveedor, docType.nombre)?.fecha_vencimiento"
                    class="text-caption text-grey-9 q-mt-xs row items-center"
                  >
                    <q-icon name="event" size="14px" color="primary" class="q-mr-xs" />
                    Vence:
                    <strong class="q-ml-xs">
                      {{ formatDateOnly(getDocRecord(selectedProveedor, docType.nombre)?.fecha_vencimiento) }}
                    </strong>
                    <q-badge
                      v-if="isDocExpired(getDocRecord(selectedProveedor, docType.nombre)?.fecha_vencimiento)"
                      color="negative"
                      label="Vencido"
                      class="q-ml-xs text-caption text-weight-bold"
                    />
                  </div>

                  <!-- Notas u observaciones si existen -->
                  <div
                    v-if="getDocRecord(selectedProveedor, docType.nombre)?.notas"
                    class="text-caption text-amber-10 bg-amber-1 q-pa-xs rounded-borders q-mt-xs"
                  >
                    <strong>Observaciones:</strong> {{ getDocRecord(selectedProveedor, docType.nombre)?.notas }}
                  </div>
                </div>

                <!-- Si el documento NO está cargado -->
                <div
                  v-else
                  class="q-pa-sm rounded-borders bg-grey-1 text-grey-6 text-caption text-center q-mb-sm"
                >
                  <q-icon name="warning_amber" size="22px" class="q-mr-xs text-grey-5" />
                  Este documento aún no ha sido cargado.
                </div>

                <!-- Acciones para este documento -->
                <div class="row items-center justify-between q-mt-md">
                  <!-- Botón para subir o reemplazar (Solo registrador o rol Proveedores) -->
                  <q-btn
                    v-if="canEditProveedor(selectedProveedor)"
                    outline
                    dense
                    color="primary"
                    icon="cloud_upload"
                    :label="getDocRecord(selectedProveedor, docType.nombre) ? 'Reemplazar PDF' : 'Subir PDF'"
                    class="q-px-sm"
                    @click="promptUploadDoc(selectedProveedor, docType.nombre)"
                  />
                  <div v-else class="text-caption text-grey-6 text-italic">
                    Solo lectura
                  </div>

                  <!-- Cambiar Estatus si el documento ya existe (para Proveedores / Admin / CC) -->
                  <div
                    v-if="getDocRecord(selectedProveedor, docType.nombre) && canValidateDoc"
                    class="row q-gutter-x-xs"
                  >
                    <q-btn
                      unelevated
                      dense
                      size="sm"
                      color="positive"
                      icon="check_circle"
                      label="Validar"
                      @click="quickChangeDocStatus(getDocRecord(selectedProveedor, docType.nombre), 183)"
                    >
                      <q-tooltip>Marcar como Validado</q-tooltip>
                    </q-btn>
                    <q-btn
                      unelevated
                      dense
                      size="sm"
                      color="negative"
                      icon="cancel"
                      label="Corregir"
                      @click="promptRejectDoc(getDocRecord(selectedProveedor, docType.nombre))"
                    >
                      <q-tooltip>Solicitar corrección</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md bg-grey-2">
          <q-btn flat label="Cerrar" color="grey-8" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ================================================================= -->
    <!-- MODAL 3: SUBIR O REEMPLAZAR DOCUMENTO INDIVIDUAL                 -->
    <!-- ================================================================= -->
    <q-dialog v-model="showUploadDocModal" persistent>
      <q-card style="width: 500px; max-width: 95vw">
        <q-item class="bg-primary text-white q-py-sm">
          <q-item-section avatar>
            <q-icon name="upload_file" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-bold">
              Subir Documento al Expediente
            </q-item-label>
            <q-item-label caption class="text-white text-caption">
              {{ uploadDocData.proveedor?.razon_social }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="close" color="white" v-close-popup />
          </q-item-section>
        </q-item>

        <q-form @submit="submitSingleDocUpload">
          <q-card-section class="q-pa-md q-gutter-y-md">
            <!-- Tipo de Documento -->
            <q-select
              v-model="uploadDocData.nombre_doc"
              :options="REQUIRED_DOCS.map((d) => d.nombre)"
              label="Tipo de Documento *"
              outlined
              dense
              :rules="[(val) => !!val || 'Seleccione el tipo de documento']"
            />

            <!-- Archivo PDF -->
            <q-file
              v-model="uploadDocData.file"
              accept=".pdf,application/pdf"
              max-file-size="15728640"
              label="Seleccionar Archivo PDF *"
              outlined
              dense
              clearable
              @rejected="onFileRejected"
              :rules="[(val) => !!val || 'Debe seleccionar un archivo PDF']"
            >
              <template v-slot:prepend>
                <q-icon name="picture_as_pdf" color="red-8" />
              </template>
            </q-file>

            <!-- Fecha de Vencimiento -->
            <q-input
              v-model="uploadDocData.fecha_vencimiento"
              label="Fecha de Vencimiento (opcional)"
              outlined
              dense
              type="date"
              stack-label
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="event" size="20px" color="primary" />
              </template>
            </q-input>

            <!-- Notas u Observaciones -->
            <q-input
              v-model="uploadDocData.notas"
              label="Notas u observaciones (opcional)"
              outlined
              dense
              type="textarea"
              rows="2"
            />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              color="primary"
              icon="cloud_upload"
              label="Subir Documento"
              :loading="uploadingDoc"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- ================================================================= -->
    <!-- MODAL 4: EDITAR DATOS GENERALES DEL PROVEEDOR                     -->
    <!-- ================================================================= -->
    <q-dialog v-model="showEditModal" persistent>
      <q-card style="width: 700px; max-width: 95vw">
        <q-item class="bg-primary text-white q-py-sm">
          <q-item-section avatar>
            <q-icon name="edit_square" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-bold">
              Editar Datos del Proveedor #{{ editForm.id }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="close" color="white" v-close-popup />
          </q-item-section>
        </q-item>

        <q-form ref="editFormRef" @submit="submitEdit">
          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-8">
                <q-input
                  v-model="editForm.razon_social"
                  label="Razón Social *"
                  outlined
                  dense
                  :rules="[(val) => !!val?.trim() || 'La razón social es obligatoria']"
                />
              </div>

              <div class="col-12 col-sm-4">
                <q-select
                  v-model="editForm.tipo_persona"
                  :options="['Moral', 'Física']"
                  label="Tipo de Persona *"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'Seleccione el tipo de persona']"
                />
              </div>

              <div class="col-12 col-sm-4">
                <q-input
                  ref="editRfcInputRef"
                  v-model="editForm.rfc"
                  label="RFC *"
                  outlined
                  dense
                  maxlength="13"
                  class="uppercase-input"
                  :loading="checkingRfcEdit"
                  :error="editRfcDuplicate"
                  :error-message="editRfcDuplicate ? `Este RFC ya está registrado con: ${editRfcDuplicateName}` : ''"
                  :rules="[
                    (val) => !!val || 'El RFC es obligatorio',
                    (val) => (val && val.length >= 12 && val.length <= 13) || 'El RFC debe tener 12 o 13 caracteres',
                    (val) => /^[A-Z&Ññ]{3,4}[0-9]{6}[A-Z0-9]{3}$/i.test(val) || 'Formato de RFC inválido (Ej. PTD240101ABC)',
                    () => !editRfcDuplicate || `Este RFC ya está registrado con: ${editRfcDuplicateName}`,
                  ]"
                  lazy-rules
                  @update:model-value="onEditRfcChange"
                  @blur="checkEditRfcDuplicate"
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="editRfcChecked && !editRfcDuplicate"
                      name="check_circle"
                      color="positive"
                    >
                      <q-tooltip>RFC disponible</q-tooltip>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-4">
                <q-input
                  v-model="editForm.telefono"
                  label="Teléfono"
                  outlined
                  dense
                />
              </div>

              <div class="col-12 col-sm-4">
                <q-input
                  v-model="editForm.correo"
                  label="Correo"
                  type="email"
                  outlined
                  dense
                />
              </div>

              <div class="col-12 col-sm-8">
                <q-input
                  v-model="editForm.domicilio"
                  label="Domicilio Fiscal"
                  outlined
                  dense
                />
              </div>

              <div class="col-12 col-sm-4">
                <q-input
                  v-model="editForm.dias_credito"
                  label="Días de Crédito"
                  outlined
                  dense
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="editForm.descripcion"
                  label="Descripción"
                  type="textarea"
                  rows="2"
                  outlined
                  dense
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              color="positive"
              icon="save"
              label="Actualizar"
              :loading="submittingEdit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { date, useQuasar } from "quasar";
import { sendRequest, checkRole } from "src/boot/functions";
import { useAuthStore } from "src/stores/auth";
import { api } from "src/boot/axios";

const $q = useQuasar();
const authStore = useAuthStore();

// 4 Documentos Requeridos Oficiales
const REQUIRED_DOCS = [
  {
    key: "opinion_positiva",
    nombre: "Opinión positiva",
    labelShort: "Opinión positiva",
    descripcion: "Opinión del cumplimiento de obligaciones fiscales (SAT 32-D)",
  },
  {
    key: "constancia_fiscal",
    nombre: "Constancia de situación fiscal",
    labelShort: "Constancia fiscal",
    descripcion: "Constancia de situación fiscal emitida por el SAT no mayor a 3 meses",
  },
  {
    key: "comprobante_domicilio",
    nombre: "Comprobante de domicilio",
    labelShort: "Comprobante domicilio",
    descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
  },
  {
    key: "caratula_bancaria",
    nombre: "Carátula bancaria",
    labelShort: "Carátula bancaria",
    descripcion: "Carátula de estado de cuenta bancario con CLABE interbancaria visible",
  },
];

const rows = ref([]);
const loading = ref(false);

const filters = ref({
  search: "",
  tipo_persona: null,
  con_docs_completos: false,
});

const pagination = ref({
  sortBy: "razon_social",
  descending: false,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
});

const columns = [
  {
    name: "razon_social",
    align: "left",
    field: "razon_social",
    label: "Razón Social / RFC",
    sortable: true,
  },
  {
    name: "tipo_persona",
    align: "center",
    field: "tipo_persona",
    label: "Tipo",
    sortable: true,
  },
  {
    name: "contacto",
    align: "left",
    field: "telefono",
    label: "Contacto & Domicilio",
  },
  {
    name: "dias_credito",
    align: "center",
    field: "dias_credito",
    label: "Crédito",
  },
  {
    name: "expediente",
    align: "left",
    label: "Expediente Digital (4 Docs)",
  },
  {
    name: "actions",
    align: "center",
    label: "Acciones",
  },
];

// --- Métodos de Documentos y Estatus ---
const getRegistradorName = (proveedor) => {
  if (!proveedor || !proveedor.registrador) return "";
  const emp = proveedor.registrador.empleado;
  if (emp) {
    const fullName = `${emp.nombre || "" } ${emp.apellido_paterno || ""}`.trim();
    if (fullName) return fullName;
  }
  return proveedor.registrador.name || `Usuario #${proveedor.registered_by}`;
};

/**
 * Determina si el usuario autenticado tiene permisos para editar la información
 * o subir/reemplazar documentos del proveedor:
 * 1. Usuarios con rol "Proveedores" o "Admin".
 * 2. El usuario que dio de alta al proveedor (registered_by).
 */
const canEditProveedor = (proveedor) => {
  if (!proveedor) return false;
  if (typeof proveedor.can_edit === "boolean") {
    return proveedor.can_edit;
  }
  if (checkRole("Proveedores") || checkRole("Admin")) {
    return true;
  }
  const currentUserId = authStore.authUser?.id;
  const regId = proveedor.registered_by || proveedor.registrador?.id;
  if (currentUserId && regId && Number(regId) === Number(currentUserId)) {
    return true;
  }
  return false;
};

/**
 * Usuarios autorizados para validar o rechazar documentos (rol "Proveedores" o "Admin").
 */
const canValidateDoc = computed(() => {
  return checkRole("Proveedores") || checkRole("Admin");
});

const getDocRecord = (proveedor, docNombre) => {
  if (!proveedor || !Array.isArray(proveedor.docs)) return null;
  return proveedor.docs.find((d) => (d.nombre_doc || "").trim().toLowerCase() === docNombre.trim().toLowerCase()) || null;
};

const getDocBadgeColor = (doc) => {
  if (!doc) return "grey-5";
  const estatus = (doc.estatus?.nombre || "").trim().toLowerCase();
  if (estatus === "validado") return "positive";
  if (estatus === "corregir") return "negative";
  if (estatus === "por validar") return "warning";
  return "orange";
};

const getDocBadgeLabel = (doc) => {
  if (!doc) return "Pendiente";
  return doc.estatus?.nombre || "Por Validar";
};

const getDocIcon = (doc) => {
  if (!doc) return "radio_button_unchecked";
  const estatus = (doc.estatus?.nombre || "").trim().toLowerCase();
  if (estatus === "validado") return "check_circle";
  if (estatus === "corregir") return "cancel";
  return "hourglass_top";
};

const getDocIconColor = (doc) => {
  if (!doc) return "grey-5";
  const estatus = (doc.estatus?.nombre || "").trim().toLowerCase();
  if (estatus === "validado") return "positive";
  if (estatus === "corregir") return "negative";
  return "warning";
};

const getDocBgClass = (doc) => {
  if (!doc) return "bg-grey-1";
  const estatus = (doc.estatus?.nombre || "").trim().toLowerCase();
  if (estatus === "validado") return "bg-green-1";
  if (estatus === "corregir") return "bg-red-1";
  return "bg-amber-1";
};

const formatDate = (val) => {
  if (!val) return "-";
  return date.formatDate(val, "DD/MM/YYYY hh:mm A");
};

const formatDateOnly = (val) => {
  if (!val) return "-";
  return date.formatDate(val, "DD/MM/YYYY");
};

const isDocExpired = (val) => {
  if (!val) return false;
  const exp = new Date(`${val}T23:59:59`);
  return !isNaN(exp.getTime()) && exp < new Date();
};

const getDefaultExpirationDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return date.formatDate(d, "YYYY-MM-DD");
};

const openPdf = (url) => {
  if (!url) {
    $q.notify({ type: "warning", message: "La URL del documento no está disponible." });
    return;
  }
  window.open(url, "_blank");
};

// --- Carga de Proveedores ---
const getRows = async (page = 1) => {
  loading.value = true;
  try {
    const payload = {
      search: filters.value.search?.trim() || null,
      tipo_persona: filters.value.tipo_persona || null,
      con_docs_completos: filters.value.con_docs_completos ? 1 : null,
      page,
      per_page: pagination.value.rowsPerPage,
    };

    const res = await sendRequest("POST", payload, "/api/proveedores", "");
    if (res && res.data) {
      rows.value = res.data;
      pagination.value.page = res.current_page || 1;
      pagination.value.rowsNumber = res.total || 0;
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

const onSearchChange = () => {
  getRows(1);
};

// --- Validación en tiempo real de RFC ---
const createRfcInputRef = ref(null);
const editRfcInputRef = ref(null);

const checkingRfcCreate = ref(false);
const createRfcDuplicate = ref(false);
const createRfcDuplicateName = ref("");
const createRfcChecked = ref(false);

const checkingRfcEdit = ref(false);
const editRfcDuplicate = ref(false);
const editRfcDuplicateName = ref("");
const editRfcChecked = ref(false);

let debounceTimerCreate = null;
let debounceTimerEdit = null;

const sanitizeRfc = (val) => {
  if (!val) return "";
  return String(val).toUpperCase().replace(/[^A-Z0-9&Ñ]/gi, "").trim();
};

const onCreateRfcChange = (val) => {
  const clean = sanitizeRfc(val);
  createForm.value.rfc = clean;
  createRfcChecked.value = false;

  if (debounceTimerCreate) clearTimeout(debounceTimerCreate);

  if (!clean || clean.length < 12) {
    createRfcDuplicate.value = false;
    createRfcDuplicateName.value = "";
    return;
  }

  // Comprobar enseguida con debounce corto
  debounceTimerCreate = setTimeout(() => {
    checkCreateRfcDuplicate();
  }, 350);
};

const checkCreateRfcDuplicate = async () => {
  const rfc = sanitizeRfc(createForm.value.rfc);
  if (!rfc || rfc.length < 12) {
    createRfcDuplicate.value = false;
    createRfcDuplicateName.value = "";
    createRfcChecked.value = false;
    return;
  }
  checkingRfcCreate.value = true;
  try {
    const res = await api.post("/api/proveedor/check-rfc", { rfc });
    if (res?.data?.data?.exists) {
      createRfcDuplicate.value = true;
      createRfcDuplicateName.value = res.data.data.proveedor?.razon_social || "otro proveedor";
      createRfcChecked.value = false;
    } else {
      createRfcDuplicate.value = false;
      createRfcDuplicateName.value = "";
      createRfcChecked.value = true;
    }
  } catch (err) {
    console.error("Error al validar RFC:", err);
  } finally {
    checkingRfcCreate.value = false;
  }
};

const onEditRfcChange = (val) => {
  const clean = sanitizeRfc(val);
  editForm.value.rfc = clean;
  editRfcChecked.value = false;

  if (debounceTimerEdit) clearTimeout(debounceTimerEdit);

  if (!clean || clean.length < 12) {
    editRfcDuplicate.value = false;
    editRfcDuplicateName.value = "";
    return;
  }

  debounceTimerEdit = setTimeout(() => {
    checkEditRfcDuplicate();
  }, 350);
};

const checkEditRfcDuplicate = async () => {
  const rfc = sanitizeRfc(editForm.value.rfc);
  if (!rfc || rfc.length < 12) {
    editRfcDuplicate.value = false;
    editRfcDuplicateName.value = "";
    editRfcChecked.value = false;
    return;
  }
  checkingRfcEdit.value = true;
  try {
    const res = await api.post("/api/proveedor/check-rfc", {
      rfc,
      exclude_id: editForm.value.id,
    });
    if (res?.data?.data?.exists) {
      editRfcDuplicate.value = true;
      editRfcDuplicateName.value = res.data.data.proveedor?.razon_social || "otro proveedor";
      editRfcChecked.value = false;
    } else {
      editRfcDuplicate.value = false;
      editRfcDuplicateName.value = "";
      editRfcChecked.value = true;
    }
  } catch (err) {
    console.error("Error al validar RFC:", err);
  } finally {
    checkingRfcEdit.value = false;
  }
};

// --- MODAL CREAR PROVEEDOR ---
const showCreateModal = ref(false);
const createFormRef = ref(null);
const submittingCreate = ref(false);

const createForm = ref({
  razon_social: "",
  tipo_persona: "Moral",
  rfc: "",
  domicilio: "",
  correo: "",
  telefono: "",
  dias_credito: "",
  descripcion: "",
});

const docFiles = ref({
  opinion_positiva: null,
  constancia_fiscal: null,
  comprobante_domicilio: null,
  caratula_bancaria: null,
});

const docVencimientos = ref({
  opinion_positiva: getDefaultExpirationDate(),
  constancia_fiscal: getDefaultExpirationDate(),
  comprobante_domicilio: getDefaultExpirationDate(),
  caratula_bancaria: getDefaultExpirationDate(),
});

const openCreate = () => {
  createForm.value = {
    razon_social: "",
    tipo_persona: "Moral",
    rfc: "",
    domicilio: "",
    correo: "",
    telefono: "",
    dias_credito: "",
    descripcion: "",
  };
  docFiles.value = {
    opinion_positiva: null,
    constancia_fiscal: null,
    comprobante_domicilio: null,
    caratula_bancaria: null,
  };
  const defaultExp = getDefaultExpirationDate();
  docVencimientos.value = {
    opinion_positiva: defaultExp,
    constancia_fiscal: defaultExp,
    comprobante_domicilio: defaultExp,
    caratula_bancaria: defaultExp,
  };
  createRfcDuplicate.value = false;
  createRfcDuplicateName.value = "";
  createRfcChecked.value = false;
  showCreateModal.value = true;
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const onFileRejected = () => {
  $q.notify({
    type: "negative",
    message: "El archivo no es válido. Asegúrese de que sea exclusivamente PDF de máximo 15 MB.",
  });
};

const submitCreate = async () => {
  const isValid = await createFormRef.value.validate();
  if (!isValid) return;

  if (createRfcDuplicate.value) {
    if (createRfcInputRef.value) {
      createRfcInputRef.value.focus();
    }
    return;
  }

  submittingCreate.value = true;
  try {
    const documentosPayload = [];

    if (docFiles.value.opinion_positiva) {
      const base64 = await fileToBase64(docFiles.value.opinion_positiva);
      documentosPayload.push({
        nombre_doc: "Opinión positiva",
        base64,
        fecha_vencimiento: docVencimientos.value.opinion_positiva || null,
      });
    }

    if (docFiles.value.constancia_fiscal) {
      const base64 = await fileToBase64(docFiles.value.constancia_fiscal);
      documentosPayload.push({
        nombre_doc: "Constancia de situación fiscal",
        base64,
        fecha_vencimiento: docVencimientos.value.constancia_fiscal || null,
      });
    }

    if (docFiles.value.comprobante_domicilio) {
      const base64 = await fileToBase64(docFiles.value.comprobante_domicilio);
      documentosPayload.push({
        nombre_doc: "Comprobante de domicilio",
        base64,
        fecha_vencimiento: docVencimientos.value.comprobante_domicilio || null,
      });
    }

    if (docFiles.value.caratula_bancaria) {
      const base64 = await fileToBase64(docFiles.value.caratula_bancaria);
      documentosPayload.push({
        nombre_doc: "Carátula bancaria",
        base64,
        fecha_vencimiento: docVencimientos.value.caratula_bancaria || null,
      });
    }

    const payload = {
      ...createForm.value,
      documentos: documentosPayload,
    };

    const res = await sendRequest("POST", payload, "/api/proveedor", "");
    if (res) {
      showCreateModal.value = false;
      await getRows(1);
    }
  } finally {
    submittingCreate.value = false;
  }
};

// --- MODAL EXPEDIENTE COMPLETO ---
const showExpedienteModal = ref(false);
const selectedProveedor = ref(null);

const openExpediente = (proveedor) => {
  selectedProveedor.value = proveedor;
  showExpedienteModal.value = true;
};

// --- MODAL SUBIR DOCUMENTO INDIVIDUAL ---
const showUploadDocModal = ref(false);
const uploadingDoc = ref(false);
const uploadDocData = ref({
  proveedor: null,
  nombre_doc: null,
  file: null,
  fecha_vencimiento: getDefaultExpirationDate(),
  notas: "",
});

const openUploadSingleDoc = (proveedor) => {
  if (!canEditProveedor(proveedor)) {
    $q.notify({
      type: "warning",
      message: "Solo el usuario que registró este proveedor o usuarios con rol 'Proveedores' pueden subir documentos.",
    });
    return;
  }
  uploadDocData.value = {
    proveedor,
    nombre_doc: null,
    file: null,
    fecha_vencimiento: getDefaultExpirationDate(),
    notas: "",
  };
  showUploadDocModal.value = true;
};

const promptUploadDoc = (proveedor, docNombre) => {
  if (!canEditProveedor(proveedor)) {
    $q.notify({
      type: "warning",
      message: "No tienes permisos para subir o actualizar documentos de este proveedor.",
    });
    return;
  }
  const existingDoc = getDocRecord(proveedor, docNombre);
  uploadDocData.value = {
    proveedor,
    nombre_doc: docNombre,
    file: null,
    fecha_vencimiento: existingDoc?.fecha_vencimiento
      ? date.formatDate(existingDoc.fecha_vencimiento, "YYYY-MM-DD")
      : getDefaultExpirationDate(),
    notas: "",
  };
  showUploadDocModal.value = true;
};

const submitSingleDocUpload = async () => {
  if (!uploadDocData.value.file || !uploadDocData.value.nombre_doc) {
    $q.notify({ type: "warning", message: "Seleccione el tipo de documento y el archivo PDF." });
    return;
  }

  uploadingDoc.value = true;
  try {
    const base64 = await fileToBase64(uploadDocData.value.file);
    const provId = uploadDocData.value.proveedor.id;

    const payload = {
      nombre_doc: uploadDocData.value.nombre_doc,
      base64,
      fecha_vencimiento: uploadDocData.value.fecha_vencimiento || null,
      notas: uploadDocData.value.notas || null,
    };

    const res = await sendRequest("POST", payload, `/api/proveedor/${provId}/documento`, "");
    if (res) {
      showUploadDocModal.value = false;

      // Actualizar proveedor en lista y en expediente
      await getRows(pagination.value.page);
      if (selectedProveedor.value && selectedProveedor.value.id === provId) {
        const updated = rows.value.find((r) => r.id === provId);
        if (updated) selectedProveedor.value = updated;
      }
    }
  } finally {
    uploadingDoc.value = false;
  }
};

// --- ACCIONES DE VALIDACIÓN / CORRECCIÓN DE DOCUMENTOS ---
const quickChangeDocStatus = async (doc, newStatusId) => {
  if (!canValidateDoc.value) {
    $q.notify({
      type: "warning",
      message: "Solo los usuarios con rol 'Proveedores' pueden validar documentos.",
    });
    return;
  }
  try {
    const res = await sendRequest(
      "PUT",
      { estatus_id: newStatusId },
      `/api/proveedor-doc/${doc.id}/status`,
      ""
    );
    if (res) {
      await getRows(pagination.value.page);
      if (selectedProveedor.value) {
        const updated = rows.value.find((r) => r.id === selectedProveedor.value.id);
        if (updated) selectedProveedor.value = updated;
      }
    }
  } catch (e) {
    // handled
  }
};

const promptRejectDoc = (doc) => {
  if (!canValidateDoc.value) {
    $q.notify({
      type: "warning",
      message: "Solo los usuarios con rol 'Proveedores' pueden solicitar corrección de documentos.",
    });
    return;
  }
  $q.dialog({
    title: "Solicitar Corrección de Documento",
    message: "Ingrese las observaciones o motivo por el cual se rechaza el documento:",
    prompt: {
      model: "",
      type: "textarea",
      placeholder: "Ej. El documento no es legible o se encuentra vencido...",
    },
    cancel: true,
    persistent: true,
    ok: {
      label: "Enviar a Corrección",
      color: "negative",
    },
  }).onOk(async (notas) => {
    try {
      const res = await sendRequest(
        "PUT",
        {
          estatus_id: 184, // Corregir
          notas: notas || "Documento rechazado para corrección.",
        },
        `/api/proveedor-doc/${doc.id}/status`,
        ""
      );
      if (res) {
        await getRows(pagination.value.page);
        if (selectedProveedor.value) {
          const updated = rows.value.find((r) => r.id === selectedProveedor.value.id);
          if (updated) selectedProveedor.value = updated;
        }
      }
    } catch (e) {}
  });
};

// --- MODAL EDITAR PROVEEDOR ---
const showEditModal = ref(false);
const editFormRef = ref(null);
const submittingEdit = ref(false);
const editForm = ref({
  id: null,
  razon_social: "",
  tipo_persona: "Moral",
  rfc: "",
  domicilio: "",
  correo: "",
  telefono: "",
  dias_credito: "",
  descripcion: "",
});

const openEdit = (proveedor) => {
  if (!canEditProveedor(proveedor)) {
    $q.notify({
      type: "warning",
      message: "No tienes permisos para editar este proveedor. Solo puede ser editado por el usuario que lo registró o por usuarios con rol 'Proveedores'.",
    });
    return;
  }
  editForm.value = {
    id: proveedor.id,
    razon_social: proveedor.razon_social,
    tipo_persona: proveedor.tipo_persona || "Moral",
    rfc: proveedor.rfc || "",
    domicilio: proveedor.domicilio || "",
    correo: proveedor.correo || "",
    telefono: proveedor.telefono || "",
    dias_credito: proveedor.dias_credito || "",
    descripcion: proveedor.descripcion || "",
  };
  editRfcDuplicate.value = false;
  editRfcDuplicateName.value = "";
  editRfcChecked.value = false;
  showEditModal.value = true;
};

const submitEdit = async () => {
  const isValid = await editFormRef.value.validate();
  if (!isValid) return;

  if (editRfcDuplicate.value) {
    if (editRfcInputRef.value) {
      editRfcInputRef.value.focus();
    }
    return;
  }

  submittingEdit.value = true;
  try {
    const res = await sendRequest(
      "PUT",
      editForm.value,
      `/api/proveedor/${editForm.value.id}`,
      ""
    );
    if (res) {
      showEditModal.value = false;
      await getRows(pagination.value.page);
    }
  } finally {
    submittingEdit.value = false;
  }
};

onMounted(() => {
  getRows(1);
});
</script>

<style scoped>
.uppercase-input :deep(input) {
  text-transform: uppercase;
}
.border-blue {
  border: 1px solid #bfdbfe !important;
}
</style>
