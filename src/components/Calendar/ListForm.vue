<template>
  <q-form ref="myForm" greedy>
    <q-item v-for="(activity, index) in activities" :key="index">
      <q-item-section class="col-1">
        <q-btn dense flat icon="more_vert" @click="openItem(activity)"></q-btn>
      </q-item-section>
      <q-item-section>
        {{ activity.details }}
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
    <q-separator></q-separator>
    <q-item v-for="(activity, index) in formActivities" :key="index">
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
              <q-btn color="red" icon="delete" @click="deleteActivity(index)" />
            </q-avatar>
          </template>
          <template v-slot:after>
            <q-checkbox
              v-model="activity.completed"
              :true-value="1"
              :false-value="0"
            ></q-checkbox>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
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
              label="Actividad"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            >
              <template v-slot:after>
                <q-checkbox
                  v-model="formActivity.completed"
                  :true-value="1"
                  :false-value="0"
                />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
const { event } = defineProps(["event"]);
const myForm = ref(null);
const itemDialog = ref(false);
const formActivities = ref([]);
const selectedItem = ref(null);
const activities = ref(null);

const formActivity = ref({
  details: null,
  completed: 0,
  event_id: event.id,
});

const openItem = (activity) => {
  itemDialog.value = true;
  selectedItem.value = activity;
  formActivity.value.details = activity.details;
  formActivity.value.completed = activity.completed;
};

const addActivity = () => {
  formActivities.value.push({
    details: null,
    completed: 0,
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
  activities.value = res;
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
