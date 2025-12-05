<template>
  <div class="q-gutter-md">
    <q-card
      v-for="(skill, index) in skills"
      :key="index"
      class="skill-card"
      flat
      bordered
    >
      <q-card-section class="bg-grey-2">
        <div class="text-subtitle1 text-weight-bold">
          {{ skill.soft_skill.nombre }}
        </div>
        <div class="text-caption text-grey-7">
          {{ skill.soft_skill.definicion }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <!-- Definición -->
        <q-input
          v-model="skill.definicion"
          label="Definición"
          outlined
          type="textarea"
          autogrow
          dense
        />

        <!-- Evidencia -->
        <q-input
          v-model="skill.evidencia"
          label="Evidencia"
          outlined
          type="textarea"
          autogrow
          dense
        />

        <!-- Nivel -->
        <q-select
          v-model="skill.soft_skill_nivel_id"
          :options="getNivelesPorSkill(skill.soft_skill_id)"
          :hint="getDescripcionNivelSeleccionado(skill)"
          label="Nivel"
          option-value="id"
          option-label="nombre"
          options-dense
          emit-value
          map-options
          outlined
          dense
          persistent-hint
        />
      </q-card-section>
    </q-card>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { empleado } = defineProps(["empleado"]);

const baseURL = "/api/softSkillEmpleado";

const skills = ref(null);
const levels = ref([]);

const getRows = async (id) => {
  let res = await sendRequest("GET", null, baseURL + "/" + id, "");
  skills.value = res;
};

const getforms = async () => {
  let res = await sendRequest("GET", null, baseURL + "/forms", "");
  levels.value = res;
};

const getNivelesPorSkill = (softSkillId) => {
  const skill = levels.value.find((s) => s.id === softSkillId);

  if (!skill || !skill.niveles) return [];

  return [...skill.niveles]
    .sort((a, b) => a.nivel - b.nivel)
    .map((n) => ({
      id: n.id,
      nombre: `${n.nivel} - ${n.nombre}`,
    }));
};

const getDescripcionNivelSeleccionado = (skill) => {
  const skillCompleta = levels.value.find((s) => s.id === skill.soft_skill_id);

  if (!skillCompleta || !skillCompleta.niveles) return "";

  const nivel = skillCompleta.niveles.find(
    (n) => n.id === skill.soft_skill_nivel_id
  );

  return nivel?.descripcion || "";
};

onMounted(() => {
  getRows(empleado.id);
  getforms();
});

defineExpose({
  skills,
});
</script>

<style scoped>
.skill-card {
  border-radius: 18px;
  transition: all 0.2s ease-in-out;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
</style>

