<template>
  <q-page class="q-pa-xs bg-white">
    <q-item>
      <q-item-section>
        <q-btn
          color="primary"
          outline
          label="Kardex visitas"
          @click="kardex = true"
        />
      </q-item-section>
    </q-item>
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
    >
      <template v-if="events != null" #day="{ scope: { timestamp } }">
        <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
          <div
            class="my-event rounded-border"
            style="position: relative"
            :style="{ backgroundColor: event.color }"
          >
            <div class="q-calendar__ellipsis">
              <q-item>
                <!-- <q-item-section avatar>
                  <q-avatar
                    color="primary"
                    text-color="white"
                    v-if="event.empleado.picture"
                  >
                    <img
                      :src="event.empleado.picture"
                      alt="Foto del empleado"
                    />
                  </q-avatar>
                  <q-avatar v-else color="white" text-color="primary">
                    {{ event.empleado.nombre.charAt(0).toUpperCase() }}
                    {{
                      event.empleado.apellido_paterno.charAt(0).toUpperCase()
                    }}
                  </q-avatar>
                </q-item-section> -->

                <q-item-section>
                  <q-item-label>
                    {{ event.empleado.nombre }}
                    {{ event.empleado.apellido_paterno }}
                  </q-item-label>
                  <q-item-label>{{ event.sucursal.nombre }}</q-item-label>
                  <q-item-label caption v-if="event.start_time">
                    {{ formatTime(event.start_time) }} -
                    {{ formatTime(event.end_time) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-avatar size="sm" color="green" text-color="white">
                    {{ event.countActivities.completed_count }}
                  </q-avatar>
                  <q-avatar size="sm" color="red" text-color="white">
                    {{ event.countActivities.incomplete_count }}
                  </q-avatar>
                </q-item-section>
              </q-item>
              <q-tooltip class="text-body2">{{ event.title }}</q-tooltip>
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
            <div class="text-h6">{{ formatDate(currentDay) }}</div>
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
            <div class="text-h6">{{ formatDate(currentDay) }}</div>
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

import { sendRequest } from "src/boot/functions";
import { formatTime, formatDate } from "src/boot/formatFunctions";

import EventForm from "src/components/Calendar/EventForm.vue";
import EventList from "src/components/Calendar/EventList.vue";
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

onMounted(() => {
  getEvents();
});
</script>

<style lang="sass" scoped>
.my-event
  position: relative
  font-size: 12px
  width: 100%
  margin: 1px 0 0 0
  justify-content: center
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.rounded-border
  border-radius: 2px

.highlight
  font-size: 20px
  font-weight: bold
  text-align: center
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)
  padding: 10px
  border-radius: 10px

.form-container
  max-height: 600px
  overflow-y: auto

.align-center
  align-items: center
</style>





