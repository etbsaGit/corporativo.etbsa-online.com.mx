<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formReport.empleado_id"
          :options="empleados"
          label="Empleado"
          option-value="id"
          option-label="apellidoCompleto"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          options-dense
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> no options </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formReport.month"
          :options="months"
          label="Mes"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          options-dense
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formReport.year"
          :options="years"
          label="Año"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          options-dense
        />
      </q-item-section>
      <q-item-section side v-if="formReport.empleado_id">
        <q-btn color="primary" label="Consultar" @click="getEmpleado" />
      </q-item-section>
      <q-item-section side v-if="formReport.empleado_id">
        <q-btn
          round
          color="primary"
          icon="picture_as_pdf"
          @click="onRowClickPDF()"
        >
          <q-tooltip>Descargar reporte en PDF</q-tooltip>
        </q-btn>
      </q-item-section>
    </q-item>
  </q-form>
  <q-item v-if="empleado">
    <q-item-section>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            size="80px"
            color="primary"
            text-color="white"
            v-if="empleado.picture"
          >
            <img :src="empleado.picture" />
          </q-avatar>
          <q-avatar v-else color="primary" text-color="white">
            {{ empleado.nombre.charAt(0).toUpperCase()
            }}{{ empleado.apellido_paterno.charAt(0).toUpperCase() }}
          </q-avatar>
          <div class="q-ml-md">
            <div class="text-h6">{{ empleado.nombreCompleto }}</div>

            <div class="text-subtitle2">
              {{ empleado.sucursal.nombre }}
            </div>
          </div>
        </q-card-section>
        <q-card-section
          v-for="(prospect, index) in empleado.prospects"
          :key="index"
        >
          <q-card>
            <q-item class="q-ml-md">
              <q-item-section class="text-h6">
                {{ prospect.nombre }}
              </q-item-section>
              <q-item-section class="text-h6">
                {{ formatPhoneNumber(prospect.telefono) }}
              </q-item-section>
              <q-item-section class="text-h6">
                {{
                  prospect.ubicacion && prospect.ubicacion.length > 25
                    ? prospect.ubicacion.slice(0, 25) + "..."
                    : prospect.ubicacion
                }}
                <q-tooltip
                  class="bg-purple text-body2"
                  v-if="prospect.ubicacion && prospect.ubicacion.length > 25"
                >
                  {{ prospect.ubicacion }}
                </q-tooltip>
              </q-item-section>
            </q-item>
            <q-list separator bordered class="rounded-borders">
              <q-expansion-item expand-separator icon="tour" label="Visitas">
                <q-item dense>
                  <q-item-section> <strong> Dia </strong> </q-item-section>
                  <q-item-section>
                    <strong> Ubicacion </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Comentarios </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Retroalimentacion </strong>
                  </q-item-section>
                </q-item>
                <q-item
                  dense
                  v-for="(visit, index) in prospect.visits"
                  :key="index"
                >
                  <q-item-section>
                    {{ formatDateplusone(visit.dia) }}
                  </q-item-section>
                  <q-item-section>
                    {{ visit.ubicacion }}
                  </q-item-section>
                  <q-item-section>
                    {{ visit.comentarios }}
                  </q-item-section>
                  <q-item-section>
                    {{ visit.retroalimentacion }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-expansion-item expand-separator icon="eco" label="Cultivos">
                <q-item dense>
                  <q-item-section> <strong> Cultivo </strong> </q-item-section>
                  <q-item-section>
                    <strong> Tipo de cultivo </strong>
                  </q-item-section>
                </q-item>
                <q-item
                  dense
                  v-for="(cultivo, index) in prospect.prospect_cultivo"
                  :key="index"
                >
                  <q-item-section>
                    {{ cultivo.cultivo.name }}
                  </q-item-section>
                  <q-item-section>
                    {{ cultivo.tipo_cultivo.name }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-expansion-item expand-separator icon="shower" label="Riegos">
                <q-item dense>
                  <q-item-section> <strong> Riego </strong> </q-item-section>
                  <q-item-section>
                    <strong> Marca </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Hectareas propias </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Hectareas rentadas </strong>
                  </q-item-section>
                </q-item>
                <q-item
                  dense
                  v-for="(riego, index) in prospect.prospect_riego"
                  :key="index"
                >
                  <q-item-section>
                    {{ riego.riego.name }}
                  </q-item-section>
                  <q-item-section>
                    {{ riego.marca }}
                  </q-item-section>
                  <q-item-section>
                    {{ riego.hectareas_propias }}
                  </q-item-section>
                  <q-item-section>
                    {{ riego.hectareas_rentadas }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-expansion-item
                expand-separator
                icon="pin_drop"
                label="Distribucion"
              >
                <q-item dense>
                  <q-item-section>
                    <strong> Nombre del lugar </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Ubicacion </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Hectareas propias </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Hectareas rentadas </strong>
                  </q-item-section>
                </q-item>
                <q-item
                  dense
                  v-for="(dist, index) in prospect.prospect_distribucion"
                  :key="index"
                >
                  <q-item-section>
                    {{ dist.nombre }}
                  </q-item-section>
                  <q-item-section>
                    {{ dist.ubicacion }}
                  </q-item-section>
                  <q-item-section>
                    {{ dist.hectareas_propias }}
                  </q-item-section>
                  <q-item-section>
                    {{ dist.hectareas_rentadas }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-expansion-item
                expand-separator
                icon="agriculture"
                label="Maquinas"
              >
                <q-item dense>
                  <q-item-section>
                    <strong> Modelo </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Año </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Marca </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Condicion </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Clasificacion de equipo </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Tipo de equipo </strong>
                  </q-item-section>
                </q-item>
                <q-item
                  dense
                  v-for="(maq, index) in prospect.prospect_maquina"
                  :key="index"
                >
                  <q-item-section>
                    {{ maq.modelo }}
                  </q-item-section>
                  <q-item-section>
                    {{ maq.anio }}
                  </q-item-section>
                  <q-item-section>
                    {{ maq.marca.name }}
                  </q-item-section>
                  <q-item-section>
                    {{ maq.condicion.name }}
                  </q-item-section>
                  <q-item-section>
                    {{ maq.clas_equipo.name }}
                  </q-item-section>
                  <q-item-section>
                    {{ maq.tipo_equipo.name }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-expansion-item
                expand-separator
                icon="analytics"
                label="Agricultura de precisión "
              >
                <q-item dense>
                  <q-item-section>
                    <strong> Equipo </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Marca </strong>
                  </q-item-section>
                </q-item>
                <q-item
                  dense
                  v-for="(agp, index) in prospect.prospect_agp"
                  :key="index"
                >
                  <q-item-section>
                    {{ agp.equipo }}
                  </q-item-section>
                  <q-item-section>
                    {{ agp.marca }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-expansion-item
                expand-separator
                icon="build"
                label="Servicios posventa"
              >
                <q-item dense>
                  <q-item-section>
                    <strong> Distribuidor </strong>
                  </q-item-section>
                  <q-item-section>
                    <strong> Ubicacion </strong>
                  </q-item-section>
                </q-item>
                <q-item
                  dense
                  v-for="(servicio, index) in prospect.prospect_servicio"
                  :key="index"
                >
                  <q-item-section>
                    {{ servicio.distribuidor }}
                  </q-item-section>
                  <q-item-section>
                    {{ servicio.ubicacion }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </q-list>
          </q-card>
        </q-card-section>
      </q-card>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatDateplusone, formatPhoneNumber } from "src/boot/formatFunctions";

const empleados = ref([]);
const empleado = ref(null);

const formReport = ref({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  empleado_id: null,
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/visits/formReport", "");
  empleados.value = res;
};

const getEmpleado = async () => {
  const final = {
    ...formReport.value,
  };
  let res = await sendRequest("POST", final, "/api/visits/report", "");
  empleado.value = res;
};

const onRowClickPDF = async (row) => {
  const final = {
    ...formReport.value,
  };
  let res = await sendRequest("POST", final, "/api/visits/reportPDF", "");
  const base64Response = await fetch(`data:application/pdf;base64,${res}`);
  const blob = await base64Response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

onMounted(() => {
  getForms();
});

// JSON

const months = [
  { id: 1, name: "Enero" },
  { id: 2, name: "Febrero" },
  { id: 3, name: "Marzo" },
  { id: 4, name: "Abril" },
  { id: 5, name: "Mayo" },
  { id: 6, name: "Junio" },
  { id: 7, name: "Julio" },
  { id: 8, name: "Agosto" },
  { id: 9, name: "Septiembre" },
  { id: 10, name: "Octubre" },
  { id: 11, name: "Noviembre" },
  { id: 12, name: "Diciembre" },
];

const years = [
  { id: 2025, name: 2025 },
  { id: 2026, name: 2026 },
  { id: 2027, name: 2027 },
  { id: 2028, name: 2028 },
  { id: 2029, name: 2029 },
  { id: 2030, name: 2030 },
];
</script>


