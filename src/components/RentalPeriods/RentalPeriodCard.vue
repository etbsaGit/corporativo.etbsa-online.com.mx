<template>
  <q-item>
    <q-item-section>
      <q-item-label overline>Máquina</q-item-label>
      <q-item-label class="text-h6 q-mt-sm q-mb-xs">
        {{ rentalPeriod.rental_machine.model }} ({{
          rentalPeriod.rental_machine.serial
        }})
      </q-item-label>
      <q-item-label caption class="text-grey">
        {{ rentalPeriod.rental_machine.description }}
      </q-item-label>
      <q-item-label caption class="text-grey">
        {{ rentalPeriod.rental_machine.comments || "Ninguno" }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-img
        class="rounded-borders"
        :src="rentalPeriod.rental_machine.pic"
        alt="Imagen de la máquina"
      />
    </q-item-section>
  </q-item>

  <q-separator />

  <q-item>
    <q-item-section>
      <q-item-label overline>Cliente</q-item-label>
      <q-item-label class="text-h5 q-mt-sm q-mb-xs">
        {{ rentalPeriod.cliente.nombre }}
      </q-item-label>
      <q-item-label caption class="text-grey">
        <strong>RFC:</strong> {{ rentalPeriod.cliente.rfc }}
      </q-item-label>
      <q-item-label caption class="text-grey">
        <strong>Telefono:</strong>
        {{ formatPhoneNumber(rentalPeriod.cliente.telefono) }}
      </q-item-label>
      <q-item-label caption class="text-grey">
        <strong>Email:</strong> {{ rentalPeriod.cliente.email }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-separator />
  <q-item>
    <q-item-section>
      <q-item-label>
        <strong>Valor de renta:</strong>
        {{ formatCurrency(rentalPeriod.rental_value) }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <strong>Dia mensual de renta:</strong>
        {{ rentalPeriod.billing_day }} de cada mes
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { formatCurrency, formatPhoneNumber } from "src/boot/formatFunctions";
const { rentalPeriod } = defineProps(["rentalPeriod"]);
</script>

