<template>
  <q-form ref="myForm" greedy>
    <div v-for="(activity, index) in activities" :key="index">
      <q-separator />
      <q-item>
        <q-item-section class="col-1">
          <q-btn dense flat icon="more_vert" @click="openItem(activity)" />
        </q-item-section>
        <q-item-section>
          {{ activity.details }}
          <q-tooltip class="bg-black text-h6" v-if="activity.comments">
            {{ activity.comments }}
          </q-tooltip>
        </q-item-section>
        <q-item-section
          v-if="activity.empleado_id"
          @click="sendMessage(activity)"
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white"
                size="60px"
                v-if="activity.empleado && activity.empleado.picture"
              >
                <img :src="activity.empleado.picture" alt="Foto del empleado" />
              </q-avatar>
              <q-avatar size="60px" v-else color="primary" text-color="white">
                {{ activity.empleado.nombre.charAt(0).toUpperCase()
                }}{{
                  activity.empleado.apellido_paterno.charAt(1).toUpperCase()
                }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              {{ activity.empleado.nombreCompleto }}
            </q-item-section>
            <q-tooltip class="bg-green"> Mandar mensaje </q-tooltip>
          </q-item>
        </q-item-section>
        <q-item-section side>
          <q-checkbox
            v-model="activity.completed"
            :true-value="1"
            :false-value="0"
            @update:model-value="changeCompleted(activity.id)"
          />
        </q-item-section>
      </q-item>
    </div>
    <q-separator />
    <div v-for="(activity, index) in formActivities" :key="index">
      <q-item>
        <q-item-section>
          <q-input
            v-model="activity.details"
            filled
            dense
            hint
            label="Actividad"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          >
            <template v-slot:before>
              <q-avatar>
                <q-btn
                  color="red"
                  icon="delete"
                  @click="deleteActivity(index)"
                />
              </q-avatar>
            </template>
          </q-input>
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="activity.empleado_id"
            :options="empleados"
            option-value="id"
            option-label="nombreCompleto"
            label="Notificar a"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            filled
            dense
            hint
          >
            <template v-slot:after>
              <q-checkbox
                v-model="activity.completed"
                :true-value="1"
                :false-value="0"
              />
            </template>
          </q-select>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="activity.comments"
            filled
            dense
            label="Comentarios"
            lazy-rules
          />
        </q-item-section>
      </q-item>
    </div>
    <q-item>
      <q-item-section>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar actividad"
          @click="addActivity"
        />
      </q-item-section>
    </q-item>
  </q-form>
  <q-dialog
    v-model="itemDialog"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Actualizar actividad</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn label="Cerrar" color="red" v-close-popup />
          </q-item-section>
          <q-item-section side>
            <q-btn label="Actualizar" color="blue" @click="putActivity" />
          </q-item-section>
          <q-item-section side>
            <q-btn label="Borrar" color="orange" @click="destroyActivity" />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formActivity.details"
              filled
              dense
              hint
              label="Actividad"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formActivity.empleado_id"
              :options="empleados"
              option-value="id"
              option-label="nombreCompleto"
              label="Notificar a"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              filled
              dense
              hint
            >
              <template v-slot:after>
                <q-checkbox
                  v-model="formActivity.completed"
                  :true-value="1"
                  :false-value="0"
                />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formActivity.comments"
              filled
              dense
              label="Comentarios"
              lazy-rules
            />
          </q-item-section>
        </q-item>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";
import { formatDateplusone } from "src/boot/formatFunctions";
const { event } = defineProps(["event"]);
const $q = useQuasar();
const myForm = ref(null);
const itemDialog = ref(false);
const formActivities = ref([]);
const selectedItem = ref(null);
const activities = ref(null);
const empleados = ref([]);

const formActivity = ref({
  details: null,
  completed: 0,
  empleado_id: null,
  event_id: event.id,
});

const openItem = (activity) => {
  itemDialog.value = true;
  selectedItem.value = activity;
  formActivity.value.details = activity.details;
  formActivity.value.completed = activity.completed;
  formActivity.value.comments = activity.comments;
  formActivity.value.empleado_id = activity.empleado_id;
};

const addActivity = () => {
  formActivities.value.push({
    details: null,
    completed: 0,
    empleado_id: null,
    comments: null,
  });
};
const deleteActivity = (index) => {
  formActivities.value.splice(index, 1);
};

const changeCompleted = async (id) => {
  let res = await sendRequest("PUT", null, "/api/event/completed/" + id, "");
};

const putActivity = async () => {
  let res = await sendRequest(
    "PUT",
    formActivity.value,
    "/api/activities/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  itemDialog.value = false;
  getActivities();
};

const destroyActivity = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/activities/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  itemDialog.value = false;
  getActivities();
};

const getActivities = async () => {
  let res = await sendRequest("GET", null, "/api/activity/" + event.id, "");
  activities.value = res.activities;
  empleados.value = res.empleados;
};

const sendMessage = (activity) => {
  const phone = activity.empleado.telefono_institucional
    ? activity.empleado.telefono_institucional
    : activity.empleado.telefono;
  if (!phone) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "No tiene numero telefonico asingnado",
    });
    return;
  }
  const date = formatDateplusone(activity.event.date);
  const countryCode = "+52";
  const formattedPhoneNumber = countryCode + phone.trim();

  const message = `Hola, ire a tu sucursal el día "${date}" con motivo de "${activity.details}"`;
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

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getActivities();
});

defineExpose({
  formActivities,
  validate,
});
</script>
