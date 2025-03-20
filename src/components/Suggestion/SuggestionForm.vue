<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSuggestion.title"
          outlined
          dense
          label="Titulo"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formSuggestion.estatus_id"
          :options="types"
          label="Tipo de situacion"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formSuggestion.description"
          outlined
          dense
          label="Descripcion"
          type="textarea"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="checkRole('RRHH') || formSuggestion.feedback">
      <q-item-section>
        <q-input
          v-model="formSuggestion.feedback"
          outlined
          dense
          label="Retroalimentacion"
          type="textarea"
          lazy-rules
          hint
          :readonly="!checkRole('RRHH')"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="checkRole('RRHH')">
      <q-item-section>
        <q-toggle
          v-model="formSuggestion.application"
          :label="
            formSuggestion.application === 1
              ? 'Concedida'
              : formSuggestion.application === 0
              ? 'Rechazada'
              : 'En proceso'
          "
          :true-value="1"
          :false-value="0"
          :color="
            formSuggestion.application === 1
              ? 'green'
              : formSuggestion.application === 0
              ? 'red'
              : 'amber'
          "
          keep-color
          toggle-indeterminate
          checked-icon="check"
          unchecked-icon="close"
          indeterminate-icon="hourglass_top"
          size="xl"
        />
      </q-item-section>
      <q-item-section>
        <q-toggle
          v-model="formSuggestion.status"
          :label="
            formSuggestion.status === 1
              ? 'Cerrada'
              : formSuggestion.status === 0
              ? 'Abierta'
              : 'En proceso'
          "
          :true-value="1"
          :false-value="0"
          :color="
            formSuggestion.status === 1
              ? 'blue'
              : formSuggestion.status === 0
              ? 'amber'
              : 'amber'
          "
          keep-color
          checked-icon="check"
          unchecked-icon="hourglass_top"
          indeterminate-icon="hourglass_top"
          size="xl"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { checkRole, sendRequest } from "src/boot/functions";
import { useAuthStore } from "src/stores/auth";

const { suggestion } = defineProps(["suggestion"]);

const authStore = useAuthStore();
const usuario = authStore.authUser;

const types = ref([]);

const myForm = ref(null);

const formSuggestion = ref({
  id: suggestion ? suggestion.id : null,
  title: suggestion ? suggestion.title : null,
  status: suggestion ? suggestion.status : 0,
  application: suggestion ? suggestion.application : null,
  description: suggestion ? suggestion.description : null,
  feedback: suggestion ? suggestion.feedback : null,
  estatus_id: suggestion ? suggestion.estatus_id : null,
  user_id: suggestion ? suggestion.user_id : usuario.id,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/estatus/suggestion", "");
  types.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formSuggestion,
  validate,
});
</script>
