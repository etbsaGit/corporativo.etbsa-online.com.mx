<template>
  <q-table
    title="Calificaciones"
    :rows="sortedScores"
    :columns="columns"
    row-key="name"
  >
    <template v-slot:body-cell-survey="props">
      <q-td :props="props">
        {{ props.row.survey.title }}
      </q-td>
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

const getScores = async () => {
  let res = await sendRequest("GET", null, "/api/grades/" + auth.user.id, "");
  scores.value = res;
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
    name: "comments",
    label: "Comentarios",
    align: "left",
    field: "comments",
    sortable: true,
  },
  {
    name: "score",
    label: "Calificacion",
    align: "left",
    field: "score",
    sortable: true,
  },
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
    name: "created_at",
    label: "Cuando se califico",
    align: "left",
    field: (row) => formatDate(row.created_at),
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
