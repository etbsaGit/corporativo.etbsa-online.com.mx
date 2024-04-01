<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSkill.name"
          filled
          dense
          label="Nombre de la skill"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-toggle
          v-model="allPuestos"
          label="Activar/Desactivar Todos"
          color="blue"
        />
      </q-item-section>
    </q-item>
    <q-separator />
    <div class="row items-start">
      <q-item v-for="puesto in puestos" :key="puesto.id" class="col-4">
        <q-item-section>
          <q-toggle
            v-model="formSkill.puestos"
            :label="puesto.nombre"
            :val="puesto.id"
            color="blue"
          />
        </q-item-section>
      </q-item>
    </div>
  </q-form>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest } from "src/boot/functions";

const { skill } = defineProps(["skill"]);
const myForm = ref(null);
const puestos = ref(null);
const allPuestos = ref(false);

const activarTodos = () => {
  if (allPuestos.value) {
    formSkill.value.puestos = puestos.value.map((puesto) => puesto.id);
  } else {
    formSkill.value.puestos = [];
  }
};

const formSkill = ref({
  id: skill ? skill.id : null,
  name: skill ? skill.name : null,
  puestos: [],
});

const getPuestos = async () => {
  let res = await sendRequest("GET", null, "/api/puesto/all", "");
  puestos.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

const marcarToggles = () => {
  if (skill) {
    for (const puesto of skill.puesto) {
      formSkill.value.puestos.push(puesto.id);
    }
  }
};

watch(allPuestos, activarTodos);

onMounted(() => {
  getPuestos();
  marcarToggles();
});

defineExpose({
  formSkill,
  validate,
});
</script>
