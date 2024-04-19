<template>
  <q-item>
    <q-btn
      label="Registrar Skill"
      color="primary"
      @click="addSkill = true"
      icon="add_circle"
    />
  </q-item>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        class="boton"
        color="green-9"
        v-model="searchTerm"
        label="Buscar"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-item-section>
  </q-item>
  <q-table
    flat
    bordered
    title="Departamentos"
    :rows="filteredSkills"
    :columns="columns"
    row-key="name"
    dense
    :rows-per-page-options="[0]"
  >
    <template v-slot:top="props">
      <div class="col-2 q-table__title">Skill</div>
      <q-space />
      <q-btn
        round
        dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
        class="q-ml-md"
      />
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td>
        <q-btn-dropdown flat color="primary" icon="menu" dense>
          <q-list v-close-popup>
            <q-item>
              <q-btn
                color="primary"
                @click="onRowClick(props.row)"
                flat
                size="sm"
                label="Editar"
                icon="edit"
              />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-td>
    </template>
  </q-table>
  <q-dialog
    v-model="addSkill"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Registrar Skill</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Agregar skill" color="blue" @click="postSkill()" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <skill-form ref="skill" :skill="null" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showSkill"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Modificar Skill</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Modificar skill" color="blue" @click="putSkill()" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div class="survey-form-container">
          <skill-form ref="skill" :skill="selectedSkill" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import SkillForm from "src/components/Skill/SkillForm.vue";

import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const skill = ref(null);
const $q = useQuasar();

const showSkill = ref(false);
const addSkill = ref(false);

const selectedSkill = ref(null);
const searchTerm = ref("");
const skills = ref([]);

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "name",
    label: "Nombre",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    align: "left",
    sortable: true,
  },
];

const onRowClick = (row) => {
  selectedSkill.value = row;
  showSkill.value = true;
};

const postSkill = async () => {
  const skill_valid = await skill.value.validate();
  if (!skill_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...skill.value.formSkill,
  };
  let res = await sendRequest("POST", final, "/api/skill", "");

  addSkill.value = false;
  getSkills();
};

const putSkill = async () => {
  const skill_valid = await skill.value.validate();
  if (!skill_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...skill.value.formSkill,
  };
  let res = await sendRequest("PUT", final, "/api/skill/" + final.id, "");

  showSkill.value = false;
  getSkills();
};

const getSkills = async () => {
  let res = await sendRequest("GET", null, "/api/skill", "");
  skills.value = res;
};

const filteredSkills = computed(() => {
  return skills.value.filter((skill) => {
    return skill.name.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});

onMounted(() => {
  getSkills();
});
</script>

<style>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
.d-flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}
</style>
