<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="isAdmin==true"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <q-img
            src="../assets/logo.png"
            spinner-color="white"
            style="max-width: 20%"
          />
          Departamento de RH
        </q-toolbar-title>

        <q-space />

        <div v-if="isEmpleado==true">{{ user.empleado.nombre }} {{ user.empleado.apellido_paterno }}</div>

        <q-btn
          label="Logout"
          class="q-ml-md"
          size="sm"
          color="red"
          @click="logout()"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <div v-if="isAdmin==true">
      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-item-label header> Opciones </q-item-label>
        <menu-list />
      </q-drawer>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

import MenuList from "./MenuList.vue";

const isAdmin = ref(false)
const isEmpleado = ref(false)
const leftDrawerOpen = ref(false);
const auth = useAuthStore();
const { logout } = auth;
const { user } = storeToRefs(auth);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const test = async () => {
  if (user.value.roles[0].name == 'Empleado') {
    isAdmin.value = false
    isEmpleado.value= true
  }
  if (user.value.roles[0].name == 'Admin') {
    isAdmin.value = true
    isEmpleado.value= false
  } 
};

onMounted(() => {
  test();
});

</script>
