<template>
  <q-card
    @click="clickRom(bay)"
    :class="['custom-card', getCardClass(bay.linea_id)]"
  >
    <q-item class="custom-card-title">
      <q-item-section>
        {{ bay.nombre }}
      </q-item-section>
    </q-item>
    <q-item v-if="bay.work_order">
      <q-item-section>
        <q-img
          v-if="bay.work_order?.work_order_doc?.[0]?.realpath"
          class="custom-card-image"
          :src="bay.work_order?.work_order_doc?.[0]?.realpath"
          :alt="'Imagen de ' + bay.nombre"
          :ratio="16 / 9"
        />
        <q-icon v-else name="no_photography" size="xl" class="default-icon" />
      </q-item-section>
    </q-item>
    <q-item class="custom-card-body">
      <q-item-section v-if="bay.work_order">
        <q-item-label class="empty-message">
          {{ bay.work_order?.cliente }}
        </q-item-label>
      </q-item-section>
      <q-item-section v-else>
        <q-item-label class="empty-message"> Bahía vacía </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>

  <q-dialog
    v-model="details"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section class="text-h6">
          {{ selectedRow.nombre }}
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <bay-item :bay="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import BayItem from "src/components/Bays/BayItem.vue";

const { bay } = defineProps(["bay"]);

const details = ref(false);
const selectedRow = ref(null);

const clickRom = (row) => {
  if (row.work_order) {
    selectedRow.value = row;
    details.value = true;
  }
};

// Función para determinar la clase de la tarjeta según linea_id
const getCardClass = (lineaId) => {
  if (lineaId === 1) return "linea-verde";
  if (lineaId === 2) return "linea-amarilla";
  return "";
};
</script>

<style scoped>
.custom-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  position: relative;
}

.custom-card:hover {
  transform: scale(1.05); /* Aumenta el tamaño ligeramente */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); /* Sombra más intensa */
}

.custom-card-title {
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.custom-card-image {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.default-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #ccc;
  background: #f5f5f5;
}

.custom-card-body {
  padding: 10px;
  font-size: 0.9rem;
  color: #555;
}

.custom-card-body p {
  margin: 5px 0;
}

.empty-message {
  color: #757575;
  font-style: italic;
  text-align: center;
}

/* Estilos dinámicos según linea_id */
.linea-verde {
  border: 2px solid #4caf50;
  background-color: #e8f5e9;
}

.linea-amarilla {
  border: 2px solid #ffeb3b;
  background-color: #fffde7;
}
</style>
