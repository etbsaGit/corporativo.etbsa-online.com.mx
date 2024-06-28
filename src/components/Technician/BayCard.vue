<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formBay.nombre"
          filled
          dense
          label="Nombre de la bahia"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formBay.sucursal_id"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formBay.linea_id"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-separator></q-separator>

    <q-item>
      <q-item-section>
        <q-select
          v-model="formBay.estatus_id"
          :options="estatus"
          label="Estatus"
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
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { bay } = defineProps(["bay"]);

const myForm = ref(null);

const sucursales = ref([]);
const lineas = ref([]);
const estatus = ref([]);

const formBay = ref({
  nombre: bay ? bay.nombre : null,
  estatus_id: bay ? bay.estatus_id : null,
  sucursal_id: bay ? bay.sucursal_id : null,
  linea_id: bay ? bay.linea_id : null,
});

const getBaysForms = async () => {
  let res = await sendRequest("GET", null, "/api/bays/forms", "");
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  estatus.value = res.estatus;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getBaysForms();
});

defineExpose({
  formBay,
  validate,
});
</script>
