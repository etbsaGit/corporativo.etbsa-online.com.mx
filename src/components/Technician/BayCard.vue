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
        <q-input
          v-model="formBay.cliente"
          filled
          dense
          label="Nombre del cliente"
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formBay.maquina"
          filled
          dense
          label="Nombre del maquina"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formBay.descripcion"
          filled
          dense
          label="Descripcion del trabajo"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formBay.tecnico_id"
          :options="tecnicos"
          label="Tecnico a cargo"
          option-value="id"
          option-label="nombreCompleto"
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
    <q-item>
      <q-item-section>
        <q-select
          v-model="formBay.status"
          :options="status"
          label="status"
          option-value="nombre"
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
import { ref, onMounted, watch } from "vue";
import { sendRequest } from "src/boot/functions";

const { bay } = defineProps(["bay"]);

const myForm = ref(null);

const sucursales = ref([]);
const lineas = ref([]);
const tecnicos = ref([]);

const status = [
  {
    name: "Trabajo Pendiente",
    color: "Rojo",
  },
  {
    name: "En Proceso",
    color: "Amarillo",
  },
  {
    name: "En Espera de Piezas",
    color: "Azul",
  },
  {
    name: "Fecha de Entrega Expirada",
    color: "Naranja",
  },
  {
    name: "Trabajo Completo",
    color: "Verde",
  },
  {
    name: "En Espera de Diagnóstico",
    color: "Morado",
  },
  // Puedes agregar más objetos según sea necesario
];

const formBay = ref({
  nombre: bay ? bay.nombre : null,
  cliente: bay ? bay.cliente : null,
  maquina: bay ? bay.maquina : null,
  descripcion: bay ? bay.descripcion : null,
  status: bay ? bay.status : null,
  tecnico_id: bay ? bay.tecnico_id : null,
  sucursal_id: bay ? bay.sucursal_id : null,
  linea_id: bay ? bay.linea_id : null,
});

const getBaysForms = async () => {
  let res = await sendRequest("GET", null, "/api/bays/forms", "");
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
};

const getTecnicos = async () => {
  if (formBay.value.sucursal_id && formBay.value.linea_id) {
    let res = await sendRequest(
      "GET",
      null,
      "/api/bays/tech/" +
        formBay.value.sucursal_id +
        "/" +
        formBay.value.linea_id,
      ""
    );
    tecnicos.value = res;
  } else {
    tecnicos.value = [];
  }
};

watch([() => formBay.value.sucursal_id, () => formBay.value.linea_id], () => {
  formBay.value.tecnico_id = null;
  getTecnicos();
});

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getBaysForms();
  if (formBay.value.sucursal_id && formBay.value.linea_id) {
    getTecnicos();
  }
});

defineExpose({
  formBay,
  validate,
});
</script>
