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
      <template v-for="(a, index) in getEventsByDate(timestamp)" :key="index">
        <div
          :label="mergeHours(a.start, a.end, a.ls, a.le)"
          class="justify-start q-ma-sm shadow-5 bg-green text-white"
          style="margin-top: 25px"
        >
          <div
            v-if="a.empleado.picture"
            class="row justify-center"
            style="margin-top: 30px; width: 100%"
          >
            <q-avatar
              style="margin-top: -50px; margin-bottom: 10px; font-size: 60px"
            >
              <img
                :src="a.empleado.picture"
                style="border: #9e9e9e solid 4px"
              />
            </q-avatar>
          </div>
          <div class="col-12 q-px-sm">
            <strong>{{ a.empleado.nombreCompleto }}</strong>
          </div>
          <div class="col-12 q-px-sm">
            <strong>{{ a.sucursal.nombre }}</strong>
          </div>
          <div class="col-12 q-px-sm">
            <strong>{{ mergeHours(a.start, a.end, a.ls, a.le) }}</strong>
          </div>
        </div>
      </template>
    </template>
  </q-calendar-agenda>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import {
  QCalendarAgenda,
  today,
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass";

const rows = ref([]);
const selectedDate = ref(today());

const filterForm = ref({
  sucursal_id: null,
  date: selectedDate.value,
});

const getEventsByDate = (timestamp) => {
  const eventsForDay = [];

  for (let i = 0; i < rows.value.length; i++) {
    const row = rows.value[i];

    // Compara la fecha del row con el timestamp.date del calendario
    if (row.date === timestamp.date) {
      // convierto 2025-11-19 → 2025/11/19
      eventsForDay.push({
        start: row.start, // hora de inicio
        end: row.end, // hora de término
        empleado: row.empleado, // objeto empleado completo
        empleado_id: row.empleado_id, // id del empleado
        sucursal: row.sucursal, // sucursal
        description: row.description, // descripción si existe
        ls: row.lunch_start,
        le: row.lunch_end,
      });
    }
  }

  return eventsForDay;
};

// Obtener rows desde la API
const getRows = async () => {
  const final = { ...filterForm.value };
  const res = await sendRequest(
    "POST",
    final,
    "/api/salidaPermisos/calendar",
    ""
  );
  rows.value = res;
};

onMounted(() => {
  getRows();
});

// Orden de días de la semana
const weekdaysOrder = (selectedDate) => {
  const todayDate = new Date(selectedDate);
  const dayOfWeek = todayDate.getDay() + 1; // 0=domingo, 6=sábado
  const orderedWeekdays = [];
  for (let i = dayOfWeek; i < 7; i++) orderedWeekdays.push(i);
  for (let i = 0; i < dayOfWeek; i++) orderedWeekdays.push(i);
  return orderedWeekdays;
};

function mergeHours(start, end, lunch_start, lunch_end) {
  if (!start || !end) return "";

  // Normalizar formato
  const s = formatHour(start);
  const e = formatHour(end);
  const ls = lunch_start ? formatHour(lunch_start) : null;
  const le = lunch_end ? formatHour(lunch_end) : null;

  console.log(lunch_start);

  // Comparar sin formato (para saber si se tocan)
  const normalize = (t) => t?.slice(0, 5); // "08:00"
  const sRaw = normalize(start);
  const eRaw = normalize(end);
  const lsRaw = normalize(lunch_start);
  const leRaw = normalize(lunch_end);

  // Caso 1: si termina justo cuando empieza el almuerzo
  if (eRaw === lsRaw) {
    return `${s} - ${le}`;
  }

  // Caso 2: si empieza justo cuando termina el almuerzo
  if (leRaw === sRaw) {
    return `${ls} - ${e}`;
  }

  // Caso 3: si no se tocan y hay horario de almuerzo definido
  if (ls && le) {
    return `${s} - ${e}, ${ls} - ${le}`;
  }

  // Caso base
  return `${s} - ${e}`;
}

function formatHour(time) {
  if (!time) return "";
  try {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return time; // por si el formato no es HH:mm
  }
}
</script>

