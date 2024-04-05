<template>
  <q-item v-if="user.empleado">
    <q-item-section>
      <q-tabs
        v-model="tab"
        dense
        active-color="grey"
        indicator-color="primary"
        align="justify"
        stretch
      >
        <q-tab name="personal" label="Datos personales" />
        <q-tab name="negocios" label="Unidad de negocios" />
        <q-tab name="expediente" label="Expediente" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="personal">
          <personal :empleado="user.empleado" />
        </q-tab-panel>

        <q-tab-panel name="negocios">
          <negocios :empleado="user.empleado" />
        </q-tab-panel>

        <q-tab-panel name="expediente">
          <expediente :empleado="user.empleado" />
        </q-tab-panel>
      </q-tab-panels>
    </q-item-section>
  </q-item>

  <q-item v-else class="text-center">
    <h1>Usted no tiene un empleado ligado</h1>
  </q-item>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth";
import { ref } from "vue";

import Personal from "src/components/Perfil/Personal.vue";
import Negocios from "src/components/Perfil/Negocios.vue";
import Expediente from "src/components/Perfil/Expediente.vue";

const tab = ref("personal");

const auth = useAuthStore();
const { user } = storeToRefs(auth);
</script>
