<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCompetencia.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { competencia } = defineProps(["competencia"]);

const myForm = ref(null);

const formCompetencia = ref({
  id: competencia ? competencia.id : null,
  nombre: competencia ? competencia.nombre : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formCompetencia,
  validate,
});
</script>
