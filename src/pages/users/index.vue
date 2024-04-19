<template>
  <div class="q-pa-sm">
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
        <q-tab name="users" icon="manage_accounts" label="users" />
        <q-tab name="roles" icon="shield" label="Roles" />
        <q-tab name="permissions" icon="key" label="Permisos" />
      </q-tabs>

      <q-separator />

      <div class="survey-form-container">
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="users">
            <user-index />
          </q-tab-panel>
          <q-tab-panel name="roles">
            <roles-index />
          </q-tab-panel>
          <q-tab-panel name="permissions">
            <permissions-index />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import userIndex from "./userIndex.vue";
import rolesIndex from "../roles/rolesIndex.vue";
import permissionsIndex from "../permissions/permissionsIndex.vue";

const tab = ref("users");
</script>
<style>
.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}
</style>

