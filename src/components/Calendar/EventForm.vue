<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEvent.title"
          filled
          dense
          label="Titulo"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEvent.description"
          filled
          dense
          label="Descripcion"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEvent.sucursal_id"
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
    </q-item>
    <q-item>
      <q-item-section class="highlight">
        <q-item-label>Hora de salida</q-item-label>
        <q-time v-model="formEvent.start_time" />
      </q-item-section>
      <q-item-section class="highlight">
        <q-item-label>Hora de regreso</q-item-label>
        <q-time v-model="formEvent.end_time" />
      </q-item-section>
    </q-item>
  </q-form>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { storeToRefs } from "pinia";

import { useAuthStore } from "src/stores/auth";

const auth = useAuthStore();
const { user } = storeToRefs(auth);

const { currentDay, event } = defineProps(["currentDay", "event"]);

const myForm = ref(null);
const sucursales = ref([]);

const formatTime = (time) => {
  if (!time) return null;
  const timeArray = time.split(":");
  return `${timeArray[0]}:${timeArray[1]}`;
};

const formEvent = ref({
  title: event ? event.title : null,
  description: event ? event.description : null,
  start_time: event ? formatTime(event.start_time) : null,
  end_time: event ? formatTime(event.end_time) : null,
  date: event ? event.date : currentDay,
  sucursal_id: event ? event.sucursal_id : null,
  empleado_id: user.value.empleado
    ? user.value.empleado.id
    : event
    ? event.empleado_id
    : null,
});

const getSucursales = async () => {
  let res = await sendRequest("GET", null, "/api/sucursal/all", "");
  sucursales.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getSucursales();
});

defineExpose({
  formEvent,
  validate,
});
</script>

<style scoped>
.highlight {
  font-size: 20px; /* Tamaño de fuente grande */
  font-weight: bold; /* Texto en negrita */
  text-align: center; /* Texto centrado */
  padding: 10px; /* Espacio interior */
  border-radius: 10px; /* Bordes redondeados */
}
</style>
