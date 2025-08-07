<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formBanco.nombre"
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
          v-model="formBanco.descripcion"
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

const { banco } = defineProps(["banco"]);

const myForm = ref(null);

const formBanco = ref({
  id: banco ? banco.id : null,
  nombre: banco ? banco.nombre : null,
  descripcion: banco ? banco.descripcion : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formBanco,
  validate,
});
</script>
