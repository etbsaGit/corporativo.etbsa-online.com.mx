<template>
  <q-page class="q-pa-sm">
    <q-btn
      label="Registrar nueva carrera"
      color="primary"
      @click="newCareer = true"
    />
    <div><br /></div>
    <div class="row q-col-gutter-sm">
      <div
        class="col-lg-4 col-md-4 col-xs-12 col-sm-12"
        v-for="(employee, index) in employees"
        :key="index"
      >
        <employee-card :employee="employee"> </employee-card>
      </div>
    </div>
  </q-page>
  <q-dialog
    v-model="newCareer"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Selecciona al empleado</div>
        <div class="text-subtitle2">
          Busca al empleado la cual quieres iniciar su registro de su carrera
          profecional
        </div>
      </q-card-section>

      <q-card-section>
        <q-select
          v-model="newEmployee"
          :options="newEmployees"
          option-value="id"
          :option-label="
            (item) =>
              item.nombre +
              ' ' +
              item.apellido_paterno +
              ' ' +
              item.apellido_materno
          "
          label="Empleados"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
        />
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn label="Cerrar" color="red" v-close-popup />
        <q-btn label="Iniciar" color="blue" @click="startCareer" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { sendRequest } from "src/boot/functions";
import EmployeeCard from "src/components/Career/EmployeeCard.vue";

const bus = inject("bus");

bus.on("new_career", () => {
  getEmployees();
});

const employees = ref(null);
const newCareer = ref(false);
const newEmployees = ref(null);
const newEmployee = ref(null);

const getEmployees = async () => {
  let res = await sendRequest("GET", null, "/api/career/empleados", "");
  employees.value = res.con_carrera;
  newEmployees.value = res.sin_carrera;
};

const startCareer = async () => {
  let res = await sendRequest(
    "POST",
    null,
    "/api/career/empleados/new/" + newEmployee.value,
    ""
  );
  getEmployees();
  newEmployee.value = null;
  newCareer.value = false;
};

onMounted(() => {
  getEmployees();
});
</script>
