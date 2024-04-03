<template>
  <div class="q-pa-md">
    <q-btn
      color="primary"
      label="Agregar tipo de tecnico"
      icon="add"
      @click="onRowClickAdd"
    />
    <div><br /></div>
    <q-table
      :rows="technicians"
      :columns="columns"
      dense
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-lineas="props">
        <q-td :props="props">
          <template
            v-for="(linea, index) in props.row.linea_technician"
            :key="index"
          >
            <div>
              {{ linea.linea.nombre }}
            </div>
          </template>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td>
          <q-btn
            @click="onRowClickEdit(props.row)"
            flat
            round
            color="blue"
            icon="edit"
          >
            <q-tooltip class="bg-blue">Editar</q-tooltip>
          </q-btn>
          <q-btn
            @click="onRowClickDelete(props.row)"
            flat
            round
            color="red"
            icon="delete"
          >
            <q-tooltip class="bg-red">Borrar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
  <q-dialog
    v-model="editTechnician"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Modificar {{ selectedTechnician.name }}</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Modificar tecnico"
            color="blue"
            @click="putTechnicians()"
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <technician-card
          :technician="selectedTechnician"
          :lineas="lineas"
          ref="editTech"
        />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="addTechnician"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Agregar tipo de tecnico</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Agregar tecnico"
            color="blue"
            @click="postTechnicians()"
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <technician-card :technician="null" :lineas="lineas" ref="addTech" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="deleteTechnician"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center">
        <div class="text-h6">Borrar tipo de tecnico</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Borrar tecnico"
            color="orange"
            @click="deleteTechnicians()"
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <h6>Se borrara el tipo de tecnico y todo lo relacionado</h6>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { sendRequest } from "src/boot/functions";

const bus = inject("bus");

import TechnicianCard from "src/components/Technician/TechnicianCard.vue";

const technicians = ref([]);
const lineas = ref([]);
const selectedTechnician = ref(null);
const editTechnician = ref(false);
const addTechnician = ref(false);
const deleteTechnician = ref(false);
const editTech = ref(null);
const addTech = ref(null);

const onRowClickEdit = (row) => {
  selectedTechnician.value = row;
  editTechnician.value = true;
};

const onRowClickDelete = (row) => {
  selectedTechnician.value = row;
  deleteTechnician.value = true;
};

const onRowClickAdd = () => {
  addTechnician.value = true;
};

const getTechnicians = async () => {
  let res = await sendRequest("GET", null, "/api/technician", "");
  technicians.value = res.technicians;
  lineas.value = res.lineas;
};

const postTechnicians = async () => {
  let res = await sendRequest(
    "POST",
    addTech.value.formTech,
    "/api/technician",
    ""
  );

  getTechnicians();
  bus.emit("edit_qualifications");
  addTechnician.value = false;
};

const putTechnicians = async () => {
  let res = await sendRequest(
    "PUT",
    editTech.value.formTech,
    "/api/technician/" + selectedTechnician.value.id,
    ""
  );
  selectedTechnician.value = null;
  editTechnician.value = false;
  getTechnicians();
  bus.emit("edit_qualifications");
};

const deleteTechnicians = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/technician/" + selectedTechnician.value.id,
    ""
  );
  selectedTechnician.value = null;
  deleteTechnician.value = false;
  getTechnicians();
  bus.emit("edit_qualifications");
};

const columns = [
  {
    name: "name",
    label: "Nombre",
    field: "name",
    sortable: true,
    align: "left",
  },
  {
    name: "level",
    label: "Nivel",
    field: "level",
    sortable: true,
    align: "left",
  },
  {
    name: "lineas",
    label: "Lineas",
    field: "linea",
    sortable: true,
    align: "left",
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    sortable: true,
    align: "left",
  },
];

onMounted(() => {
  getTechnicians();
});
</script>

