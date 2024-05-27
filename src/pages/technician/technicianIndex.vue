<template>
  <q-page class="q-pa-sm">
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
          class="col text-black"
          label="Tecnicos Agricola"
          color="green"
          style="height: 450px; font-size: 60px; margin-right: 10px"
          @click="onClickAcricola"
        />
        <q-btn
          class="col text-black"
          label="Tecnicos Construccion"
          color="amber"
          style="height: 450px; font-size: 60px"
          @click="onClickConstruccion"
        />
      </div>
      <div class="row">
        <q-btn
          class="col text-grey"
          label="Escalafon Agricola"
          color="green-3"
          style="height: 150px; font-size: 35px; margin-right: 10px"
          @click="onClickQuaAgricola"
        />
        <q-btn
          class="col text-grey"
          label="Escalafon Construccion"
          color="amber-3"
          style="height: 150px; font-size: 35px"
          @click="onClickQuaConstruccion"
        />
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
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Tecnicos de Agricola</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <q-list separator>
          <q-expansion-item
            v-for="(level, index) in tecAgricola"
            :key="index"
            :label="level.technician.concepto"
            expand-separator
            default-opened
            class="shadow-1 overflow-hidden"
            header-class="bg-green text-white"
            style="border-radius: 30px"
          >
            <div class="row q-col-gutter-sm">
              <div
                class="col-lg-4 col-md-4 col-xs-12 col-sm-12"
                v-for="(employee, index) in level.technician.empleado"
                :key="index"
              >
                <employee-card :employee="employee" :key="employee">
                </employee-card>
              </div>
            </div>
          </q-expansion-item>
          <q-expansion-item
            label="Sin tipo de tecnico"
            expand-separator
            default-opened
            class="shadow-1 overflow-hidden"
            header-class="bg-green text-white"
            style="border-radius: 30px"
          >
            <div class="row q-col-gutter-sm">
              <div
                class="col-lg-4 col-md-4 col-xs-12 col-sm-12"
                v-for="(employee, index) in tecSinAsignarAgricola"
                :key="index"
              >
                <employee-card :employee="employee" :key="employee">
                </employee-card>
              </div>
            </div>
          </q-expansion-item>
        </q-list>
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
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Tecnicos de Construccion</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Presentación técnicos"
            color="blue"
            @click="openPresentationConstruccion"
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <q-list separator>
          <q-expansion-item
            v-for="(level, index) in tecConstruccion"
            :key="index"
            :label="level.technician.concepto"
            expand-separator
            default-opened
            class="shadow-1 overflow-hidden"
            header-class="bg-amber text-black"
            style="border-radius: 30px"
          >
            <div class="row q-col-gutter-sm">
              <div
                class="col-lg-4 col-md-4 col-xs-12 col-sm-12"
                v-for="(employee, index) in level.technician.empleado"
                :key="index"
              >
                <employee-card :employee="employee" :key="employee">
                </employee-card>
              </div>
            </div>
          </q-expansion-item>
          <q-expansion-item
            label="Sin tipo de tecnico"
            expand-separator
            default-opened
            class="shadow-1 overflow-hidden"
            header-class="bg-amber text-black"
            style="border-radius: 30px"
          >
            <div class="row q-col-gutter-sm">
              <div
                class="col-lg-4 col-md-4 col-xs-12 col-sm-12"
                v-for="(employee, index) in tecSinAsignarConstruccion"
                :key="index"
              >
                <employee-card :employee="employee" :key="employee">
                </employee-card>
              </div>
            </div>
          </q-expansion-item>
        </q-list>
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
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
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
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
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
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
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

const openPresentationConstruccion = () => {
  const baseUrl = window.location.origin + "/#/";
  const newUrl = `${baseUrl}presentation/construccion`;
  window.open(newUrl, "_blank");
};

const bus = inject("bus");

bus.on("new_qualifications", () => {
  getTecnicos();
});

bus.on("edit_qualifications", () => {
  getQualifications();
});

const tecAgricola = ref(null);
const tecConstruccion = ref(null);
const tecSinAsignarAgricola = ref(null);
const tecSinAsignarConstruccion = ref(null);
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
  tecSinAsignarAgricola.value = res.sinAsignar.agricola;
  tecSinAsignarConstruccion.value = res.sinAsignar.construccion;
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



