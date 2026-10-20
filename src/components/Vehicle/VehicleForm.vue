<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formVehicle.placas"
          filled
          dense
          label="Placas"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formVehicle.serie"
          filled
          dense
          label="Serie"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formVehicle.estatus_id"
          :options="filteredTypes"
          label="Tipo de vehiculo"
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
          filled
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formVehicle.sucursal_id"
          :options="filteredSucursales"
          label="Sucursal"
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
          filled
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formVehicle.linea_id"
          :options="filteredLineas"
          label="Linea"
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
          filled
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formVehicle.departamento_id"
          :options="filteredDepartamentos"
          label="Departamento"
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
          filled
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { vehicle } = defineProps(["vehicle"]);

const departamentos = ref([]);
const filteredDepartamentos = ref([]);
const lineas = ref([]);
const filteredLineas = ref([]);
const sucursales = ref([]);
const filteredSucursales = ref([]);
const types = ref([]);
const filteredTypes = ref([]);

const myForm = ref(null);

const formVehicle = ref({
  id: vehicle ? vehicle.id : null,
  placas: vehicle ? vehicle.placas : null,
  serie: vehicle ? vehicle.serie : null,
  departamento_id: vehicle ? vehicle.departamento_id : null,
  linea_id: vehicle ? vehicle.linea_id : null,
  sucursal_id: vehicle ? vehicle.sucursal_id : null,
  estatus_id: vehicle ? vehicle.estatus_id : null,
});

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

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/vehicle/forms", "");
  sucursales.value = res.sucursales || [];
  filteredSucursales.value = sucursales.value;
  lineas.value = res.lineas || [];
  filteredLineas.value = lineas.value;
  departamentos.value = res.departamentos || [];
  filteredDepartamentos.value = departamentos.value;
  types.value = res.estatus || [];
  filteredTypes.value = types.value;
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
