<template>
  <q-layout view="hHh LpR fFf">
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

        <div v-if="user.empleado">
          {{ user.empleado.nombreCompleto }}
        </div>

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
      <div class="avatar-container">
        <div v-if="user.empleado">
          <q-item>
            <q-avatar size="200px" v-if="user.empleado.picture">
              <img :src="user.empleado.picture" />
            </q-avatar>
            <q-avatar size="200px" v-else color="primary" text-color="white">
              {{ user.empleado.nombre.charAt(0).toUpperCase()
              }}{{ user.empleado.apellido_paterno.charAt(0).toUpperCase() }}
            </q-avatar>
          </q-item>
        </div>
        <div v-else>
          <q-avatar
            size="200px"
            color="primary"
            text-color="white"
            icon="admin_panel_settings"
          />
        </div>
      </div>
      <q-expansion-item
        expand-separator
        icon="perm_identity"
        :label="
          user && user.empleado && user.empleado.nombreCompleto
            ? user.empleado.nombreCompleto
            : user.name
        "
        caption="Opciones de usuario"
      >
        <q-card>
          <q-card-section>
            <q-item-label caption>
              <strong>user:</strong>
              {{ user.name }}
            </q-item-label>
            <q-item-label caption>
              <strong>email:</strong>
              {{ user.email }}
            </q-item-label>
            <q-item-section>
              <q-btn
                label="Cambiar password"
                size="xs"
                color="orange"
                @click="openPassword"
              />
            </q-item-section>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <menu-list />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <q-dialog
    v-model="showChangePassword"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Cambiar contraseña de {{ user.name }}</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Actualizar" color="blue" @click="changePassword" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <change-password-form ref="password" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { sendRequest } from "src/boot/functions";

const $q = useQuasar();

import MenuList from "./MenuList.vue";
import ChangePasswordForm from "src/components/User/ChangePasswordForm.vue";

const leftDrawerOpen = ref(false);
const auth = useAuthStore();
const { logout } = auth;
const { user } = storeToRefs(auth);

const showChangePassword = ref(false);
const authUser = ref(null);
const password = ref(null);

const openPassword = () => {
  authUser.value = user;
  showChangePassword.value = true;
};

const changePassword = async () => {
  const password_valid = await password.value.validate();
  if (!password_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...password.value.formUser,
  };
  let res = await sendRequest("POST", final, "/api/auth/change", "");
  console.log(res);
  showChangePassword.value == false;
  logout();
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

onMounted(() => {});
</script>

<style>
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
