<template>
  <kardex :puestos="surveys_with_puesto" :survey="surveys_without_puesto" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, checkRole } from "src/boot/functions";

import kardex from "../../components/Survey/DashBoard/kardex.vue";

const surveys_with_puesto = ref(null);
const surveys_without_puesto = ref(null);

const getKardex = async () => {
  if (checkRole("Evaluador")) {
    let res = await sendRequest(
      "GET",
      null,
      "/api/surveys/kardex/evaluator",
      ""
    );
    surveys_with_puesto.value = res.surveys_with_puesto;
    surveys_without_puesto.value = res.surveys_without_puesto;
  }
  if (checkRole("Encuestador") || checkRole("Admin")) {
    let res = await sendRequest("GET", null, "/api/surveys/kardex", "");
    surveys_with_puesto.value = res.surveys_with_puesto;
    surveys_without_puesto.value = res.surveys_without_puesto;
  }
};

onMounted(() => {
  getKardex();
});
</script>
