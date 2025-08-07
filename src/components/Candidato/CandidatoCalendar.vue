<template>
  <div class="q-pa-md q-gutter-md">
    <div
      class="flex justify-between items-center bg-primary text-white q-pa-sm rounded-borders shadow-2"
    >
      <q-btn
        icon="arrow_left"
        @click="prevMonth"
        flat
        dense
        round
        class="bg-white text-primary"
      />
      <div class="text-h6 text-weight-bold">{{ currentMonthYear }}</div>
      <q-btn
        icon="arrow_right"
        @click="nextMonth"
        flat
        dense
        round
        class="bg-white text-primary"
      />
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
      :day-min-height="120"
      :day-height="0"
      class="custom-calendar-month"
    >
      <template v-if="candidatos != null" #day="{ scope: { timestamp } }">
        <template
          v-for="candidato in candidatoMap[timestamp.date] || []"
          :key="candidato.id"
        >
          <div class="candidato-card" @click="onClickCandidato(candidato)">
            <q-item dense class="q-pa-xs">
              <q-item-section>
                <q-item-label class="text-bold text-primary">
                  {{ candidato.nombre }}
                </q-item-label>
                <q-item-label caption>
                  <strong>Puesto:</strong>
                  {{ candidato.requisicion.puesto.nombre }}
                </q-item-label>
                <q-item-label caption>
                  <strong>Sucursal:</strong>
                  {{ candidato.requisicion.sucursal.nombre }}
                </q-item-label>
                <q-item-label caption>
                  <strong>Linea:</strong>
                  {{ candidato.requisicion.linea.nombre }}
                </q-item-label>
                <q-item-label caption>
                  <strong>Departamento:</strong>
                  {{ candidato.requisicion.departamento.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </template>
    </q-calendar-month>
  </div>

  <BaseDialog v-model="showReq" mode="show" titleShow="Detalle">
    <template #form>
      <requisicion-personal-card :requisicion="selectedRow.requisicion" />
    </template>
  </BaseDialog>
</template>


<script setup>
import { QCalendarMonth, parseDate, today } from "@quasar/quasar-ui-qcalendar";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";
import { ref, watch, onMounted, computed } from "vue";
import { date } from "quasar";

import { sendRequest, dataIncomplete } from "src/boot/functions";
import RequisicionPersonalCard from "src/components/RequisicionPersonal/RequisicionPersonalCard.vue";
import BaseDialog from "src/bases/BaseDialog.vue";

const candidatos = ref([]);
const selectedRow = ref(null);
const showReq = ref(false);

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

const candidatoMap = computed(() => {
  const map = {};
  if (candidatos.value.length > 0) {
    candidatos.value.forEach((candidato) => {
      (map[candidato.fecha_entrevista_1] =
        map[candidato.fecha_entrevista_1] || []).push(candidato);
    });
  }
  return map;
});

const onClickCandidato = (candidato) => {
  selectedRow.value = candidato;
  showReq.value = true;
};

const getRows = async (date) => {
  let res = await sendRequest("GET", null, "/api/candidatos/month/" + date, "");
  candidatos.value = res;
};

onMounted(() => {
  getRows(selectedDate.value);
});
</script>

<style scoped>
.candidato-card {
  background-color: #e0f7fa;
  border-left: 4px solid #00bcd4;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
.candidato-card:hover {
  transform: scale(1.02);
  background-color: #b2ebf2;
}

.custom-calendar-month {
  background-color: #fafafa;
  border-radius: 10px;
  padding: 8px;
}
</style>

