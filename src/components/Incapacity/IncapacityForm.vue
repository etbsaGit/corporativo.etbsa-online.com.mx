<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section avatar>
        <q-date minimal v-model="model" range @range-end="onRangeEnd" />
      </q-item-section>
      <q-item-section>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formIncapacity.empleado_id"
              :options="filterEmpleados"
              label="Empleado"
              option-value="id"
              option-label="nombreCompleto"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              clearable
              options-dense
              use-input
              @filter="filterFn"
              input-debounce="0"
              behavior="menu"
              :rules="[(val) => val !== null || 'Obligatorio']"
              v-on:update:model-value="resetFormDates"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    no options
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
          <q-item-section class="col-3">
            <q-select
              v-model="formIncapacity.sucursal_id"
              :options="sucursales"
              label="Sucursal"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              readonly
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section class="col-3">
            <q-select
              v-model="formIncapacity.puesto_id"
              :options="puestos"
              label="Puesto"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              readonly
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formIncapacity.estatus_id"
              :options="estatuses"
              label="Tipo de incapacidad"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              clearable
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formIncapacity.fecha_inicio"
              mask="date"
              :rules="['date']"
              outlined
              dense
              label="Fecha de inicio"
              lazy-rules
              readonly
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formIncapacity.fecha_termino"
              mask="date"
              :rules="['date']"
              outlined
              dense
              label="Fecha de termino"
              lazy-rules
              readonly
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formIncapacity.fecha_regreso"
              mask="date"
              :rules="['date']"
              outlined
              dense
              label="Fecha de regreso"
              lazy-rules
              readonly
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formIncapacity.comentarios"
              outlined
              dense
              label="Comentarios"
              lazy-rules
            />
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest } from "src/boot/functions";

const { incapacity } = defineProps(["incapacity"]);

const myForm = ref(null);
const estatuses = ref([]);
const sucursales = ref([]);
const puestos = ref([]);
const empleados = ref([]);
const filterEmpleados = ref(null);
const selectedEmpleado = ref(null);
const model = ref(null);

const formIncapacity = ref({
  id: incapacity ? incapacity.id : null,
  empleado_id: incapacity ? incapacity.empleado_id : null,
  sucursal_id: incapacity ? incapacity.sucursal_id : null,
  puesto_id: incapacity ? incapacity.puesto_id : null,
  estatus_id: incapacity ? incapacity.estatus_id : null,
  fecha_inicio: incapacity ? incapacity.fecha_inicio : null,
  fecha_termino: incapacity ? incapacity.fecha_termino : null,
  fecha_regreso: incapacity ? incapacity.fecha_regreso : null,
  comentarios: incapacity ? incapacity.comentarios : null,
});

const holidays = [
  "2025/01/01",
  "2025/02/03",
  "2025/03/17",
  "2025/04/17",
  "2025/04/19",
  "2025/05/01",
  "2025/09/16",
  "2025/11/17",
  "2025/12/25",
  // Agrega más días festivos aquí en formato yyyy/mm/dd
];

// Función para formatear la fecha
const formatDate = (date) => {
  const { year, month, day } = date;
  // Asegurarse de que el mes y el día tengan dos dígitos
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  return `${year}/${paddedMonth}/${paddedDay}`;
};

const addBusinessDay = (date) => {
  const { year, month, day } = date;

  // Crear un objeto Date para manejar la lógica de fechas
  let currentDate = new Date(year, month - 1, day);

  // Función para formatear la fecha a yyyy/mm/dd
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  };

  do {
    // Sumar un día
    currentDate.setDate(currentDate.getDate() + 1);

    // Recalcular el día de la semana (0=domingo, 6=sábado)
    const dayOfWeek = currentDate.getDay();

    // Verificar si es domingo o un día festivo
    if (dayOfWeek !== 0 && !holidays.includes(formatDate(currentDate))) {
      break; // Día válido encontrado
    }
  } while (true);

  // Devuelve la fecha válida formateada
  return formatDate(currentDate);
};

const onRangeEnd = (date) => {
  formIncapacity.value.fecha_inicio = formatDate(date.from);
  formIncapacity.value.fecha_termino = formatDate(date.to);
  formIncapacity.value.fecha_regreso = addBusinessDay(date.to);
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/incapacity/forms", "");
  empleados.value = res.empleados;
  sucursales.value = res.sucursales;
  puestos.value = res.puestos;
  estatuses.value = res.estatuses;
};

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterEmpleados.value = empleados.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterEmpleados.value = empleados.value.filter(
      (empleado) => empleado.nombreCompleto.toLowerCase().indexOf(needle) > -1
    );
  });
};

watch(
  () => formIncapacity.value.empleado_id,
  (newValue) => {
    // Encuentra el empleado seleccionado
    selectedEmpleado.value =
      empleados.value.find((empleado) => empleado.id === newValue) || null;

    // Actualiza sucursal_id y puesto_id en el formulario
    if (selectedEmpleado.value) {
      formIncapacity.value.sucursal_id =
        selectedEmpleado.value.sucursal_id || null;
      formIncapacity.value.puesto_id = selectedEmpleado.value.puesto_id || null;
    } else {
      // Si no hay empleado seleccionado, resetea los valores
      formIncapacity.value.sucursal_id = null;
      formIncapacity.value.puesto_id = null;
    }
  }
);

const resetFormDates = () => {
  model.value = null;
  formIncapacity.value.fecha_inicio = null;
  formIncapacity.value.fecha_termino = null;
  formIncapacity.value.fecha_regreso = null;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formIncapacity,
  validate,
});
</script>
