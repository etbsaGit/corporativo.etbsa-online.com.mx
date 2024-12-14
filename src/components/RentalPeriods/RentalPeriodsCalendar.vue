<template>
  <div class="q-pa-xs flex justify-between items-center">
    <q-btn icon="arrow_left" @click="prevMonth" />
    <div class="highlight">{{ currentMonthYear }}</div>
    <q-btn icon="arrow_right" @click="nextMonth" />
  </div>

  <q-calendar-month
    :weekdays="[0, 1, 2, 3, 4, 5, 6]"
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
    <template v-if="eventsMap" #day="{ scope: { timestamp } }">
      <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
        <q-card @click="clickItem(event)">
          <div class="my-event">
            <div class="event-title">Folio: {{ event.folio }}</div>

            <div class="event-details">
              <span>Cliente: {{ event.cliente?.nombre || "N/A" }}</span>
              <span>Modelo: {{ event.rental_machine?.model || "N/A" }}</span>
              <span># serie: {{ event.rental_machine?.serial || "N/A" }}</span>
            </div>

            <div class="rental-value">
              Renta: {{ formatCurrency(event.rental_value) }}
            </div>

            <img
              v-if="event.rental_machine?.pic"
              :src="event.rental_machine.pic"
              alt="Máquina"
            />

            <div v-if="event.comments" class="comments">
              {{ event.comments }}
            </div>
          </div>
        </q-card>
      </template>
    </template>
  </q-calendar-month>

  <q-dialog
    v-model="showEvent"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-space></q-space>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item class="q-pa-none">
        <q-item-section>
          <rental-period-card :rentalPeriod="currentDay" />
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
import { sendRequest } from "src/boot/functions";
import { formatCurrency } from "src/boot/formatFunctions";

import RentalPeriodCard from "src/components/RentalPeriods/RentalPeriodCard.vue";

const currentDay = ref(null);
const showEvent = ref(false);
const selectedDate = ref(today());
const rentals = ref([]);

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
});

// Función para obtener los datos de la API
const getActive = async () => {
  let res = await sendRequest("GET", null, "/api/rentalPeriods/all", "");
  rentals.value = res;
};

const clickItem = (event) => {
  showEvent.value = true;
  currentDay.value = event;
};

// Computed para generar el eventsMap dinámicamente
const eventsMap = computed(() => {
  const map = {};

  rentals.value.forEach((rental) => {
    const startDate = new Date(rental.start_date);
    const endDate = new Date(rental.end_date);
    const billingDay = parseInt(rental.billing_day, 10);

    // Iterar desde el mes de start_date hasta el último mes que incluye endDate
    let currentDate = new Date(startDate);

    while (
      currentDate.getFullYear() < endDate.getFullYear() ||
      (currentDate.getFullYear() === endDate.getFullYear() &&
        currentDate.getMonth() <= endDate.getMonth())
    ) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Crear una fecha válida para el día de facturación
      const validDate = new Date(year, month, billingDay);

      // Validar que el día pertenece al mes actual
      if (validDate.getMonth() === month) {
        const dateKey = date.formatDate(validDate, "YYYY-MM-DD");

        // Si no existe la clave, inicializarla
        if (!map[dateKey]) {
          map[dateKey] = [];
        }

        // Añadir el evento al día correspondiente
        map[dateKey].push({
          id: rental.id,
          folio: rental.folio,
          rental_value: rental.rental_value,
          cliente_id: rental.cliente_id,
          document: rental.document,
          comments: rental.comments,
          cliente: rental.cliente,
          rental_machine: rental.rental_machine,
          billing_day: rental.billing_day,
        });
      }

      // Avanzar al siguiente mes
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  });
  return map;
});

onMounted(() => {
  getActive();
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

.align-center {
  align-items: center;
}

.my-event {
  width: 100%; /* Ocupa todo el ancho de la celda */
  box-sizing: border-box; /* Incluye padding y borde en el cálculo del ancho */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #f9f9f9; /* Fondo claro */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin: 5px 0; /* Margen entre eventos si hay múltiples en un día */
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #333; /* Texto oscuro */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra ligera */
}

.my-event .event-title {
  font-size: 16px;
  font-weight: bold;
  color: #007bff; /* Azul para resaltar */
  margin-bottom: 5px;
}

.my-event .event-details {
  margin-bottom: 8px;
}

.my-event .event-details span {
  display: block;
  font-size: 12px;
  color: #666; /* Gris para información secundaria */
}

.my-event .rental-value {
  font-size: 14px;
  font-weight: bold;
  color: #28a745; /* Verde para el valor del alquiler */
  margin-bottom: 5px;
}

.my-event img {
  position: absolute; /* Posiciona la imagen sobre el evento */
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px; /* Tamaño de la imagen */
  height: auto;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: 0; /* Ocultar inicialmente */
  transition: opacity 0.3s ease-in-out; /* Transición suave */
  z-index: 10; /* Asegurar que se muestre sobre otros elementos */
}

.my-event:hover img {
  opacity: 1; /* Mostrar la imagen al pasar el mouse */
}

.my-event .comments {
  font-style: italic;
  font-size: 12px;
  color: #555;
}
</style>
