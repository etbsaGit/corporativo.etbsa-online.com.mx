<template>
  <q-list bordered separator dense>
    <q-item align="center">
      <q-item-section>
        <q-item-label><strong>Fecha</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Inicio</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Termino</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Actividad</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>OT</strong></q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      align="center"
      v-for="(log, index) in rows"
      :key="index"
      clickable
      v-ripple
      @click="openEdit(log)"
      class="item-log"
    >
      <q-item-section>
        {{ formatDateplusoneSlim(log.fecha) }}
      </q-item-section>
      <q-item-section>
        {{ formatTime(log.hora_inicio) }}
      </q-item-section>
      <q-item-section>
        {{ formatTime(log.hora_termino) }}
      </q-item-section>
      <q-item-section>
        {{ log.activity_technician.nombre }}
      </q-item-section>
      <q-item-section>
        {{ log.wo?.maquina }}
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          dense
          flat
          label="Agregar actividad"
          color="primary"
          icon="add_circle"
          @click="showAdd = true"
        />
      </q-item-section>
    </q-item>
  </q-list>

  <q-dialog
    v-model="showAdd"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn dense size="md" label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            size="md"
            label="Agregar"
            color="blue"
            @click="postItem"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item class="q-pa-none">
        <q-item-section>
          <log-form ref="add" :employee="employee" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn dense size="md" label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            size="md"
            label="Actualizar"
            color="blue"
            @click="putItem"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            size="md"
            label="Borrar"
            color="orange"
            @click="destroyItem"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <log-form ref="edit" :log="selectedItem" :employee="employee" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatTime, formatDateplusoneSlim } from "src/boot/formatFunctions";
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from "quasar";

const $q = useQuasar();

const auth = useAuthStore();

const employee = ref(auth.user.empleado);

import LogForm from "src/components/Technician/LogForm.vue";

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const getRows = async () => {
  let res = await sendRequest("GET", null, "/api/techniciansLog/options", "");
  rows.value = res.logs;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...add.value.formLog,
  };
  let res = await sendRequest("POST", final, "/api/techniciansLog", "");
  showAdd.value = false;
  getRows();
};

const putItem = async () => {
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
    ...edit.value.formLog,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/techniciansLog/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows();
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/techniciansLog/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  getRows();
};

onMounted(() => {
  getRows();
});
</script>

<style>
.item-log {
  font-size: 0.8em; /* Tamaño de fuente más pequeño */
}
</style>
