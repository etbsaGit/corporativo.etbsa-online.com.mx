<template>
  <q-form class="q-gutter-y-sm text-uppercase">
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

const formLinea = ref({
  nombre: null
});

defineExpose({
  formLinea
});
</script>
