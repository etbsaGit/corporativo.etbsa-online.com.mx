<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="selectedEventId"
        :options="events"
        label="Llevar a"
        option-value="id"
        :option-label="formatLabel"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        filled
        dense
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-btn @click="setEvent" color="blue" dense label="Asignar lugar" />
    </q-item-section>
  </q-item>
  <q-separator></q-separator>

  <div class="q-pa-sm">
    <q-card bordered>
      <q-item v-for="(child, index) in event.child_events" :key="index">
        <q-item-section avatar>
          <q-avatar
            size="50px"
            color="primary"
            text-color="white"
            v-if="child.empleado.picture"
          >
            <img :src="child.empleado.picture" alt="Foto del empleado" />
          </q-avatar>
          <q-avatar v-else color="primary" text-color="white" size="50px">
            {{ child.empleado.nombre.charAt(0).toUpperCase()
            }}{{ child.empleado.apellido_paterno.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ child.empleado.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn @click="quitEvent(child.id)" icon="delete" color="red" dense />
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { sendRequest } from "src/boot/functions";

const bus = inject("bus");

const { event } = defineProps(["event"]);

const events = ref([]);
const selectedEventId = ref(null);

const getEmpleados = async () => {
  let res = await sendRequest("GET", null, "/api/event/" + event.date, "");
  events.value = res.filter(
    (option) =>
      option.id !== event.id &&
      !event.child_events.some((childEvent) => childEvent.id === option.id)
  );
};

const setEvent = async () => {
  const final = {
    event_id: event.id,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/event/child/" + selectedEventId.value,
    ""
  );
  bus.emit("recharge");
};

const quitEvent = async (id) => {
  let res = await sendRequest("GET", null, "/api/event/quit/" + id, "");
  bus.emit("recharge");
};

const formatLabel = (option) => {
  return option.empleado.nombreCompleto;
};

onMounted(() => {
  getEmpleados();
});
</script>

