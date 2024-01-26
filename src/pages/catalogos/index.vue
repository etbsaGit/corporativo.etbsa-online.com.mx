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
        <q-tab name="puestos" icon="work" label="Puestos" />
        <q-tab name="departamentos" icon="group_work" label="Departamentos" />
        <q-tab name="sucursales" icon="apartment" label="Sucursales" />
        <q-tab name="lineas" icon="engineering" label="Lineas" />
        <q-tab name="requisitos" icon="folder" label="Requisitos" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="departamentos">
          <departamentos-index></departamentos-index>
        </q-tab-panel>
        <q-tab-panel name="puestos">
          <puestos-index></puestos-index>
        </q-tab-panel>
        <q-tab-panel name="sucursales">
          <sucursal-index></sucursal-index>
        </q-tab-panel>
        <q-tab-panel name="lineas">
          <lineas-index></lineas-index>
        </q-tab-panel>
        <q-tab-panel name="requisitos">
          <requisitos-index></requisitos-index>
        </q-tab-panel>
      </q-tab-panels>
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

const tab = ref("puestos");
</script>
