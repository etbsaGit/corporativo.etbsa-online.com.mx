<template>
  <q-page>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Explorador de Archivos Intranet ETBSA</q-toolbar-title>
    </q-toolbar>

    <div class="grid-container q-pa-md">
      <!-- Agregar la carpeta "Generales" -->
      <div class="grid-item">
        <q-card bordered class="q-pa-md folder-card" @click="clickFolder(null)">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="folder" color="yellow" size="48px" class="q-mr-md" />
            <div>Generales</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Renderizar departamentos -->
      <div
        v-for="departamento in departamentos"
        :key="departamento.id"
        class="grid-item"
      >
        <q-card
          bordered
          class="q-pa-md folder-card"
          @click="clickFolder(departamento)"
        >
          <q-card-section class="row items-center no-wrap">
            <q-icon name="folder" color="yellow" size="48px" class="q-mr-md" />
            <div>{{ departamento.nombre }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-dialog
    v-model="showDocs"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card style="width: 100%">
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6">{{
            selectedDepartamento ? selectedDepartamento.nombre : "Generales"
          }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Cerrar"
            color="red"
            v-close-popup
            @click="selectedDepartamento = null"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <post-list :departamento="selectedDepartamento" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

import PostList from "src/components/Post/PostList.vue";

const departamentos = ref([]);
const selectedDepartamento = ref(null);
const showDocs = ref(false);

const clickFolder = (departamento) => {
  selectedDepartamento.value = departamento;
  showDocs.value = true;
};

const getDepartamentos = async () => {
  let res = await sendRequest("GET", null, "/api/departamento/all", "");
  departamentos.value = res;
};

onMounted(() => {
  getDepartamentos();
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, 1fr)
  ); /* Ajusta aquí el tamaño mínimo */
  gap: 20px;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: x-large;
}

.folder-card {
  width: 100%; /* Asegura que ocupe todo el ancho de la celda */
  height: 150px; /* Fija la altura para que todas sean iguales */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Transición suave */
}

.folder-card:hover {
  transform: scale(1.05); /* Aumenta el tamaño al pasar el mouse */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); /* Sombra para darle profundidad */
}
</style>
