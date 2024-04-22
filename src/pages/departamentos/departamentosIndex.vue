<template>
  <q-item>
    <q-btn
      dense
      label="Registrar departamento"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />
  </q-item>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
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
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Departamentos"
        :rows="filteredDepartamentos"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:top="props">
          <div class="col-2 q-table__title">Departamentos</div>
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
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Registrar Departamento</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Registrar" color="blue" @click="crearDepartamento()" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <departamento-form ref="form_1" />
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
        <div class="text-h6">Actualizar {{ selectedDepartamento.nombre }}</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Actualizar"
            color="blue"
            @click="actualizarDepartamento"
          />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <departamento-form
            ref="edit_1"
            :departamento="selectedDepartamento"
          />
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import DepartamentoForm from "src/components/Departamento/DepartamentoForm.vue";

import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedDepartamento = ref(null);

const searchTerm = ref("");
const showAdd = ref(false);
const departamentos = ref([]);

const onRowClick = (row) => {
  selectedDepartamento.value = row;
  showDetails.value = true;
};

const crearDepartamento = async () => {
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
    ...form_1.value.formDepartamento,
  };
  let res = await sendRequest("POST", final, "/api/departamento", "");

  showAdd.value = false;
  getDepartamentos();
};

const actualizarDepartamento = async () => {
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
    ...edit_1.value.formDepartamento,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/departamento/" + final.id,
    ""
  );

  showDetails.value = false;
  getDepartamentos();
};

const getDepartamentos = async () => {
  let res = await sendRequest("GET", null, "/api/departamento/all", "");
  departamentos.value = res;
};

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    align: "left",
    sortable: true,
  },
];

const filteredDepartamentos = computed(() => {
  return departamentos.value.filter((departamento) => {
    return departamento.nombre
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
  });
});

onMounted(() => {
  getDepartamentos();
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
</style>
