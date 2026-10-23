<template>
  <q-form ref="myForm" greedy class="q-pa-xs">
    <!-- SECCIÓN 1: Datos Generales de la Orden de Compra -->
    <div
      class="text-subtitle1 text-weight-bold text-primary q-mb-sm flex items-center"
    >
      <q-icon name="receipt_long" size="sm" class="q-mr-xs" />
      Datos de la Orden de Compra
    </div>

    <q-card flat bordered class="bg-grey-1 q-mb-md">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Vehículo -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formService.vehicle_id"
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
                Último kilometraje registrado de la unidad ({{
                  selectedVehicle.placas
                }}):
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
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model="formService.fecha_elaboracion"
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
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model.number="formService.km_evento"
              type="number"
              :min="ultimoKmUnidad > 0 ? ultimoKmUnidad : 0"
              label="Kilometraje (KM) *"
              suffix="km"
              outlined
              dense
              bg-color="white"
              reactive-rules
              :rules="[validateKm]"
              @update:model-value="syncKmToDetalles"
            >
              <template v-slot:prepend>
                <q-icon name="speed" color="orange-8" />
              </template>
            </q-input>
          </div>

          <!-- Proveedor -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formService.proveedor_id"
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
              clearable
              bg-color="white"
              :rules="[(val) => !!val || 'Seleccione un proveedor']"
            >
              <template v-slot:prepend>
                <q-icon name="storefront" color="primary" />
              </template>
            </q-select>
          </div>

          <!-- Solicitante -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formService.solicitante_id"
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
              clearable
              bg-color="white"
              :disable="
                !checkRole('Admin') ||
                !checkPuestoIncludes('Coordinador de compras') ||
                !checkPuestoIncludes('Director administrativo')
              "
            >
              <template v-slot:prepend>
                <q-icon name="person" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- Sucursal con Cargo -->
          <div class="col-12 col-sm-6">
            <q-select
              v-model="formService.suc_cargo_id"
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
              clearable
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="store" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- Departamento con Cargo -->
          <div class="col-12 col-sm-6">
            <q-select
              v-model="formService.depto_cargo_id"
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
              clearable
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="domain" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- Archivo de Cotización en PDF -->
          <div class="col-12">
            <q-file
              v-model="cotizacionFile"
              label="Cotización (Solo PDF)"
              outlined
              dense
              bg-color="white"
              accept=".pdf,application/pdf"
              max-file-size="15728640"
              @rejected="onRejectedFile"
              @update:model-value="onCotizacionFileChange"
              clearable
              @clear="clearCotizacion"
            >
              <template v-slot:prepend>
                <q-icon name="picture_as_pdf" color="red-8" />
              </template>
              <template v-slot:append>
                <q-btn
                  v-if="formService.cotizacion_url"
                  flat
                  round
                  dense
                  color="primary"
                  icon="open_in_new"
                  @click.stop="openPdf(formService.cotizacion_url)"
                >
                  <q-tooltip>Ver cotización cargada</q-tooltip>
                </q-btn>
              </template>
            </q-file>
            <div
              v-if="formService.cotizacion_url && !cotizacionFile"
              class="text-caption text-primary q-mt-xs flex items-center cursor-pointer"
              @click="openPdf(formService.cotizacion_url)"
            >
              <q-icon name="attach_file" size="14px" class="q-mr-xs" />
              <span
                >Cotización registrada previamente (clic aquí para ver el
                PDF)</span
              >
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SECCIÓN 2: Detalles / Conceptos de Compra -->
    <div class="row items-center justify-between q-mb-sm">
      <div
        class="text-subtitle1 text-weight-bold text-primary flex items-center"
      >
        <q-icon name="handyman" size="sm" class="q-mr-xs" />
        Conceptos de la Orden de Compra ({{ formService.detalles.length }})
      </div>
      <q-btn
        unelevated
        dense
        color="primary"
        icon="add_circle"
        label="Agregar otro concepto"
        class="q-px-sm"
        @click="addDetalle"
      />
    </div>

    <div class="q-gutter-y-md">
      <q-card
        v-for="(det, index) in formService.detalles"
        :key="index"
        flat
        bordered
        class="bg-white detail-card"
      >
        <q-card-section
          class="q-py-xs q-px-md bg-blue-grey-1 flex items-center justify-between"
        >
          <div class="text-subtitle2 text-weight-bold text-blue-grey-9">
            Concepto #{{ index + 1 }}
          </div>
          <q-btn
            v-if="formService.detalles.length > 1"
            flat
            dense
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="removeDetalle(index)"
          >
            <q-tooltip>Quitar este concepto</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <!-- Filtro auxiliar por Tipo de Compra -->
            <div class="col-12 col-sm-6 col-md-5">
              <q-select
                v-model="det.tipo_servicio_id"
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
                clearable
                @update:model-value="onTipoChange(det)"
              />
            </div>

            <!-- Servicio específico del catálogo -->
            <div class="col-12 col-sm-6 col-md-7">
              <q-select
                v-model="det.servicio_id"
                :options="getServiciosOptionsForDetail(det)"
                label="Concepto *"
                option-value="id"
                option-label="nombre"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="
                  (val, update) => filterServiciosDetailFn(det, val, update)
                "
                outlined
                dense
                options-dense
                clearable
                :rules="[(val) => !!val || 'Seleccione el concepto']"
                @update:model-value="(val) => onServicioSelect(det, val)"
              />
            </div>

            <!-- Descripción -->
            <div class="col-12">
              <q-input
                v-model="det.descripcion"
                type="textarea"
                rows="2"
                autogrow
                label="Descripción / Detalle del trabajo *"
                outlined
                dense
                :rules="[
                  (val) =>
                    (val && String(val).trim().length > 0) ||
                    'Ingrese la descripción',
                ]"
              />
            </div>

            <!-- Campos de Llantas (Visibles únicamente si Tipo es Refacciones y Concepto es Llanta) -->
            <div v-if="isLlantaService(det)" class="col-12">
              <div class="q-pa-sm rounded-borders bg-grey-1 border-grey">
                <div
                  class="text-caption text-weight-bold text-blue-grey-8 q-mb-xs flex items-center"
                >
                  <q-icon name="tire_repair" size="16px" class="q-mr-xs" />
                  Medidas de Llanta
                </div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model.number="det.llanta_anchura"
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
                      v-model.number="det.llanta_altura"
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
                      v-model.number="det.llanta_rin"
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

            <!-- Cantidad -->
            <div class="col-12 col-sm-4 col-md-2">
              <q-input
                v-model.number="det.cantidad"
                type="number"
                step="1"
                min="1"
                label="Cantidad"
                outlined
                dense
                @update:model-value="onPrecioCantidadChange(det)"
              />
            </div>

            <!-- Precio Unitario -->
            <div class="col-12 col-sm-4 col-md-2">
              <q-input
                v-model.number="det.precio_unitario"
                type="number"
                step="0.01"
                min="0"
                prefix="$"
                label="Precio Unitario"
                outlined
                dense
                @update:model-value="onPrecioCantidadChange(det)"
              />
            </div>

            <!-- Subtotal -->
            <div class="col-12 col-sm-4 col-md-3">
              <q-input
                v-model.number="det.subtotal"
                type="number"
                step="0.01"
                min="0"
                prefix="$"
                label="Subtotal *"
                outlined
                dense
                :rules="[
                  (val) =>
                    (val !== null && val !== '' && Number(val) >= 0) ||
                    'Requerido',
                ]"
                @update:model-value="onSubtotalChange(det)"
              />
            </div>

            <!-- IVA -->
            <div class="col-12 col-sm-6 col-md-2">
              <q-input
                v-model.number="det.iva"
                type="number"
                step="0.01"
                min="0"
                prefix="$"
                label="IVA (16%) *"
                outlined
                dense
                :rules="[
                  (val) =>
                    (val !== null && val !== '' && Number(val) >= 0) ||
                    'Requerido',
                ]"
                @update:model-value="onIvaChange(det)"
              />
            </div>

            <!-- Total -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                v-model.number="det.total"
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
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Resumen Total de la Orden -->
    <q-card flat bordered class="q-mt-md bg-green-1 border-positive">
      <q-card-section class="q-py-sm q-px-md row items-center justify-between">
        <div class="text-subtitle2 text-grey-9">
          Resumen de la Orden ({{ formService.detalles.length }} concepto(s))
        </div>
        <div class="row q-gutter-x-lg items-center">
          <div class="text-caption text-grey-8">
            Subtotal:
            <strong class="text-body2">{{
              formatCurrency(orderTotals.subtotal)
            }}</strong>
          </div>
          <div class="text-caption text-grey-8">
            IVA:
            <strong class="text-body2">{{
              formatCurrency(orderTotals.iva)
            }}</strong>
          </div>
          <div class="text-subtitle1 text-weight-bolder text-positive">
            Total Orden: {{ formatCurrency(orderTotals.total) }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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
const cotizacionFile = ref(null);

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

const todayStr = new Date().toISOString().slice(0, 10);

const createEmptyDetalle = () => ({
  tipo_servicio_id: null,
  servicio_id: null,
  servicioSearch: "",
  km_evento: null,
  descripcion: "",
  cantidad: 1,
  precio_unitario: null,
  llanta_anchura: null,
  llanta_altura: null,
  llanta_rin: null,
  subtotal: 0,
  iva: 0,
  total: 0,
});

const mapInitialDetalles = (srv) => {
  const raw =
    srv?.detalles || srv?.detalles_servicio || srv?.detallesServicio || [];
  if (!raw.length) {
    return [createEmptyDetalle()];
  }
  return raw.map((d) => ({
    id: d.id,
    tipo_servicio_id:
      d.servicio?.tipo_servicio_id ||
      d.servicio?.tipo_servicio?.id ||
      d.servicio?.tipoServicio?.id ||
      null,
    servicio_id: d.servicio_id || d.servicio?.id || null,
    servicioSearch: "",
    km_evento:
      d.km_evento !== null && d.km_evento !== undefined
        ? Number(d.km_evento)
        : null,
    descripcion: d.descripcion || "",
    cantidad:
      d.cantidad !== null && d.cantidad !== undefined ? Number(d.cantidad) : 1,
    precio_unitario:
      d.precio_unitario !== null && d.precio_unitario !== undefined
        ? Number(d.precio_unitario)
        : null,
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
    subtotal: Number(d.subtotal || 0),
    iva: Number(d.iva || 0),
    total: Number(d.total || 0),
  }));
};

const getInitialKm = (srv) => {
  const raw =
    srv?.detalles || srv?.detalles_servicio || srv?.detallesServicio || [];
  const kms = raw.map((d) => Number(d.km_evento || 0)).filter((k) => k > 0);
  return kms.length > 0 ? Math.max(...kms) : null;
};

const formService = ref({
  id: props.service?.id || null,
  vehicle_id:
    props.service?.vehicle_id ||
    (props.fixedVehicleId ? Number(props.fixedVehicleId) : null),
  fecha_elaboracion: props.service?.fecha_elaboracion
    ? String(props.service.fecha_elaboracion).slice(0, 10)
    : todayStr,
  km_evento: getInitialKm(props.service),
  autorizacion_compras: null,
  orden_compra: null,
  factura: null,
  proveedor_id: props.service?.proveedor_id || null,
  solicitante_id:
    props.service?.solicitante_id ||
    (props.defaultSolicitanteId ? Number(props.defaultSolicitanteId) : null),
  suc_cargo_id: props.service?.suc_cargo_id || null,
  depto_cargo_id: props.service?.depto_cargo_id || null,
  cotizacion_url: props.service?.cotizacion_url || null,
  archivo: null,
  base64: null,
  detalles: mapInitialDetalles(props.service),
});

const onRejectedFile = () => {
  $q.notify({
    type: "negative",
    message:
      "El archivo no es válido. Asegúrese de que sea un PDF de máximo 15 MB.",
  });
};

const onCotizacionFileChange = (file) => {
  if (!file) {
    formService.value.archivo = null;
    formService.value.base64 = null;
    return;
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    $q.notify({
      type: "negative",
      message: "Solo se permiten archivos en formato PDF (.pdf).",
    });
    cotizacionFile.value = null;
    formService.value.archivo = null;
    formService.value.base64 = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Data = e.target.result;
    formService.value.base64 = base64Data;
    formService.value.archivo = {
      name: file.name,
      extension: "pdf",
      base64: base64Data,
    };
  };
  reader.readAsDataURL(file);
};

const clearCotizacion = () => {
  cotizacionFile.value = null;
  formService.value.archivo = null;
  formService.value.base64 = null;
};

const openPdf = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};

