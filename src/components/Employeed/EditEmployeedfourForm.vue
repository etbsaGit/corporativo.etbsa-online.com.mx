<template>
  <q-form>
    <div>{{ requisito }}</div>
    <div>{{ id }}</div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { requisito } = defineProps(["requisito"]);
const id = ref(requisito.pivot.id);
</script>
