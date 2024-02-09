<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-item>
      <q-item-section style="max-width: 400px">
        <q-input
          v-model="formSucursal.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formSucursal.direccion"
          filled
          dense
          label="Dirección"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { sucursal } = defineProps(["sucursal"]);
const myForm = ref(null);

const formSucursal = ref({
  id: sucursal.id,
  nombre: sucursal.nombre,
  direccion: sucursal.direccion
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formSucursal,
  validate
});
</script>
