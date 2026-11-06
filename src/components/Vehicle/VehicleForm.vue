<template>
  <q-form ref="myForm" greedy class="q-pa-md">
    <!-- Sección 1: Identificación -->
    <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs flex items-center">
      <q-icon name="badge" class="q-mr-xs" size="sm" />
      Identificación de la Unidad
    </div>
    <q-card flat bordered class="bg-grey-1 q-mb-md">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="formVehicle.placas"
              outlined
              dense
              bg-color="white"
              label="Placas *"
              placeholder="Ej. ABC-123-A"
              lazy-rules
              hide-bottom-space
              @update:model-value="(val) => (formVehicle.placas = val ? val.toUpperCase() : '')"
              :rules="[(val) => (val && val.trim().length > 0) || 'La placa es obligatoria']"
            >
              <template v-slot:prepend>
                <q-icon name="pin" color="primary" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model="formVehicle.serie"
              outlined
              dense
              bg-color="white"
              label="Número de Serie (VIN) *"
              placeholder="17 caracteres"
              lazy-rules
              hide-bottom-space
              @update:model-value="(val) => (formVehicle.serie = val ? val.toUpperCase() : '')"
              :rules="[(val) => (val && val.trim().length > 0) || 'La serie es obligatoria']"
            >
              <template v-slot:prepend>
                <q-icon name="tag" color="primary" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Sección 2: Especificaciones del Vehículo -->
    <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs flex items-center">
      <q-icon name="directions_car" class="q-mr-xs" size="sm" />
      Especificaciones del Vehículo
    </div>
    <q-card flat bordered class="bg-grey-1 q-mb-md">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <q-select
              v-model="formVehicle.marca_id"
              :options="filteredMarcas"
              :loading="loadingForms"
              label="Marca *"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterMarcasFn"
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              hide-bottom-space
              :rules="[(val) => val !== null || 'Seleccione una marca']"
            >
              <template v-slot:prepend>
                <q-icon name="verified" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Sin resultados</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6">
            <q-select
              v-model="formVehicle.modelo_id"
              :options="filteredModelos"
              :loading="loadingForms"
              label="Modelo *"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterModelosFn"
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              hide-bottom-space
              :rules="[(val) => val !== null || 'Seleccione un modelo']"
            >
              <template v-slot:prepend>
                <q-icon name="commute" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Sin resultados</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-5">
            <q-select
              v-model="formVehicle.tipo_id"
              :options="filteredTypes"
              :loading="loadingForms"
              label="Tipo de vehículo *"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterTypesFn"
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              hide-bottom-space
              :rules="[(val) => val !== null || 'Seleccione un tipo']"
            >
              <template v-slot:prepend>
                <q-icon name="local_shipping" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Sin resultados</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-4">
            <q-input
              v-model="formVehicle.version"
              outlined
              dense
              bg-color="white"
              label="Versión"
              placeholder="Ej. SE, XLT, Estándar"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="tune" color="primary" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-3">
            <q-input
              v-model.number="formVehicle.anio"
              type="number"
              outlined
              dense
              bg-color="white"
              label="Año *"
              placeholder="Ej. 2024"
              lazy-rules
              hide-bottom-space
              :rules="[
                (val) => (val !== null && val !== '') || 'Obligatorio',
                (val) => (val >= 1980 && val <= 2100) || 'Año inválido',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="event" color="primary" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Sección 3: Asignación Organizacional -->
    <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs flex items-center">
      <q-icon name="apartment" class="q-mr-xs" size="sm" />
      Asignación Organizacional
    </div>
    <q-card flat bordered class="bg-grey-1">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <q-select
              v-model="formVehicle.sucursal_id"
              :options="filteredSucursales"
              :loading="loadingForms"
              label="Sucursal *"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterSucursalesFn"
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              hide-bottom-space
              :rules="[(val) => val !== null || 'Seleccione una sucursal']"
            >
              <template v-slot:prepend>
                <q-icon name="store" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Sin resultados</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6">
            <q-select
              v-model="formVehicle.linea_id"
              :options="filteredLineas"
              :loading="loadingForms"
              label="Línea *"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterLineasFn"
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              hide-bottom-space
              :rules="[(val) => val !== null || 'Seleccione una línea']"
            >
              <template v-slot:prepend>
                <q-icon name="category" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Sin resultados</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12">
            <q-select
              v-model="formVehicle.departamento_id"
              :options="filteredDepartamentos"
              :loading="loadingForms"
              label="Departamento *"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterDepartamentosFn"
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              options-dense
              bg-color="white"
              hide-bottom-space
              :rules="[(val) => val !== null || 'Seleccione un departamento']"
            >
              <template v-slot:prepend>
                <q-icon name="domain" color="primary" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Sin resultados</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { vehicle, catalogs } = defineProps(["vehicle", "catalogs"]);

