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
      <q-badge
        v-if="formGasolina.is_urgente"
        color="negative"
        class="q-px-sm q-py-xs text-weight-bold"
      >
        <q-icon name="priority_high" size="14px" class="q-mr-xs" />
        SOLICITUD URGENTE
      </q-badge>
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

          <!-- 7. Switch Solicitud Urgente -->
          <div class="col-12 col-sm-6 col-md-4">
            <div
              class="q-pa-sm rounded-borders row items-center justify-between full-height"
              :class="
                formGasolina.is_urgente
                  ? 'bg-red-1 border-negative'
                  : 'bg-white border-grey'
              "
            >
              <div class="row items-center no-wrap">
                <q-icon
                  :name="
                    formGasolina.is_urgente
                      ? 'notification_important'
                      : 'schedule'
                  "
                  :color="formGasolina.is_urgente ? 'negative' : 'grey-7'"
                  size="22px"
                  class="q-mr-sm"
                />
                <div>
                  <div
                    class="text-body2 text-weight-bold"
                    :class="
                      formGasolina.is_urgente ? 'text-negative' : 'text-grey-9'
                    "
                  >
                    {{
                      formGasolina.is_urgente
                        ? "Dispersión Urgente"
                        : "Prioridad Normal"
                    }}
                  </div>
                  <div class="text-caption text-grey-7">
                    Marcar si requiere atención inmediata
                  </div>
                </div>
              </div>
              <q-toggle
                v-model="formGasolina.is_urgente"
                color="negative"
                keep-color
              />
            </div>
          </div>

          <!-- 8. Notas / Observaciones -->
          <div class="col-12 col-sm-6 col-md-8">
            <q-input
              v-model="formGasolina.notas"
              type="textarea"
              rows="2"
              :label="
                formGasolina.is_urgente
                  ? 'Notas u Observaciones (Motivo de urgencia) *'
                  : 'Notas u Observaciones (Opcional)'
              "
              :placeholder="
                formGasolina.is_urgente
                  ? 'Indique obligatoriamente el motivo por el cual la dispersión es urgente...'
                  : 'Ej. Dispersión semanal de gasolina para ruta...'
              "
              outlined
              dense
              bg-color="white"
              :rules="[
                (val) =>
                  !formGasolina.is_urgente ||
                  (val && String(val).trim().length > 0) ||
                  'Las notas son obligatorias cuando la dispersión es urgente',
              ]"
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon
                  name="notes"
                  :color="formGasolina.is_urgente ? 'negative' : 'grey-7'"
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
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
const myForm = ref(null);

const canChangeSolicitante = computed(() => {
  return (
    checkRole("Admin") ||
    checkPuestoIncludes("Coordinador de compras") ||
    checkPuestoIncludes("Director administrativo")
  );
});

const formGasolina = ref({
  id: null,
  vehicle_id: null,
  km_evento: null,
  lts_solicitados: null,
  lts_dispersados: null,
  notas: "",
  solicitado_por: null,
  suc_cargo_id: null,
  depto_cargo_id: null,
  estatus_id: null,
  is_urgente: false,
});

const filteredVehicles = ref([]);
const filteredEmpleados = ref([]);
const filteredSucursalesCargo = ref([]);
const filteredDeptosCargo = ref([]);

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
        (v.estatus?.nombre && v.estatus.nombre.toLowerCase().includes(q))
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
      notas: ord.notas || "",
      solicitado_por: ord.solicitado_por || ord.solicitante_id || null,
      suc_cargo_id: ord.suc_cargo_id || null,
      depto_cargo_id: ord.depto_cargo_id || null,
      estatus_id: ord.estatus_id || null,
      is_urgente: Boolean(ord.is_urgente),
    };
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
      notas: "",
      solicitado_por: defaultSolId ? Number(defaultSolId) : null,
      suc_cargo_id: null,
      depto_cargo_id: null,
      estatus_id: null,
      is_urgente: false,
    };
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

watch(
  () => formGasolina.value.is_urgente,
  (isUrgente) => {
    if (!isUrgente && myForm.value) {
      myForm.value.resetValidation();
    }
  }
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
    notas: formGasolina.value.notas?.trim() || null,
    is_urgente: Boolean(formGasolina.value.is_urgente),
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
.border-grey {
  border: 1px solid #e0e0e0;
}
.border-negative {
  border: 1px solid var(--q-negative);
}
</style>
