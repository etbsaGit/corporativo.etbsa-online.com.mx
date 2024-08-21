<template>
  <div class="grid-container q-pa-sm" v-if="technicians == null">
    <q-btn
      v-for="(sucursal, index) in sucursales"
      :key="index"
      dense
      :label="sucursal.nombre"
      class="fixed-height-btn text-caption"
      @click="clickSucursal(sucursal.id)"
    />
  </div>

  <q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="Tecnicos" label="Tecnicos" />
      <q-tab name="Imagen1" />
      <q-tab name="Bahia1" label="Bahia" />
      <q-tab name="Imagen2" />
      <q-tab name="Bahia2" label="Bahia" />
      <q-tab name="Imagen3" />
      <q-tab name="Estadistico" label="Estadistico" />
      <q-tab name="Calendario" label="Calendario" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Tecnicos">
        <div class="grid-container">
          <technician-card :technicians="technicians" />
        </div>
      </q-tab-panel>

      <q-tab-panel name="Bahia1">
        <div class="grid-container-bay">
          <bay-card :bays="firstHalfBays" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Bahia2">
        <div class="grid-container-bay">
          <bay-card :bays="secondHalfBays" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Imagen1" class="q-pa-none">
        <div class="fullscreen-img-container" v-if="extractPostDoc(posts)[0]">
          <img
            :src="extractPostDoc(posts)[0].realpath"
            alt="Descripción de la imagen"
            class="fullscreen-img"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Imagen2" class="q-pa-none">
        <div class="fullscreen-img-container" v-if="extractPostDoc(posts)[0]">
          <img
            :src="extractPostDoc(posts)[0].realpath"
            alt="Descripción de la imagen"
            class="fullscreen-img"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Imagen3" class="q-pa-none">
        <div class="fullscreen-img-container" v-if="extractPostDoc(posts)[0]">
          <img
            :src="extractPostDoc(posts)[0].realpath"
            alt="Descripción de la imagen"
            class="fullscreen-img"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Estadistico" class="q-pa-none">
        <div>
          <charts :data="chartsData" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Calendario" class="q-pa-none">
        <div>
          <calendar-logs :data="technicianLogs" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>


<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";

import BayCard from "src/components/Pantalla/BayCard.vue";
import TechnicianCard from "src/components/Pantalla/TechnicianCard.vue";
import Charts from "src/components/Pantalla/Charts.vue";
import CalendarLogs from "src/components/Pantalla/CalendarLogs.vue";

const technicians = ref(null);
const bays = ref(null);
const sucursales = ref(null);
const chartsData = ref(null);
const technicianLogs = ref(null);
const tab = ref("Tecnicos");
const posts = ref(null);

const switchTab = () => {
  const options = [
    "Tecnicos",
    "Imagen1",
    "Bahia1",
    "Imagen2",
    "Bahia2",
    "Imagen3",
    "Estadistico",
    "Calendario",
  ];
  let currentIndex = 0;

  return () => {
    tab.value = options[currentIndex];
    currentIndex = (currentIndex + 1) % options.length;
  };
};

let intervalId;

const getSucursales = async () => {
  let res = await sendRequest("GET", null, "/api/sucursal/all", "");
  sucursales.value = res;
};

const clickSucursal = async (id) => {
  let resp = await sendRequest(
    "GET",
    null,
    "/api/pantalla/construccion/" + id,
    ""
  );
  technicians.value = resp.tecnicos;
  posts.value = resp.post;
  bays.value = resp.bays;
  chartsData.value = resp.charts;
  technicianLogs.value = resp.technicianLogs;
};

onMounted(() => {
  getSucursales();
  const switchBetweenTabs = switchTab();
  intervalId = setInterval(switchBetweenTabs, 30000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const firstHalfBays = computed(() => {
  const halfIndex = Math.ceil(bays.value.length / 2);
  return bays.value.slice(0, halfIndex);
});

const secondHalfBays = computed(() => {
  const halfIndex = Math.ceil(bays.value.length / 2);
  return bays.value.slice(halfIndex);
});

const extractPostDoc = (posts) => {
  let postDocs = [];
  // Extraer todas las imágenes de los posts
  for (const post of posts) {
    if (post.hasOwnProperty("post_doc")) {
      for (const doc of post.post_doc) {
        postDocs.push(doc);
      }
    }
  }
  // Mezclar aleatoriamente las imágenes
  for (let i = postDocs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [postDocs[i], postDocs[j]] = [postDocs[j], postDocs[i]];
  }
  return postDocs;
};
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(200px, 1fr)
  ); /* Ajusta el tamaño mínimo aquí 200px para que sean 6 y 300px para 4 px*/
  gap: 10px;
}

.grid-container-bay {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(500px, 1fr)
  ); /* Ajusta el tamaño mínimo aquí 200px para que sean 6 y 300px para 4 px*/
  gap: 5px;
}

.fullscreen-img-container {
  position: relative;
  width: 100%;
  height: 90vh; /* Altura igual al viewport height */
  overflow: hidden; /* Oculta cualquier parte de la imagen que se extienda más allá del contenedor */
}

.fullscreen-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  max-height: 100%; /* Altura máxima igual al viewport height */
  object-fit: contain; /* Ajusta la imagen dentro del contenedor manteniendo su relación de aspecto */
}
</style>
