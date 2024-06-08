<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formEstatus.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formEstatus.tipo_estatus"
          filled
          dense
          label="tipo de estatus"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEstatus.color"
          dense
          readonly
          outlined
          label="color"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-color
          v-model="formEstatus.color"
          no-header
          no-footer
          default-view="palette"
          format-model="auto"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { estatus } = defineProps(["estatus"]);

const myForm = ref(null);

const validate = async () => {
  return await myForm.value.validate();
};

const formEstatus = ref({
  id: estatus ? estatus.id : null,
  nombre: estatus ? estatus.nombre : null,
  tipo_estatus: estatus ? estatus.tipo_estatus : null,
  color: estatus ? estatus.color : null,
});

defineExpose({
  formEstatus,
  validate,
});
</script>
