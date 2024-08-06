<template>
  <div class="year-navigator">
    <q-btn @click="prevYear" round dense flat icon="arrow_left" />
    <span class="year-display">{{ currentYear }}</span>
    <q-btn @click="nextYear" round dense flat icon="arrow_right" />
  </div>
  <div class="month-cards">
    <q-card
      v-for="(month, index) in months"
      :key="index"
      :class="{
        'card-month': true,
        'card-month-blue': getItemForMonth(month.id),
        'card-month-red': !getItemForMonth(month.id),
      }"
      @click="openForm(month)"
    >
      <q-item dense align="center">
        <q-item-section>
          <q-item-label class="text-h6">
            {{ month.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="getItemForMonth(month.id)" align="center">
        <q-item-section>
          <q-item-label> Facturadas: </q-item-label>
          <q-item-label>
            {{ getItemForMonth(month.id).facturadas }}
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label> Horas disponibles con Ingreso: </q-item-label>
          <q-item-label>
            {{ getItemForMonth(month.id).con_ingreso }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-else align="center">
        <q-item-section>
          <q-item-label>No hay datos para este mes</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>

  <q-dialog
    v-model="addForm"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">{{ selectedMonth.name }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side v-if="!getItemForMonth(selectedMonth.id)">
          <q-btn label="Guardar" color="blue" @click="postHoras" />
        </q-item-section>
        <q-item-section side v-if="getItemForMonth(selectedMonth.id)">
          <q-btn label="Editar" color="teal" @click="putHoras" />
        </q-item-section>
        <q-item-section side v-if="getItemForMonth(selectedMonth.id)">
          <q-btn label="Borrar" color="orange" @click="deleteHoras" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <horas-form
            ref="add"
            :month="selectedMonth"
            :anio="currentYear"
            :technician="selectedTechnician"
            :item="getItemForMonth(selectedMonth.id)"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest } from "src/boot/functions";

import HorasForm from "src/components/Technician/HorasForm.vue";

const { employee } = defineProps(["employee"]);

const addForm = ref(false);
const add = ref(null);
const selectedMonth = ref(null);
const selectedTechnician = ref(employee);
const item = ref([]);
const currentYear = ref(new Date().getFullYear());
const months = [
  { id: 1, name: "Enero" },
  { id: 2, name: "Febrero" },
  { id: 3, name: "Marzo" },
  { id: 4, name: "Abril" },
  { id: 5, name: "Mayo" },
  { id: 6, name: "Junio" },
  { id: 7, name: "Julio" },
  { id: 8, name: "Agosto" },
  { id: 9, name: "Septiembre" },
  { id: 10, name: "Octubre" },
  { id: 11, name: "Noviembre" },
  { id: 12, name: "Diciembre" },
];

const openForm = (month) => {
  addForm.value = true;
  selectedMonth.value = month;
};

const prevYear = () => {
  currentYear.value -= 1;
};

const nextYear = () => {
  currentYear.value += 1;
};

const getItemForMonth = (monthId) => {
  return item.value.find((data) => data.mes === monthId);
};

const getHoras = async (id, anio) => {
  let res = await sendRequest(
    "GET",
    null,
    `/api/horasTechnician/tech/${id}/${anio}`,
    ""
  );
  item.value = res;
};

const postHoras = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...add.value.formItem,
  };
  let res = await sendRequest("POST", final, "/api/horasTechnician", "");
  addForm.value = false;
  getHoras(employee.id, currentYear.value);
};

const putHoras = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...add.value.formItem,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/horasTechnician/" + final.id,
    ""
  );
  addForm.value = false;
  getHoras(employee.id, currentYear.value);
};

const deleteHoras = async () => {
  const final = {
    ...add.value.formItem,
  };
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/horasTechnician/" + final.id,
    ""
  );
  addForm.value = false;
  getHoras(employee.id, currentYear.value);
};

onMounted(() => {
  getHoras(employee.id, currentYear.value);
});

watch(currentYear, (newYear) => {
  getHoras(employee.id, newYear);
});
</script>

<style scoped>
.year-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px;
}

.year-display {
  font-size: 24px;
  margin: 0 16px;
}

.month-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas */
  grid-auto-rows: minmax(
    145px,
    auto
  ); /* Ajusta la altura mínima de las filas */
  gap: 15px;
}

.card-month {
  box-sizing: border-box;
  font-size: 0.9em; /* Tamaño de fuente ajustado */
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Asegura que los elementos se distribuyan bien */
  padding: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Suaviza la transición de escala y sombra */
}

.card-month-blue {
  background-color: #e3f2fd; /* Azul claro */
}

.card-month-red {
  background-color: #ffcdd2; /* Rojo claro */
}

.card-month:hover {
  transform: scale(1.03); /* Aumenta el tamaño de la tarjeta al 105% */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Agrega una sombra para mayor profundidad */
}
</style>


