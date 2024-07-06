<template>
  <div v-if="events.length > 0" class="q-pa-md items-start q-gutter-md">
    <q-card v-for="(event, index) in sortedEvents" :key="index" bordered>
      <q-item>
        <q-item-section class="col-6">
          <q-item-label class="text-grey-8">
            <strong> Motivo: </strong>
            {{ event.title }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong> descripcion: </strong>
            {{ event.description }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong> Fecha: </strong>
            {{ formatDateplusone(event.date) }}
          </q-item-label>
        </q-item-section>
        <q-separator vertical></q-separator>
        <q-item-section>
          <q-item-label
            v-for="(activity, index) in event.activity"
            :key="index"
          >
            <q-item>
              <q-item-section>
                {{ activity.details }}
              </q-item-section>
              <q-item-section side>
                <q-checkbox
                  v-model="activity.completed"
                  :true-value="1"
                  :false-value="0"
                  disable
                />
              </q-item-section>
            </q-item>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item v-for="(travel, index) in event.travel" :key="index">
        <q-item-section>
          <q-item-label><strong>Salida:</strong></q-item-label>
          <q-item-label>{{
            travel.start_point_r ? travel.start_point_r.nombre : "Otro"
          }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label><strong>Hora salida:</strong></q-item-label>
          <q-item-label>{{ formatTime(travel.start_time) }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label><strong>Destino:</strong></q-item-label>
          <q-item-label>{{
            travel.end_point_r ? travel.end_point_r.nombre : "Otro"
          }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label><strong>Hora llegada:</strong></q-item-label>
          <q-item-label>{{ formatTime(travel.end_time) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatTime, formatDateplusone } from "src/boot/formatFunctions";
const { events } = defineProps(["events"]);

const sortedEvents = computed(() => {
  const copiedEvents = events.slice();
  copiedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  const uniqueEvents = copiedEvents.filter(
    (event, index, self) => index === self.findIndex((t) => t.id === event.id)
  );
  return uniqueEvents;
});
</script>
