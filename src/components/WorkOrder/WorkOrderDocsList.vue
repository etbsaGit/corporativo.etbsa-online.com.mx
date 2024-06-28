<template>
  <q-list separator>
    <q-item>
      <q-item-section>Nombre</q-item-section>
      <q-item-section>Subido</q-item-section>
      <q-item-section avatar>Descargar</q-item-section>
      <q-item-section avatar>Borrar</q-item-section>
    </q-item>
    <q-item v-for="(wod, index) in local_docs" :key="index">
      <q-item-section>{{ wod.name }}</q-item-section>
      <q-item-section>{{ formatDate(wod.created_at) }}</q-item-section>
      <q-item-section avatar>
        <a :href="wod.realpath" target="_blank">
          <q-icon color="primary" name="download" size="sm" />
        </a>
      </q-item-section>
      <q-item-section avatar>
        <q-btn
          icon="delete"
          flat
          color="red"
          @click="clickDelete(wod, index)"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from "vue";
import { formatDate } from "src/boot/formatFunctions";
import { sendRequest } from "src/boot/functions";

const { wo } = defineProps(["wo"]);

const local_docs = ref(wo ? wo.work_order_doc : []);

const clickDelete = async (wod, index) => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/workOrderDoc/" + wod.id,
    ""
  );
  local_docs.value.splice(index, 1);
};
</script>
