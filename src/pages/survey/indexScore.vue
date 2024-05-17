<template>
  <q-table
    title="Calificaciones"
    :rows="sortedScores"
    :columns="columns"
    row-key="name"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body-cell-survey="props">
      <q-td :props="props">
        <q-item-label>
          {{ props.row.survey.title }}
        </q-item-label>
        <q-tooltip class="bg-purple text-body2" :offset="[10, 10]">
          {{ props.row.comments }}
        </q-tooltip>
      </q-td>
    </template>
    <template v-slot:body-cell-score="props">
      <q-td :props="props">
        <q-item-label>
          {{ props.row.score.toFixed(2) }}<strong>/100</strong>
        </q-item-label>
      </q-td>
    </template>
    <template v-slot:pagination>
      <q-item class="q-pr-xl">
        <q-item-section class="text-subtitle2">
          <strong> El promedio de todas tus evaluaciones es: </strong>
        </q-item-section>
        <q-item-section class="text-h5">
          <q-item-label
            :class="{
              'text-green': average_score >= 90,
              'text-orange': average_score >= 70 && average_score < 90,
              'text-red': average_score < 70,
            }"
          >
            {{ average_score.toFixed(2) }}
            <strong class="text-black">/100</strong>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-table>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth";
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const auth = useAuthStore();
const { user } = storeToRefs(auth);

const scores = ref([]);
const average_score = ref(null);

const getScores = async () => {
  let res = await sendRequest("GET", null, "/api/grades/" + auth.user.id, "");
  scores.value = res.grades;
  // average_score.value = res.average_score;
  average_score.value = res.average_score;
};

const columns = [
  // { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "survey",
    label: "Encuesta",
    align: "left",
    field: "survey",
    sortable: true,
  },
  {
    name: "created_at",
    label: "Cuando se califico",
    align: "left",
    field: (row) => formatDate(row.created_at),
    sortable: true,
  },
  // {
  //   name: "comments",
  //   label: "Comentarios",
  //   align: "left",
  //   field: "comments",
  //   sortable: true,
  // },

  {
    name: "questions",
    label: "Preguntas",
    align: "left",
    field: "questions",
    sortable: true,
  },
  {
    name: "correct",
    label: "Correctas",
    align: "left",
    field: "correct",
    sortable: true,
  },
  {
    name: "incorrect",
    label: "Incorrectas",
    align: "left",
    field: "incorrect",
    sortable: true,
  },
  {
    name: "unanswered",
    label: "Sin responder",
    align: "left",
    field: "unanswered",
    sortable: true,
  },
  {
    name: "score",
    label: "Calificacion",
    align: "left",
    field: "score",
    sortable: true,
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Ordenar los scores por el id en orden descendente
const sortedScores = computed(() => {
  return scores.value
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

onMounted(() => {
  getScores();
});
</script>
