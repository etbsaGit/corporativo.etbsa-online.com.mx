<template>
  <div class="q-pa-md">
    <q-card>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="evaluaciones" icon="work" label="Evaluaciones" />
        <q-tab name="calificaciones" icon="group_work" label="calificaciones" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="evaluaciones">
          <index-evaluee></index-evaluee>
        </q-tab-panel>
        <q-tab-panel name="calificaciones">
          <index-score></index-score>
        </q-tab-panel>
      </q-tab-panels>

    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import indexEvaluee from './indexEvaluee.vue';
import indexScore from './indexScore.vue';

const tab = ref("evaluaciones");
</script>
