<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTipoFactura.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTipoFactura.descripcion"
          filled
          dense
          label="Descripcion"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { tiposFactura } = defineProps(["tiposFactura"]);

const myForm = ref(null);

const formTipoFactura = ref({
  id: tiposFactura ? tiposFactura.id : null,
  nombre: tiposFactura ? tiposFactura.nombre : null,
  descripcion: tiposFactura ? tiposFactura.descripcion : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formTipoFactura,
  validate,
});
</script>
