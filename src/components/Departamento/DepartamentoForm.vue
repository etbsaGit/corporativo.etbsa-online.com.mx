<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formDepartamento.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { departamento } = defineProps(["departamento"]);
const myForm = ref(null);

const formDepartamento = ref({
  id: departamento ? departamento.id : null,
  nombre: departamento ? departamento.nombre : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formDepartamento,
  validate,
});
</script>
