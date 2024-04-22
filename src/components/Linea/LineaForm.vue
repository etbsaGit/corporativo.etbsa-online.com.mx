<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formLinea.nombre"
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

const { linea } = defineProps(["linea"]);
const myForm = ref(null);

const formLinea = ref({
  id: linea ? linea.id : null,
  nombre: linea ? linea.nombre : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formLinea,
  validate,
});
</script>
