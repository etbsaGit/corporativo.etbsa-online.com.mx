<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <q-splitter v-model="insideModel" horizontal>
        <template v-slot:before>
          <div class="q-pa-sm">
            <q-item>
              <q-item-section avatar>
                <q-avatar
                  size="200px"
                  color="primary"
                  text-color="white"
                  v-if="employee.picture"
                >
                  <img :src="employee.picture" alt="Foto del empleado" />
                </q-avatar>
                <q-avatar
                  size="200px"
                  v-else
                  color="primary"
                  text-color="white"
                >
                  {{ employee.nombre.charAt(0).toUpperCase()
                  }}{{ employee.apellido_paterno.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <strong>
                    {{ employee.nombreCompleto }}
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
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-sm">
            <div class="text-h4 q-mb-md">Historico</div>
            <employee-time-line :empleado="employee" :editable="false" />
          </div>
        </template>
      </q-splitter>
    </template>

    <template v-slot:after>
      <div class="q-pa-sm">
        <div class="text-h4 q-mb-md">Habilidades</div>
        <skill-rating-chart
          v-if="initial == true"
          :ratings="skillratings"
          :key="skillratings"
        />
      </div>
    </template>
  </q-splitter>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import EmployeeTimeLine from "src/components/Employeed/EmployeeTimeLine.vue";
import SkillRatingChart from "src/components/Skill/SkillRatingChart.vue";

const { employee } = defineProps(["employee"]);

const skillratings = ref([]);
const initial = ref(false);
const splitterModel = ref(40);
const insideModel = ref(25);

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
