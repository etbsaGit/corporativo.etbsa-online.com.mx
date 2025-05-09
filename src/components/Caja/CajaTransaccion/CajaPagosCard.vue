<template>
  <q-card class="card-event">
    <q-list dense bordered separator>
      <q-item>
        <q-item-section><strong>Descripcion</strong></q-item-section>
        <q-item-section><strong>Monto</strong></q-item-section>
        <q-item-section><strong>Categoría</strong></q-item-section>
        <q-item-section><strong>Sucursal</strong></q-item-section>
      </q-item>
      <q-item v-for="pago in pagos" :key="pago.id">
        <q-item-section>
          {{ pago.descripcion }}
        </q-item-section>
        <q-item-section>
          {{ formatCurrency(pago.monto) }}
        </q-item-section>
        <q-item-section>
          {{ pago.categoria?.nombre }}
        </q-item-section>
        <q-item-section>
          {{ pago.sucursal?.nombre }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup>
import {
  formatCurrency,
  formatDateplusoneSlim,
} from "src/boot/formatFunctions";

const { pagos } = defineProps(["pagos"]);
</script>

<style scoped>
.card-event {
  font-size: 1.5em; /* Tamaño de fuente más pequeño */
  width: 800px;
}
</style>
