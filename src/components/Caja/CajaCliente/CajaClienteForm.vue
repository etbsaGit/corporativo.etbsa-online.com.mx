<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCliente.clave"
          filled
          dense
          label="Clave"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCliente.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { cliente } = defineProps(["cliente"]);

const myForm = ref(null);

const formCliente = ref({
  id: cliente ? cliente.id : null,
  nombre: cliente ? cliente.nombre : null,
  clave: cliente ? cliente.clave : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formCliente,
  validate,
});
</script>
