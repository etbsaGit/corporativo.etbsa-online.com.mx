<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTiposPago.nombre"
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
          v-model="formTiposPago.descripcion"
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

const { tiposPagos } = defineProps(["tiposPagos"]);

const myForm = ref(null);

const formTiposPago = ref({
  id: tiposPagos ? tiposPagos.id : null,
  nombre: tiposPagos ? tiposPagos.nombre : null,
  descripcion: tiposPagos ? tiposPagos.descripcion : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formTiposPago,
  validate,
});
</script>
