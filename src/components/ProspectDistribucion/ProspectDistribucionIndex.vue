<template>
  <q-list bordered separator dense style="border-radius: 10px">
    <q-item align="center">
      <q-item-section avatar>
        <q-item-label><strong>Editar</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Nombre</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Ubicacion</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Hectareas Propias</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Hectareas Rentadas</strong></q-item-label>
      </q-item-section>
    </q-item>
    <q-item align="center" v-for="(dist, index) in rows" :key="index">
      <q-item-section avatar>
        <q-btn
          dense
          color="primary"
          flat
          icon="edit_square"
          @click="openEdit(dist)"
        />
      </q-item-section>
      <q-item-section>
        {{ dist.nombre }}
      </q-item-section>
      <q-item-section>
        {{ dist.ubicacion }}
      </q-item-section>
      <q-item-section>
        {{ dist.hectareas_propias }}
      </q-item-section>
      <q-item-section>
        {{ dist.hectareas_rentadas }}
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          dense
          flat
          label="Agregar distribucion"
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
          <prospect-distribucion-form ref="add" :prospect="prospect" />
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
          <prospect-distribucion-form
            ref="edit"
            :prospectDistribucion="selectedItem"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import ProspectDistribucionForm from "src/components/ProspectDistribucion/ProspectDistribucionForm.vue";

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
    "/api/prospectDistribucion/prospect/" + id,
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
    ...add.value.formProspectDistribucion,
  };
  let res = await sendRequest("POST", final, "/api/prospectDistribucion", "");
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
    ...edit.value.formProspectDistribucion,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/prospectDistribucion/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(prospect.id);
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/prospectDistribucion/" + selectedItem.value.id,
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
