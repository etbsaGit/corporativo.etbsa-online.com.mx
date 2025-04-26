<template>
  <q-card>
    <q-tabs
      v-model="tab"
      dense
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      align="justify"
      narrow-indicator
    >
      <q-tab name="categorias" label="Categorias" />
      <q-tab name="tiposPagos" label="Formas de pago" />
      <q-tab name="tiposFacturas" label="Tipos de facturas" />
      <q-tab name="bancos" label="Bancos" />
      <q-tab name="cuentas" label="Cuentas" />
      <q-tab name="denominaciones" label="Denominaciones" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="categorias">
        <caja-categoria-index />
      </q-tab-panel>

      <q-tab-panel name="tiposPagos">
        <caja-tipos-pago-index />
      </q-tab-panel>

      <q-tab-panel name="tiposFacturas">
        <caja-tipos-factura-index />
      </q-tab-panel>

      <q-tab-panel name="bancos">
        <caja-banco-index />
      </q-tab-panel>

      <q-tab-panel name="cuentas">
        <caja-cuenta-index />
      </q-tab-panel>

      <q-tab-panel name="denominaciones">
        <caja-denominacion-index />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import CajaCategoriaIndex from "src/components/Caja/CajaCategoria/CajaCategoriaIndex.vue";
import CajaTiposPagoIndex from "src/components/Caja/CajaTiposPago/CajaTiposPagoIndex.vue";
import CajaTiposFacturaIndex from "src/components/Caja/CajaTiposFactura/CajaTiposFacturaIndex.vue";
import CajaBancoIndex from "src/components/Caja/CajaBanco/CajaBancoIndex.vue";
import CajaCuentaIndex from "src/components/Caja/CajaCuenta/CajaCuentaIndex.vue";
import CajaDenominacionIndex from "src/components/Caja/CajaDenominacion/CajaDenominacionIndex.vue";

const tab = ref("categorias");
</script>
