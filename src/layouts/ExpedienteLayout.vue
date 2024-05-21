<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-img
            src="../assets/logo.png"
            spinner-color="white"
            style="max-width: 10%"
          />
          Corporativo ETBSA
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
  },
});
</script>

<style scoped>
.center-text {
  text-align: center;
}
</style>
