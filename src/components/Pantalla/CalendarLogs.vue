<template>
  <q-calendar-agenda
    ref="calendar"
    v-model="selectedDate"
    view="week"
    :day-min-height="200"
    bordered
    animated
    locale="es-ES"
    :weekdays="weekdaysOrder(selectedDate)"
  >
    <template #day="{ scope: { timestamp } }">
      <template v-for="(a, index) in getEvent(timestamp)" :key="index">
        <q-card
          :style="{ backgroundColor: getCardColor(a.tecnico_id) }"
          class="my-event text-black"
        >
          <div class="row items-center">
            <div class="col">
              <strong>
                {{ formatTime(a.hora_inicio) }} -
                {{ formatTime(a.hora_termino) }}
              </strong>
            </div>
            <div class="col">
              <strong>
                {{ a.tarea }}
              </strong>
            </div>
          </div>
          <div align="center">
            <strong>
              {{ a.tecnico }}
            </strong>
          </div>
          <div align="center">
            {{ a.comentarios }}
          </div>
        </q-card>
      </template>
    </template>
  </q-calendar-agenda>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  QCalendarAgenda,
  today,
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass";

import { formatTime } from "src/boot/formatFunctions";

const selectedDate = ref(today());

const { data } = defineProps(["data"]);
const agenda = data;

const getEvent = (timestamp) => {
  const agendaResource = [];
  for (let x = 0; x < agenda.length; x++) {
    if (agenda[x].fecha === timestamp.date) {
      agendaResource.push({
        hora_inicio: agenda[x].hora_inicio,
        hora_termino: agenda[x].hora_termino,
        tarea: agenda[x].activity_technician.nombre,
        tecnico: agenda[x].tecnico.nombreCompleto,
        tecnico_id: agenda[x].tecnico.id, // Asegúrate de que el id está disponible
        comentarios: agenda[x].comentarios,
      });
    }
  }
  return agendaResource;
};

const weekdaysOrder = (selectedDate) => {
  const today = new Date(selectedDate);
  const dayOfWeek = today.getDay() + 1; // Domingo es 0 y sábado es 6

  const orderedWeekdays = [];
  for (let i = dayOfWeek; i < 7; i++) {
    orderedWeekdays.push(i);
  }
  for (let i = 0; i < dayOfWeek; i++) {
    orderedWeekdays.push(i);
  }

  return orderedWeekdays;
};

// Function to generate a more distinct color based on technician_id
const getCardColor = (technicianId) => {
  // Create a pseudo-random color generator based on the technician ID
  const hue = (parseInt(technicianId, 10) * 82) % 360; // 97 is a prime number to ensure good color spread
  const saturation = 60; // Moderate saturation
  const lightness = 75; // Light color for a pastel effect

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Adjusted to be more distinct
};
</script>

<style scoped>
.my-event {
  position: relative;
  font-size: 11px;
  width: 100%;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
</style>
