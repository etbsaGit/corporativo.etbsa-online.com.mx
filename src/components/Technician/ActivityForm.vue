<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formActivity.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formActivity.status_id"
          :options="types"
          label="Tipo de actividad"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { activity } = defineProps(["activity"]);

const types = ref([]);

const myForm = ref(null);

const formActivity = ref({
  id: activity ? activity.id : null,
  nombre: activity ? activity.nombre : null,
  status_id: activity ? activity.status_id : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/estatus/typeActivityTechnician",
    ""
  );
  types.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formActivity,
  validate,
});
</script>
