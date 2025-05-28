<template>
  <q-tabs
    v-model="tab"
    dense
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    align="justify"
    narrow-indicator
  >
    <q-tab name="transacciones" label="Transacciones" />
  </q-tabs>
  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="transacciones">
      <caja-admin-transacciones-index />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import CajaAdminTransaccionesIndex from "src/components/Caja/CajaAdmin/CajaAdminTransacciones/CajaAdminTransaccionesIndex.vue";

const tab = ref("transacciones");
</script>
