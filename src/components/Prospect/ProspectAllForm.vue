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
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import ProspectForm from "src/components/Prospect/ProspectForm.vue";

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
