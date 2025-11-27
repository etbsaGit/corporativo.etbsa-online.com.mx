<template>
  <q-form ref="myForm" greedy>
    <q-tabs
      v-model="tab"
      dense
      class="text-black"
      active-color="green"
      indicator-color="green"
      align="justify"
      narrow-indicator
    >
      <q-tab name="info" label="Info" />
      <q-tab name="niveles" label="Niveles" />
    </q-tabs>

    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="info">
        <q-item>
          <q-item-section>
            <q-input
              v-model="formSkill.nombre"
              outlined
              dense
              label="Nombre"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formSkill.definicion"
              outlined
              dense
              label="Definicion"
              lazy-rules
              type="textarea"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formSkill.positivas"
              outlined
              dense
              label="Conductas positivas"
              lazy-rules
              type="textarea"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formSkill.negativas"
              outlined
              dense
              label="Conductas negativas"
              lazy-rules
              type="textarea"
              hint
            />
          </q-item-section>
        </q-item>
      </q-tab-panel>

      <q-tab-panel name="niveles">
        <div v-for="(nivel, index) in formSkill.niveles" :key="index">
          <q-item>
            <q-item-section>
              <q-input
                v-model="nivel.nivel"
                outlined
                dense
                type="number"
                label="Nivel"
                :rules="[requiredGreaterThan0]"
              >
                <template v-slot:before>
                  <q-btn
                    color="negative"
                    icon="delete"
                    outline
                    round
                    dense
                    @click="removeRelacion(nivel.id, index)"
                  />
                </template>
              </q-input>
            </q-item-section>
            <q-item-section>
              <q-input
                v-model="nivel.nombre"
                outlined
                dense
                label="nombre"
                :rules="[required]"
              />
            </q-item-section>

            <q-item-section>
              <q-input
                v-model="nivel.descripcion"
                outlined
                dense
                type="textarea"
                label="descripcion"
                :rules="[required]"
              />
            </q-item-section>
            <q-item-section>
              <q-input
                v-model="nivel.indicadores"
                outlined
                dense
                type="textarea"
                label="indicadores"
                :rules="[required]"
              />
            </q-item-section>
          </q-item>
          <q-separator spaced />
        </div>
        <q-item>
          <q-item-section>
            <q-btn
              label="Agregar"
              color="primary"
              @click="addNivel"
              icon="add"
              outline
            />
          </q-item-section>
        </q-item>
      </q-tab-panel>
    </q-tab-panels>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { sendRequest } from "src/boot/functions";
import { required, requiredGreaterThan0 } from "src/boot/rules";

const { skill } = defineProps(["skill"]);

const myForm = ref(null);

const tab = ref("info");

const formSkill = ref({
  id: skill ? skill.id : null,
  nombre: skill ? skill.nombre : null,
  definicion: skill ? skill.definicion : null,
  positivas: skill ? skill.positivas : null,
  negativas: skill ? skill.negativas : null,

  niveles: skill ? skill.niveles : [],
});

const addNivel = () => {
  formSkill.value.niveles.push({
    id: null,
    nivel: null,
    nombre: null,
    descripcion: null,
    indicadores: null,
  });
};

const removeRelacion = async (id, index) => {
  if (id) {
    await sendRequest("DELETE", null, "/api/softSkillNivel/" + id, "");
  }
  formSkill.value.niveles.splice(index, 1);
};

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formSkill,
  validate,
});
</script>
