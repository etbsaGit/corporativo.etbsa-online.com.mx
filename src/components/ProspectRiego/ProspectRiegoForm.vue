<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formProspectRiego.riego_id"
          :options="riegos"
          label="Tipo de riego"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspectRiego.marca"
          filled
          dense
          label="Marca"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProspectRiego.hectareas_propias"
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
          v-model="formProspectRiego.hectareas_rentadas"
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
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { riego, prospect } = defineProps(["riego", "prospect"]);

const riegos = ref([]);

const myForm = ref(null);

const formProspectRiego = ref({
  id: riego ? riego.id : null,
  hectareas_propias: riego ? riego.hectareas_propias : 0,
  hectareas_rentadas: riego ? riego.hectareas_rentadas : 0,
  marca: riego ? riego.marca : null,
  prospect_id: riego ? riego.prospect_id : prospect.id,
  riego_id: riego ? riego.riego_id : null,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/riego", "");
  riegos.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formProspectRiego,
  validate,
});
</script>
