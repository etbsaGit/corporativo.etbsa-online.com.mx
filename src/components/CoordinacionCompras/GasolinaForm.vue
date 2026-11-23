<template>
  <q-form ref="myForm" greedy class="q-pa-xs">
    <!-- Encabezado / Título del Formulario -->
    <div
      class="text-subtitle1 text-weight-bold text-primary q-mb-sm flex items-center justify-between"
    >
      <div class="flex items-center">
        <q-icon
          name="local_gas_station"
          size="sm"
          class="q-mr-xs text-amber-9"
        />
        Datos de la Solicitud de Dispersión de Gasolina
      </div>
    </div>

    <q-card flat bordered class="bg-grey-1 q-mb-md">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- 1. Vehículo / Unidad -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formGasolina.vehicle_id"
              :options="filteredVehicles"
              label="Unidad / Vehículo *"
              option-value="id"
              :option-label="
                (v) =>
                  v
                    ? `${v.placas || 'S/P'} - ${getVehicleNombre(v)} (${
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
                        ({{ getVehicleNombre(scope.opt) || "Unidad" }})
                      </span>
                    </q-item-label>
                    <q-item-label caption>
                      Serie: {{ scope.opt.serie || "N/A" }} &bull; Sucursal:
                      {{ scope.opt.sucursal?.nombre || "N/A" }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="orange-9" outline>
                      Último KM: {{ formatKm(getVehicleUltimoKm(scope.opt)) }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!-- Indicador de Último Kilometraje de la Unidad -->
            <div
              v-if="selectedVehicle"
              class="q-mt-xs q-px-sm q-py-xs rounded-borders bg-amber-1 text-amber-10 row items-center justify-between border-amber"
            >
              <div class="text-caption text-weight-medium flex items-center">
                <q-icon name="speed" size="16px" class="q-mr-xs" />
                Último kilometraje registrado ({{
                  selectedVehicle.placas || "S/P"
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

          <!-- 2. Kilometraje de Carga (KM Evento) -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model.number="formGasolina.km_evento"
              type="number"
              :min="ultimoKmUnidad > 0 ? ultimoKmUnidad : 0"
              label="Kilometraje Actual (KM) *"
              suffix="km"
              outlined
              dense
              bg-color="white"
              reactive-rules
              :rules="[validateKm]"
            >
              <template v-slot:prepend>
                <q-icon name="speed" color="orange-8" />
              </template>
            </q-input>
          </div>

          <!-- 3. Litros Solicitados -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model.number="formGasolina.lts_solicitados"
              type="number"
              min="1"
              label="Litros Solicitados (Lts) *"
              suffix="L"
              outlined
              dense
              bg-color="white"
              reactive-rules
              :rules="[validateLitros]"
            >
              <template v-slot:prepend>
                <q-icon name="local_gas_station" color="amber-10" />
              </template>
            </q-input>
          </div>

          <!-- 4. Empleado Solicitante -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="formGasolina.solicitado_por"
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
              :disable="!canChangeSolicitante"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- 5. Sucursal con Cargo -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="formGasolina.suc_cargo_id"
              :options="filteredSucursalesCargo"
              label="Sucursal Cargo *"
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
              :rules="[(val) => !!val || 'Seleccione la sucursal con cargo']"
            >
              <template v-slot:prepend>
                <q-icon name="store" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- 6. Departamento con Cargo -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="formGasolina.depto_cargo_id"
              :options="filteredDeptosCargo"
              label="Departamento Cargo *"
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
              :rules="[
                (val) => !!val || 'Seleccione el departamento con cargo',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="apartment" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- 7. Fecha y Hora Requerida de Dispersión -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model="formGasolina.fecha_requerida"
              type="datetime-local"
              label="Fecha y Hora Requerida *"
              stack-label
              outlined
              dense
              bg-color="white"
              :rules="[
                (val) =>
                  !!val ||
                  'Indique la fecha y hora en que se necesita la dispersión',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="event_available" color="primary" />
              </template>
            </q-input>
          </div>

          <!-- 8. URL del Recorrido (Google Maps) -->
          <div class="col-12 col-sm-6 col-md-8">
            <q-input
              v-model="formGasolina.recorrido_url"
              type="url"
              label="URL del Recorrido (Google Maps) *"
              placeholder="Ej. https://maps.app.goo.gl/... o https://www.google.com/maps/dir/..."
              outlined
              dense
              clearable
              bg-color="white"
              :rules="[validateRecorridoUrl]"
            >
              <template v-slot:prepend>
                <q-icon name="route" color="positive" />
              </template>
              <template v-slot:append>
                <q-btn
                  v-if="isValidHttpUrl(formGasolina.recorrido_url)"
                  flat
                  round
                  dense
                  color="primary"
                  icon="open_in_new"
                  type="a"
                  :href="formGasolina.recorrido_url"
                  target="_blank"
                >
                  <q-tooltip>Abrir recorrido en Google Maps</q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>

          <!-- 9. Foto del Kilometraje Real (PNG o JPG) -->
          <div class="col-12 col-md-5">
            <q-file
              v-model="fotoFile"
              label="Foto del Kilometraje Real (PNG / JPG)"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              outlined
              dense
              clearable
              bg-color="white"
              @update:model-value="onFotoSelected"
              @rejected="onFotoRejected"
            >
              <template v-slot:prepend>
                <q-icon name="photo_camera" color="amber-10" />
              </template>
            </q-file>

            <!-- Previsualización de la foto -->
            <div
              v-if="fotoPreviewUrl"
              class="q-mt-xs q-pa-xs bg-white rounded-borders border-amber row items-center justify-between"
            >
              <div class="row items-center q-gutter-x-sm">
                <q-img
                  :src="fotoPreviewUrl"
                  style="width: 56px; height: 42px"
                  fit="cover"
                  class="rounded-borders cursor-pointer shadow-1"
                  @click="showPreviewDialog = true"
                />
                <div>
                  <div class="text-caption text-weight-bold text-primary">
                    Evidencia de KM lista
                  </div>
                  <q-btn
                    flat
                    dense
                    no-caps
                    size="xs"
                    color="primary"
                    icon="zoom_in"
                    label="Ver imagen completa"
                    @click="showPreviewDialog = true"
                  />
                </div>
              </div>
              <q-btn
                flat
                round
                dense
                size="sm"
                color="negative"
                icon="delete"
                @click="clearFotoKm"
              >
                <q-tooltip>Quitar foto del kilometraje</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- 10. Notas / Observaciones -->
          <div class="col-12 col-md-7">
            <q-input
              v-model="formGasolina.notas"
              type="textarea"
              rows="3"
              label="Notas u Observaciones (Opcional)"
              placeholder="Ej. Dispersión semanal de gasolina para ruta..."
              outlined
              dense
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="notes" color="grey-7" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal para previsualizar foto del kilometraje -->
    <q-dialog v-model="showPreviewDialog">
      <q-card style="width: 720px; max-width: 95vw">
        <q-card-section
          class="row items-center justify-between bg-primary text-white q-py-sm"
        >
          <div class="text-subtitle1 text-weight-bold flex items-center">
            <q-icon name="photo_camera" class="q-mr-xs" size="20px" />
            Foto del Kilometraje ({{ formatKm(formGasolina.km_evento || 0) }})
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-sm bg-grey-10 flex flex-center">
          <img
            v-if="fotoPreviewUrl"
            :src="fotoPreviewUrl"
            alt="Foto Kilometraje"
            style="max-width: 100%; max-height: 75vh; object-fit: contain"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { date, useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { checkRole, checkPuestoIncludes } from "src/boot/functions";

const props = defineProps({
  orden: {
    type: Object,
    default: null,
  },
  catalogs: {
    type: Object,
    default: () => ({}),
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

const authStore = useAuthStore();
const $q = useQuasar();
const myForm = ref(null);
const fotoFile = ref(null);
const fotoPreviewUrl = ref(null);
const showPreviewDialog = ref(false);

const canChangeSolicitante = computed(() => {
  return (
    checkRole("Admin") ||
    checkPuestoIncludes("Coordinador de compras") ||
    checkPuestoIncludes("Director administrativo")
  );
});

const getDefaultDateTimeLocal = () => {
  return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm");
};

const formatToDateTimeLocal = (val) => {
  if (!val) return getDefaultDateTimeLocal();
  const parsed = new Date(val);
  if (isNaN(parsed.getTime())) return getDefaultDateTimeLocal();
  return date.formatDate(parsed, "YYYY-MM-DDTHH:mm");
};

const formGasolina = ref({
  id: null,
  vehicle_id: null,
  km_evento: null,
  lts_solicitados: null,
  lts_dispersados: null,
  fecha_requerida: getDefaultDateTimeLocal(),
  recorrido_url: "",
  foto_km: null,
  remove_foto_km: false,
  notas: "",
  solicitado_por: null,
  suc_cargo_id: null,
  depto_cargo_id: null,
  estatus_id: null,
});

const onFotoRejected = () => {
  $q.notify({
    type: "negative",
    message: "Solo se permiten imágenes en formato PNG o JPG.",
    position: "top",
  });
};

const onFotoSelected = (file) => {
  if (!file) {
    formGasolina.value.foto_km = null;
    if (!props.orden?.foto_km_url || formGasolina.value.remove_foto_km) {
      fotoPreviewUrl.value = null;
    } else {
      fotoPreviewUrl.value = props.orden.foto_km_url;
    }
    return;
  }

  const validTypes = ["image/png", "image/jpeg", "image/jpg"];
  const ext = (file.name || "").split(".").pop().toLowerCase();
  if (!validTypes.includes(file.type) && !["png", "jpg", "jpeg"].includes(ext)) {
    onFotoRejected();
    fotoFile.value = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Str = e.target?.result;
    formGasolina.value.foto_km = base64Str;
    formGasolina.value.remove_foto_km = false;
    fotoPreviewUrl.value = base64Str;
  };
  reader.readAsDataURL(file);
};

const clearFotoKm = () => {
  fotoFile.value = null;
  formGasolina.value.foto_km = null;
  formGasolina.value.remove_foto_km = true;
  fotoPreviewUrl.value = null;
};

const filteredVehicles = ref([]);
const filteredEmpleados = ref([]);
const filteredSucursalesCargo = ref([]);
const filteredDeptosCargo = ref([]);

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

const getVehicleUltimoKm = (veh) => {
  if (!veh) return 0;
  const catVeh = (props.catalogs?.vehicles || []).find(
    (v) => Number(v.id) === Number(veh.id)
  );
  return Math.max(Number(veh.ultimo_km || 0), Number(catVeh?.ultimo_km || 0));
};

const selectedVehicle = computed(() => {
  if (!formGasolina.value.vehicle_id) return null;
  const list = props.allowedVehicles || props.catalogs?.vehicles || [];
  return (
    list.find((v) => Number(v.id) === Number(formGasolina.value.vehicle_id)) ||
    (props.catalogs?.vehicles || []).find(
      (v) => Number(v.id) === Number(formGasolina.value.vehicle_id)
    ) ||
    null
  );
});

const ultimoKmUnidad = computed(() => {
  if (!selectedVehicle.value) return 0;
  return getVehicleUltimoKm(selectedVehicle.value);
});

const validateKm = (val) => {
  if (val === null || val === undefined || val === "") {
    return "El kilometraje es obligatorio";
  }
  const num = Number(val);
  if (isNaN(num) || num < 0) {
    return "Ingrese un kilometraje válido";
  }
  // Si estamos creando o si cambiamos de unidad, validar contra el último KM
  const isEditingSameVehicle =
    props.orden &&
    Number(props.orden.vehicle_id) === Number(formGasolina.value.vehicle_id);
  if (!isEditingSameVehicle && ultimoKmUnidad.value > 0 && num < ultimoKmUnidad.value) {
    return `El kilometraje (${num.toLocaleString()} km) no puede ser menor al último registrado de la unidad (${ultimoKmUnidad.value.toLocaleString()} km)`;
  }
  return true;
};

const validateLitros = (val) => {
  if (val === null || val === undefined || val === "") {
    return "Los litros solicitados son obligatorios";
  }
  const num = Number(val);
  if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
    return "Ingrese una cantidad entera mayor a 0";
  }
  return true;
};

const isValidHttpUrl = (val) => {
  if (!val || typeof val !== "string") return false;
  try {
    const parsed = new URL(val.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const validateRecorridoUrl = (val) => {
  if (!val || !String(val).trim()) {
    return "La URL del recorrido en Google Maps es obligatoria";
  }
  if (!isValidHttpUrl(val)) {
    return "Ingrese una URL válida que inicie con http:// o https://";
  }
  return true;
};

const formatKm = (val) => {
  if (val === null || val === undefined || val === "") return "0 km";
  const num = Number(val);
  if (isNaN(num)) return `${val} km`;
  return `${num.toLocaleString("es-MX")} km`;
};

const filterVehiclesFn = (val, update) => {
  const baseList = props.allowedVehicles || props.catalogs?.vehicles || [];
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
        getVehicleNombre(v).toLowerCase().includes(q)
    );
  });
};

const filterEmpleadosFn = (val, update) => {
  const baseList = props.catalogs?.empleados || [];
  if (val === "") {
    update(() => {
      filteredEmpleados.value = baseList;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredEmpleados.value = baseList.filter((e) => {
      const nombre = (
        e.nombreCompleto || `${e.nombre} ${e.apellido_paterno}`
      ).toLowerCase();
      return nombre.includes(q);
    });
  });
};

const filterSucursalesCargoFn = (val, update) => {
  const baseList = props.catalogs?.sucursales_cargo || [];
  if (val === "") {
    update(() => {
      filteredSucursalesCargo.value = baseList;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredSucursalesCargo.value = baseList.filter(
      (s) => s.nombre && s.nombre.toLowerCase().includes(q)
    );
  });
};

const filterDeptosCargoFn = (val, update) => {
  const baseList = props.catalogs?.deptos_cargo || [];
  if (val === "") {
    update(() => {
      filteredDeptosCargo.value = baseList;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredDeptosCargo.value = baseList.filter(
      (d) => d.nombre && d.nombre.toLowerCase().includes(q)
    );
  });
};

const initForm = () => {
  if (props.orden && typeof props.orden === "object") {
    const ord = props.orden;
    formGasolina.value = {
      id: ord.id,
      vehicle_id: ord.vehicle_id,
      km_evento:
        ord.km_evento !== undefined && ord.km_evento !== null
          ? Number(ord.km_evento)
          : null,
      lts_solicitados:
        ord.lts_solicitados !== undefined && ord.lts_solicitados !== null
          ? Number(ord.lts_solicitados)
          : null,
      lts_dispersados:
        ord.lts_dispersados !== undefined && ord.lts_dispersados !== null
          ? Number(ord.lts_dispersados)
          : null,
      fecha_requerida: formatToDateTimeLocal(
        ord.fecha_requerida || ord.created_at
      ),
      recorrido_url: ord.recorrido_url || "",
      foto_km: null,
      remove_foto_km: false,
      notas: ord.notas || "",
      solicitado_por: ord.solicitado_por || ord.solicitante_id || null,
      suc_cargo_id: ord.suc_cargo_id || null,
      depto_cargo_id: ord.depto_cargo_id || null,
      estatus_id: ord.estatus_id || null,
    };
    fotoFile.value = null;
    fotoPreviewUrl.value = ord.foto_km_url || null;
  } else {
    const defaultVehId = props.fixedVehicleId
      ? Number(props.fixedVehicleId)
      : null;

    const defaultSolId =
      props.defaultSolicitanteId || authStore.authUser?.empleado?.id || null;

    formGasolina.value = {
      id: null,
      vehicle_id: defaultVehId,
      km_evento: null,
      lts_solicitados: null,
      lts_dispersados: null,
      fecha_requerida: getDefaultDateTimeLocal(),
      recorrido_url: "",
      foto_km: null,
      remove_foto_km: false,
      notas: "",
      solicitado_por: defaultSolId ? Number(defaultSolId) : null,
      suc_cargo_id: null,
      depto_cargo_id: null,
      estatus_id: null,
    };
    fotoFile.value = null;
    fotoPreviewUrl.value = null;
  }

  filteredVehicles.value =
    props.allowedVehicles || props.catalogs?.vehicles || [];
  filteredEmpleados.value = props.catalogs?.empleados || [];
  filteredSucursalesCargo.value = props.catalogs?.sucursales_cargo || [];
  filteredDeptosCargo.value = props.catalogs?.deptos_cargo || [];
};

watch(
  () => props.orden,
  () => {
    initForm();
  },
  { immediate: true }
);

watch(
  () => props.catalogs,
  (cats) => {
    if (cats) {
      filteredVehicles.value = props.allowedVehicles || cats.vehicles || [];
      filteredEmpleados.value = cats.empleados || [];
      filteredSucursalesCargo.value = cats.sucursales_cargo || [];
      filteredDeptosCargo.value = cats.deptos_cargo || [];
    }
  },
  { deep: true }
);

onMounted(() => {
  initForm();
});

const validate = async () => {
  if (!myForm.value) return false;
  return await myForm.value.validate();
};

const getPayload = () => {
  const base = {
    vehicle_id: formGasolina.value.vehicle_id,
    solicitado_por: formGasolina.value.solicitado_por || null,
    suc_cargo_id: formGasolina.value.suc_cargo_id || null,
    depto_cargo_id: formGasolina.value.depto_cargo_id || null,
    lts_solicitados:
      formGasolina.value.lts_solicitados !== null &&
      formGasolina.value.lts_solicitados !== ""
        ? Number(formGasolina.value.lts_solicitados)
        : 1,
    km_evento:
      formGasolina.value.km_evento !== null &&
      formGasolina.value.km_evento !== ""
        ? Number(formGasolina.value.km_evento)
        : null,
    fecha_requerida: formGasolina.value.fecha_requerida
      ? formGasolina.value.fecha_requerida.replace("T", " ")
      : null,
    recorrido_url: formGasolina.value.recorrido_url?.trim() || null,
    foto_km: formGasolina.value.foto_km || null,
    remove_foto_km: Boolean(formGasolina.value.remove_foto_km),
    notas: formGasolina.value.notas?.trim() || null,
  };

  if (formGasolina.value.id) {
    base.id = formGasolina.value.id;
  }
  if (
    formGasolina.value.lts_dispersados !== null &&
    formGasolina.value.lts_dispersados !== undefined &&
    formGasolina.value.lts_dispersados !== ""
  ) {
    base.lts_dispersados = Number(formGasolina.value.lts_dispersados);
  }
  if (formGasolina.value.estatus_id) {
    base.estatus_id = formGasolina.value.estatus_id;
  }

  return base;
};

defineExpose({
  validate,
  get formGasolina() {
    return getPayload();
  },
  getPayload,
});
</script>

<style scoped>
.border-amber {
  border: 1px solid #ffb300;
}
</style>
