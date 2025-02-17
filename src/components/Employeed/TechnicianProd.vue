<template>
  <q-item>
    <q-item-section avatar>
      <q-icon name="schedule" color="primary" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-primary text-h6">
        <strong>Horas facturadas en el mes:</strong>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label class="text-teal text-h6">
        {{ empleado.prod.horas }} horas
      </q-item-label>
    </q-item-section>
  </q-item>
  <!-- <q-separator />
  <q-item>
    <q-item-section avatar>
      <q-icon name="attach_money" color="green" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-green text-h6">
        <strong>Total generado en el mes:</strong>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label class="text-deep-orange text-h6">
        {{ formatCurrency(empleado.prod.value) }}
      </q-item-label>
    </q-item-section>
  </q-item> -->
</template>

<script setup>
import { formatCurrency } from "src/boot/formatFunctions";
const { empleado } = defineProps(["empleado"]);
</script>
