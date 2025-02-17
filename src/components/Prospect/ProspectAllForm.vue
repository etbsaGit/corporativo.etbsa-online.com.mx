<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <q-tabs
        v-model="tab"
        vertical
        class="text-black"
        active-color="teal"
        indicator-color="teal"
      >
        <q-tab name="info" icon="person" label="Informacion" />
        <q-tab name="cultivos" icon="eco" label="Cultivos" />
        <q-tab name="riegos" icon="shower" label="Riegos" />
        <q-tab name="distribucion" icon="pin_drop" label="Distribucion" />
        <q-tab name="maquinas" icon="agriculture" label="Maquinas" />
        <q-tab
          v-if="currentProspect?.candidato_agp == 1"
          name="agp"
          icon="analytics"
          label="Agricultura de presicion"
        />
        <q-tab name="servicios" icon="build" label="Servicios posventa" />
      </q-tabs>
    </template>
    <template v-slot:after>
      <q-tab-panels
        v-model="tab"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="info">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Informacion general </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn label="Guardar" color="blue" @click="putRow" />
            </q-item-section>
          </q-item>
          <prospect-form
            ref="edit"
            :prospect="currentProspect"
            :key="currentProspect"
          />
        </q-tab-panel>
        <q-tab-panel name="cultivos">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Cultivos </q-item-label>
            </q-item-section>
          </q-item>
          <prospect-cultivo-index
            :prospect="currentProspect"
            :key="currentProspect"
          />
        </q-tab-panel>
        <q-tab-panel name="riegos">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Riego </q-item-label>
            </q-item-section>
          </q-item>
          <prospect-riego-index
            :prospect="currentProspect"
            :key="currentProspect"
          />
        </q-tab-panel>
        <q-tab-panel name="distribucion">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Distribucion </q-item-label>
            </q-item-section>
          </q-item>
          <prospect-distribucion-index
            :prospect="currentProspect"
            :key="currentProspect"
          />
        </q-tab-panel>
        <q-tab-panel name="maquinas">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Maquinas </q-item-label>
            </q-item-section>
          </q-item>
          <prospect-maquina-index
            :prospect="currentProspect"
            :key="currentProspect"
          />
        </q-tab-panel>
        <q-tab-panel name="agp">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6">
                Agricultura de presicion
              </q-item-label>
            </q-item-section>
          </q-item>
          <prospect-agp-index
            :prospect="currentProspect"
            :key="currentProspect"
          />
        </q-tab-panel>
        <q-tab-panel name="servicios">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Servicios posventa </q-item-label>
            </q-item-section>
          </q-item>
          <prospect-servicio-index
            :prospect="currentProspect"
            :key="currentProspect"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import ProspectForm from "src/components/Prospect/ProspectForm.vue";
import ProspectCultivoIndex from "src/components/ProspectCultivo/ProspectCultivoIndex.vue";
import ProspectRiegoIndex from "src/components/ProspectRiego/ProspectRiegoIndex.vue";
import ProspectDistribucionIndex from "src/components/ProspectDistribucion/ProspectDistribucionIndex.vue";
import ProspectMaquinaIndex from "src/components/ProspectMaquina/ProspectMaquinaIndex.vue";
import ProspectAgpIndex from "src/components/ProspectAgp/ProspectAgpIndex.vue";
import ProspectServicioIndex from "src/components/ProspectServicio/ProspectServicioIndex.vue";

const { prospect } = defineProps(["prospect"]);

const tab = ref("info");
const splitterModel = ref(15);
const currentProspect = ref(null);
const edit = ref(null);

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formProspect,
  };
  let res = await sendRequest("PUT", final, "/api/prospect/" + final.id, "");
  currentProspect.value = res;
};

onMounted(() => {
  currentProspect.value = prospect;
});
</script>
