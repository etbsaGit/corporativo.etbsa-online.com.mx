<template>
  <q-list bordered separator dense style="border-radius: 10px">
    <q-item align="center">
      <q-item-section avatar>
        <q-item-label><strong>Editar</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Hectareas propias</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Hectareas rentadas</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Tipo de riego</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Marca</strong></q-item-label>
      </q-item-section>
    </q-item>
    <q-item align="center" v-for="(riego, index) in rows" :key="index">
      <q-item-section avatar>
        <q-btn
          dense
          color="primary"
          flat
          icon="edit_square"
          @click="openEdit(riego)"
        />
      </q-item-section>
      <q-item-section>
        {{ riego.hectareas_propias }}
      </q-item-section>
      <q-item-section>
        {{ riego.hectareas_rentadas }}
      </q-item-section>
      <q-item-section>
        {{ riego.riego.name }}
      </q-item-section>
      <q-item-section>
        {{ riego.marca }}
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          dense
          flat
          label="Agregar riego"
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
          <prospect-riego-form ref="add" :prospect="prospect" />
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
          <prospect-riego-form ref="edit" :riego="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import ProspectRiegoForm from "src/components/ProspectRiego/ProspectRiegoForm.vue";

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
    "/api/prospectRiego/prospect/" + id,
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
    ...add.value.formProspectRiego,
  };
  let res = await sendRequest("POST", final, "/api/prospectRiego", "");
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
    ...edit.value.formProspectRiego,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/prospectRiego/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(prospect.id);
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/prospectRiego/" + selectedItem.value.id,
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
