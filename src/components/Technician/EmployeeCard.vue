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
          <strong>Fecha de ingreso: </strong>{{ employee.fecha_de_ingreso }}
        </q-item-label>
        <!-- <q-item-label caption>
          <strong>Linea: </strong>{{ employee.linea.nombre }}
        </q-item-label>
        <q-item-label caption>
          <strong>Departamento: </strong>{{ employee.departamento.nombre }}
        </q-item-label>
        <q-item-label caption>
          <strong>Puesto: </strong>{{ employee.puesto.nombre }}
        </q-item-label> -->
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            size="sm"
            flat
            round
            icon="timeline"
            class="bg-indigo-7 text-white"
            @click="openQualificationsDialog"
          >
            <q-tooltip class="bg-indigo"
              >Asignar cursos completados a tecnico</q-tooltip
            >
          </q-btn>
        </q-item-label>
        <q-item-label>
          <q-btn
            size="sm"
            round
            color="amber"
            icon="contact_page"
            class="text-white"
            @click="openCV"
          >
            <q-tooltip class="bg-amber">Resumen del tecnico</q-tooltip>
          </q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
    <q-item>
      <q-item-section>
        <div v-if="employee.technician">
          <div>
            <strong>Tipo de tecnico: </strong>{{ employee.technician.name }}
          </div>
        </div>
        <div v-else>
          <p>No tiene asignado un tipo de tecnico.</p>
        </div>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            size="sm"
            round
            icon="edit"
            color="green"
            class="text-white"
            @click="openTechnicians(employee)"
          >
            <q-tooltip class="bg-green">Cambiar tipo de tecnico</q-tooltip>
          </q-btn>
        </q-item-label>
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
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">
          Carrera de {{ employee.nombre }} {{ employee.apellido_paterno }}
        </div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Agregar"
            color="blue"
            @click="addQualifications(employee)"
          />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <employee-time-line
            :qualifications="employee.qualification"
            :linea="employee.linea"
            :disable="false"
            ref="timeLine"
          />
        </div>
      </q-card>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showTechnicians"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">
          Asignar tecnico a: {{ employee.nombre }}
          {{ employee.apellido_paterno }}
        </div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Asignar"
            color="blue"
            @click="asignarTechnician(employee)"
          />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-md" flat>
        <q-select
          v-model="selectedTechnician"
          :options="tecnicos"
          label="Tipo de tecnico"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          hint
        />
      </q-card>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showCV"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
    full-height
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">
          Carrera de {{ employee.nombre }} {{ employee.apellido_paterno }}
        </div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <c-v :employee="empleado"></c-v>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

import EmployeeTimeLine from "src/components/Technician/EmployeeTimeLine.vue";
import CV from "src/components/Technician/CV.vue";

const { employee } = defineProps(["employee"]);
const bus = inject("bus");

const showQualifications = ref(false);
const showTechnicians = ref(false);
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

const openCV = () => {
  showCV.value = true;
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
