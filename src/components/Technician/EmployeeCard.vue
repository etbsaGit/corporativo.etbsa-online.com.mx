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
          {{ employee.nombreCompleto }}
        </q-item-label>
        <q-item-label caption>
          <strong>Sucursal: </strong>{{ employee.sucursal.nombre }}
        </q-item-label>
        <q-item-label caption>
          <strong>Fecha de ingreso: </strong>{{ employee.fecha_de_ingreso }}
        </q-item-label>
        <q-item-label caption>
          <div v-if="employee.technician">
            <strong>Tipo de tecnico: </strong>{{ employee.technician.name }}
          </div>
          <div v-else>
            <strong>Sin tipo de tecnico</strong>
          </div>
        </q-item-label>
        <q-item-label caption>
          <div v-if="employee.usuario_x">
            <div><strong>Usuario X: </strong>{{ employee.usuario_x }}</div>
          </div>
          <div v-else>
            <strong>No tiene usuario X</strong>
          </div>
        </q-item-label>
        <q-item-label caption>
          <div v-if="employee.productividad">
            <div>
              <strong>Productividad: </strong>{{ employee.productividad }}
            </div>
          </div>
          <div v-else>
            <strong>Sin productividad</strong>
          </div>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn-dropdown flat color="primary" icon="menu">
          <q-list v-close-popup>
            <q-item>
              <q-btn
                flat
                size="sm"
                color="primary"
                icon="timeline"
                label="Asignar cursos completados a tecnico"
                @click="openQualificationsDialog"
              />
            </q-item>
            <q-item>
              <q-btn
                flat
                label="Resumen del tecnico"
                size="sm"
                color="primary"
                icon="contact_page"
                @click="showCV = true"
              />
            </q-item>
            <q-item>
              <q-btn
                flat
                label="Cambiar tipo de tecnico"
                size="sm"
                color="primary"
                icon="edit"
                @click="openTechnicians(employee)"
              />
            </q-item>
            <q-item>
              <q-btn
                flat
                label="Asignar usuario X"
                size="sm"
                color="primary"
                icon="badge"
                @click="openUserX(employee)"
              />
            </q-item>
            <q-item>
              <q-btn
                flat
                label="Asignar Productividad"
                size="sm"
                color="primary"
                icon="trending_up"
                @click="openProductividad(employee)"
              />
            </q-item>
            <!-- <q-item>
              <q-btn
                flat
                label="Resumen de horas"
                size="sm"
                color="primary"
                icon="work_history"
                @click="showHoras = true"
              />
            </q-item> -->
            <q-item>
              <q-btn
                flat
                label="Facturas"
                size="sm"
                color="primary"
                icon="request_quote"
                @click="showInvoices = true"
              />
            </q-item>
            <q-item>
              <q-btn
                flat
                label="Diario de horas"
                size="sm"
                color="primary"
                icon="manage_history"
                @click="showLogs = true"
              />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-item-section>
    </q-item>
  </q-card>

  <q-dialog
    v-model="showQualifications"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Carrera de {{ employee.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Agregar"
            color="blue"
            @click="addQualifications(employee)"
          />
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none">
        <q-item-section>
          <employee-time-line
            :qualifications="employee.qualification"
            :linea="employee.linea"
            :disable="false"
            ref="timeLine"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showTechnicians"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Asignar tecnico a: {{ employee.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Asignar"
            color="blue"
            @click="asignarTechnician(employee)"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="selectedTechnician"
            :options="tecnicos"
            label="Tipo de tecnico"
            option-value="id"
            option-label="concepto"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            filled
            dense
            hint
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showCV"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Carrera de: {{ employee.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <c-v :employee="empleado" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showUserX"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Asignar usuario X a: {{ employee.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Asignar" color="blue" @click="setUserX(employee)" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            outlined
            v-model="userX"
            label="Asignar el usuario x al empleado"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showProductividad"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Asignar productividad a: {{ employee.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Asignar"
            color="blue"
            @click="setProductividad(employee)"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            mask="##.#"
            outlined
            v-model="productividad"
            label="Asignar productividad al empleado"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showHoras"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Horas con ingreso: {{ employee.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <horas-index :employee="empleado" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showInvoices"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Facturas de: {{ employee.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <invoice-index :employee="empleado" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showLogs"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Diario de horas: {{ employee.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <log-index :employee="empleado" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, inject } from "vue";
import { sendRequest } from "src/boot/functions";

import EmployeeTimeLine from "src/components/Technician/EmployeeTimeLine.vue";
import CV from "src/components/Technician/CV.vue";
import HorasIndex from "src/components/Technician/HorasIndex.vue";
import InvoiceIndex from "src/components/Technician/InvoiceIndex.vue";
import LogIndex from "src/components/Technician/LogIndex.vue";

const { employee } = defineProps(["employee"]);

const bus = inject("bus");

const showQualifications = ref(false);
const showTechnicians = ref(false);
const showHoras = ref(false);
const showUserX = ref(false);
const showInvoices = ref(false);
const showLogs = ref(false);
const userX = ref(null);
const showProductividad = ref(false);
const productividad = ref(null);
const showCV = ref(false);
const tecnicos = ref(null);
const timeLine = ref(null);
const selectedTechnician = ref(null);
const empleado = ref(employee);

const openQualificationsDialog = () => {
  showQualifications.value = true;
};

const openTechnicians = (employee) => {
  getTechnicians(employee.linea_id);
  selectedTechnician.value = employee.technician_id;
  showTechnicians.value = true;
};

const openUserX = (employee) => {
  userX.value = employee.usuario_x;
  showUserX.value = true;
};

const openProductividad = (employee) => {
  productividad.value = employee.productividad;
  showProductividad.value = true;
};

const getTechnicians = async (id) => {
  let res = await sendRequest("GET", null, "/api/technicians/" + id, "");
  tecnicos.value = res;
};

const addQualifications = async (employee) => {
  const final = { qualifications: timeLine.value.qualificationSelected };
  let res = await sendRequest(
    "POST",
    final,
    "/api/qualifications/empleado/" + employee.id,
    ""
  );
  bus.emit("new_qualifications");
  showQualifications.value = false;
};

const asignarTechnician = async () => {
  let res = await sendRequest(
    "POST",
    null,
    "/api/technician/empleado/" + employee.id + "/" + selectedTechnician.value,
    ""
  );
  bus.emit("new_qualifications");
  selectedTechnician.value = null;
  showTechnicians.value = false;
};

const setUserX = async () => {
  const final = { usuario_x: userX.value };
  let res = await sendRequest(
    "POST",
    final,
    "/api/technician/userx/" + employee.id,
    ""
  );
  bus.emit("new_qualifications");
  selectedTechnician.value = null;
  userX.value = null;
  showUserX.value = false;
};

const setProductividad = async () => {
  const final = { productividad: productividad.value };
  let res = await sendRequest(
    "POST",
    final,
    "/api/technician/productividad/" + employee.id,
    ""
  );
  bus.emit("new_qualifications");
  selectedTechnician.value = null;
  productividad.value = null;
  showProductividad.value = false;
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
