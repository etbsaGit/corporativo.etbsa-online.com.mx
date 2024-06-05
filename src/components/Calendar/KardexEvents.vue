<template>
  <div v-if="events.length > 0" class="q-pa-md items-start q-gutter-md">
    <q-card v-for="(event, index) in sortedEvents" :key="index" bordered>
      <q-item>
        <q-item-section class="col-6">
          <q-item-label class="text-grey-8">
            <strong> Viaja a: </strong>
            {{ event.sucursal.nombre }}
          </q-item-label>
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
            {{ formatDate(event.date) }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong> Salida: </strong>
            {{ formatTime(event.start_time) }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong> Regreso: </strong>
            {{ formatTime(event.end_time) }}
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
            <q-separator></q-separator>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatTime, formatDate } from "src/boot/formatFunctions";
const { events } = defineProps(["events"]);

const sortedEvents = computed(() => {
  return events.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
});
</script>
