<template>
  <div class="q-px-lg q-py-md">
    <q-timeline color="secondary">
      <q-timeline-entry
        v-for="(technician, index) in allQualifications"
        :key="index"
        :title="technician.technician.name"
        :subtitle="technician.technician.concepto"
      >
        <q-item
          v-for="qualification in technician.qualification"
          :key="qualification.id"
        >
          <q-item-section avatar>
            <q-toggle
              v-model="qualificationSelected"
              :val="qualification.id"
              color="blue"
              :disable="disable"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ qualification.name }}</q-item-label>
            <q-item-label caption>{{ qualification.clave }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { qualifications, linea, disable } = defineProps([
  "qualifications",
  "linea",
  "disable",
]);

const allQualifications = ref([]);
const qualificationSelected = ref([]);

const getQualifications = async () => {
  const res = await sendRequest(
    "GET",
    null,
    "/api/qualifications/" + linea.id,
    ""
  );
  allQualifications.value = res;
};

const marcarToggles = () => {
  // Verificar si existe la propiedad evaluee en survey y si tiene usuarios asociados
  if (qualifications) {
    // Recorrer los usuarios asociados a survey.evaluee
    for (const qualification of qualifications) {
      // Agregar el ID del usuario al array selectedEvaluee
      qualificationSelected.value.push(qualification.id);
    }
  }
};

onMounted(() => {
  getQualifications();
  marcarToggles();
});

defineExpose({
  qualificationSelected,
});
</script>

