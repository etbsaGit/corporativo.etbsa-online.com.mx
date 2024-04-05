<template>
  <q-item>
    <q-item-section>
      <q-tabs
        v-model="tab"
        dense
        active-color="grey"
        indicator-color="primary"
        align="justify"
        stretch
      >
        <q-tab name="evaluaciones" icon="work" label="Evaluaciones" />
        <q-tab name="calificaciones" icon="group_work" label="calificaciones" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="evaluaciones">
          <index-evaluee />
        </q-tab-panel>
        <q-tab-panel name="calificaciones">
          <index-score />
        </q-tab-panel>
      </q-tab-panels>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref } from "vue";
import indexEvaluee from "./indexEvaluee.vue";
import indexScore from "./indexScore.vue";

const tab = ref("evaluaciones");
</script>
