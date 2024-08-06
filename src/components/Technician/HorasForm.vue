<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formItem.facturadas"
          filled
          dense
          label="Horas facturadas"
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formItem.con_ingreso"
          filled
          dense
          label="Horas disponibles con ingreso"
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { item, month, anio, technician } = defineProps([
  "item",
  "month",
  "anio",
  "technician",
]);

const myForm = ref(null);

const formItem = ref({
  id: item ? item.id : null,
  anio: item ? item.anio : anio,
  mes: item ? item.mes : month.id,
  facturadas: item ? item.facturadas : null,
  con_ingreso: item ? item.con_ingreso : null,
  tecnico_id: item ? item.tecnico_id : technician.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formItem,
  validate,
});
</script>
