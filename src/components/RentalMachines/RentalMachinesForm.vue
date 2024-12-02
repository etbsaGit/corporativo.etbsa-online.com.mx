<template>
  <q-form ref="myForm" greedy>
    <q-item dense>
      <q-item-section class="items-center" avatar>
        <q-avatar square size="280px" v-if="formMachine.base64 || path">
          <q-img :src="formMachine.base64 ? formMachine.base64 : path" />
        </q-avatar>
        <q-avatar square size="280px" v-else>
          <q-icon name="add_photo_alternate" />
        </q-avatar>
        <q-space />
        <q-file
          clearable
          color="secondary"
          dense
          filled
          v-model="formMachine.file"
          label="Subir foto"
          lazy-rules
          accept=".jpg, .jpeg, .png"
          @clear="formMachine.base64 = null"
          @input="convertirFile($event)"
        />
      </q-item-section>
      <q-item-section>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formMachine.serial"
              filled
              dense
              label="# de serie"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formMachine.model"
              filled
              dense
              label="Modelo"
              lazy-rules
              hint
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formMachine.hours"
              filled
              dense
              label="Horas"
              lazy-rules
              hint
              mask="####"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formMachine.status"
              :options="statuses"
              label="Estatus"
              option-value="id"
              option-label="value"
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
              v-model="formMachine.description"
              filled
              dense
              label="Descripcion"
              lazy-rules
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formMachine.comments"
              filled
              dense
              label="Comentarios"
              lazy-rules
            />
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { rentalMachine } = defineProps(["rentalMachine"]);

const path = rentalMachine ? rentalMachine.pic : null;

const myForm = ref(null);

const statuses = [
  { id: "available", value: "Disponible" },
  { id: "rented", value: "Rentado" },
  { id: "maintenance", value: "En mantenimiento" },
];

const formMachine = ref({
  id: rentalMachine ? rentalMachine.id : null,
  serial: rentalMachine ? rentalMachine.serial : null,
  model: rentalMachine ? rentalMachine.model : null,
  description: rentalMachine ? rentalMachine.description : null,
  hours: rentalMachine ? rentalMachine.hours : null,
  comments: rentalMachine ? rentalMachine.comments : null,
  status: rentalMachine ? rentalMachine.status : null,
  base64: null,
  file: [],
});

const convertirFile = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formMachine.value.base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formMachine.value.base64.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formMachine,
  validate,
});
</script>

