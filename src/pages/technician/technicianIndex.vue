<template>
  <q-page>
    <q-item v-if="checkRole('Admin')">
      <q-item-section>
        <q-btn
          color="primary"
          label="Administrar tipos de tecnicos"
          @click="showTable = true"
        />
      </q-item-section>
      <q-item-section v-if="checkRole('Admin')">
        <q-btn
          color="primary"
          label="Tipo de actividades de tecnicos"
          @click="showActivities = true"
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
                  <q-btn
                    label="Tecnicos"
                    @click="showTecAgricola = true"
                    outline
                  />
                </q-item-section>
                <q-item-section v-if="checkRole('Servicio')">
                  <q-btn
                    label="Escalafon"
                    @click="showQualificationsAgricola = true"
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
              <q-item>
                <q-item-section v-if="checkRole('Admin')">
                  <q-btn label="Bahias" outline @click="showTableBays = true" />
                </q-item-section>
                <q-item-section>
                  <q-btn
                    label="Ordenes de trabajo"
                    outline
                    @click="woIndex = true"
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
                    @click="showTecConstruccion = true"
                    outline
                  />
                </q-item-section>
                <q-item-section v-if="checkRole('Servicio')">
                  <q-btn
                    label="Escalafon"
                    @click="showQualificationsConstruccion = true"
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
              <q-item>
                <q-item-section>
                  <q-btn label="Bahias" outline @click="showTableBays = true" />
                </q-item-section>
                <q-item-section>
                  <q-btn
                    label="Ordenes de trabajo"
                    outline
                    @click="woIndex = true"
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
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Tecnicos de Agricola</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
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
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Tecnicos de Construccion</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
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
              header-class="bg-yellow"
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
            header-class="bg-yellow"
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
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Escalafon de construccion</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none">
        <q-item-section>
          <edit-level
            :qualifications="qualificationsConstruccion"
            :key="qualificationsConstruccion"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showQualificationsAgricola"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Escalafon de agricola</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none">
        <q-item-section>
          <edit-level
            :qualifications="qualificationsAgricola"
            :key="qualificationsAgricola"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showTable"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6"
            >Administrar tipos de tecnicos</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none">
        <q-item-section>
          <technician-table />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showTableBays"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    :maximized="true"
  >
    <q-card>
      <q-card-section
        class="d-flex justify-between items-center q-pa-sm bg-primary text-white"
      >
        <div class="text-h6">Administrar Bahias</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <bay-table />
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="woIndex"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    :maximized="true"
  >
    <q-card>
      <q-card-section
        class="d-flex justify-between items-center q-pa-sm bg-primary text-white"
      >
        <div class="text-h6">Ordenes de trabajo</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <work-order-index />
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showActivities"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Administrar tipos de actividades de tecnicos
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none">
        <q-item-section>
          <activity-index />
        </q-item-section>
      </q-item>
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
import WorkOrderIndex from "src/components/WorkOrder/WorkOrderIndex.vue";
import ActivityIndex from "src/components/Technician/ActivityIndex.vue";

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
const woIndex = ref(false);
const showActivities = ref(false);

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
  height: 100vh;
}

.imagen {
  height: 90vh;
  border-radius: 10px;
}

.img-container {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.button-overlay {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se distribuyan en múltiples líneas */
  flex-direction: column; /* Cambia la dirección principal a columnas */
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



