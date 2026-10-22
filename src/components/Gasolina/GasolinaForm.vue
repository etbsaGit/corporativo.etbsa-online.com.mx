<template>
  <q-form ref="myForm" greedy class="q-pa-xs">
    <!-- Encabezado / Título del Formulario -->
    <div
      class="text-subtitle1 text-weight-bold text-primary q-mb-sm flex items-center"
    >
      <q-icon name="local_gas_station" size="sm" class="q-mr-xs text-amber-9" />
      Datos de la Solicitud de Gasolina
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
                      Último KM: {{ formatKm(scope.opt.ultimo_km || 0) }}
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
                Último kilometraje registrado ({{ selectedVehicle.placas || "S/P" }}):
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

          <!-- 2. Fecha de Registro -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model="formGasolina.fecha_elaboracion"
              type="date"
              label="Fecha de Carga *"
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

          <!-- 3. Kilometraje de Carga (KM Evento) -->
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

          <!-- 4. Litros a Cargar -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model.number="formGasolina.cantidad"
              type="number"
              min="1"
              label="Litros a Cargar (Lts) *"
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

          <!-- 5. Empleado Solicitante -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="formGasolina.solicitante_id"
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
            >
              <template v-slot:prepend>
                <q-icon name="person" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- 6. Sucursal con Cargo -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="formGasolina.suc_cargo_id"
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

          <!-- 7. Departamento con Cargo -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="formGasolina.depto_cargo_id"
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
                <q-icon name="apartment" color="grey-7" />
              </template>
            </q-select>
          </div>

          <!-- 8. Descripción (Opcional) -->
          <div class="col-12 col-md-8">
            <q-input
              v-model="formGasolina.descripcion"
              type="textarea"
              rows="2"
              label="Descripción u Observaciones (Opcional)"
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
  </q-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { date } from "quasar";

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

const myForm = ref(null);

const getTodayDate = () => {
  return date.formatDate(Date.now(), "YYYY-MM-DD");
};

const formGasolina = ref({
  id: null,
  vehicle_id: null,
  fecha_elaboracion: getTodayDate(),
  km_evento: null,
  cantidad: null,
  descripcion: "",
  solicitante_id: null,
  suc_cargo_id: null,
  depto_cargo_id: null,
  estatus_id: null,
});

const filteredVehicles = ref([]);
const filteredEmpleados = ref([]);
const filteredSucursalesCargo = ref([]);
const filteredDeptosCargo = ref([]);

const selectedVehicle = computed(() => {
  if (!formGasolina.value.vehicle_id) return null;
  const list = props.allowedVehicles || props.catalogs?.vehicles || [];
  return list.find(
    (v) => Number(v.id) === Number(formGasolina.value.vehicle_id)
  );
});

const ultimoKmUnidad = computed(() => {
  if (!selectedVehicle.value) return 0;
  return Number(selectedVehicle.value.ultimo_km || 0);
});

const servicioGasolinaId = computed(() => {
  const list = props.catalogs?.servicios_cat || [];
  const found = list.find(
    (s) =>
      (s.nombre || "").trim().toLowerCase() === "dispersión de gasolina" ||
      (s.nombre || "").trim().toLowerCase() === "dispersion de gasolina" ||
      Number(s.tipo_servicio_id) === 14
  );
  return found?.id || 3417;
});

const validateKm = (val) => {
  if (val === null || val === undefined || val === "") {
    return "El kilometraje es obligatorio";
  }
  const num = Number(val);
  if (isNaN(num) || num < 0) {
    return "Ingrese un kilometraje válido";
  }
  if (ultimoKmUnidad.value > 0 && num < ultimoKmUnidad.value) {
    return `El kilometraje (${num.toLocaleString()} km) no puede ser menor al último registrado de la unidad (${ultimoKmUnidad.value.toLocaleString()} km)`;
  }
  return true;
};

const validateLitros = (val) => {
  if (val === null || val === undefined || val === "") {
    return "Los litros son obligatorios";
  }
  const num = Number(val);
  if (isNaN(num) || num <= 0) {
    return "Ingrese una cantidad válida mayor a 0";
  }
  return true;
};

const formatKm = (val) => {
  if (val === null || val === undefined || val === "") return "0 km";
  const num = Number(val);
  if (isNaN(num)) return `${val} km`;
  return `${num.toLocaleString("es-MX")} km`;
};

// Filtro de vehículos
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

// Filtro de empleados
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
      const nombre = (e.nombreCompleto || `${e.nombre} ${e.apellido_paterno}`)
        .toLowerCase();
      return nombre.includes(q);
    });
  });
};

// Filtro de sucursales cargo
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

// Filtro de deptos cargo
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

// Inicialización de datos para modo edición o creación
const initForm = () => {
  if (props.orden && typeof props.orden === "object") {
    const ord = props.orden;
    const primerDetalle =
      (ord.detalles && ord.detalles[0]) ||
      (ord.detalles_servicio && ord.detalles_servicio[0]) ||
      {};

    formGasolina.value = {
      id: ord.id,
      vehicle_id: ord.vehicle_id,
      fecha_elaboracion: ord.fecha_elaboracion || getTodayDate(),
      km_evento:
        primerDetalle.km_evento !== undefined && primerDetalle.km_evento !== null
          ? Number(primerDetalle.km_evento)
          : null,
      cantidad:
        primerDetalle.cantidad !== undefined && primerDetalle.cantidad !== null
          ? Number(primerDetalle.cantidad)
          : null,
      descripcion: primerDetalle.descripcion || "",
      solicitante_id: ord.solicitante_id || null,
      suc_cargo_id: ord.suc_cargo_id || null,
      depto_cargo_id: ord.depto_cargo_id || null,
      estatus_id: ord.estatus_id || null,
    };
  } else {
    formGasolina.value = {
      id: null,
      vehicle_id: props.fixedVehicleId ? Number(props.fixedVehicleId) : null,
      fecha_elaboracion: getTodayDate(),
      km_evento: null,
      cantidad: null,
      descripcion: "",
      solicitante_id: null,
      suc_cargo_id: null,
      depto_cargo_id: null,
      estatus_id: null,
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
      filteredVehicles.value =
        props.allowedVehicles || cats.vehicles || [];
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

// Validación para el formulario
const validate = async () => {
  if (!myForm.value) return false;
  return await myForm.value.validate();
};

// Generar payload estructurado para OCGasolinaVehicleController
const getPayload = () => {
  const base = {
    vehicle_id: formGasolina.value.vehicle_id,
    fecha_elaboracion: formGasolina.value.fecha_elaboracion,
    solicitante_id: formGasolina.value.solicitante_id || null,
    suc_cargo_id: formGasolina.value.suc_cargo_id || null,
    depto_cargo_id: formGasolina.value.depto_cargo_id || null,
    detalles: [
      {
        vehicle_id: formGasolina.value.vehicle_id,
        servicio_id: servicioGasolinaId.value,
        km_evento:
          formGasolina.value.km_evento !== null &&
          formGasolina.value.km_evento !== ""
            ? Number(formGasolina.value.km_evento)
            : null,
        cantidad:
          formGasolina.value.cantidad !== null &&
          formGasolina.value.cantidad !== ""
            ? Number(formGasolina.value.cantidad)
            : 1,
        descripcion:
          formGasolina.value.descripcion?.trim() ||
          "Dispersión de gasolina para unidad",
        precio_unitario: null,
        subtotal: null,
        iva: null,
        total: null,
      },
    ],
  };

  if (formGasolina.value.id) {
    base.id = formGasolina.value.id;
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
