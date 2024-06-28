<template>
  <q-card
    class="card-tec"
    v-for="(employee, index) in technicians"
    :key="index"
  >
    <q-card-section align="center">
      <q-item>
        <q-item-section>
          <q-avatar
            size="200px"
            color="primary"
            text-color="white"
            v-if="employee.picture"
          >
            <img :src="employee.picture" alt="Foto del empleado" />
          </q-avatar>
          <q-avatar size="200px" v-else color="primary" text-color="white">
            {{ employee.nombre.charAt(0).toUpperCase()
            }}{{ employee.apellido_paterno.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <chart-tec
            :prod="employee.productividad ? employee.productividad : 0"
            :index="employee.id"
          />
        </q-item-section>
      </q-item>
      <q-item-label class="q-pa-xs text-h6">
        {{ employee.nombreCompleto }}
      </q-item-label>
      <q-item-label caption>
        <div v-if="employee.technician">
          <strong>Tipo de tecnico: </strong>
          {{ employee.technician.name }}
        </div>
        <div v-else>
          <strong>Sin tipo de tecnico</strong>
        </div>
      </q-item-label>
    </q-card-section>
  </q-card>
</template>

<script setup>
import ChartTec from "src/components/Pantalla/ChartTec.vue";

const { technicians } = defineProps(["technicians"]);
</script>

<style>
.card-tec {
  height: 100%; /* Para asegurar que todas las tarjetas tengan la misma altura */
  box-sizing: border-box;
  font-size: 0.8em; /* Tamaño de fuente más pequeño */
  border: 1px solid black;
}
</style>


