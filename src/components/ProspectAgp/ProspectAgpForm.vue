<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspectAgp.marca"
          filled
          dense
          label="Marca"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formProspectAgp.equipo"
          filled
          dense
          label="Equipo"
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

const { prospectAgp, prospect } = defineProps(["prospectAgp", "prospect"]);

const myForm = ref(null);

const formProspectAgp = ref({
  id: prospectAgp ? prospectAgp.id : null,
  marca: prospectAgp ? prospectAgp.marca : null,
  equipo: prospectAgp ? prospectAgp.equipo : null,
  prospect_id: prospectAgp ? prospectAgp.prospect_id : prospect.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formProspectAgp,
  validate,
});
</script>
