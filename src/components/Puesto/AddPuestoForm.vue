<template>
  <q-form class="q-gutter-y-sm text-uppercase" ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formPuesto.nombre"
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

const myForm = ref(null);

const validate = async () => {
  return await myForm.value.validate();
};

const formPuesto = ref({
  nombre: null
});

defineExpose({
  formPuesto,
  validate
});
</script>
