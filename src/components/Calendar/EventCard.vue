<template>
  <q-card bordered class="text-grey-8 card-event">
    <q-item>
      <q-item-section avatar>
        <q-avatar
          size="80px"
          color="primary"
          text-color="white"
          v-if="event.empleado.picture"
        >
          <img :src="event.empleado.picture" alt="Foto del empleado" />
        </q-avatar>
        <q-avatar v-else color="primary" text-color="white" size="80px">
          {{ event.empleado.nombre.charAt(0).toUpperCase()
          }}{{ event.empleado.apellido_paterno.charAt(0).toUpperCase() }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          {{ event.empleado.nombreCompleto }}
        </q-item-label>
        <q-item-label>
          <strong> Motivo: </strong>
          {{ event.title }}
        </q-item-label>
        <q-item-label class="q-pa-none">
          <strong> Descripcion de actividades: </strong>
          {{ event.description }}
        </q-item-label>
        <q-item-label class="q-pa-none">
          <strong> Asientos disponibles: </strong>
          {{ event.available_seats }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <div v-for="(travel, index) in event.travel" :key="index">
      <q-separator />
      <q-item class="q-pa-sm">
        <q-item-section>
          <q-item-label><strong>Salida:</strong></q-item-label>
          <q-item-label>{{
            travel.start_point_r ? travel.start_point_r.nombre : "Otro"
          }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label><strong>Hora salida:</strong></q-item-label>
          <q-item-label>{{ formatTime(travel.start_time) }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label><strong>Destino:</strong></q-item-label>
          <q-item-label>{{
            travel.end_point_r ? travel.end_point_r.nombre : "Otro"
          }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label><strong>Hora llegada:</strong></q-item-label>
          <q-item-label>{{ formatTime(travel.end_time) }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </q-card>
</template>

<script setup>
import { formatTime } from "src/boot/formatFunctions";
const { event } = defineProps(["event"]);
</script>

<style>
.card-event {
  font-size: 1.5em; /* Tamaño de fuente más pequeño */
}
</style>

