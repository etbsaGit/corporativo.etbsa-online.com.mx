<template>
  <div class="q-pa-xs flex justify-between items-center">
    <q-btn icon="arrow_left" @click="prevMonth" />
    <div class="highlight">{{ currentMonthYear }}</div>
    <q-btn icon="arrow_right" @click="nextMonth" />
  </div>
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
    class="custom-calendar-month"
  >
    <template v-if="visits != null" #day="{ scope: { timestamp } }">
      <template v-for="visit in visitsMap[timestamp.date]" :key="visit.id">
        <div
          class="my-visit rounded-border text-black"
          style="position: relative"
          :style="{ backgroundColor: getOpaqueColor(visit.color) }"
          @click="onClickVisit(visit)"
        >
          <div class="q-calendar__ellipsis">
            <q-item>
              <q-item-section>
                <q-item-label>
                  <strong>Cliente: </strong> {{ visit.cliente }}
                </q-item-label>
                <q-item-label>
                  <strong>Ubicacion: </strong> {{ visit.ubicacion }}
                </q-item-label>
                <q-item-label>
                  <strong>Empleado: </strong>
                  {{ visit.empleado.nombreCompleto }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </template>
    </template>
  </q-calendar-month>

  <q-page-sticky position="bottom-right" :offset="[30, 30]">
    <q-btn fab icon="add" color="blue-10" @click="showAdd = true">
      <q-tooltip
        class="bg-blue-10 text-body1"
        anchor="center left"
        self="center right"
        :offset="[10, 10]"
      >
        Agendar visita
      </q-tooltip>
    </q-btn>
  </q-page-sticky>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agendar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agendar" color="blue" @click="postRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <visiti-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Editar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putRow" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <visiti-form ref="edit" :visit="selectedRow" />
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
import { date } from "quasar";

import { sendRequest, dataIncomplete } from "src/boot/functions";

import VisitiForm from "src/components/Visits/VisitiForm.vue";

const visits = ref([]);
const selectedRow = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);

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
  getRows(newDate);
});

const visitsMap = computed(() => {
  const map = {};
  if (visits.value.length > 0) {
    visits.value.forEach((visit) => {
      (map[visit.dia] = map[visit.dia] || []).push(visit);
    });
  }
  return map;
});

const onClickVisit = (visit) => {
  selectedRow.value = visit;
  showEdit.value = true;
};

const getOpaqueColor = (color) => {
  // Asumiendo que visit.color es un string en formato hexadecimal (#RRGGBB)
  // Puedes ajustar este método según cómo se almacene el color en tu caso
  const hexColor = color.startsWith("#") ? color.slice(1) : color;
  return `rgba(${parseInt(hexColor.slice(0, 2), 16)}, ${parseInt(
    hexColor.slice(2, 4),
    16
  )}, ${parseInt(hexColor.slice(4, 6), 16)}, 0.5)`;
};

const getRows = async (date) => {
  let res = await sendRequest("GET", null, "/api/visit/calendar/" + date, "");
  visits.value = res;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formVisit,
  };
  let res = await sendRequest("POST", final, "/api/visit", "");
  showAdd.value = false;
  getRows(selectedDate.value);
};

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formVisit,
  };
  let res = await sendRequest("PUT", final, "/api/visit/" + final.id, "");
  showEdit.value = false;
  getRows(selectedDate.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/visit/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showEdit.value = false;
  getRows();
};

onMounted(() => {
  getRows(selectedDate.value);
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
.my-visit {
  position: relative;
  font-size: 11px;
  width: 100%;
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

.my-void-visit {
  display: inline-flex;
  white-space: nowrap;
  height: 1px;
}

.rounded-border {
  border-radius: 2px;
}
</style>
