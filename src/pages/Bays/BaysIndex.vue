<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab
      v-for="(sucursal, index) in filteredData"
      :key="index"
      :name="sucursal.id"
      :label="sucursal.nombre"
    />
  </q-tabs>
  <q-separator />

  <!-- Vista Grid -->
  <q-tab-panels v-model="tab" animated v-if="grid">
    <q-tab-panel
      v-for="(sucursal, index) in filteredData"
      :key="index"
      :name="sucursal.id"
    >
      <div class="grid-container">
        <bay-grid
          v-for="(bay, index) in getBaysForSucursal(sucursal.id).linea1"
          :key="index"
          :bay="bay"
        />
      </div>
      <q-item dense>
        <q-item-section align="center">
          <q-item-label caption> -En espera- </q-item-label>
        </q-item-section>
      </q-item>
      <div class="grid-container">
        <bay-grid
          v-for="(bay, index) in getBaysForSucursal(sucursal.id).esperaLinea1"
          :key="index"
          :bay="bay"
        />
      </div>

      <q-separator spaced />

      <div class="grid-container">
        <bay-grid
          v-for="(bay, index) in getBaysForSucursal(sucursal.id).linea2"
          :key="index"
          :bay="bay"
        />
      </div>
      <q-item dense>
        <q-item-section align="center">
          <q-item-label caption> -En espera- </q-item-label>
        </q-item-section>
      </q-item>
      <div class="grid-container">
        <bay-grid
          v-for="(bay, index) in getBaysForSucursal(sucursal.id).esperaLinea2"
          :key="index"
          :bay="bay"
        />
      </div>
    </q-tab-panel>
  </q-tab-panels>

  <!-- Vista List -->
  <q-tab-panels v-model="tab" animated v-if="list">
    <q-tab-panel
      v-for="(sucursal, index) in filteredData"
      :key="index"
      :name="sucursal.id"
    >
      <div class="list-container">
        <bay-list
          v-for="(bay, index) in getBaysForSucursal(sucursal.id).linea1"
          :key="index"
          :bay="bay"
        />
      </div>

      <q-item dense>
        <q-item-section align="center">
          <q-item-label caption> -En espera- </q-item-label>
        </q-item-section>
      </q-item>

      <div class="list-container">
        <bay-list
          v-for="(bay, index) in getBaysForSucursal(sucursal.id).esperaLinea1"
          :key="index"
          :bay="bay"
        />
      </div>

      <q-separator spaced />

      <div class="list-container">
        <bay-list
          v-for="(bay, index) in getBaysForSucursal(sucursal.id).linea2"
          :key="index"
          :bay="bay"
        />
      </div>

      <q-item dense>
        <q-item-section align="center">
          <q-item-label caption> -En espera- </q-item-label>
        </q-item-section>
      </q-item>

      <div class="list-container">
        <bay-list
          v-for="(bay, index) in getBaysForSucursal(sucursal.id).esperaLinea2"
          :key="index"
          :bay="bay"
        />
      </div>
    </q-tab-panel>
  </q-tab-panels>

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="grid_on" color="blue" @click="toggleView" v-if="list" />
    <q-btn fab icon="table_rows" color="blue" @click="toggleView" v-if="grid" />
  </q-page-sticky>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { checkSucursal, sendRequest } from "src/boot/functions";

import BayGrid from "src/components/Bays/BayGrid.vue";
import BayList from "src/components/Bays/BayList.vue";

const data = ref([]);
const tab = ref(1);
const grid = ref(true);
const list = ref(false);

// Obtener datos
const getData = async () => {
  let res = await sendRequest("GET", null, "/api/bays/sucursal", "");
  data.value = res;
};

// Propiedad computada para filtrar las sucursales
const filteredData = computed(() =>
  data.value.filter((sucursal) => checkSucursal(sucursal.nombre))
);

// Obtener las bahías por sucursal y línea
const getBaysForSucursal = (sucursalId) => {
  const sucursal = data.value.find((sucursal) => sucursal.id === sucursalId);
  if (!sucursal)
    return { linea1: [], linea2: [], esperaLinea1: [], esperaLinea2: [] };

  return {
    linea1: sucursal.bay.filter(
      (bay) =>
        bay.linea_id === 1 && !bay.nombre.toLowerCase().includes("espera")
    ),
    linea2: sucursal.bay.filter(
      (bay) =>
        bay.linea_id === 2 && !bay.nombre.toLowerCase().includes("espera")
    ),
    esperaLinea1: sucursal.bay.filter(
      (bay) => bay.linea_id === 1 && bay.nombre.toLowerCase().includes("espera")
    ),
    esperaLinea2: sucursal.bay.filter(
      (bay) => bay.linea_id === 2 && bay.nombre.toLowerCase().includes("espera")
    ),
  };
};

// Método para alternar entre vistas grid y list
const toggleView = () => {
  grid.value = !grid.value;
  list.value = !list.value;
};

onMounted(() => {
  getData();
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, auto));
  gap: 20px;
  padding: 10px;
  justify-content: center;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}
</style>
