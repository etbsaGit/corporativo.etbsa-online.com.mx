<template>
  <div class="row q-pa-sm q-gutter-sm">
    <q-card class="col-12">
      <!-- <div class="q-pr-md"> -->
      <!-- <div class="q-pb-sm text-h5">Model: {{ model }}</div>
        <div class="q-pb-sm text-h5">Eventos: {{ fechasInRange }}</div> -->

      <q-date
        v-model="model"
        :events="eventsFn"
        :event-color="
          (date) =>
            events.some((event) => event.event == date && event.to_count)
              ? 'red'
              : 'blue'
        "
        :options="isSunday"
        range
        style="width: 100%"
        minimal
        dark
      />
      <!-- </div> -->
    </q-card>
    <div class="col-12">
      <div class="row q-gutter-sm">
        <div class="col">
          <q-card>
            <q-card-section>
              <div class="row">
                <div class="col-10">
                  <div class="text-h6">Dias Periodo Actual</div>
                  <div class="text-h5">{{ 20 }}</div>
                </div>
                <div class="col">
                  <q-icon size="34px" name="trending_up" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card>
            <q-card-section>
              <div class="row">
                <div class="col-10">
                  <div class="text-h6">Subtotal</div>
                  <div class="text-h5">15</div>
                </div>
                <div class="col">
                  <q-icon size="34px" name="trending_up" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card>
            <q-card-section>
              <div class="row">
                <div class="col-10">
                  <div class="text-h6">Dias Disfrute</div>
                  <div class="text-h5">{{ DifferenceInDays }}</div>
                </div>
                <div class="col">
                  <q-icon size="34px" name="trending_up" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card class="col-6">
            <q-card-section>
              <div class="row">
                <div class="col-10">
                  <div class="text-h6">Dias Pendientes</div>
                  <div class="text-h5">5</div>
                </div>
                <div class="col">
                  <q-icon size="34px" name="trending_up" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- <q-btn label="Enviar"></q-btn> -->
  </div>
</template>
<script setup>
// import { differenceInDays } from 'date-fns'
import { date } from "quasar";
import { computed, ref } from "vue";

const model = ref({ from: "2023/12/08", to: "2023/012/17" });
const events = [
  { event: "2023/12/12", to_count: true },
  { event: "2023/12/28", to_count: false },
  { event: "2023/12/06", to_count: false },
];

const eventsFn = computed(() => {
  return events.map((event) => event.event);
});

const selectedEvent = computed(() => {
  return model.value instanceof Object
    ? model.value.to || model.value.from
    : model.value;
});

const isSunday = (date) => {
  const dateNow = new Date(date);
  const day = dateNow.getDay();

  return day !== 0;
};

const fechasInRange = computed(() => {
  if (!(model.value instanceof Object)) return null;
  const fechaInicio = new Date(model.value.from);
  const fechaFin = new Date(model.value.to);

  return events
    .map((fecha) => fecha) // Mapear a objetos con la fecha y su índice
    .filter(({ event }) => {
      const fechaActual = new Date(event);
      return fechaActual >= fechaInicio && fechaActual <= fechaFin;
    });
});
const DifferenceInDays = computed(() => {
  return model.value instanceof Object
    ? date.getDateDiff(model.value.to, model.value.from, "days") + 1
    : 1;
});
</script>
<style></style>
