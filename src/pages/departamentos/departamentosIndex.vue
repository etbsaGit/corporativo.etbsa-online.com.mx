<template>
  <div class="q-pa-md">
    <q-btn
      label="Registrar departamento"
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
      title="Departamentos"
      :rows="filteredDepartamentos"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      dense
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title">Departamentos</div>

        <q-dialog
          v-model="showAdd"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card style="width: 2000px">
            <q-card-section>
              <div class="text-h6">Registrar Departamento</div>
            </q-card-section>
            <q-separator />

            <q-separator />
            <q-card style="max-height: 1000px" class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab" animated keep-alive>
                <q-tab-panel name="tab_form_one">
                  <add-departamento-form ref="form_1"></add-departamento-form>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>

            <q-separator />

            <q-card-actions align="right">
              <q-btn label="Cancelar" color="red" v-close-popup />
              <q-btn
                label="Registrar"
                color="blue"
                @click="crearDepartamento()"
              />
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
      <q-card style="width: 2000px">
        <q-card-section>
          <div class="text-h6">Actualizar departamento</div>
        </q-card-section>
        <q-separator />

        <q-separator />
        <q-card style="max-height: 1000px" class="q-pa-none scroll" flat>
          <q-tab-panels v-model="tab" animated keep-alive>
            <q-tab-panel name="tab_form_one">
              <edit-departamento-form
                ref="edit_1"
                :departamento="selectedDepartamento"
              ></edit-departamento-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn
            label="Actualizar"
            color="blue"
            @click="actualizarDepartamento"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AddDepartamentoForm from "src/components/Departamento/AddDepartamentoForm.vue";
import EditDepartamentoForm from "src/components/Departamento/EditDepartamentoForm.vue";

import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const form_1 = ref(null);
const edit_1 = ref(null);

const $q = useQuasar();

const showDetails = ref(false);
const selectedDepartamento = ref(null);

const visibleColumns = ref(["id", "nombre"]);

const tab = ref("tab_form_one");
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
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  const final = {
    ...form_1.value.formDepartamento
  };
  try {
    let res = await sendRequest("POST", final, "/api/departamento", "");

    showAdd.value = false;
    getDepartamentos();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const actualizarDepartamento = async () => {
  const edit1_valid = await edit_1.value.validate();
  if (!edit1_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  const final = {
    ...edit_1.value.formDepartamento
  };
  try {
    let res = await sendRequest(
      "PUT",
      final,
      "/api/departamento/" + final.id,
      ""
    );

    showDetails.value = false;
    getDepartamentos();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
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
    sortable: true
  }
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
</style>
