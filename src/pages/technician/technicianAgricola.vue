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
      <q-tab name="Tecnicos1" label="Tecnicos" />
      <q-tab name="Imagen1" />
      <q-tab name="Tecnicos2" label="Tecnicos" />
      <q-tab name="Imagen2" />
      <q-tab name="Bahia1" label="Bahia" />
      <q-tab name="Imagen3" />
      <q-tab name="Bahia2" label="Bahia" />
      <q-tab name="Estadistico" />
      <q-tab name="Bahia3" label="Bahia" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Tecnicos1">
        <div class="grid-container">
          <technician-card :technicians="firstHalfTec" />
        </div>
      </q-tab-panel>

      <q-tab-panel name="Tecnicos2">
        <div class="grid-container">
          <technician-card :technicians="secondHalfTec" />
        </div>
      </q-tab-panel>

      <q-tab-panel name="Bahia1">
        <div class="grid-container-bay">
          <bay-card :bays="firstThirdBays" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Bahia2">
        <div class="grid-container-bay">
          <bay-card :bays="secondThirdBays" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Bahia3">
        <div class="grid-container-bay">
          <bay-card :bays="thirdThirdBays" />
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
    </q-tab-panels>
  </q-card>
</template>


<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";

import BayCard from "src/components/Pantalla/BayCard.vue";
import TechnicianCard from "src/components/Pantalla/TechnicianCard.vue";
import Charts from "src/components/Pantalla/Charts.vue";

const technicians = ref(null);
const bays = ref(null);
const sucursales = ref(null);
const chartsData = ref(null);
const tab = ref("Tecnicos1");
const posts = ref(null);

const switchTab = () => {
  const options = [
    "Tecnicos1",
    "Tecnicos2",
    "Imagen1",
    "Bahia1",
    "Imagen2",
    "Bahia2",
    "Imagen3",
    "Estadistico",
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
  let resp = await sendRequest("GET", null, "/api/pantalla/agricola/" + id, "");
  technicians.value = resp.tecnicos;
  posts.value = resp.post;
  bays.value = resp.bays;
  chartsData.value = resp.charts;
};

onMounted(() => {
  getSucursales();
  const switchBetweenTabs = switchTab();
  intervalId = setInterval(switchBetweenTabs, 60000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const firstThirdBays = computed(() => {
  const thirdIndex = Math.ceil(bays.value.length / 3);
  return bays.value.slice(0, thirdIndex);
});

const secondThirdBays = computed(() => {
  const thirdIndex = Math.ceil(bays.value.length / 3);
  const twoThirdsIndex = 2 * thirdIndex;
  return bays.value.slice(thirdIndex, twoThirdsIndex);
});

const thirdThirdBays = computed(() => {
  const thirdIndex = Math.ceil(bays.value.length / 3);
  const twoThirdsIndex = 2 * thirdIndex;
  return bays.value.slice(twoThirdsIndex);
});

const firstHalfTec = computed(() => {
  if (technicians.value) {
    const halfIndex = Math.ceil(technicians.value.length / 2);
    return technicians.value.slice(0, halfIndex);
  } else {
    return [];
  }
});

const secondHalfTec = computed(() => {
  if (technicians.value) {
    const halfIndex = Math.ceil(technicians.value.length / 2);
    return technicians.value.slice(halfIndex);
  } else {
    return [];
  }
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
    minmax(400px, 1fr)
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
