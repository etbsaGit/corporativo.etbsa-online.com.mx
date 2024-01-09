<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="center-text">
          ETBSA Recursos Humanos: Sistema para carga de archivos
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ExpedienteLayout",

  setup() {
    return {};
  }
});
</script>

<style scoped>
.center-text {
  text-align: center;
}
</style>
