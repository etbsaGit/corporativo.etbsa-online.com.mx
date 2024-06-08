<template>
  <q-page>
    <q-item>
      <q-item-section v-if="checkRole('Servicio')">
        <q-btn
          color="primary"
          label="Administrar tipos de tecnicos"
          @click="onClickTable"
        />
      </q-item-section>
      <q-item-section>
        <q-btn
          color="primary"
          label="Administrar Bahias"
          @click="onClickTableBays"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section v-if="checkLine('Agricola')">
        <div class="img-container">
          <q-img class="imagen" src="../../assets/agricola.jpeg">
            <div class="absolute-bottom text-h2 text-center">Agricola</div>
            <div class="button-overlay">
              <q-item>
                <q-item-section v-if="checkRole('Servicio')">
                  <q-btn label="Tecnicos" @click="onClickAgricola" outline />
                </q-item-section>
                <q-item-section v-if="checkRole('Servicio')">
                  <q-btn
                    label="Escalafon"
                    @click="onClickQuaAgricola"
                    outline
                  />
                </q-item-section>
                <q-item-section>
                  <q-btn
                    label="Presentacion"
                    @click="openPresentationAgricola"
                    outline
                  />
                </q-item-section>
              </q-item>
            </div>
          </q-img>
        </div>
      </q-item-section>
      <q-item-section v-if="checkLine('Construccion')">
        <div class="img-container">
          <q-img class="imagen" src="../../assets/construccion.jpg">
            <div class="absolute-bottom text-h2 text-center">Construccion</div>
            <div class="button-overlay">
              <q-item>
                <q-item-section v-if="checkRole('Servicio')">
                  <q-btn
                    label="Tecnicos"
                    @click="onClickConstruccion"
                    outline
                  />
                </q-item-section>
                <q-item-section v-if="checkRole('Servicio')">
                  <q-btn
                    label="Escalafon"
                    @click="onClickQuaConstruccion"
                    outline
                  />
                </q-item-section>
                <q-item-section>
                  <q-btn
                    label="Presentacion"
                    @click="openPresentationConstruccion"
                    outline
                  />
                </q-item-section>
              </q-item>
            </div>
          </q-img>
        </div>
      </q-item-section>
    </q-item>
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
          <div v-for="(level, index) in tecAgricola" :key="index">
            <q-expansion-item
              v-if="level.technician"
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
          </div>
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
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <q-list separator>
          <div v-for="(level, index) in tecConstruccion" :key="index">
            <q-expansion-item
              v-if="level.technician"
              :label="level.technician.concepto"
              expand-separator
              default-opened
              class="shadow-1 overflow-hidden"
              header-class="bg-yellow text-black"
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
          </div>
          <q-expansion-item
            label="Sin tipo de tecnico"
            expand-separator
            default-opened
            class="shadow-1 overflow-hidden"
            header-class="bg-yellow text-black"
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
    v-model="showQualificationsConstruccion"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Escalafon de Construccion</div>
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
        <div class="text-h6">Escalafon de Agricola</div>
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

  <q-dialog
    v-model="showTableBays"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
    full-height
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Administrar Bahias</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="survey-form-container">
        <bay-table />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { sendRequest } from "src/boot/functions";
import { checkRole, checkLine } from "src/boot/functions";

import EmployeeCard from "src/components/Technician/EmployeeCard.vue";
import EditLevel from "src/components/Technician/EditLevel.vue";
import TechnicianTable from "src/components/Technician/TechnicianTable.vue";
import BayTable from "src/components/Technician/BayTable.vue";

const openPresentationConstruccion = () => {
  const baseUrl = window.location.origin + "/#/";
  const newUrl = `${baseUrl}presentation/construccion`;
  window.open(newUrl, "_blank");
};

const openPresentationAgricola = () => {
  const baseUrl = window.location.origin + "/#/";
  const newUrl = `${baseUrl}presentation/agricola`;
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
const showTableBays = ref(false);

const onClickAgricola = () => {
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

const onClickTableBays = () => {
  showTableBays.value = true;
};

const getTecnicos = async () => {
  let res = await sendRequest("GET", null, "/api/technician/all", "");
  tecAgricola.value = res.agricola;
  tecConstruccion.value = res.construccion;
  tecSinAsignarAgricola.value = res.sinAsignar.agricola;
  tecSinAsignarConstruccion.value = res.sinAsignar.construccion;
  console.log(tecAgricola.value);
  console.log(tecConstruccion.value);
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
  height: 100vh;
}

.imagen {
  height: 80vh;
  border-radius: 10px;
}

.img-container {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.button-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 10px;
}

.img-container:hover .button-overlay {
  opacity: 1;
}

.q-btn {
  padding: 10px 20px;
}
</style>



