<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar
            size="100px"
            color="primary"
            text-color="white"
            v-if="employee.picture"
          >
            <img :src="employee.picture" alt="Foto del empleado" />
          </q-avatar>
          <q-avatar size="100px" v-else color="primary" text-color="white">
            {{ employee.nombre.charAt(0).toUpperCase()
            }}{{ employee.apellido_paterno.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong>
              {{ employee.nombre }} {{ employee.segundo_nombre }}
              {{ employee.apellido_paterno }} {{ employee.apellido_materno }}
            </strong>
          </q-item-label>
          <q-item-label caption>
            <strong>Sucursal: </strong>
            {{ employee.sucursal.nombre }}
          </q-item-label>
          <q-item-label caption>
            <strong>Linea: </strong>
            {{ employee.linea.nombre }}
          </q-item-label>
          <q-item-label caption>
            <strong>Departamento: </strong>
            {{ employee.departamento.nombre }}
          </q-item-label>
          <q-item-label caption>
            <strong>Puesto: </strong>
            {{ employee.puesto.nombre }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-splitter v-model="splitterModel">
        <template v-slot:before>
          <div class="q-pa-md">
            <div class="text-h4 q-mb-md">Historico</div>
            <employee-time-line :empleado="employee" :editable="false" />
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-md">
            <div class="text-h4 q-mb-md">Habilidades</div>
            <skill-rating-chart
              v-if="initial == true"
              :ratings="skillratings"
              :key="skillratings"
            />
          </div>
        </template>
      </q-splitter>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
const { employee } = defineProps(["employee"]);
import EmployeeTimeLine from "src/components/Employeed/EmployeeTimeLine.vue";
import SkillRatingChart from "src/components/Skill/SkillRatingChart.vue";

const skillratings = ref([]);
const initial = ref(false);
const splitterModel = ref(50);

const getSkillRating = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/skillratings/" + employee.id,
    ""
  );
  skillratings.value = res;
};

onMounted(() => {
  getSkillRating();
  initial.value = true;
});
</script>
