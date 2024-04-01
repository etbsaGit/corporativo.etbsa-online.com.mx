<template>
  <q-page class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section>
          <q-item-label>
            {{ employee.nombre }} {{ employee.segundo_nombre }}
            {{ employee.apellido_paterno }} {{ employee.apellido_materno }}
          </q-item-label>
          <q-item-label caption>
            <strong>Sucursal: </strong>
            {{ employee.sucursal.nombre }}
          </q-item-label>
        </q-item-section>

        <q-item-section avatar class="flex justify-center items-center">
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
      </q-item>

      <q-separator />

      <q-card-section horizontal>
        <q-card-section>
          {{ employee }}
        </q-card-section>

        <q-separator vertical />

        <q-card-section class="col-6">
          <employee-time-line
            :qualifications="employee.qualification"
            :linea="employee.linea"
            :disable="true"
            ref="timeLine"
          />
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const { employee } = defineProps(["employee"]);
import EmployeeTimeLine from "src/components/Technician/EmployeeTimeLine.vue";
</script>

<style scoped>
.my-card {
  max-width: 1300px;
  margin: 0 auto;
}
</style>
