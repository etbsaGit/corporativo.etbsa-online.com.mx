<template>
  <q-item>
    <q-btn
      label="Registrar estatus"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />
  </q-item>
  <q-item>
    <q-item-section>
      <q-input
        dense
        outlined
        class="boton"
        color="green-9"
        v-model="searchTerm"
        label="Buscar"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-item-section>
  </q-item>
  <q-table
    flat
    bordered
    title="Roles"
    :rows="filteredEstatus"
    :columns="columns"
    row-key="name"
    dense
    :rows-per-page-options="[0]"
  >
    <template v-slot:body-cell-color="props">
      <q-td :props="props">
        <q-badge
          text-color="black"
          :style="{ backgroundColor: props.row.color }"
        >
          <div class="text-subtitle1">
            {{ props.row.nombre }}
          </div>
        </q-badge>
      </q-td>
    </template>
    <template v-slot:top="props">
      <div class="col-2 q-table__title">Estatus</div>
      <q-space />
      <q-btn
        round
        dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
        class="q-ml-md"
      />
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td>
        <q-btn-dropdown flat color="primary" icon="menu" dense>
          <q-list v-close-popup>
            <q-item>
              <q-btn
                color="primary"
                @click="onRowClick(props.row)"
                flat
                size="sm"
                label="Editar"
                icon="edit"
              />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-td>
    </template>
  </q-table>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Registrar estatus</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Registrar" color="blue" @click="crearEstatus" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <estatus-form ref="form_1" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showDetails"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">
          Actualizar estatus {{ selectedEstatus.nombre }}
        </div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Actualizar" color="blue" @click="actualizarEstatus()" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <estatus-form ref="edit_1" :estatus="selectedEstatus" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import EstatusForm from "src/components/Estatus/EstatusForm.vue";

import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedEstatus = ref(null);

const searchTerm = ref("");
const showAdd = ref(false);
const estatuses = ref([]);

const onRowClick = (row) => {
  selectedEstatus.value = row;
  showDetails.value = true;
};

const crearEstatus = async () => {
  const form1_valid = await form_1.value.validate();
  if (!form1_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...form_1.value.formEstatus,
  };
  let res = await sendRequest("POST", final, "/api/estatus", "");
  showAdd.value = false;
  getEstatus();
};

const actualizarEstatus = async () => {
  const edit1_valid = await edit_1.value.validate();
  if (!edit1_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...edit_1.value.formEstatus,
  };
  let res = await sendRequest("PUT", final, "/api/estatus/" + final.id, "");
  showDetails.value = false;
  getEstatus();
};

const getEstatus = async () => {
  let res = await sendRequest("GET", null, "/api/estatus/all", "");
  estatuses.value = res;
};

const columns = [
  // { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "tipo_estatus",
    label: "Tipo de estatus",
    align: "left",
    field: "tipo_estatus",
    sortable: true,
  },
  {
    name: "color",
    label: "Color",
    align: "center",
    field: "color",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    align: "left",
    sortable: true,
  },
];

const filteredEstatus = computed(() => {
  return estatuses.value.filter((estatus) => {
    return estatus.nombre
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
  });
});

onMounted(() => {
  getEstatus();
});
</script>

<style>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
.d-flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}

.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}
</style>

