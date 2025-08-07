<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCandidato.nombre"
          outlined
          dense
          label="Nombre"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCandidato.telefono"
          outlined
          dense
          label="Telefono"
          mask="(###) ### - ####"
          :rules="[
            (val) => !!val || 'Obligatorio',
            (val) => /^\d{10}$/.test(val) || 'Debe tener 10 dígitos',
          ]"
          unmasked-value
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formCandidato.status_1"
          :options="estatuses1"
          label="Estatus 1"
          outlined
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          outlined
          dense
          v-model="formCandidato.fecha_entrevista_1"
          mask="date"
          label="Fecha de entrevista"
          readonly
          hint
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date minimal v-model="formCandidato.fecha_entrevista_1">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formCandidato.forma_reclutamiento"
          :options="formasReclutamiento"
          label="Forma de reclutamiento"
          outlined
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formCandidato.status_2"
          :options="estatuses2"
          label="Estatus 2"
          outlined
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          outlined
          dense
          v-model="formCandidato.fecha_ingreso"
          mask="date"
          label="Fecha de ingreso"
          readonly
          hint
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date minimal v-model="formCandidato.fecha_ingreso">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCandidato.descripcion"
          outlined
          dense
          type="textarea"
          label="Descripcion general del candidato"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-file
          clearable
          color="secondary"
          dense
          outlined
          v-model="formCandidato.file"
          label="Subir CV"
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif"
          @clear="formCandidato.base64 = null"
          @input="convertirFile($event)"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <div class="text-h6 text-center">- Notas -</div>
      </q-item-section>
    </q-item>
    <q-item v-for="(nota, index) in formCandidato.notas" :key="index">
      <q-item-section>
        <q-input
          v-model="nota.nota"
          outlined
          dense
          hint
          label="Nota"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:before>
            <q-btn
              align="left"
              icon="delete"
              color="red"
              outline
              dense
              rounded
              @click="deleteNote(index)"
            />
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar nota"
          @click="pushNote"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { sendRequest } from "src/boot/functions";

const { requisicion, candidato } = defineProps(["requisicion", "candidato"]);

const path = candidato ? candidato.cvpath : null;

const myForm = ref(null);
const estatuses1 = ref(["Programar entrevista", "Entrevista realizada"]);
const estatuses2 = ref([
  "Pendiente por definir",
  "Solicitar CB",
  "Solicitar ES",
  "En espera de documentacion",
  "Descartado",
  "Contratado",
]);

const formasReclutamiento = ref(["Interna", "Externa", "Recomendado"]);

const formCandidato = ref({
  id: candidato ? candidato.id : null,
  nombre: candidato ? candidato.nombre : null,
  telefono: candidato ? candidato.telefono : null,
  descripcion: candidato ? candidato.descripcion : null,
  status_1: candidato ? candidato.status_1 : null,
  fecha_entrevista_1: candidato ? candidato.fecha_entrevista_1 : null,
  forma_reclutamiento: candidato ? candidato.forma_reclutamiento : null,
  status_2: candidato ? candidato.status_2 : null,
  fecha_ingreso: candidato ? candidato.fecha_ingreso : null,
  requisicion_id: candidato ? candidato.requisicion_id : requisicion.id,

  base64: null,
  file: [],

  notas: candidato ? candidato.notas : [],
});

const pushNote = () => {
  formCandidato.value.notas.push({
    id: null,
    nota: null,
  });
};

const deleteNote = async (index) => {
  const nota = formCandidato.value.notas[index];

  if (nota && nota.id) {
    let res = await sendRequest(
      "DELETE",
      null,
      "/api/candidatoNota/" + nota.id,
      ""
    );
  }

  formCandidato.value.notas.splice(index, 1);
};

const convertirFile = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formCandidato.value.base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formCandidato.value.base64.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formCandidato,
  validate,
});
</script>
