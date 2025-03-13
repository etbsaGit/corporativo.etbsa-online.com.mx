<template>
  <q-table
    flat
    bordered
    :rows="rows"
    :columns="columns"
    row-key="name"
    dense
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <q-item dense>
        <q-item-section avatar>
          <q-btn
            rounded
            dense
            color="primary"
            @click="showAdd = true"
            icon="add_circle"
          />
        </q-item-section>
        <q-item-section class="highlight"> Festivos </q-item-section>
      </q-item>
      <q-space></q-space>
      <q-item dense>
        <q-item-section side>
          <q-btn align="right" icon="arrow_left" @click="decrementYear" />
        </q-item-section>
        <q-item-section>
          <div class="highlight">{{ year }}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="arrow_right" @click="incrementYear" />
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:body-cell-edit="props">
      <q-td :props="props">
        <q-btn
          dense
          color="primary"
          flat
          icon="edit_square"
          @click="openEdit(props.row)"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-fecha="props">
      <q-td :props="props">
        {{ formatDateplusone(props.row.fecha) }}
      </q-td>
    </template>
  </q-table>

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
          <q-btn label="Agregar" color="blue" @click="postRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <festivo-form ref="add" />
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
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putRow" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <festivo-form ref="edit" :festivo="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import FestivoForm from "src/components/Festivo/FestivoForm.vue";
import { formatDateplusone } from "src/boot/formatFunctions";

const year = ref(new Date().getFullYear());

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
  },
  {
    name: "nombre",
    align: "left",
    field: "nombre",
    label: "Nombre",
  },

  {
    name: "fecha",
    align: "left",
    field: "fecha",
    label: "Fecha",
  },
];

const incrementYear = () => {
  year.value++;
};

const decrementYear = () => {
  year.value--;
};

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const getRows = async () => {
  const final = {
    year: year.value,
  };
  let res = await sendRequest("POST", final, "/api/festivos", "");
  rows.value = res;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formFestivo,
  };
  let res = await sendRequest("POST", final, "/api/festivo", "");
  showAdd.value = false;
  getRows();
};

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formFestivo,
  };
  let res = await sendRequest("PUT", final, "/api/festivo/" + final.id, "");
  showEdit.value = false;
  getRows();
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/festivo/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showEdit.value = false;
  getRows();
};

watch(year, () => {
  getRows();
});

onMounted(() => {
  getRows();
});
</script>

<style scoped>
.highlight {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
}
</style>
