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
        <q-tab name="puestos" icon="work" label="Puestos" />
        <q-tab name="departamentos" icon="group_work" label="Departamentos" />
        <q-tab name="sucursales" icon="apartment" label="Sucursales" />
        <q-tab name="lineas" icon="engineering" label="Lineas" />
        <q-tab name="requisitos" icon="folder" label="Requisitos" />
        <q-tab name="skills" icon="grade" label="Skills" />
      </q-tabs>

      <q-separator />

      <div class="survey-form-container">
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="departamentos">
            <departamentos-index />
          </q-tab-panel>
          <q-tab-panel name="puestos">
            <puestos-index />
          </q-tab-panel>
          <q-tab-panel name="sucursales">
            <sucursal-index />
          </q-tab-panel>
          <q-tab-panel name="lineas">
            <lineas-index />
          </q-tab-panel>
          <q-tab-panel name="requisitos">
            <requisitos-index />
          </q-tab-panel>
          <q-tab-panel name="skills">
            <skills-index />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import departamentosIndex from "../departamentos/departamentosIndex.vue";
import puestosIndex from "../puestos/puestosIndex.vue";
import sucursalIndex from "../sucursales/sucursalIndex.vue";
import lineasIndex from "../lineas/lineasIndex.vue";
import requisitosIndex from "../requisitos/requisitosIndex.vue";
import skillsIndex from "../skills/skillsIndex.vue";

const tab = ref("puestos");
</script>
<style>
.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}
</style>
