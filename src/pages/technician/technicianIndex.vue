<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md">
      <div class="row">
        <q-btn
          color="primary"
          class="col"
          label="Administrar tipos de tecnicos"
          @click="onClickTable"
        />
      </div>
      <div class="row">
        <q-btn
          class="col"
          color="green"
          style="height: 450px; font-size: 60px"
          @click="onClickAcricola"
        >
          <span class="text-black">Tecnicos Agricola</span>
        </q-btn>
        <q-btn
          class="col"
          color="amber"
          style="height: 450px; font-size: 60px"
          @click="onClickConstruccion"
        >
          <span class="text-black">Tecnicos Construccion</span>
        </q-btn>
      </div>
      <div class="row">
        <q-btn
          class="col"
          color="green-3"
          style="height: 150px; font-size: 35px"
          @click="onClickQuaAgricola"
        >
          <span class="text-grey">Escalafon Agricola</span>
        </q-btn>
        <q-btn
          class="col"
          color="amber-3"
          style="height: 150px; font-size: 35px"
          @click="onClickQuaConstruccion"
        >
          <span class="text-grey">Escalafon Construccion</span>
        </q-btn>
      </div>
    </div>
  </q-page>
  <q-dialog
    v-model="showTecAgricola"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
    full-height
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Tecnicos de Agricola</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <div class="row q-col-gutter-sm">
          <div
            class="col-lg-4 col-md-4 col-xs-12 col-sm-12"
            v-for="(employee, index) in tecAgricola"
            :key="index"
          >
            <employee-card :employee="employee" :key="employee"></employee-card>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="showTecConstruccion"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
    full-height
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Tecnicos de Construccion</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <!-- <q-btn
              label="Clonar encuesta"
              color="blue"
              @click="addSurvey()"
              v-close-popup
            /> -->
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <div class="row q-col-gutter-sm">
          <div
            class="col-lg-4 col-md-4 col-xs-12 col-sm-12"
            v-for="(employee, index) in tecConstruccion"
            :key="index"
          >
            <employee-card :employee="employee" :key="employee">
            </employee-card>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showQualificationsConstruccion"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Cursos de Construccion</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="survey-form-container">
        <edit-level
          :qualifications="qualificationsConstruccion"
          :key="qualificationsConstruccion"
        />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showQualificationsAgricola"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Cursos de Agricola</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="survey-form-container">
        <edit-level
          :qualifications="qualificationsAgricola"
          :key="qualificationsAgricola"
        />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showTable"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
    full-height
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Administrar tipos de tecnicos</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="survey-form-container">
        <technician-table />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { sendRequest } from "src/boot/functions";

import EmployeeCard from "src/components/Technician/EmployeeCard.vue";
import EditLevel from "src/components/Technician/EditLevel.vue";
import TechnicianTable from "src/components/Technician/TechnicianTable.vue";

const bus = inject("bus");

bus.on("new_qualifications", () => {
  getTecnicos();
});

bus.on("edit_qualifications", () => {
  getQualifications();
});

const tecAgricola = ref(null);
const tecConstruccion = ref(null);
const qualificationsAgricola = ref(null);
const qualificationsConstruccion = ref(null);
const showTecAgricola = ref(false);
const showTecConstruccion = ref(false);
const showQualificationsConstruccion = ref(false);
const showQualificationsAgricola = ref(false);
const showTable = ref(null);

const onClickAcricola = () => {
  showTecAgricola.value = true;
};

const onClickConstruccion = () => {
  showTecConstruccion.value = true;
};

const onClickQuaConstruccion = () => {
  showQualificationsConstruccion.value = true;
};

const onClickQuaAgricola = () => {
  showQualificationsAgricola.value = true;
};

const onClickTable = () => {
  showTable.value = true;
};

const getTecnicos = async () => {
  let res = await sendRequest("GET", null, "/api/technician/all", "");
  tecAgricola.value = res.agricola;
  tecConstruccion.value = res.construccion;
};

const getQualifications = async () => {
  let res = await sendRequest("GET", null, "/api/technicians", "");
  qualificationsAgricola.value = res.agricola;
  qualificationsConstruccion.value = res.construccion;
};

onMounted(() => {
  getQualifications();
  getTecnicos();
});
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



