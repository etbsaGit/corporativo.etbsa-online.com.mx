<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="users" icon="manage_accounts" label="users" />
    <q-tab name="roles" icon="shield" label="Roles" />
    <q-tab name="permissions" icon="key" label="Permisos" />
    <q-tab name="estatus" icon="settings_applications" label="Estatus" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated keep-alive>
    <q-tab-panel name="users" class="q-pa-none">
      <user-index />
    </q-tab-panel>
    <q-tab-panel name="roles" class="q-pa-none">
      <roles-index />
    </q-tab-panel>
    <q-tab-panel name="permissions" class="q-pa-none">
      <permissions-index />
    </q-tab-panel>
    <q-tab-panel name="estatus" class="q-pa-none">
      <estatus-index />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import userIndex from "./userIndex.vue";
import rolesIndex from "../roles/rolesIndex.vue";
import permissionsIndex from "../permissions/permissionsIndex.vue";
import estatusIndex from "../estatus/estatusIndex.vue";

const tab = ref("users");
</script>


