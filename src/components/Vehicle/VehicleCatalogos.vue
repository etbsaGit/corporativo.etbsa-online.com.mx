<template>
  <q-card flat bordered>
    <q-tabs
      v-model="tab"
      dense
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="marcas" icon="branding_watermark" label="Marcas" />
      <q-tab name="modelos" icon="directions_car" label="Modelos" />
      <q-tab name="tipos" icon="category" label="Tipos de vehículo" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated keep-alive>
      <q-tab-panel name="marcas">
        <vehicle-catalogo-crud
          tipo="marcas"
          titulo="Marcas de vehículos"
          singular="Marca"
          @updated="$emit('updated')"
        />
      </q-tab-panel>

      <q-tab-panel name="modelos">
        <vehicle-catalogo-crud
          tipo="modelos"
          titulo="Modelos de vehículos"
          singular="Modelo"
          @updated="$emit('updated')"
        />
      </q-tab-panel>

      <q-tab-panel name="tipos">
        <vehicle-catalogo-crud
          tipo="tipos"
          titulo="Tipos de vehículos"
          singular="Tipo de vehículo"
          @updated="$emit('updated')"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import VehicleCatalogoCrud from "src/components/Vehicle/VehicleCatalogoCrud.vue";

defineEmits(["updated"]);

const tab = ref("marcas");
</script>
