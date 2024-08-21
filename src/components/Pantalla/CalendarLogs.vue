<template>
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
      :day-min-height="120"
      :day-height="0"
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
                <q-item-section>
                  <q-avatar
                    color="primary"
                    text-color="white"
                    v-if="log.tecnico.picture"
                  >
                    <img :src="log.tecnico.picture" alt="Foto del empleado" />
                  </q-avatar>
                  <q-avatar v-else color="primary" text-color="white">
                    {{ log.tecnico.nombre.charAt(0).toUpperCase()
                    }}{{ log.tecnico.apellido_paterno.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section avatar>
                  <q-item-label>
                    {{ formatTime(log.hora_inicio) }} -
                    {{ formatTime(log.hora_termino) }}
                  </q-item-label>
                  <q-item-label>
                    {{ log.tecnico.nombre }}
                    {{ log.tecnico.apellido_paterno }}
                    {{ log.tecnico.apellido_materno }}
                  </q-item-label>
                  <q-item-label>
                    {{ log.activity_technician.nombre }}
                  </q-item-label>
                  <q-item-label>
                    <strong>
                      {{ log.comentarios }}
                    </strong>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </template>
      </template>
    </q-calendar-month>
  </q-item>
</template>

<script setup>
import { QCalendarMonth, parseDate, today } from "@quasar/quasar-ui-qcalendar";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";

import { ref, watch, onMounted, computed } from "vue";
import { formatTime, formatDateplusone } from "src/boot/formatFunctions";

const { data } = defineProps(["data"]);

const selectedDate = ref(today());

const logs = ref(data);

const logsMap = computed(() => {
  const map = {};
  if (logs.value.length > 0) {
    logs.value.forEach((log) => {
      (map[log.fecha] = map[log.fecha] || []).push(log);
    });
  }
  return map;
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
</style>
