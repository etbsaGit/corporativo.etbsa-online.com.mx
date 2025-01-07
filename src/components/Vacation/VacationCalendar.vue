<template>
  <div class="q-pa-xs flex justify-between items-center">
    <q-btn icon="arrow_left" @click="prevMonth" />
    <div class="highlight">{{ currentMonthYear }}</div>
    <q-btn icon="arrow_right" @click="nextMonth" />
  </div>

  <q-calendar-month
    ref="calendar"
    v-model="selectedDate"
    animated
    bordered
    focusable
    hoverable
    no-active-date
    locale="es"
    :day-min-height="110"
    :day-height="0"
  >
    <template #week="{ scope: { week, weekdays } }">
      <template
        v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
        :key="index"
      >
        <div
          :class="badgeClasses(computedEvent)"
          :style="badgeStyles(computedEvent, week.length)"
        >
          <div v-if="computedEvent.event" class="title q-calendar__ellipsis">
            {{ computedEvent.event.title }}
            <q-tooltip>{{ computedEvent.event.details }}</q-tooltip>
          </div>
        </div>
      </template>
    </template>
  </q-calendar-month>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { date } from "quasar";
import {
  QCalendarMonth,
  daysBetween,
  isOverlappingDates,
  parsed,
  parseDate,
  today,
  indexOf,
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";

import { sendRequest } from "src/boot/functions";

const vacations = ref([]);

const transformedVacations = computed(() =>
  vacations.value.map((vacation) => ({
    start: vacation.fecha_inicio,
    end: vacation.fecha_termino,
    title: vacation.empleado.nombreCompleto,
    bgcolor: vacation.color,
    details: vacation.comentarios,
  }))
);

const selectedDate = ref(today());

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

watch(selectedDate, (newDate) => {
  currentMonthYear.value = getMonthYear(newDate);
  getVacations(newDate);
});

const getWeekEvents = (week, weekdays) => {
  const firstDay = parsed(week[0].date + " 00:00");
  const lastDay = parsed(week[week.length - 1].date + " 23:59");

  const eventsWeek = [];
  transformedVacations.value.forEach((event, id) => {
    const startDate = parsed(event.start + " 00:00");
    const endDate = parsed(event.end + " 23:59");

    if (isOverlappingDates(startDate, endDate, firstDay, lastDay)) {
      const left = daysBetween(firstDay, startDate, true);
      const right = daysBetween(endDate, lastDay, true);

      eventsWeek.push({
        id, // index event
        left, // Position initial day [0-6]
        right, // Number days available
        size: week.length - (left + right), // Size current event (in days)
        event, // Info
      });
    }
  });

  const eventsResult = [];
  if (eventsWeek.length > 0) {
    const infoWeek = eventsWeek.sort((a, b) => a.left - b.left);
    infoWeek.forEach((_, i) => {
      insertEvent(eventsResult, week.length, infoWeek, i, 0, 0);
    });
  }

  return eventsResult;
};

const insertEvent = (
  events,
  weekLength,
  infoWeek,
  index,
  availableDays,
  level
) => {
  const iEvent = infoWeek[index];
  if (iEvent !== undefined && iEvent.left >= availableDays) {
    if (iEvent.left - availableDays) {
      events.push({ size: iEvent.left - availableDays });
    }
    events.push({ size: iEvent.size, event: iEvent.event });

    if (level !== 0) {
      infoWeek.splice(index, 1);
    }

    const currentAvailableDays = iEvent.left + iEvent.size;

    if (currentAvailableDays < weekLength) {
      const indexNextEvent = indexOf(
        infoWeek,
        (e) => e.id !== iEvent.id && e.left >= currentAvailableDays
      );

      insertEvent(
        events,
        weekLength,
        infoWeek,
        indexNextEvent !== -1 ? indexNextEvent : index,
        currentAvailableDays,
        level + 1
      );
    }
  } else {
    events.push({ size: weekLength - availableDays });
  }
};

const badgeClasses = (computedEvent) => {
  if (computedEvent.event !== undefined) {
    return {
      "my-event": true,
      "text-black": true,
      "rounded-border": true,
      "q-calendar__ellipsis": true,
    };
  }
  return {
    "my-void-event": true,
  };
};

const badgeStyles = (computedEvent, weekLength) => {
  const s = {};

  // Calcula el ancho basado en el tamaño del evento
  if (computedEvent.size !== undefined) {
    s.width = (100 / weekLength) * computedEvent.size + "%";
  }

  // Agrega el background-color si existe en computedEvent
  if (computedEvent.event && computedEvent.event.bgcolor) {
    s.backgroundColor = getOpaqueColor(computedEvent.event.bgcolor);
  }

  return s;
};

const getOpaqueColor = (color) => {
  // Asumiendo que event.color es un string en formato hexadecimal (#RRGGBB)
  // Puedes ajustar este método según cómo se almacene el color en tu caso
  const hexColor = color.startsWith("#") ? color.slice(1) : color;
  return `rgba(${parseInt(hexColor.slice(0, 2), 16)}, ${parseInt(
    hexColor.slice(2, 4),
    16
  )}, ${parseInt(hexColor.slice(4, 6), 16)}, 0.5)`;
};

// Función para obtener los datos de la API
const getVacations = async (date) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/vacationDay/calendar/" + date,
    ""
  );
  vacations.value = res;
};

onMounted(() => {
  getVacations(selectedDate.value);
});
</script>

<style scoped>
.highlight {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
}
.my-event {
  position: relative;
  display: inline-flex;
  white-space: nowrap;
  font-size: 12px;
  height: 16px;
  max-height: 16px;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.my-void-event {
  display: inline-flex;
  white-space: nowrap;
  height: 1px;
}

.rounded-border {
  border-radius: 2px;
}
</style>
