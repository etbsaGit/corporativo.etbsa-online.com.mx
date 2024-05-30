<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-amber">
      <q-toolbar>
        <q-toolbar-title align="center" class="text-black">
          <q-img
            src="../assets/logo.png"
            spinner-color="white"
            style="max-width: 5%"
          />
          Construccion
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

