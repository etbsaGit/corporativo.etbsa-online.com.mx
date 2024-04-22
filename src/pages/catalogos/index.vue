<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="puestos" icon="work" label="Puestos" />
    <q-tab name="departamentos" icon="group_work" label="Departamentos" />
    <q-tab name="sucursales" icon="apartment" label="Sucursales" />
    <q-tab name="lineas" icon="engineering" label="Lineas" />
    <q-tab name="requisitos" icon="folder" label="Requisitos" />
    <q-tab name="skills" icon="grade" label="Skills" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated keep-alive>
    <q-tab-panel name="departamentos" class="q-pa-none">
      <departamentos-index />
    </q-tab-panel>
    <q-tab-panel name="puestos" class="q-pa-none">
      <puestos-index />
    </q-tab-panel>
    <q-tab-panel name="sucursales" class="q-pa-none">
      <sucursal-index />
    </q-tab-panel>
    <q-tab-panel name="lineas" class="q-pa-none">
      <lineas-index />
    </q-tab-panel>
    <q-tab-panel name="requisitos" class="q-pa-none">
      <requisitos-index />
    </q-tab-panel>
    <q-tab-panel name="skills" class="q-pa-none">
      <skills-index />
    </q-tab-panel>
  </q-tab-panels>
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
  overflow-y: auto;
  max-height: 600px; /* Ajusta este valor según tus necesidades */
}
</style>
