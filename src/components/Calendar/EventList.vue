<template>
  <div v-if="events.length > 0" class="q-pa-sm items-start q-gutter-md">
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
            <strong> Motivo: </strong>
            {{ event.title }}
          </q-item-label>
          <q-item-label class="q-pa-none text-grey-8">
            <strong> Descripcion de actividades: </strong>
            {{ event.description }}
          </q-item-label>
          <q-item-label class="q-pa-none text-grey-8">
            <strong> Asientos disponibles: </strong>
            {{ event.available_seats }}
          </q-item-label>
        </q-item-section>

        <q-item-section side v-if="checkUserId(event.empleado.id)">
          <q-btn-dropdown dense flat color="primary" icon="menu">
            <q-list>
              <q-item>
                <q-btn
                  size="sm"
                  flat
                  icon="no_crash"
                  label="Asignar lugar"
                  color="purple-7"
                  @click="openCar(event)"
                />
              </q-item>
              <q-item>
                <q-btn
                  flat
                  icon="content_copy"
                  color="green-10"
                  size="sm"
                  label="Copiar evento"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="clonEventDate" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Cancelar"
                          color="red"
                          dense
                          v-close-popup
                        />
                        <q-btn
                          dense
                          label="Copiar"
                          color="green"
                          @click="copyEvent(event.id)"
                          v-close-popup
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </q-item>
              <q-item>
                <q-btn
                  size="sm"
                  flat
                  icon="edit"
                  label="Editar"
                  color="indigo-7"
                  @click="openEdit(event)"
                />
              </q-item>
              <q-item>
                <q-btn
                  size="sm"
                  flat
                  icon="list_alt"
                  color="blue-grey-10"
                  @click="openList(event)"
                  label="Lista de actividades"
                />
              </q-item>
              <q-item>
                <q-btn
                  flat
                  icon="event"
                  color="brown"
                  size="sm"
                  label="cambiar fecha"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="newDate" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Cancelar"
                          color="red"
                          dense
                          v-close-popup
                        />
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
                </q-btn>
              </q-item>
              <q-item>
                <q-btn
                  v-if="checkUserId(event.empleado.id)"
                  size="sm"
                  flat
                  icon="delete"
                  color="red"
                  label="borrar"
                  @click="deleteEvent(event.id)"
                />
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
        <q-item-section side v-else>
          <q-icon name="airport_shuttle" @click="sendMessage(event)">
            <q-tooltip class="text-body2"> Solicitar viaje </q-tooltip>
          </q-icon>
        </q-item-section>
      </q-item>

      <q-separator />
      <q-expansion-item
        dense
        flat
        color="primary"
        icon="fork_left"
        label="Rutas"
      >
        <div v-for="(travel, index) in event.travel" :key="index">
          <q-separator />
          <q-item class="q-pa-sm">
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
        </div>
      </q-expansion-item>
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
            <div class="text-h6">{{ formatDateplusone(currentDay) }}</div>
          </q-item-section>
          <q-item-section side>
            <q-btn dense label="Cerrar" color="red" v-close-popup />
          </q-item-section>
          <q-item-section side>
            <q-item-section>
              <q-btn
                dense
                label="Actualizar"
                color="blue"
                @click="putEvent(selectedEvent.id)"
              />
            </q-item-section>
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

  <q-dialog
    v-model="listForm"
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
                <q-btn dense label="Cerrar" color="red" v-close-popup />
              </q-item-section>
              <q-item-section>
                <q-btn
                  dense
                  label="Finalizar"
                  color="blue"
                  @click="setList(selectedEvent.id)"
                />
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div>
          <list-form ref="list" :event="selectedEvent" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="car"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
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
            <q-btn
              dense
              label="Cerrar"
              color="red"
              v-close-popup
              @click="getEventsPerDate"
            />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <card-place :event="selectedEvent" />
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { sendRequest, checkUserId } from "src/boot/functions";
import { formatTime, formatDateplusone } from "src/boot/formatFunctions";

import EventForm from "src/components/Calendar/EventForm.vue";
import ListForm from "src/components/Calendar/ListForm.vue";
import CardPlace from "src/components/Calendar/CardPlace.vue";

import { inject } from "vue";

const bus = inject("bus");

const { currentDay } = defineProps(["currentDay"]);

const $q = useQuasar();

const events = ref([]);
const selectedEvent = ref(null);
const edit = ref(null);
const editForm = ref(false);
const car = ref(false);
const newDate = ref(currentDay);
const clonEventDate = ref(currentDay);
const listForm = ref(false);
const list = ref(null);

bus.on("recharge", () => {
  getEventsPerDate();
  car.value = false;
});

const openEdit = (event) => {
  selectedEvent.value = event;
  editForm.value = true;
};

const openList = (event) => {
  selectedEvent.value = event;
  listForm.value = true;
};

const openCar = (event) => {
  selectedEvent.value = event;
  car.value = true;
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

const copyEvent = async (id) => {
  const final = {
    date: clonEventDate.value,
  };
  let res = await sendRequest("PUT", final, "/api/event/clone/" + id, "");
  getEventsPerDate();
};

const setList = async (id) => {
  const list_valid = await list.value.validate();
  if (!list_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  let res = await sendRequest(
    "PUT",
    list.value.formActivities,
    "/api/event/activity/" + id,
    ""
  );
  listForm.value = false;
  getEventsPerDate();
};

const sendMessage = (event) => {
  const phone = event.empleado.telefono_institucional
    ? event.empleado.telefono_institucional
    : event.empleado.telefono;
  if (!phone) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "No tiene numero telefonico asingnado",
    });
    return;
  }
  const date = formatDateplusone(event.date);
  const countryCode = "+52";
  const formattedPhoneNumber = countryCode + phone.trim();

  const message = `Hola, quiero solicitar un raite en tu viaje del "${date}"`;
  const whatsappLink = `https://wa.me/${encodeURIComponent(
    formattedPhoneNumber
  )}?text=${encodeURIComponent(message)}`;

  //Abrir enlace en una nueva ventana
  const newWindow = window.open(whatsappLink, "_blank");

  //Verificar si se abrió la nueva ventana correctamente
  if (!newWindow) {
    alert(
      "No se pudo abrir la ventana de WhatsApp. Asegúrate de tener permitido abrir ventanas emergentes en tu navegador."
    );
  }
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

