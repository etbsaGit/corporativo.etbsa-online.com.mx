<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
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

        <div v-if="user.empleado">{{ user.empleado.nombre }} {{ user.empleado.apellido_paterno }}</div>

        <q-btn
          label="Logout"
          class="q-ml-md"
          size="sm"
          color="red"
          @click="logout()"
        ></q-btn>
      </q-toolbar>
    </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-item-label header> Perfil </q-item-label>
        <q-separator/>
        <div class="avatar-container">
          <div v-if="user.empleado">
            <q-item>
              <q-avatar square size="200px" v-if="user.empleado.picture">
                <img :src="user.empleado.picture">
              </q-avatar>
              <q-avatar size="200px" square v-else color="primary" text-color="white">
                {{ user.empleado.nombre.charAt(0).toUpperCase()
                }}{{ user.empleado.apellido_paterno.charAt(0).toUpperCase() }}
              </q-avatar>
            </q-item>
            <q-item>
              {{ user.empleado.nombre }} 
              {{ user.empleado.segundo_nombre }} 
              {{ user.empleado.apellido_paterno }} 
              {{ user.empleado.apellido_materno }} </q-item>
          </div>
          <div v-else>
            <q-avatar square size="200px" color="primary" text-color="white" icon="admin_panel_settings" />
          </div>
        </div>
        <q-separator/>
        <q-item-label header> Opciones </q-item-label>
        <menu-list />
      </q-drawer>

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

const leftDrawerOpen = ref(false);
const auth = useAuthStore();
const { logout } = auth;
const { user } = storeToRefs(auth);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

onMounted(() => {

});

</script>

<style>
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
