<template>
  <q-page class="q-pa-none bg-white">
    <div class="q-pa-xs flex justify-between items-center">
      <q-btn icon="arrow_left" @click="prevMonth" />
      <div class="highlight">{{ currentMonthYear }}</div>
      <q-btn icon="arrow_right" @click="nextMonth" />
    </div>
    <q-calendar-month
      v-if="agenda.length > 0"
      ref="calendar"
      v-model="selectedDate"
      view="week"
      :day-min-height="100"
      bordered
      animated
      locale="es-ES"
      :weekdays="[1, 2, 3, 4, 5, 6]"
      :disabled-weekdays="[0]"
      :disabled-before="disabledBefore"
      focusable
      hoverable
      :day-height="0"
      class="custom-calendar-month"
    >
      <template #day="{ scope: { timestamp } }">
        <template v-for="(a, index) in getEvent(timestamp)" :key="index">
          <q-card
            :style="{ backgroundColor: getCardColor(a.tecnico_id) }"
            class="my-event text-black"
            @click="onClickEvent(a)"
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
    </q-calendar-month>
    <q-page-sticky position="bottom-right" :offset="[50, 50]">
      <q-btn fab icon="add" color="blue-10" @click="showDay = true">
        <q-tooltip
          class="bg-blue-10 text-body1"
          anchor="center left"
          self="center right"
          :offset="[10, 10]"
        >
          Agendar tarea
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>

  <q-dialog
    v-model="showDay"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
  >
    <q-card>
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6"> Asignar </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agendar" color="blue" @click="postLog" />
        </q-item-section>
      </q-item>
      <q-separator />
      <log-form ref="store" />
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEvent"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
  >
    <q-card>
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6"> Asignar </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agendar" color="blue" @click="putLog" />
        </q-item-section>
      </q-item>
      <q-separator />
      <log-form ref="put" :log="selectedEvent" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { date } from "quasar";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import { formatTime } from "src/boot/formatFunctions";
import {
  QCalendarMonth,
  parseDate,
  today,
  parseTimestamp,
  addToDate,
} from "@quasar/quasar-ui-qcalendar";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";

import LogForm from "src/components/Technician/LogForm.vue";

const selectedDate = ref(today());
const showDay = ref(false);
const store = ref(null);
const selectedEvent = ref(null);
const showEvent = ref(false);
const put = ref(null);

const agenda = ref([]);

const getMonthYear = (dateString) => {
  const dateObject = new Date(dateString);
  const month = dateObject.toLocaleString("default", { month: "long" });
  const year = dateObject.getFullYear();
  return `${month} ${year}`;
};

const currentMonthYear = ref(getMonthYear(selectedDate.value));

const prevMonth = () => {
  const current = new Date(selectedDate.value);
  current.setMonth(current.getMonth() - 1);
  selectedDate.value = date.formatDate(current, "YYYY-MM-DD");
  currentMonthYear.value = getMonthYear(selectedDate.value);
};

const nextMonth = () => {
  const current = new Date(selectedDate.value);
  current.setMonth(current.getMonth() + 1);
  selectedDate.value = date.formatDate(current, "YYYY-MM-DD");
  currentMonthYear.value = getMonthYear(selectedDate.value);
};

const getEvent = (timestamp) => {
  const agendaResource = [];
  for (let x = 0; x < agenda.value.length; x++) {
    if (agenda.value[x].fecha === timestamp.date) {
      agendaResource.push({
        id: agenda.value[x].id,
        fecha: agenda.value[x].fecha,
        hora_inicio: agenda.value[x].hora_inicio,
        hora_termino: agenda.value[x].hora_termino,
        comentarios: agenda.value[x].comentarios,
        activity_technician_id: agenda.value[x].activity_technician_id,
        tecnico_id: agenda.value[x].tecnico.id,
        wo_id: agenda.value[x].wo_id,
        tarea: agenda.value[x].activity_technician.nombre,
        tecnico: agenda.value[x].tecnico.nombreCompleto,
      });
    }
  }
  return agendaResource;
};

const onClickEvent = (event) => {
  selectedEvent.value = event;
  showEvent.value = true;
};

// Computed property
const disabledBefore = computed(() => {
  let ts = parseTimestamp(today());
  ts = addToDate(ts, { day: -1 });
  return ts.date;
});

// Function to generate a more distinct color based on technician_id
const getCardColor = (technicianId) => {
  // Create a pseudo-random color generator based on the technician ID
  const hue = (parseInt(technicianId, 10) * 82) % 360; // 97 is a prime number to ensure good color spread
  const saturation = 60; // Moderate saturation
  const lightness = 75; // Light color for a pastel effect

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Adjusted to be more distinct
};

const getData = async () => {
  let res = await sendRequest("GET", null, "/api/tech/calendar", "");
  agenda.value = res;
};

const postLog = async () => {
  const store_valid = await store.value.validate();
  if (!store_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...store.value.formLog,
  };
  let res = await sendRequest("POST", final, "/api/techniciansLog", "");
  showDay.value = false;
  getData();
};

const putLog = async () => {
  const put_valid = await put.value.validate();
  if (!put_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...put.value.formLog,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/techniciansLog/" + final.id,
    ""
  );
  showEvent.value = false;
  getData();
};

onMounted(() => {
  getData();
});
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

.highlight {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
}
</style>
