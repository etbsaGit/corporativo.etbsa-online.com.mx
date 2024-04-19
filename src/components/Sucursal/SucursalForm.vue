<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSucursal.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSucursal.direccion"
          filled
          dense
          label="Dirección"
          lazy-rules
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
  id: sucursal ? sucursal.id : null,
  nombre: sucursal.nombre,
  direccion: sucursal ? sucursal.direccion : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formSucursal,
  validate,
});
</script>
