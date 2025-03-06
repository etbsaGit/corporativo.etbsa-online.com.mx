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
              v-model="formVacation.empleado_id"
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
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formVacation.sucursal_id"
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
          <q-item-section>
            <q-select
              v-model="formVacation.puesto_id"
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
          <q-item-section>
            <q-input
              v-model="formVacation.anios_cumplidos"
              outlined
              dense
              label="Años cumplidos"
              lazy-rules
              readonly
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formVacation.dias_periodo"
              outlined
              dense
              label="Dias correspondientes"
              lazy-rules
              readonly
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formVacation.periodo_correspondiente"
              outlined
              dense
              label="Periodo correspondiente"
              lazy-rules
              readonly
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formVacation.fecha_inicio"
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
              v-model="formVacation.fecha_termino"
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
              v-model="formVacation.fecha_regreso"
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
              v-model="formVacation.subtotal_dias"
              outlined
              dense
              label="Subtotal dias"
              lazy-rules
              readonly
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formVacation.dias_disfrute"
              outlined
              dense
              label="Dias disfrute"
              lazy-rules
              readonly
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formVacation.dias_pendientes"
              outlined
              dense
              label="Dias pendientes"
              lazy-rules
              readonly
              :rules="[
                (val) => val !== null || 'Obligatorio',
                (val) => val >= 0 || 'Debe ser un número positivo',
              ]"
            />
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section avatar>
        <q-input
          v-model="formVacation.vehiculo_utilitario"
          outlined
          dense
          label="Vehiculo utilitario"
          lazy-rules
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formVacation.comentarios"
          outlined
          dense
          label="Comentarios"
          lazy-rules
        />
      </q-item-section>
      <q-item-section avatar>
        <q-toggle
          v-if="checkRole('RRHH')"
          v-model="formVacation.validated"
          label="Autorizado"
          :true-value="1"
          :false-value="0"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";

const { vacation } = defineProps(["vacation"]);

const myForm = ref(null);
const sucursales = ref([]);
const puestos = ref([]);
const empleados = ref([]);
const filterEmpleados = ref(null);
const selectedEmpleado = ref(null);
const model = ref(null);

const authStore = useAuthStore();
const usuario = authStore.authUser;

const formVacation = ref({
  id: vacation ? vacation.id : null,
  empleado_id: vacation ? vacation.empleado_id : null,
  sucursal_id: vacation ? vacation.sucursal_id : null,
  puesto_id: vacation ? vacation.puesto_id : null,
  vehiculo_utilitario: vacation ? vacation.vehiculo_utilitario : null,
  periodo_correspondiente: vacation ? vacation.periodo_correspondiente : null,
  anios_cumplidos: vacation ? vacation.anios_cumplidos : null,
  dias_periodo: vacation ? vacation.dias_periodo : null,
  subtotal_dias: vacation ? vacation.subtotal_dias : null,
  dias_disfrute: vacation ? vacation.dias_disfrute : null,
  dias_pendientes: vacation ? vacation.dias_pendientes : null,
  fecha_inicio: vacation ? vacation.fecha_inicio : null,
  fecha_termino: vacation ? vacation.fecha_termino : null,
  fecha_regreso: vacation ? vacation.fecha_regreso : null,
  validated: vacation ? vacation.validated : null,
  comentarios: vacation ? vacation.comentarios : null,
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

const countBusinessDays = (startDate, endDate) => {
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  };

  let start = new Date(startDate.year, startDate.month - 1, startDate.day);
  let end = new Date(endDate.year, endDate.month - 1, endDate.day);

  // Asegurarse de que la fecha de inicio es antes que la de fin
  if (start > end) {
    [start, end] = [end, start]; // Intercambia las fechas si están en el orden incorrecto
  }

  let businessDaysCount = 0;
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    const formattedDate = formatDate(currentDate);

    // Verifica si es un día hábil (no domingo y no festivo)
    if (dayOfWeek !== 0 && !holidays.includes(formattedDate)) {
      businessDaysCount++;
    }

    // Avanza al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDaysCount;
};

const onRangeEnd = (date) => {
  formVacation.value.fecha_inicio = formatDate(date.from);
  formVacation.value.fecha_termino = formatDate(date.to);
  formVacation.value.fecha_regreso = addBusinessDay(date.to);
  formVacation.value.dias_disfrute = countBusinessDays(date.from, date.to);
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/vacationDay/forms", "");
  empleados.value = res.empleados;
  sucursales.value = res.sucursales;
  puestos.value = res.puestos;
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
      (empleado) => empleado?.nombreCompleto.toLowerCase().indexOf(needle) > -1
    );
  });
};

watch(
  () => formVacation.value.dias_disfrute,
  (newValue) => {
    formVacation.value.dias_pendientes =
      formVacation.value.subtotal_dias - formVacation.value.dias_disfrute;
  }
);

watch(
  () => formVacation.value.empleado_id,
  (newValue) => {
    // Encuentra el empleado seleccionado
    selectedEmpleado.value =
      empleados.value.find((empleado) => empleado?.id === newValue) || null;

    // Actualiza sucursal_id y puesto_id en el formulario
    if (selectedEmpleado.value) {
      formVacation.value.sucursal_id =
        selectedEmpleado.value.sucursal_id || null;
      formVacation.value.puesto_id = selectedEmpleado.value.puesto_id || null;
      formVacation.value.anios_cumplidos =
        selectedEmpleado.value.aniosVacaciones.cumplidos || null;
      formVacation.value.dias_periodo =
        selectedEmpleado.value.aniosVacaciones.correspondientes || null;
      formVacation.value.subtotal_dias =
        selectedEmpleado.value.aniosVacaciones.subtotal || null;
      formVacation.value.periodo_correspondiente =
        selectedEmpleado.value.vacationPeriod || null;
    } else {
      // Si no hay empleado seleccionado, resetea los valores
      formVacation.value.sucursal_id = null;
      formVacation.value.puesto_id = null;
      formVacation.value.anios_cumplidos = null;
      formVacation.value.dias_periodo = null;
      formVacation.value.subtotal_dias = null;
      formVacation.value.periodo_correspondiente = null;
    }
  }
);

const resetFormDates = () => {
  model.value = null;
  formVacation.value.fecha_inicio = null;
  formVacation.value.fecha_termino = null;
  formVacation.value.fecha_regreso = null;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms().then(() => {
    if (!vacation && usuario && usuario.empleado) {
      formVacation.value.empleado_id = usuario.empleado.id;
    }
    empleados.value.push(usuario.empleado);
  });
});

defineExpose({
  formVacation,
  validate,
});
</script>
