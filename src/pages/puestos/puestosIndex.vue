<template>
  <q-item>
    <q-btn
      label="Registrar puesto"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />
  </q-item>
  <q-item>
    <q-btn
      color="primary"
      icon-right="archive"
      label="Export to csv"
      no-caps
      @click="exportTable"
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
  <q-table
    flat
    bordered
    title="Puestos"
    :rows="filteredPuestos"
    :columns="columns"
    row-key="name"
    dense
    :rows-per-page-options="[0]"
  >
    <template v-slot:top="props">
      <div class="col-2 q-table__title">Puestos</div>
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
        <div class="text-h6">Registrar Puesto</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Registrar" color="blue" @click="crearPuesto" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <puesto-form ref="form_1" />
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
        <div class="text-h6">Actualizar Puesto {{ selectedPuesto.nombre }}</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Actualizar" color="blue" @click="actualizarPuesto()" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <puesto-form ref="edit_1" :puesto="selectedPuesto" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import PuestoForm from "src/components/Puesto/PuestoForm.vue";

import { sendRequest } from "src/boot/functions";
import { useQuasar, exportFile } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedPuesto = ref(null);

const searchTerm = ref("");
const showAdd = ref(false);
const puestos = ref([]);

const onRowClick = (row) => {
  selectedPuesto.value = row;
  showDetails.value = true;
};

const crearPuesto = async () => {
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
    ...form_1.value.formPuesto,
  };
  let res = await sendRequest("POST", final, "/api/puesto", "");
  showAdd.value = false;
  getPuestos();
};

const actualizarPuesto = async () => {
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
    ...edit_1.value.formPuesto,
  };
  let res = await sendRequest("PUT", final, "/api/puesto/" + final.id, "");
  showDetails.value = false;
  getPuestos();
};

const getPuestos = async () => {
  let res = await sendRequest("GET", null, "/api/puesto/all", "");
  puestos.value = res;
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

const filteredPuestos = computed(() => {
  return puestos.value.filter((puesto) => {
    return puesto.nombre.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});

const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== undefined ? formatFn(val, row) : val;

  formatted =
    formatted === undefined || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  if (typeof val === "object" && val !== null) {
    // Si val es un objeto, intentamos acceder a una propiedad específica
    const propertyName = "nombre"; // Cambia 'nombre' por la propiedad que deseas mostrar
    formatted = val[propertyName] || ""; // Utilizamos 'nombre' como ejemplo
  }
  return `"${formatted}"`;
};

const exportTable = () => {
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      filteredPuestos.value.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === undefined ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const status = exportFile("puestos-export.csv", content, "text/csv");

  if (status !== true) {
    $q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
};
onMounted(() => {
  getPuestos();
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

