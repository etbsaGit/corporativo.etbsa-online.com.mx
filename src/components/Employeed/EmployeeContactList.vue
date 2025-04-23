<template>
  <q-list bordered separator dense>
    <q-item v-for="(contact, index) in contacts" :key="index">
      <q-item-section>
        <q-item-label>
          <q-icon name="person" class="q-mr-sm text-secondary" />
          {{ contact.nombre }}
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <q-icon name="phone" class="q-mr-sm text-secondary" />
          {{ formatPhoneNumber(contact.telefono) }}
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-icon name="group" class="q-mr-sm text-secondary" />
          {{ contact.kinship.name }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { formatPhoneNumber } from "src/boot/formatFunctions";

const { contacts } = defineProps(["contacts"]);
</script>
