<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="Kardex" label="Kardex" />
    <q-tab name="Encuestas" label="Encuestas" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="Kardex" class="q-pa-none">
      <surveys-kardex />
    </q-tab-panel>
    <q-tab-panel name="Encuestas" class="q-pa-none">
      <index-survey />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import surveysKardex from "./surveysKardex.vue";
import indexSurvey from "./indexSurvey.vue";

const tab = ref("Kardex");
</script>
