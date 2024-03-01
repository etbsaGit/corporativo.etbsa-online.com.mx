<template>
    <div class="q-pa-md" v-if="user.empleado">
      <q-card flat bordered>

      <q-card-section>
        <q-card-section>
          <q-tabs
          v-model="tab"
          dense
          active-color="grey"
          indicator-color="primary"
          align="justify"
          stretch
        >
          <q-tab name="personal" label="Datos personales" />
          <q-tab name="negocios" label="Unidad de negocios" />
          <q-tab name="expediente" label="Expediente" />
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="personal">
            <div class="text-h6">Datos personales</div>
           <personal :empleado="user.empleado"></personal>
          </q-tab-panel>

          <q-tab-panel name="negocios">
            <div class="text-h6">Unidad de negocios</div>
            <negocios :empleado="user.empleado"></negocios>
          </q-tab-panel>

          <q-tab-panel name="expediente">
            <div class="text-h6">Expediente</div>
            <expediente :empleado="user.empleado"></expediente>
          </q-tab-panel>
        </q-tab-panels>

        </q-card-section>
        
      </q-card-section>
    </q-card>
    </div>

  <div v-else class="text-center"><h1>Usted esta en modo super usuario</h1></div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth";
import { ref } from "vue";

import Personal from "src/components/Perfil/Personal.vue";
import Negocios from "src/components/Perfil/Negocios.vue";
import Expediente from "src/components/Perfil/Expediente.vue";

const tab = ref('personal')

const auth = useAuthStore();
const { user } = storeToRefs(auth);

</script>
