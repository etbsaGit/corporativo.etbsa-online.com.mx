<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formDocumento.requisito_id"
          :options="requisitos"
          label="Requisito"
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
  </q-form>
</template>

<script setup>
import { sendRequest } from "src/boot/functions";
import { onMounted, ref } from "vue";

const { empleado } = defineProps(["empleado"]);
const requisitos = ref([]);
const myForm = ref(null);

const formDocumento = ref({
  requisito_id: null,
  expediente_id: empleado.archivable[0].id,
});

const obtenerRequisitos = async () => {
  let res = await sendRequest("GET", null, "/api/requisito/all", "");
  requisitos.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  obtenerRequisitos();
});

defineExpose({
  formDocumento,
  validate,
});
</script>
