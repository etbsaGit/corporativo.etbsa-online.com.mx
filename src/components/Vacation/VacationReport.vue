<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="formReport.sucursal_id"
        :options="sucursales"
        label="Sucursal"
        option-value="id"
        option-label="nombre"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        outlined
        dense
        hint
      />
    </q-item-section>
    <q-item-section class="col-2">
      <q-input
        readonly
        outlined
        dense
        v-model="formReport.start"
        mask="date"
        :rules="['date']"
        label="Del:"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date minimal v-model="formReport.start">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formReport.end"
        mask="date"
        :rules="['date']"
        label="Al: "
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date minimal v-model="formReport.end">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:after>
          <q-item>
            <q-item-section>
              <q-btn color="primary" label="Consultar" @click="getEmpleado" />
            </q-item-section>
            <q-item-section>
              <q-btn
                color="primary"
                label="Descargar"
                @click="onRowClickExcelVacation"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-input>
    </q-item-section>
  </q-item>

  <div class="grid-container">
    <q-card
      v-for="(empleado, index) in empleados"
      :key="index"
      bordered
      class="no-shadow"
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar
            size="60px"
            color="primary"
            text-color="white"
            v-if="empleado.picture"
          >
            <img :src="empleado.picture" alt="Foto del empleado" />
          </q-avatar>
          <q-avatar size="60px" v-else color="primary" text-color="white">
            {{ empleado.nombre.charAt(0).toUpperCase()
            }}{{ empleado.apellido_paterno.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-grey-8 text-weight-bold">
            {{ empleado.nombreCompleto }}
          </q-item-label>
          <q-item-label caption>
            <strong>Sucursal: </strong>{{ empleado.sucursal.nombre }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong>Fecha de ingreso: </strong>
            {{ formatDateplusoneSlim(empleado.fecha_de_ingreso) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section class="text-grey-8">
        <div>Dias tomados en el periodo seleccionado</div>
        <q-list bordered separator>
          <q-item
            clickable
            v-ripple
            v-for="(day, index) in empleado.vacationDetails"
            :key="index"
          >
            <q-item-section>{{ formatDateplusoneSlim(day) }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatDateplusoneSlim } from "src/boot/formatFunctions";

const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

const empleados = ref(null);
const sucursales = ref([]);

const formReport = ref({
  start: today,
  end: today,
  sucursal_id: 1,
});

const getSucursales = async () => {
  let res = await sendRequest("GET", null, "/api/sucursal/all", "");
  sucursales.value = res;
};

const getEmpleado = async () => {
  const final = {
    ...formReport.value,
  };
  let res = await sendRequest("POST", final, "/api/vacationDay/report", "");
  empleados.value = res;
};

const onRowClickExcelVacation = async () => {
  const final = {
    ...formReport.value,
  };
  let res = await sendRequest("POST", final, "/api/vacationDay/reportPDF", "");
  const base64Response = await fetch(
    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.file_base64}`
  );
  const blob = await base64Response.blob();
  const url = URL.createObjectURL(blob);

  // Creación de un enlace temporal para descargar el archivo con un nombre específico
  const link = document.createElement("a");
  link.href = url;
  link.download = res.file_name + "vacaciones"; // Nombre que se le asigna al archivo
  link.click();

  // Limpieza
  URL.revokeObjectURL(url);
};

onMounted(() => {
  getSucursales();
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, 1fr)
  ); /* Ajusta el tamaño mínimo aquí 200px para que sean 6 y 300px para 4 px*/
  gap: 10px;
}
</style>
