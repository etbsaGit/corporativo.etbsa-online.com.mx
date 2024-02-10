<template>
    <div class="q-pa-md" v-if="user.empleado">
      <q-card class="my-card" flat bordered>

      <q-card-section horizontal>
        <q-card-section>
          <q-item>
              <q-avatar size="300px" v-if="user.empleado.picture">
                <img :src="user.empleado.picture">
              </q-avatar>
              <q-avatar  size="300px" v-else color="primary" text-color="white">
                    {{ user.empleado.nombre.charAt(0).toUpperCase()
                    }}{{ user.empleado.apellido_paterno.charAt(0).toUpperCase() }}
                  </q-avatar>
        </q-item>
        <q-item>
              <q-item-label>{{ user.empleado.nombre }} {{ user.empleado.segundo_nombre }} {{ user.empleado.apellido_paterno }} {{ user.empleado.apellido_materno }}</q-item-label>
        </q-item>
        <q-separator/>
        <q-item>
          <strong>Correo:</strong>{{ user.empleado.correo_institucional }}
        </q-item>
        <q-item>
          <strong>Usuario: </strong>{{ user.name }}
        </q-item>
        </q-card-section>

        <q-separator vertical />
        
        <q-card-section>
          <div style="width: 1450px">
          <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
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

      </div>
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100%
</style>