<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formHerramienta.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[required]"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { required } from "src/boot/rules";

const { herramienta } = defineProps(["herramienta"]);

const myForm = ref(null);

const formHerramienta = ref({
  id: herramienta ? herramienta.id : null,
  nombre: herramienta ? herramienta.nombre : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formHerramienta,
  validate,
});
</script>
