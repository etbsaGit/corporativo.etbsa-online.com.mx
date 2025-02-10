<template>
  <q-list bordered separator dense style="border-radius: 10px">
    <q-item align="center">
      <q-item-section avatar>
        <q-item-label><strong>Editar</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Modelo</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Año</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Marca</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Condicion</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Clasicicacion de equipo</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Tipo de equipo</strong></q-item-label>
      </q-item-section>
    </q-item>
    <q-item align="center" v-for="(maquina, index) in rows" :key="index">
      <q-item-section avatar>
        <q-btn
          dense
          color="primary"
          flat
          icon="edit_square"
          @click="openEdit(maquina)"
        />
      </q-item-section>

      <q-item-section>
        {{ maquina.modelo }}
      </q-item-section>
      <q-item-section>
        {{ maquina.anio }}
      </q-item-section>

      <q-item-section>
        {{ maquina.marca?.name }}
      </q-item-section>
      <q-item-section>
        {{ maquina.condicion?.name }}
      </q-item-section>
      <q-item-section>
        {{ maquina.clas_equipo?.name }}
      </q-item-section>
      <q-item-section>
        {{ maquina.tipo_equipo?.name }}
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          dense
          flat
          label="Agregar maquina"
          color="primary"
          icon="add_circle"
          @click="showAdd = true"
        />
      </q-item-section>
    </q-item>
  </q-list>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <prospect-maquina-form ref="add" :prospect="prospect" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putItem" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="destroyItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <prospect-maquina-form ref="edit" :prospectMaquina="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import ProspectMaquinaForm from "src/components/ProspectMaquina/ProspectMaquinaForm.vue";

const { prospect } = defineProps(["prospect"]);

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

const getRows = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/prospectMaquina/prospect/" + id,
    ""
  );
  rows.value = res;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formProspectMaquina,
  };
  let res = await sendRequest("POST", final, "/api/prospectMaquina", "");
  showAdd.value = false;
  getRows(prospect.id);
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formProspectMaquina,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/prospectMaquina/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(prospect.id);
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/prospectMaquina/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  getRows(prospect.id);
};

onMounted(() => {
  getRows(prospect.id);
});
</script>
