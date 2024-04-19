<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTech.name"
          filled
          dense
          label="Nombre del tipo de tecnico"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTech.level"
          filled
          dense
          label="nivel del tipo de tecnico"
          mask="##"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item v-for="linea in lineas" :key="linea.id">
      <q-item-section>
        <q-toggle
          v-model="formTech.lineas"
          :label="linea.nombre"
          :val="linea.id"
          color="blue"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { technician, lineas } = defineProps(["technician", "lineas"]);

const myForm = ref(null);

const formTech = ref({
  name: technician ? technician.name : null,
  level: technician ? technician.level : null,
  lineas: [],
});

const validate = async () => {
  return await myForm.value.validate();
};

const marcarToggles = () => {
  if (technician) {
    for (const linea of technician.linea_technician) {
      formTech.value.lineas.push(linea.linea_id);
    }
  }
};

onMounted(() => {
  marcarToggles();
});

defineExpose({
  formTech,
  validate,
});
</script>
