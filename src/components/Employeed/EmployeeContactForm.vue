<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formContact.nombre"
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
          v-model="formContact.telefono"
          filled
          dense
          label="Telefono"
          mask="(###) ### - ####"
          unmasked-value
          :rules="[
            (val) => (val && /^\d{10}$/.test(val)) || 'Debe tener 10 dígitos',
          ]"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formContact.kinship_id"
          :options="kinships"
          label="Parentesco"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formContact.direccion"
          filled
          dense
          label="Direccion"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { contact, employee } = defineProps(["contact", "employee"]);

const kinships = ref([]);

const myForm = ref(null);

const formContact = ref({
  id: contact ? contact.id : null,
  nombre: contact ? contact.nombre : null,
  telefono: contact ? contact.telefono : null,
  direccion: contact ? contact.direccion : null,
  kinship_id: contact ? contact.kinship_id : null,
  empleado_id: contact ? contact.empleado_id : employee.id,
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/kinship", "");
  kinships.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formContact,
  validate,
});
</script>

