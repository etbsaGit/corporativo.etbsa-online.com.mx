<template>
  <q-card bordered class="no-shadow">
    <q-item>
      <q-item-section avatar>
        <q-avatar
          size="100px"
          color="primary"
          text-color="white"
          v-if="employee.picture"
        >
          <img :src="employee.picture" alt="Foto del empleado" />
        </q-avatar>
        <q-avatar size="100px" v-else color="primary" text-color="white">
          {{ employee.nombre.charAt(0).toUpperCase()
          }}{{ employee.apellido_paterno.charAt(0).toUpperCase() }}
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-grey-8 text-weight-bold">
          {{ employee.nombre }} {{ employee.segundo_nombre }}
          {{ employee.apellido_paterno }} {{ employee.apellido_materno }}
        </q-item-label>
        <q-item-label caption>
          <strong>Sucursal: </strong>{{ employee.sucursal.nombre }}
        </q-item-label>
        <q-item-label caption>
          <strong>Linea: </strong>{{ employee.linea.nombre }}
        </q-item-label>
        <q-item-label caption>
          <strong>Departamento: </strong>{{ employee.departamento.nombre }}
        </q-item-label>
        <q-item-label caption>
          <strong>Puesto: </strong>{{ employee.puesto.nombre }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            size="sm"
            flat
            round
            icon="fab fa-facebook"
            class="bg-indigo-7 text-white"
          />
        </q-item-label>
        <q-item-label>
          <q-btn
            size="sm"
            flat
            round
            icon="twitter"
            class="bg-info text-white"
            @click="openCareerDialog"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
    <!-- <q-separator></q-separator>
    <q-card-section>
      <div class="q-pa-sm text-grey-8">
        Intro : At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis atque corrupti quos dolores et...
      </div>
    </q-card-section> -->
  </q-card>
  <q-dialog
    v-model="showCareerDialog"
    transition-show="rotate"
    transition-hide="rotate"
    full-height
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">
          Carrera de {{ employee.nombre }} {{ employee.apellido_paterno }}
        </div>
        <q-card-actions align="right">
          <q-btn
            label="Cerrar"
            color="red"
            v-close-popup
            @click="inputsEnabled = false"
          />
          <q-btn label="Agrgear" color="blue" @click="enableInputs" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="inputsEnabled == true">
        <q-input filled dense hint v-model="formCareer.title" label="Titulo" />
        <q-input
          filled
          dense
          v-model="formCareer.date"
          mask="date"
          label="Fecha de entrada"
          hint
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formCareer.date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          filled
          dense
          hint
          v-model="formCareer.description"
          label="Descripcion"
        />
        <q-btn
          dense
          label="Cancelar"
          color="red"
          @click="inputsEnabled = false"
        />
        <q-btn dense label="Agregar" color="green" @click="saveCareer" />
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <employee-time-line
            :careers="employee.career"
            :key="employee.career"
          ></employee-time-line>
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, inject } from "vue";
import { sendRequest } from "src/boot/functions";
import EmployeeTimeLine from "src/components/Career/EmployeeTimeLine.vue";

const { employee } = defineProps(["employee"]);
const bus = inject("bus");

bus.on("career_empty", () => {
  if (!employee.career || employee.career === "") {
    showCareerDialog.value = false;
  }
});

const showCareerDialog = ref(false);

const inputsEnabled = ref(false);

const formCareer = ref({
  title: null,
  date: null,
  description: null,
  empleado_id: employee.id,
});

const enableInputs = () => {
  inputsEnabled.value = true;
};

const saveCareer = async () => {
  let res = await sendRequest("POST", formCareer.value, "/api/career", "");
  bus.emit("new_career");
  inputsEnabled.value = false;
  formCareer.value.title = null;
  formCareer.value.date = null;
  formCareer.value.description = null;
};

const openCareerDialog = () => {
  showCareerDialog.value = true;
};
</script>

<style>
.d-flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}
</style>
