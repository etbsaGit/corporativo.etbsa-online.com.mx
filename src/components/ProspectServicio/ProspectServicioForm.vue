<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspectServicio.distribuidor"
          filled
          dense
          label="Distribuidor"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formProspectServicio.ubicacion"
          filled
          dense
          label="Ubicacion"
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

const { prospectServicio, prospect } = defineProps([
  "prospectServicio",
  "prospect",
]);

const myForm = ref(null);

const formProspectServicio = ref({
  id: prospectServicio ? prospectServicio.id : null,
  distribuidor: prospectServicio ? prospectServicio.distribuidor : null,
  ubicacion: prospectServicio ? prospectServicio.ubicacion : null,
  prospect_id: prospectServicio ? prospectServicio.prospect_id : prospect.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formProspectServicio,
  validate,
});
</script>
