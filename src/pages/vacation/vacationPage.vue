<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="myVacation" label="Mis vacaciones" />
    <q-tab name="vacationsRH" label="Vacaciones" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="myVacation" class="q-pa-none">
      <my-vacation-index />
    </q-tab-panel>

    <q-tab-panel name="vacationsRH" class="q-pa-none">
      <vacation-all />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import MyVacationIndex from "src/components/Vacation/MyVacationIndex.vue";
import VacationAll from "src/components/Vacation/VacationAll.vue";

const tab = ref("myVacation");
</script>
