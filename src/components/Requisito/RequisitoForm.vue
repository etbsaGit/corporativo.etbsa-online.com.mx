<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formRequisito.nombre"
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
          v-model="formRequisito.descripcion"
          filled
          dense
          label="Descripcion"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { requisito } = defineProps(["requisito"]);
const myForm = ref(null);

const formRequisito = ref({
  id: requisito ? requisito.id : null,
  nombre: requisito ? requisito.nombre : null,
  descripcion: requisito ? requisito.descripcion : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formRequisito,
  validate,
});
</script>
