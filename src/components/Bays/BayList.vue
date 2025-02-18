<template>
  <q-list :class="['custom-list', getListClass(bay)]">
    <q-item
      clickable
      v-ripple
      v-if="bay.work_order"
      class="custom-list-item"
      @click="clickRom(bay)"
    >
      <q-item-section avatar class="custom-list-title">
        {{ bay.nombre }}
      </q-item-section>
      <q-item-section thumbnail>
        <img
          v-if="bay.work_order?.work_order_doc?.[0]?.realpath"
          :src="bay.work_order?.work_order_doc?.[0]?.realpath"
        />
        <q-icon v-else name="no_photography" size="xl" class="default-icon" />
      </q-item-section>
      <q-item-section>
        {{ bay.work_order.maquina }}
      </q-item-section>
      <q-item-section>
        {{ bay.work_order.descripcion }}
      </q-item-section>
      <q-item-section>
        {{ bay.work_order.cliente }}
      </q-item-section>
      <q-item-section>
        {{ bay.work_order.estatus.nombre }}
      </q-item-section>
      <q-item-section>
        {{ formatDateplusoneSlim(bay.work_order.fecha_ingreso) }} -
        {{
          formatDateplusoneSlim(bay.work_order.fecha_entrega) || "No definido"
        }}
      </q-item-section>
    </q-item>

    <q-item v-else class="custom-list-item">
      <q-item-section avatar class="custom-list-title">
        {{ bay.nombre }}
      </q-item-section>
      <q-item-section>
        <p class="empty-message">Bahía vacía</p>
      </q-item-section>
    </q-item>
  </q-list>

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
import { formatDateplusoneSlim } from "src/boot/formatFunctions";

const { bay } = defineProps(["bay"]);

const details = ref(false);
const selectedRow = ref(null);

const clickRom = (row) => {
  if (row.work_order) {
    selectedRow.value = row;
    details.value = true;
  }
};

// Función para determinar la clase de la lista según linea_id
const getListClass = (bay) => {
  const isEnEspera = bay.nombre.toLowerCase().includes("espera");

  if (bay.linea_id === 1)
    return isEnEspera ? "linea-verde-espera" : "linea-verde";
  if (bay.linea_id === 2)
    return isEnEspera ? "linea-amarilla-espera" : "linea-amarilla";

  return "";
};
</script>

<style scoped>
.custom-list {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  position: relative;
}

.custom-list:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px);
}

.custom-list-title {
  font-size: 1rem;
  font-weight: bold;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.custom-list-item {
  padding: 10px;
  font-size: 0.9rem;
  color: #555;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.custom-list-item:hover {
  background-color: #e0f7fa;
  color: #00796b;
}

.custom-list-image {
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

.custom-list-item p {
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

/* Bahías en espera - Línea Verde */
.linea-verde-espera {
  border: 2px dashed #4caf50; /* Mismo color pero con borde punteado */
  background-color: #c8e6c9; /* Un tono más oscuro de verde */
}

/* Bahías en espera - Línea Amarilla */
.linea-amarilla-espera {
  border: 2px dashed #ffeb3b; /* Mismo color pero con borde punteado */
  background-color: #fff9c4; /* Un tono más oscuro de amarillo */
}
</style>
