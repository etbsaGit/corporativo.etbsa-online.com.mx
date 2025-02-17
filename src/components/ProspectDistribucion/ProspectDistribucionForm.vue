<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspectDistribucion.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formProspectDistribucion.ubicacion"
          filled
          dense
          label="Ubicacion"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspectDistribucion.hectareas_propias"
          filled
          dense
          label="Hectareas propias"
          lazy-rules
          hint
          mask="#####"
          reverse-fill-mask
          unmasked-value
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formProspectDistribucion.hectareas_rentadas"
          filled
          dense
          label="Hectareas rentadas"
          lazy-rules
          hint
          mask="#####"
          reverse-fill-mask
          unmasked-value
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { prospectDistribucion, prospect } = defineProps([
  "prospectDistribucion",
  "prospect",
]);

const myForm = ref(null);

const formProspectDistribucion = ref({
  id: prospectDistribucion ? prospectDistribucion.id : null,
  nombre: prospectDistribucion ? prospectDistribucion.nombre : null,
  ubicacion: prospectDistribucion ? prospectDistribucion.ubicacion : null,
  hectareas_propias: prospectDistribucion
    ? prospectDistribucion.hectareas_propias
    : 0,
  hectareas_rentadas: prospectDistribucion
    ? prospectDistribucion.hectareas_rentadas
    : 0,
  prospect_id: prospectDistribucion
    ? prospectDistribucion.prospect_id
    : prospect.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formProspectDistribucion,
  validate,
});
</script>
