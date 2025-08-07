<template>
  <q-list separator>
    <q-item v-for="(nota, index) in notas" :key="index">
      <q-item-section class="text-h6">{{ nota.nota }}</q-item-section>
    </q-item>
  </q-list>
</template>
<script setup>
const { notas } = defineProps(["notas"]);
</script>
