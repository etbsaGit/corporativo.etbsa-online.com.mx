<template>
    <div class="q-pa-md">
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

            <q-tab-panels v-model="tab" animated keep-alive>
                <q-tab-panel name="users">
                    <user-index></user-index>
                </q-tab-panel>
                <q-tab-panel name="roles">
                    <roles-index></roles-index>
                </q-tab-panel>
                <q-tab-panel name="permissions">
                    <permissions-index></permissions-index>
                </q-tab-panel>
            </q-tab-panels>
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
