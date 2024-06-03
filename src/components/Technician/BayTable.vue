<template>
  <q-item class="row">
    <q-item-section class="col-2">
      <q-btn
        dense
        color="primary"
        label="Agregar bahia"
        icon="add"
        @click="onRowClickAdd"
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-if="!checkRole('Taller')"
        v-model="formFilter.linea_id"
        :options="lineas"
        label="Linea"
        option-value="id"
        option-label="nombre"
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
    <q-item-section>
      <q-select
        v-if="!checkRole('Taller')"
        v-model="formFilter.sucursal_id"
        :options="sucursales"
        label="Sucursal"
        option-value="id"
        option-label="nombre"
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
    <q-item-section class="col-1">
      <q-btn
        v-if="!checkRole('Taller')"
        dense
        color="primary"
        label="buscar"
        @click="getAll"
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        :rows="bays"
        :columns="columns"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-tecnico="props">
          <q-td :props="props">
            {{ props.row.tecnico ? props.row.tecnico.nombreCompleto : null }}
          </q-td>
        </template>
        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            {{ props.row.sucursal.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-linea="props">
          <q-td :props="props">
            {{ props.row.linea.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-maquina="props">
          <q-td :props="props">
            {{ props.row.maquina }}
            <q-tooltip>{{ props.row.descripcion }}</q-tooltip>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td>
            <q-btn-dropdown flat color="primary" icon="menu" dense>
              <q-list v-close-popup>
                <q-item>
                  <q-btn
                    @click="onRowClickEdit(props.row)"
                    flat
                    size="sm"
                    label="Editar"
                    color="blue"
                    icon="edit"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    @click="onRowClickDelete(props.row)"
                    flat
                    size="sm"
                    label="Borrar"
                    color="red"
                    icon="delete"
                  />
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="editBay"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Modificar bahia {{ selectedBay.num }}</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Modificar bahia" color="blue" @click="putBay()" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <bay-card :bay="selectedBay" ref="edit" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="addBay"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Agregar bahia</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Agregar bahia" color="blue" @click="postBay()" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <bay-card ref="add" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="deleteBay"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Borrar bahia</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Borrar bahia"
            color="orange"
            @click="supBay()"
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <h6>Se borrara la bahia y todo lo relacionado</h6>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted, inject, watch } from "vue";
import { sendRequest } from "src/boot/functions";
import { checkRole } from "src/boot/functions";

import { useQuasar } from "quasar";

import BayCard from "src/components/Technician/BayCard.vue";

const channel = new BroadcastChannel("method-execution-channel");

const formFilter = ref({
  sucursal_id: null,
  linea_id: null,
});

const bus = inject("bus");
const $q = useQuasar();

const bays = ref([]);
const sucursales = ref(null);
const lineas = ref(null);
const selectedBay = ref(null);
const editBay = ref(false);
const addBay = ref(false);
const deleteBay = ref(false);
const edit = ref(null);
const add = ref(null);

const onRowClickEdit = (row) => {
  selectedBay.value = row;
  editBay.value = true;
};

const onRowClickDelete = (row) => {
  selectedBay.value = row;
  deleteBay.value = true;
};

const onRowClickAdd = () => {
  addBay.value = true;
};

const getAll = async () => {
  const final = { ...formFilter.value };
  let res = await sendRequest("POST", final, "/api/bays/getAll", "");
  bays.value = res.bays;
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
};

const postBay = async () => {
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
    ...add.value.formBay,
  };
  let res = await sendRequest("POST", final, "/api/bay", "");
  getAll();
  addBay.value = false;
  channel.postMessage({ action: "executeMethod" });
};

const putBay = async () => {
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
    ...edit.value.formBay,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/bay/" + selectedBay.value.id,
    ""
  );
  selectedBay.value = null;
  editBay.value = false;
  getAll();
  channel.postMessage({ action: "executeMethod" });
};

const supBay = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/bay/" + selectedBay.value.id,
    ""
  );
  selectedBay.value = null;
  deleteBay.value = false;
  getAll();
  channel.postMessage({ action: "executeMethod" });
};

const columns = [
  {
    name: "nombre",
    label: "Bahia",
    field: "nombre",
    sortable: true,
    align: "left",
  },
  {
    name: "cliente",
    label: "Cliente",
    field: "cliente",
    sortable: true,
    align: "left",
  },
  {
    name: "maquina",
    label: "Maquina",
    field: "maquina",
    sortable: true,
    align: "left",
  },
  {
    name: "tecnico",
    label: "Tecnico",
    field: "tecnico",
    sortable: true,
    align: "left",
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    sortable: true,
    align: "left",
  },
  {
    name: "sucursal",
    label: "Sucursal",
    field: "sucursal",
    sortable: true,
    align: "left",
  },
  {
    name: "linea",
    label: "Linea",
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
  getAll();
});
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 10px;
}
</style>
