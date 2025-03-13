<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section align="center">
        <q-date landscape v-model="formFestivo.fecha" mask="YYYY-MM-DD" />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formFestivo.nombre"
          outlined
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const { festivo } = defineProps(["festivo"]);

const myForm = ref(null);

const formFestivo = ref({
  id: festivo ? festivo.id : null,
  nombre: festivo ? festivo.nombre : null,
  fecha: festivo ? festivo.fecha : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formFestivo,
  validate,
});
</script>
