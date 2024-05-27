<template>
  <q-form ref="myForm" greedy>
    <q-item v-for="(activity, index) in event.activity" :key="index">
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
</template>

<script setup>
import { ref } from "vue";
import { sendRequest } from "src/boot/functions";
const { event } = defineProps(["event"]);
const myForm = ref(null);

const formActivities = ref([]);

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

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formActivities,
  validate,
});
</script>
