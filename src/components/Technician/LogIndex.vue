<template>
  <div class="year-navigator">
    <q-btn @click="prevMonth" round dense flat icon="arrow_left" />
    <span class="year-display">{{ currentMonthYear }}</span>
    <q-btn @click="nextMonth" round dense flat icon="arrow_right" />
  </div>
  <q-item class="q-pa-none">
    <q-calendar-month
      :weekdays="[1, 2, 3, 4, 5, 6]"
      :disabled-weekdays="[0]"
      ref="calendar"
      v-model="selectedDate"
      locale="es"
      animated
      bordered
      focusable
      hoverable
      no-active-date
      :day-min-height="100"
      :day-height="0"
      @click-day="onClickDay"
      class="custom-calendar-month"
    >
      <template v-if="logs != null" #day="{ scope: { timestamp } }">
        <template v-for="log in logsMap[timestamp.date]" :key="log.id">
          <div
            class="my-event rounded-border text-black"
            style="position: relative"
          >
            <div class="q-calendar__ellipsis">
              <q-item class="bg-grey" dense>
                <q-item-section avatar>
                  {{ formatTime(log.hora_inicio) }} -
                  {{ formatTime(log.hora_termino) }}
                </q-item-section>
                <q-item-section>
                  {{ log.activity_technician.nombre }}
                </q-item-section>
              </q-item>

              <q-tooltip>{{ log.wo?.maquina }}</q-tooltip>
            </div>
          </div>
        </template>
      </template>
    </q-calendar-month>
  </q-item>

  <q-dialog
    v-model="showDay"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    full-height
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            {{ formatDateplusone(currentDay) }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            size="md"
            label="Cerrar"
            color="red"
            v-close-popup
            @click="getLogs(empleado.id)"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item class="q-pa-none">
        <q-item-section>
          <logs-days :employee="empleado" :day="currentDay" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QCalendarMonth, parseDate, today } from "@quasar/quasar-ui-qcalendar";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";
import { ref, watch, onMounted, computed } from "vue";
import { date, useQuasar } from "quasar";
import { formatTime, formatDateplusone } from "src/boot/formatFunctions";

import { sendRequest } from "src/boot/functions";

import LogsDays from "src/components/Technician/LogsDays.vue";

const { employee } = defineProps(["employee"]);

const $q = useQuasar();
const calendar = ref(null);
const selectedDate = ref(today());
const addForm = ref(false);
const store = ref(null);
const showDay = ref(null);
const currentDay = ref(null);
const empleado = ref(employee);

const logs = ref(null);

const getMonthYear = (dateString) => {
  const dateObject = new Date(dateString);
  const month = dateObject.toLocaleString("default", { month: "long" });
  const year = dateObject.getFullYear();
  return `${month} ${year}`;
};

const currentMonthYear = ref(getMonthYear(selectedDate.value));

const onClickDay = (data) => {
  showDay.value = true;
  currentDay.value = data.scope.timestamp.date;
};

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
});

const logsMap = computed(() => {
  const map = {};
  if (logs.value.length > 0) {
    logs.value.forEach((log) => {
      (map[log.fecha] = map[log.fecha] || []).push(log);
    });
  }
  return map;
});

const getLogs = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/techniciansLog/tech/" + id,
    ""
  );
  logs.value = res;
};

const postLog = async () => {
  const store_valid = await store.value.validate();
  if (!store_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...store.value.formLog,
  };
  let res = await sendRequest("POST", final, "/api/techniciansLog", "");
  addForm.value = false;
  showDay.value = false;
  getLogs(empleado.value.id);
};

onMounted(() => {
  getLogs(empleado.value.id);
});
</script>

<style scoped>
.year-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px;
}

.year-display {
  font-size: 24px;
  margin: 0 16px;
}

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
