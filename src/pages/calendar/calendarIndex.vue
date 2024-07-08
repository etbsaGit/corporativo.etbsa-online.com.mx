<template>
  <q-page class="q-pa-xs bg-white">
    <q-item v-if="checkRole('Calendar')">
      <q-item-section>
        <q-btn
          color="primary"
          outline
          label="Kardex visitas"
          @click="kardex = true"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-expansion-item
          flat
          color="primary"
          icon="filter_alt"
          label="Filtros de viaje"
          dense
        >
          <q-item v-close-popup>
            <q-item-section>
              <q-select
                v-model="formFilter.start_point"
                :options="sucursales"
                label="Punto de partida"
                option-value="id"
                option-label="nombre"
                option-disable="inactive"
                emit-value
                map-options
                transition-show="jump-up"
                transition-hide="jump-up"
                clearable
                outlined
                dense
              />
              <q-tooltip class="text-h6">
                Si se deja vacío se busca un punto de partida que no es una
                sucursal
              </q-tooltip>
            </q-item-section>
            <q-item-section>
              <q-select
                v-model="formFilter.end_point"
                :options="sucursales"
                label="Destino"
                option-value="id"
                option-label="nombre"
                option-disable="inactive"
                emit-value
                map-options
                transition-show="jump-up"
                transition-hide="jump-up"
                clearable
                outlined
                dense
              />
              <q-tooltip class="text-h6">
                Si se deja vacío se busca un destino que no es una sucursal
              </q-tooltip>
            </q-item-section>
            <q-item-section class="col-2">
              <q-btn
                outline
                icon="search"
                label="Filtrar"
                @click="getEventsFilter"
              />
            </q-item-section>
            <q-item-section class="col-1">
              <q-btn outline icon="refresh" @click="getEvents" />
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-item-section>
    </q-item>
    <q-separator />
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
      @click-date="onClickDate"
      @click-day="onClickDay"
      class="custom-calendar-month"
    >
      <template v-if="events != null" #day="{ scope: { timestamp } }">
        <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
          <div
            class="my-event rounded-border text-black"
            style="position: relative"
            :style="{ backgroundColor: getOpaqueColor(event.color) }"
          >
            <div class="q-calendar__ellipsis">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{ event.empleado.nombre }}
                    {{ event.empleado.apellido_paterno }}
                  </q-item-label>
                  <q-item-label>
                    {{
                      event.travel[0].start_point_r
                        ? event.travel[0].start_point_r.nombre
                        : "Otro"
                    }}
                    -
                    {{
                      event.travel[0].end_point_r
                        ? event.travel[0].end_point_r.nombre
                        : "Otro"
                    }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="col-1">
                  {{ event.available_seats }}
                </q-item-section>
                <q-item-section side>
                  <q-icon name="airport_shuttle" />
                </q-item-section>
              </q-item>

              <q-tooltip>
                <event-card :event="event" />
              </q-tooltip>
            </div>
          </div>
        </template>
      </template>
    </q-calendar-month>
  </q-page>

  <q-dialog
    v-model="addForm"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="max-width: 900px">
      <q-card-section
        class="bg-primary text-white d-flex justify-between items-center q-pa-sm"
      >
        <q-item>
          <q-item-section>
            <div class="text-h6">
              {{ formatDateplusone(currentDay) }}
            </div>
          </q-item-section>
          <q-item-section side>
            <q-item>
              <q-item-section>
                <q-btn dense label="Cerrar" color="red" v-close-popup />
              </q-item-section>
              <q-item-section>
                <q-btn dense label="Agendar" color="blue" @click="postEvent" />
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div>
          <event-form ref="store" :currentDay="currentDay" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showDay"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="max-width: 900px">
      <q-card-section
        class="bg-primary text-white d-flex justify-between items-center q-pa-sm"
      >
        <q-item>
          <q-item-section>
            <div class="text-h6">{{ formatDateplusone(currentDay) }}</div>
          </q-item-section>
          <q-item-section side>
            <q-item>
              <q-item-section>
                <q-btn
                  dense
                  label="Cerrar"
                  color="red"
                  v-close-popup
                  @click="getEvents"
                />
              </q-item-section>
              <q-item-section>
                <q-btn
                  dense
                  label="Agregar"
                  color="green"
                  @click="addForm = true"
                />
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div>
          <event-list :key="currentDay" :currentDay="currentDay" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="kardex"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    :maximized="true"
  >
    <q-card>
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6"> Kardex </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-separator />
      <Kardex />
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

import { sendRequest, checkRole } from "src/boot/functions";
import { formatTime, formatDateplusone } from "src/boot/formatFunctions";

import EventForm from "src/components/Calendar/EventForm.vue";
import EventList from "src/components/Calendar/EventList.vue";
import EventCard from "src/components/Calendar/EventCard.vue";
import Kardex from "src/components/Calendar/kardex.vue";

const $q = useQuasar();
const calendar = ref(null);
const selectedDate = ref(today());
const addForm = ref(false);
const kardex = ref(false);
const store = ref(null);
const showDay = ref(null);
const currentDay = ref(null);

const events = ref(null);
const sucursales = ref([]);

const formFilter = ref({
  start_point: null,
  end_point: null,
});

const getMonthYear = (dateString) => {
  const dateObject = new Date(dateString);
  const month = dateObject.toLocaleString("default", { month: "long" });
  const year = dateObject.getFullYear();
  return `${month} ${year}`;
};

const currentMonthYear = ref(getMonthYear(selectedDate.value));

const onClickDate = (data) => {
  addForm.value = true;
  currentDay.value = data.scope.timestamp.date;
};

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

const eventsMap = computed(() => {
  const map = {};
  if (events.value.length > 0) {
    events.value.forEach((event) => {
      (map[event.date] = map[event.date] || []).push(event);
    });
  }
  return map;
});

const getEvents = async () => {
  let res = await sendRequest("GET", null, "/api/events", "");
  sucursales.value = res.sucursales;
  events.value = res.eventos;
};

const getEventsFilter = async () => {
  const final = { ...formFilter.value };
  let res = await sendRequest("PUT", final, "/api/event/all", "");
  events.value = res;
};

const postEvent = async () => {
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
    ...store.value.formEvent,
  };
  let res = await sendRequest("POST", final, "/api/events", "");
  addForm.value = false;
  showDay.value = false;
  getEvents();
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

onMounted(() => {
  getEvents();
});
</script>

<style>
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

.align-center {
  align-items: center;
}

.custom-calendar-month {
  margin: 20px; /* Ajusta el valor según el grosor de margen que desees */
}
</style>





