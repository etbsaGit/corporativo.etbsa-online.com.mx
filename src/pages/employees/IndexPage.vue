<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      dense
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title">Empleados</div>

        <q-btn
          label="Registrar Empleado"
          color="primary"
          @click="showAdd = true"
        />

        <q-dialog
          v-model="showAdd"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card style="width: 1200px">
            <q-card-section>
              <div class="text-h6">Registrar Empleado</div>
            </q-card-section>
            <q-separator />

            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="tab_form_one" label="Datos Personales" />
              <q-tab name="tab_form_two" label="Unidad Negocio" />
            </q-tabs>

            <q-separator />
            <q-card style="height: 65vh" class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab" animated keep-alive>
                <q-tab-panel name="tab_form_one">
                  <add-employeed-form></add-employeed-form>
                </q-tab-panel>

                <q-tab-panel name="tab_form_two">
                  <add-employeed-2-form></add-employeed-2-form>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>

            <q-separator />

            <q-card-actions align="right">
              <q-btn label="Cancelar" color="blue" v-close-popup />
              <q-btn
                flat
                label="Registrar"
                color="primary"
                @click="getUser()"
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
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props" @click="onRowClick(props.value)">
          <q-item class="q-my-none" dense>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white"> A </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ props.value }}</q-item-label>
              <q-item-label caption lines="1">
                {{ props.value }}@etbsa.com.mx
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from "vue";

import AddEmployeedForm from "src/components/AddEmployeedForm.vue";
import AddEmployeed2Form from "src/components/AddEmployeed2Form.vue";
import { sendRequest } from "src/boot/functions";

const columns = [
  {
    name: "name",
    required: true,
    label: "Empleado",
    align: "left",
    field: "name",
    // field: (row) => row.name,
    // format: (val) => `${val}`,
    sortable: true
  },
  {
    name: "brands",
    align: "center",
    label: "Sucursal",
    field: "brands",
    sortable: true
  },
  {
    name: "department",
    label: "Departamento",
    field: "department",
    sortable: true
  },
  { name: "job", label: "Puesto", field: "job" }
];

const rows = [
  {
    name: "Frozen Yogurt",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 4.0,
    sodium: 87,
    calcium: "14%",
    iron: "1%"
  },
  {
    name: "Ice cream sandwich",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 4.3,
    sodium: 129,
    calcium: "8%",
    iron: "1%"
  },
  {
    name: "Eclair",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 6.0,
    sodium: 337,
    calcium: "6%",
    iron: "7%"
  },
  {
    name: "Cupcake",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 4.3,
    sodium: 413,
    calcium: "3%",
    iron: "8%"
  },
  {
    name: "Gingerbread",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 3.9,
    sodium: 327,
    calcium: "7%",
    iron: "16%"
  },
  {
    name: "Jelly bean",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 0.0,
    sodium: 50,
    calcium: "0%",
    iron: "0%"
  },
  {
    name: "Lollipop",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 0,
    sodium: 38,
    calcium: "0%",
    iron: "2%"
  },
  {
    name: "Honeycomb",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 6.5,
    sodium: 562,
    calcium: "0%",
    iron: "45%"
  },
  {
    name: "Donut",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 4.9,
    sodium: 326,
    calcium: "2%",
    iron: "22%"
  },
  {
    name: "KitKat",
    brands: "Celaya",
    department: "Ventas",
    job: "Vendedor",
    protein: 7,
    sodium: 54,
    calcium: "12%",
    iron: "6%"
  }
];

export default {
  components: { AddEmployeedForm, AddEmployeed2Form },
  setup() {
    return {
      tab: ref("tab_form_one"),
      showAdd: ref(false),
      visibleColumns: ref(["name", "brands", "department", "job"]),
      onRowClick: (value) => alert(`${value} clicked`),
      columns,
      rows,
      getUser: async () => {
        let res = await sendRequest("GET", null, "/api/employees", "");
        console.log(res);
      }
    };
  }
};
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
