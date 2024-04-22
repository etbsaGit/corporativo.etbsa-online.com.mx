<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="evaluaciones" icon="work" label="Evaluaciones" />
    <q-tab name="calificaciones" icon="group_work" label="calificaciones" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="evaluaciones" class="q-pa-none">
      <index-evaluee />
    </q-tab-panel>
    <q-tab-panel name="calificaciones" class="q-pa-none">
      <index-score />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import indexEvaluee from "./indexEvaluee.vue";
import indexScore from "./indexScore.vue";

const tab = ref("evaluaciones");
</script>
