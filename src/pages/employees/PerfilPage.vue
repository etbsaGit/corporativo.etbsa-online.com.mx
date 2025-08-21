<template>
  <div v-if="user.empleado">
    <q-item-section>
      <q-tabs
        v-model="tab"
        dense
        active-color="grey"
        indicator-color="primary"
        align="justify"
        stretch
      >
        <q-tab name="skill" label="Skill" />
        <q-tab name="personal" label="Datos personales" />
        <q-tab name="negocios" label="Unidad de negocios" />
        <q-tab name="expediente" label="Expediente" />
        <q-tab
          name="servicio"
          label="Servicio a unidades"
          v-if="user.empleado.vehicle"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="skill" class="q-pa-none">
          <cv-employee :employee="user.empleado" />
        </q-tab-panel>

        <q-tab-panel name="personal" class="q-pa-none">
          <personal :empleado="user.empleado" />
        </q-tab-panel>

        <q-tab-panel name="negocios" class="q-pa-none">
          <negocios :empleado="user.empleado" />
        </q-tab-panel>

        <q-tab-panel name="expediente" class="q-pa-none">
          <expediente :empleado="user.empleado" />
        </q-tab-panel>

        <q-tab-panel name="servicio" class="q-pa-none">
          <service-index></service-index>
        </q-tab-panel>
      </q-tab-panels>
    </q-item-section>
  </div>

  <q-item v-else class="empty-state">
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
import CvEmployee from "src/components/Employeed/CvEmployee.vue";
import ServiceIndex from "src/pages/Service/ServiceIndex.vue";

const tab = ref("skill");

const auth = useAuthStore();
const { user } = storeToRefs(auth);
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 92vh; /* Ocupa toda la altura de la pantalla */
  padding: 2rem; /* Espaciado uniforme alrededor */
  border: 1px solid #ffffff;
  border-radius: 8px;
  background-color: #ffffff;
  text-align: center;
  box-sizing: border-box; /* Asegura que el padding no rompa el layout */
}

.empty-state h1 {
  font-size: 1.5rem;
  color: #555;
  margin: 0;
}
</style>
