<template>
  <div class="q-pa-md">
    <q-btn
      label="Registrar linea"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />

    <div><br /></div>

    <q-input
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

    <br />

    <q-table
      flat
      bordered
      title="Lineas"
      :rows="filteredLineas"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      dense
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title">Lineas</div>

        <q-dialog
          v-model="showAdd"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card style="max-width: 400px">
            <q-card-section>
              <div class="text-h6">Registrar Linea</div>
            </q-card-section>
            <q-separator />

            <q-separator />
            <q-card style="max-height: 400px" class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab" animated keep-alive>
                <q-tab-panel name="tab_form_one">
                  <add-linea-form ref="form_1"></add-linea-form>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>

            <q-separator />

            <q-card-actions align="right">
              <q-btn label="Cancelar" color="red" v-close-popup />
              <q-btn flat label="Registrar" color="blue" @click="crearLinea" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          style="min-width: 150px"
          option-value="name"
        />

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>

      <template v-slot:body-cell-nombre="props">
        <q-td @click="onRowClick(props.row)">
          <q-item class="q-my-none" dense>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">{{
                props.row.nombre.charAt(0).toUpperCase()
              }}</q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ props.row.nombre }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
    </q-table>

    <q-dialog
      v-model="showDetails"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="max-width: 400px">
        <q-card-section>
          <div class="text-h6">Actualizar linea</div>
        </q-card-section>
        <q-separator />

        <q-separator />
        <q-card style="max-height: 400px" class="q-pa-none scroll" flat>
          <q-tab-panels v-model="tab" animated keep-alive>
            <q-tab-panel name="tab_form_one">
              <edit-linea-form
                ref="edit_1"
                :linea="selectedLinea"
              ></edit-linea-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn
            flat
            label="Actualizar"
            color="blue"
            @click="actualizarLinea()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AddLineaForm from "src/components/Linea/AddLineaForm.vue";
import EditLineaForm from "src/components/Linea/EditLineaForm.vue";

import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedLinea = ref(null);

const visibleColumns = ref(["id", "nombre"]);

const tab = ref("tab_form_one");
const searchTerm = ref("");
const showAdd = ref(false);
const lineas = ref([]);

const onRowClick = (row) => {
  selectedLinea.value = row;
  showDetails.value = true;
};

const crearLinea = async () => {
  if (!form_1.value.formLinea.nombre) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  const final = {
    ...form_1.value.formLinea
  };
  console.log(final);
  try {
    let res = await sendRequest("POST", final, "/api/linea", "");
    console.log(res);

    // Si la solicitud es exitosa, recarga la página
    showAdd.value = false;
    getLineas();
  } catch (error) {
    // Maneja el error aquí si es necesario
    console.error("Error al enviar la solicitud:", error);
  }
};

const actualizarLinea = async () => {
  const final = {
    ...edit_1.value.formLinea
  };
  console.log(final);
  try {
    let res = await sendRequest("PUT", final, "/api/linea/" + final.id, "");
    console.log(res);

    // Si la solicitud es exitosa, recarga la página
    showDetails.value = false;
    getLineas();
  } catch (error) {
    // Maneja el error aquí si es necesario
    console.error("Error al enviar la solicitud:", error);
  }
};

const getLineas = async () => {
  let res = await sendRequest("GET", null, "/api/linea/all", "");
  lineas.value = res;
};

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true
  }
];

const filteredLineas = computed(() => {
  return lineas.value.filter((linea) => {
    return linea.nombre.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});

onMounted(() => {
  getLineas();
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
</style>
