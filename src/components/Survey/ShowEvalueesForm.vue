<template>
  <div class="q-pa-md">
    <q-list>
      <q-item
        class="q-linear-progress-container"
        v-for="evaluee in evaluees"
        :key="evaluee.id"
      >
        <q-item-section>
          <q-item-label>
            {{ evaluee.evaluee_name }}: {{ evaluee.total_responses }}/{{
              evaluee.total_questions
            }}</q-item-label
          >
          <q-linear-progress
            size="20px"
            stripe
            rounded
            color="green"
            :value="evaluee.total_responses / evaluee.total_questions"
            max="1"
          >
          </q-linear-progress>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { survey } = defineProps(["survey"]);
const evaluees = ref([]);

const getEvalueesPerSurvey = async () => {
  let res = await sendRequest(
    "GET",
    null,
    `/api/survey/evaluees/all/${survey.id}`,
    ""
  );
  evaluees.value = res;
};

onMounted(() => {
  getEvalueesPerSurvey();
});
</script>