const loadingForms = ref(false);
const departamentos = ref([]);
const filteredDepartamentos = ref([]);
const lineas = ref([]);
const filteredLineas = ref([]);
const sucursales = ref([]);
const filteredSucursales = ref([]);
const marcas = ref([]);
const filteredMarcas = ref([]);
const modelos = ref([]);
const filteredModelos = ref([]);
const types = ref([]);
const filteredTypes = ref([]);

const myForm = ref(null);

const formVehicle = ref({
  id: vehicle ? vehicle.id : null,
  placas: vehicle ? vehicle.placas : null,
  serie: vehicle ? vehicle.serie : null,
  marca_id: vehicle ? vehicle.marca_id : null,
  modelo_id: vehicle ? vehicle.modelo_id : null,
  tipo_id: vehicle ? vehicle.tipo_id : null,
  version: vehicle ? vehicle.version : null,
  anio: vehicle ? vehicle.anio : null,
  departamento_id: vehicle ? vehicle.departamento_id : null,
  linea_id: vehicle ? vehicle.linea_id : null,
  sucursal_id: vehicle ? vehicle.sucursal_id : null,
  estatus_id: vehicle ? vehicle.estatus_id : null,
});

const filterMarcasFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredMarcas.value = marcas.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredMarcas.value = marcas.value.filter(
      (m) => m.nombre && m.nombre.toLowerCase().includes(q)
    );
  });
};

const filterModelosFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredModelos.value = modelos.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredModelos.value = modelos.value.filter(
      (m) => m.nombre && m.nombre.toLowerCase().includes(q)
    );
  });
};

const filterTypesFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredTypes.value = types.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredTypes.value = types.value.filter(
      (t) => t.nombre && t.nombre.toLowerCase().includes(q)
    );
  });
};

const filterSucursalesFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredSucursales.value = sucursales.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredSucursales.value = sucursales.value.filter(
      (s) => s.nombre && s.nombre.toLowerCase().includes(q)
    );
  });
};

const filterLineasFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredLineas.value = lineas.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredLineas.value = lineas.value.filter(
      (l) => l.nombre && l.nombre.toLowerCase().includes(q)
    );
  });
};

const filterDepartamentosFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredDepartamentos.value = departamentos.value;
    });
    return;
  }
  update(() => {
    const q = val.toLowerCase();
    filteredDepartamentos.value = departamentos.value.filter(
      (d) => d.nombre && d.nombre.toLowerCase().includes(q)
    );
  });
};

const applyCatalogs = (res) => {
  sucursales.value = res?.sucursales || [];
  filteredSucursales.value = sucursales.value;
  lineas.value = res?.lineas || [];
  filteredLineas.value = lineas.value;
  departamentos.value = res?.departamentos || [];
  filteredDepartamentos.value = departamentos.value;
  marcas.value = res?.marcas || [];
  filteredMarcas.value = marcas.value;
  modelos.value = res?.modelos || [];
  filteredModelos.value = modelos.value;
  types.value = res?.tipos || [];
  filteredTypes.value = types.value;
};

const getForms = async () => {
  if (
    catalogs &&
    (catalogs.sucursales?.length ||
      catalogs.marcas?.length ||
      catalogs.tipos?.length)
  ) {
    applyCatalogs(catalogs);
    return;
  }
  loadingForms.value = true;
  try {
    let res = await sendRequest("GET", null, "/api/vehicle/forms", "");
    applyCatalogs(res);
  } finally {
    loadingForms.value = false;
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formVehicle,
  validate,
});
</script>
