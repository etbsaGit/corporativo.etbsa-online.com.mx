<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCategoria.nombre"
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
          v-model="formCategoria.descripcion"
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

const { categoria } = defineProps(["categoria"]);

const myForm = ref(null);

const formCategoria = ref({
  id: categoria ? categoria.id : null,
  nombre: categoria ? categoria.nombre : null,
  descripcion: categoria ? categoria.descripcion : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formCategoria,
  validate,
});
</script>
