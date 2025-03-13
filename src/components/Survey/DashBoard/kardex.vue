<template>
  <div class="q-pb-lg q-pa-sm" v-for="(puesto, index) in puestos" :key="index">
    <q-card bordered>
      <q-card-section class="row">
        <div class="text-h6 text-weight-bolder text-blue-8">
          {{ puesto.nombre }}
        </div>
      </q-card-section>
      <q-separator></q-separator>

      <q-table
        :rows="rows(puesto.survey)"
        :columns="columns(puesto.survey)"
        row-key="name"
        :rows-per-page-options="[0]"
        separator="cell"
        dense
        hide-bottom
        class="my-sticky-column-table"
      />
    </q-card>
  </div>
  <div class="q-pb-lg q-pa-sm" v-if="survey != null">
    <q-card bordered>
      <q-card-section class="row">
        <div class="text-h6 text-weight-bolder text-blue-8">
          Sin puesto asignado
        </div>
      </q-card-section>
      <q-separator></q-separator>

      <q-table
        :rows="rows(survey)"
        :columns="columns(survey)"
        row-key="name"
        :rows-per-page-options="[0]"
        separator="cell"
        dense
        hide-bottom
        class="my-sticky-column-table"
      />
    </q-card>
  </div>
</template>

<script setup>
const { puestos, survey } = defineProps(["puestos", "survey"]);

const columns = (surveys) => {
  const cols = [
    {
      name: "name",
      required: true,
      label: "Empleado",
      align: "left",
      field: (row) => row.name,
    },
  ];

  surveys.forEach((survey) => {
    cols.push({
      name: survey.title,
      label: survey.title,
      align: "center",
      field: survey.title,
    });
  });

  cols.push({
    name: "total",
    label: "Total",
    align: "center",
    field: "total",
  });

  return cols;
};

const calculateTotals = (surveys) => {
  let totals = {};

  surveys.forEach((survey) => {
    survey.evaluee.forEach((evaluee) => {
      if (!totals[evaluee.empleado.nombreCompleto]) {
        totals[evaluee.empleado.nombreCompleto] = [];
      }
      if (evaluee.grade.length > 0) {
        let grade = evaluee.grade.find((g) => g.survey_id === survey.id);
        if (grade) {
          totals[evaluee.empleado.nombreCompleto].push(grade.score);
        }
      }
    });
  });

  return Object.fromEntries(
    Object.entries(totals).map(([name, scores]) => [
      name,
      scores.reduce((acc, curr) => acc + curr, 0) / scores.length,
    ])
  );
};

const calculateSurveyAverages = (surveys) => {
  let averages = {};

  surveys.forEach((survey) => {
    let totalScore = 0;
    let totalEvaluees = 0;

    survey.evaluee.forEach((evaluee) => {
      evaluee.grade.forEach((grade) => {
        if (grade.survey_id === survey.id) {
          totalScore += grade.score;
          totalEvaluees++;
        }
      });
    });

    averages[survey.title] = totalEvaluees > 0 ? totalScore / totalEvaluees : 0;
  });

  return averages;
};

const rows = (survey) => {
  const dynamicRows = [];
  const totals = calculateTotals(survey);
  const surveyAverages = calculateSurveyAverages(survey);

  survey.forEach((survey) => {
    survey.evaluee.forEach((evaluee) => {
      let empleadoIndex = dynamicRows.findIndex(
        (row) => row.name === evaluee.empleado.nombreCompleto
      );

      if (empleadoIndex === -1) {
        let newRow = {
          name: evaluee.empleado.nombreCompleto,
        };
        if (evaluee.grade.length === 0) {
          newRow[survey.title] = "Sin calificar";
        } else {
          let grade = evaluee.grade.find((g) => g.survey_id === survey.id);
          newRow[survey.title] = grade
            ? grade.score.toFixed(2)
            : "Sin calificar";
        }
        dynamicRows.push(newRow);
      } else {
        if (evaluee.grade.length === 0) {
          dynamicRows[empleadoIndex][survey.title] = "Sin calificar";
        } else {
          let grade = evaluee.grade.find((g) => g.survey_id === survey.id);
          dynamicRows[empleadoIndex][survey.title] = grade
            ? grade.score.toFixed(2)
            : "Sin calificar";
        }
      }
    });
  });

  // Filtrar los totales válidos (excluir 'N/A')
  const validTotals = Object.values(totals).filter((value) => !isNaN(value));

  // Calcular el promedio de los totales válidos
  const totalAverage =
    validTotals.length > 0
      ? validTotals.reduce((acc, curr) => acc + curr, 0) / validTotals.length
      : 0;

  // Agregar los totales a cada fila
  dynamicRows.forEach((row) => {
    row.total = totals[row.name] ? totals[row.name].toFixed(2) : "N/A";
  });

  // Agregar los promedios de las evaluaciones como una fila adicional
  const surveyAverageRow = {
    name: "Promedio por Evaluacion",
  };
  survey.forEach((s) => {
    surveyAverageRow[s.title] = surveyAverages[s.title]
      ? surveyAverages[s.title].toFixed(2)
      : "N/A";
  });
  surveyAverageRow.total = totalAverage.toFixed(2); // Total promedio de evaluaciones

  // Agregar la fila de promedio de evaluaciones al final
  dynamicRows.push(surveyAverageRow);

  return dynamicRows;
};
</script>

<style lang="sass">
.my-sticky-column-table
  thead tr:first-child th:first-child
    background-color: white

  td:first-child
    background-color: white

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1

  tbody tr:last-child td,
  thead tr:last-child th
    background-color: #f2f2f2

  tr td:last-child,
  tr th:last-child
    background-color: #f2f2f2

    /* Tamaño de fuente más pequeño para las etiquetas de columna */
  th
    font-size: 12px

  /* Romper el texto en varias líneas */
  th
    white-space: normal
    word-wrap: break-word
    max-width: 120px /* Ajusta el ancho máximo según sea necesario */
</style>
