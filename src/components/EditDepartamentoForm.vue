<template>
  <q-form class="q-gutter-y-sm text-uppercase">
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
import { ref, defineProps } from "vue";

const { departamento } = defineProps(["departamento"]);

const formDepartamento = ref({
  id: departamento.id,
  nombre: departamento.nombre
});

defineExpose({
  formDepartamento
});
</script>