const syncKmToDetalles = (val) => {
  const kmVal =
    val !== null && val !== "" && val !== undefined ? Number(val) : null;
  formService.value.detalles.forEach((d) => {
    d.km_evento = kmVal;
  });
};

const selectedVehicle = computed(() => {
  if (!formService.value.vehicle_id) return null;
  return (
    vehicles.value.find(
      (v) => Number(v.id) === Number(formService.value.vehicle_id)
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

const addDetalle = () => {
  formService.value.detalles.push({
    ...createEmptyDetalle(),
    km_evento:
      formService.value.km_evento !== null &&
      formService.value.km_evento !== "" &&
      formService.value.km_evento !== undefined
        ? Number(formService.value.km_evento)
        : null,
  });
};

const removeDetalle = (index) => {
  if (formService.value.detalles.length > 1) {
    formService.value.detalles.splice(index, 1);
  }
};

const getServiciosOptionsForDetail = (det) => {
  let list = serviciosCat.value;
  if (det.tipo_servicio_id) {
    list = list.filter(
      (s) => Number(s.tipo_servicio_id) === Number(det.tipo_servicio_id)
    );
  }
  if (det.servicioSearch) {
    const q = det.servicioSearch.toLowerCase();
    list = list.filter((s) => s.nombre && s.nombre.toLowerCase().includes(q));
  }
  return list;
};

const filterServiciosDetailFn = (det, val, update) => {
  update(() => {
    det.servicioSearch = val || "";
  });
};

const isLlantaService = (det) => {
  if (!det?.servicio_id) return false;
  const srv = serviciosCat.value.find(
    (s) => Number(s.id) === Number(det.servicio_id)
  );
  if (!srv) return false;

  const tipoId = det.tipo_servicio_id || srv.tipo_servicio_id;
  const tipoObj =
    tiposServicio.value.find((t) => Number(t.id) === Number(tipoId)) ||
    srv.tipo_servicio ||
    srv.tipoServicio;

  const tipoNombre = (tipoObj?.nombre || "").trim().toLowerCase();
  const servicioNombre = (srv.nombre || "").trim().toLowerCase();

  return tipoNombre.includes("refaccion") && servicioNombre.includes("llanta");
};

const clearLlantaFieldsIfNeeded = (det) => {
  if (!isLlantaService(det)) {
    det.llanta_anchura = null;
    det.llanta_altura = null;
    det.llanta_rin = null;
  }
};

const onTipoChange = (det) => {
  if (det.tipo_servicio_id && det.servicio_id) {
    const found = serviciosCat.value.find(
      (s) => Number(s.id) === Number(det.servicio_id)
    );
    if (
      found &&
      Number(found.tipo_servicio_id) !== Number(det.tipo_servicio_id)
    ) {
      det.servicio_id = null;
    }
  }
  clearLlantaFieldsIfNeeded(det);
};

const onServicioSelect = (det, servicioId) => {
  if (servicioId) {
    const found = serviciosCat.value.find(
      (s) => Number(s.id) === Number(servicioId)
    );
    if (found && found.tipo_servicio_id) {
      det.tipo_servicio_id = found.tipo_servicio_id;
    }
  }
  clearLlantaFieldsIfNeeded(det);
};

const onPrecioCantidadChange = (det) => {
  if (
    det.precio_unitario !== null &&
    det.precio_unitario !== "" &&
    det.precio_unitario !== undefined &&
    det.cantidad !== null &&
    det.cantidad !== "" &&
    det.cantidad !== undefined
  ) {
    const cant = Number(det.cantidad || 1);
    const pu = Number(det.precio_unitario || 0);
    det.subtotal = Number((cant * pu).toFixed(2));
    det.iva = Number((det.subtotal * 0.16).toFixed(2));
    det.total = Number((det.subtotal + det.iva).toFixed(2));
  }
};

const onSubtotalChange = (det) => {
  const sub = Number(det.subtotal || 0);
  det.iva = Number((sub * 0.16).toFixed(2));
  det.total = Number((sub + det.iva).toFixed(2));
};

const onIvaChange = (det) => {
  const sub = Number(det.subtotal || 0);
  const iva = Number(det.iva || 0);
  det.total = Number((sub + iva).toFixed(2));
};

const orderTotals = computed(() => {
  return formService.value.detalles.reduce(
    (acc, d) => {
      acc.subtotal += Number(d.subtotal || 0);
      acc.iva += Number(d.iva || 0);
      acc.total += Number(d.total || 0);
      return acc;
    },
    { subtotal: 0, iva: 0, total: 0 }
  );
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
  syncKmToDetalles(formService.value.km_evento);
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formService,
  validate,
});
</script>

<style scoped>
.detail-card {
  border-left: 4px solid var(--q-primary);
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
