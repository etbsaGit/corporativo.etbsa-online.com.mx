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
        <q-select
          v-model="formVehicle.estatus_id"
          :options="types"
          label="Tipo de vehiculo"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
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
          :options="sucursales"
          label="Sucursal"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
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
          :options="lineas"
          label="Linea"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
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
          :options="departamentos"
          label="Departamento"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
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
const lineas = ref([]);
const sucursales = ref([]);
const types = ref([]);

const myForm = ref(null);

const formVehicle = ref({
  id: vehicle ? vehicle.id : null,
  placas: vehicle ? vehicle.placas : null,
  departamento_id: vehicle ? vehicle.departamento_id : null,
  linea_id: vehicle ? vehicle.linea_id : null,
  sucursal_id: vehicle ? vehicle.sucursal_id : null,
  estatus_id: vehicle ? vehicle.estatus_id : null,
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/vehicle/forms", "");
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  types.value = res.estatus;
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
