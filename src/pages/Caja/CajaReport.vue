<template>
  <q-tabs
    v-model="tab"
    dense
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    align="justify"
    narrow-indicator
  >
    <q-tab name="corte" label="Corte de caja" />
    <q-tab name="categoria" label="Por categoria" />
  </q-tabs>

  <q-separator />
  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="corte" class="q-pa-none">
      <caja-corte />
    </q-tab-panel>

    <q-tab-panel name="categoria" class="q-pa-none">
      <caja-por-categoria />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import CajaCorte from "src/components/Caja/CajaReport/CajaCorte.vue";
import CajaPorCategoria from "src/components/Caja/CajaReport/CajaPorCategoria.vue";

const tab = ref("corte");
</script>
