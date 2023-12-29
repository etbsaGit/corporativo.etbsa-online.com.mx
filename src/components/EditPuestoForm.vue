<template>
  <q-form class="q-gutter-y-sm text-uppercase">
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
import { ref, defineProps } from "vue";

const { puesto } = defineProps(["puesto"]);

const formPuesto = ref({
  id: puesto.id,
  nombre: puesto.nombre
});

defineExpose({
  formPuesto
});
</script>
