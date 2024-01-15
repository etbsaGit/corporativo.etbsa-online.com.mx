<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 585px">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-table
            flat
            bordered
            grid
            :rows="requisitos"
            :columns="columns"
            row-key="name"
            :filter="filter"
            :rows-per-page-options="[0]"
          >
            <template v-slot:top-right>
              <q-input
                bordered
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:top-left>
              <div class="text-h6 q-mb-md">Requisitos</div>
            </template>

            <template v-slot:item="props">
              <q-card
                @click.stop="onRowClick(props.row)"
                :style="{
                  backgroundColor: '#f2f2f2',
                  width: '200px',
                  height: '100px',
                  margin: '5px'
                }"
              >
                <q-card-section>
                  <q-item v-for="col in props.cols" :key="col.name">
                    <q-item-section side>
                      <q-item-label caption>{{
                        props.row[col.name]
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </template>
          </q-table>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">Documentos</div>
          <edit-employeedfour-form
            v-if="selectedRequisito"
            ref="edit_4"
            :requisito="selectedRequisito"
          />
          <div v-else>Selecciona un requisito para ver los detalles.</div>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import EditEmployeedfourForm from "./EditEmployeedfourForm.vue";

const { empleado } = defineProps(["empleado"]);

const expedientes = ref([]);
const requisitos = ref([]);
const selectedRequisito = ref(null);
const splitterModel = ref(50);
const filter = ref("");
const edit_4 = ref(null);

const columns = [
  {
    name: "nombre",
    align: "left",
    field: "nombre",
    sortable: true
  }
];

const mapear = () => {
  expedientes.value = empleado.archivable;
  requisitos.value = empleado.archivable[0].requisito;
};

const onRowClick = (row) => {
  selectedRequisito.value = row;
  //console.log(selectedRequisito.value.nombre);
};

onMounted(() => {
  mapear();
  //console.log(empleado.archivable);
});
</script>
