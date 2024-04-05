<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Skills</div>
          <q-item v-for="(skillrating, index) in skillratings" :key="index">
            <q-item-section>
              <q-input v-model="skillrating.skill.name" disable filled dense />
            </q-item-section>
            <q-item-section>
              <q-input
                v-model.number="skillrating.rating"
                filled
                dense
                mask="##"
                lazy-rules
              />
            </q-item-section>
          </q-item>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Grafica</div>
          <skill-rating-chart
            v-if="initial == true"
            :ratings="skillratings"
            :key="skillratings"
          />
          <div v-else>Cargando.....</div>
        </div>
      </template>
    </q-splitter>
  </q-form>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { sendRequest } from "src/boot/functions";
import SkillRatingChart from "src/components/Skill/SkillRatingChart.vue";
const { employee } = defineProps(["employee"]);
const bus = inject("bus");
const splitterModel = ref(50);
const skillratings = ref([]);
const myForm = ref(null);
const initial = ref(false);

const getSkillRating = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/skillratings/" + employee.id,
    ""
  );
  skillratings.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

bus.on("new-skill", () => {
  getSkillRating();
});

defineExpose({
  skillratings,
  validate,
});

onMounted(() => {
  getSkillRating();
  initial.value = true;
});
</script>
