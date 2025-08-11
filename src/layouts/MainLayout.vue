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
          Corporativo ETBSA
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

    <q-drawer v-model="leftDrawerOpen" bordered :width="250" :breakpoint="250">
      <q-item v-if="user.empleado" class="avatar-container">
        <q-item-section avatar>
          <q-avatar size="150px" v-if="user.empleado.picture">
            <img :src="user.empleado.picture" />
          </q-avatar>
          <q-avatar size="150px" v-else color="primary" text-color="white">
            {{ user.empleado.nombre.charAt(0).toUpperCase()
            }}{{ user.empleado.apellido_paterno.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>
      </q-item>
      <q-item v-else class="avatar-container">
        <q-item-section avatar>
          <q-avatar
            size="150px"
            color="primary"
            text-color="white"
            icon="admin_panel_settings"
          />
        </q-item-section>
      </q-item>
      <q-expansion-item
        v-if="checkRole('Empleado')"
        expand-separator
        icon="perm_identity"
        :label="
          user && user.empleado ? user.empleado.nombreCompleto : user.name
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
    <q-page-sticky
      position="bottom-left"
      :offset="[20, 20]"
      v-if="!user.email_verified_at"
    >
      <q-btn
        label="Enviar verificación"
        class="btn-verificar"
        @click="enviarCorreoVerificacion"
      />
    </q-page-sticky>
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
        <change-password-form ref="password" />
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { checkRoleEmpleado, sendRequest } from "src/boot/functions";
import { checkRole } from "src/boot/functions";

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
  showChangePassword.value == false;
  logout();
};

const enviarCorreoVerificacion = async () => {
  try {
    const response = await sendRequest(
      "POST",
      {},
      "/api/enviar-correo-verificacion",
      ""
    );

    $q.notify({
      type: "positive",
      message: response.message || "Correo de verificación enviado",
      icon: "email",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error.message || "Error al enviar correo",
      icon: "error",
    });
  }
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

.btn-verificar {
  background: linear-gradient(135deg, #a020f0, #ff4dd2);
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(160, 32, 240, 0.5);
  transition: all 0.3s ease;
}

.btn-verificar:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(160, 32, 240, 0.7);
}

.btn-verificar:active {
  transform: scale(0.96);
}
</style>
