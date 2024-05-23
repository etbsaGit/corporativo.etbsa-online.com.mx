<template>
  <div v-if="events.length > 0" class="q-pa-md items-start q-gutter-md">
    <q-card v-for="(event, index) in events" :key="index" bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar
            size="60px"
            color="primary"
            text-color="white"
            v-if="event.empleado.picture"
          >
            <img :src="event.empleado.picture" alt="Foto del empleado" />
          </q-avatar>
          <q-avatar v-else color="primary" text-color="white" size="60px">
            {{ event.empleado.nombre.charAt(0).toUpperCase()
            }}{{ event.empleado.apellido_paterno.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-grey-8 text-weight-bold">
            {{ event.empleado.nombreCompleto }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong> Viaja a: </strong>
            {{ event.sucursal.nombre }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong> Motivo: </strong>
            {{ event.title }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong> Sale a las: </strong>
            {{ formatTime(event.start_time) }}
          </q-item-label>
          <q-item-label class="text-grey-8">
            <strong> Regresa a las: </strong>
            {{ formatTime(event.end_time) }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label>
            <q-btn
              v-if="checkUserId(event.empleado.id)"
              size="sm"
              flat
              round
              icon="edit"
              class="bg-indigo-7 text-white"
              @click="openEdit(event)"
            >
              <q-tooltip class="text-body2 bg-indigo-7">Editar</q-tooltip>
            </q-btn>
          </q-item-label>
          <q-item-label>
            <q-btn
              icon="event"
              round
              color="brown"
              size="sm"
              v-if="checkUserId(event.empleado.id)"
            >
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="newDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancelar" color="red" dense v-close-popup />
                    <q-btn
                      dense
                      label="Cambiar"
                      color="green"
                      @click="changeDate(event.id)"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
              <q-tooltip class="text-body2 bg-brown">Cambiar fecha</q-tooltip>
            </q-btn>
          </q-item-label>
          <q-item-label>
            <q-btn
              v-if="checkUserId(event.empleado.id)"
              size="sm"
              flat
              round
              icon="delete"
              class="bg-red text-white"
              @click="deleteEvent(event.id)"
            >
              <q-tooltip class="text-body2 bg-red">Borrar</q-tooltip>
            </q-btn>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator></q-separator>
      <q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label class="q-pa-none text-grey-8">
              <strong> Descripcion de actividades: </strong>
              {{ event.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>
              <q-btn
                v-if="checkUserId(event.empleado.id)"
                flat
                round
                icon="list_alt"
                class="bg-blue-grey-10 text-white"
              >
                <q-tooltip class="text-body2 bg-blue-grey-10">
                  Lista de actividades
                </q-tooltip>
              </q-btn>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </div>
  <div v-else class="highlight">No hay citas</div>

  <q-dialog
    v-model="editForm"
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
                <q-btn
                  dense
                  label="Actualizar"
                  color="blue"
                  @click="putEvent(selectedEvent.id)"
                />
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div>
          <event-form ref="edit" :event="selectedEvent" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { date, useQuasar } from "quasar";
import { sendRequest, checkUserId } from "src/boot/functions";

import EventForm from "src/components/Calendar/EventForm.vue";

const { currentDay } = defineProps(["currentDay"]);

const $q = useQuasar();

const events = ref([]);
const selectedEvent = ref(null);
const edit = ref(null);
const editForm = ref(false);
const newDate = ref(currentDay);

function formatDate(currentDay) {
  const nextDay = date.addToDate(currentDay, { days: 1 });
  return date.formatDate(nextDay, "dddd D [de] MMMM [del] YYYY");
}

const formatTime = (time) => {
  if (!time) return "No definido";
  const timeArray = time.split(":");
  return `${timeArray[0]}:${timeArray[1]}`;
};

const openEdit = (event) => {
  selectedEvent.value = event;
  editForm.value = true;
};

const getEventsPerDate = async () => {
  let res = await sendRequest("GET", null, "/api/event/" + currentDay, "");
  events.value = res;
};

const deleteEvent = async (id) => {
  let res = await sendRequest("DELETE", null, "/api/events/" + id, "");
  getEventsPerDate();
};

const putEvent = async (id) => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...edit.value.formEvent,
  };
  let res = await sendRequest("PUT", final, "/api/events/" + id, "");
  editForm.value = false;
  getEventsPerDate();
};

const changeDate = async (id) => {
  const final = {
    date: newDate.value,
  };
  let res = await sendRequest("PUT", final, "/api/event/change/" + id, "");
  getEventsPerDate();
};

onMounted(() => {
  getEventsPerDate();
});
</script>

<style lang="sass" scoped>
.highlight
  font-size: 20px
  font-weight: bold
  text-align: center
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)
  padding: 10px
  border-radius: 10px
</style>

