<template>
  <q-form ref="myForm">
    <q-item>
      <q-item-section>
        <q-select
          v-model="formProspectCultivo.cultivo_id"
          :options="cultivos"
          label="Cultivo"
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
      <q-item-section>
        <q-select
          v-model="formProspectCultivo.tipo_cultivo_id"
          :options="tiposCultivo"
          label="Finalidad del cultivo"
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
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { cultivo, prospect } = defineProps(["cultivo", "prospect"]);

const cultivos = ref([]);
const tiposCultivo = ref([]);

const myForm = ref(null);

const formProspectCultivo = ref({
  id: cultivo ? cultivo.id : null,
  cultivo_id: cultivo ? cultivo.cultivo_id : null,
  tipo_cultivo_id: cultivo ? cultivo.tipo_cultivo_id : null,
  prospect_id: cultivo ? cultivo.prospect_id : prospect.id,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/prospectCultivo/options", "");
  cultivos.value = res.cultivos;
  tiposCultivo.value = res.tiposCultivo;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formProspectCultivo,
  validate,
});
</script>
