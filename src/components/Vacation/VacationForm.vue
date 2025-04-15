<template>
  <q-form ref="myForm" greedy>
    <q-item dense>
      <q-item-section avatar>
        <q-date
          minimal
          v-model="model"
          range
          @range-end="onRangeEnd"
          :options="options(selectedEmpleado?.fecha_de_ingreso)"
        />
      </q-item-section>
      <q-item-section>
        <q-item dense>
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
                <q-item dense>
                  <q-item-section class="text-grey">
                    no options
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:after>
                <q-item dense v-if="selectedEmpleado">
                  <q-item-section side>
                    <strong> Fecha de ingreso: </strong>
                  </q-item-section>
                  <q-item-section>
                    {{
                      formatDateplusoneSlim(selectedEmpleado.fecha_de_ingreso)
                    }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>

        <q-item dense>
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
              v-model="formVacation.departamento_id"
              :options="departamentos"
              label="Departamento"
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
              hint
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
        <q-item dense>
          <q-item-section>
            <q-input
              v-model="formVacation.fecha_inicio"
              mask="date"
              :rules="[(val) => val !== null || 'Obligatorio']"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
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
              :rules="[(val) => val !== null || 'Obligatorio']"
              outlined
              dense
              label="Fecha de regreso"
              lazy-rules
              readonly
            />
          </q-item-section>
        </q-item>
        <q-item dense>
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
        <q-item dense>
          <q-item-section>
            <q-select
              v-model="formVacation.cubre"
              :options="filterEmpleadosC"
              label="Quien cubre"
              option-value="id"
              option-label="apellidoCompleto"
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
              @filter="filterFnC"
              input-debounce="0"
              behavior="menu"
              :rules="[(val) => val !== null || 'Obligatorio']"
            >
              <template v-slot:no-option>
                <q-item dense>
                  <q-item-section class="text-grey">
                    no options
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="autoriza"
              :options="empleadosAll"
              label="Quien autoriza"
              option-value="id"
              option-label="nombreCompleto"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              readonly
              hint="Esta persona debera autorizar o recharar tu solicitud"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="notifica"
              :options="empleadosAll"
              label="A quien notifica"
              option-value="id"
              option-label="nombreCompleto"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              outlined
              dense
              readonly
              hint="A esta persona se le notifica sobre tu solicitud"
            />
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
    <q-item dense v-if="checkRole('RRHH')">
      <q-item-section avatar>
        <q-input
          v-model="formVacation.vehiculo_utilitario"
          outlined
          dense
          label="Vehiculo utilitario"
          lazy-rules
          readonly
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
          :color="
            formVacation.validated === 1
              ? 'green'
              : formVacation.validated === 0
              ? 'red'
              : 'amber'
          "
          keep-color
          toggle-indeterminate
          checked-icon="check"
          unchecked-icon="close"
          indeterminate-icon="question_mark"
          size="xl"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";
import { formatDateplusoneSlim } from "src/boot/formatFunctions";

const { vacation } = defineProps(["vacation"]);

const autoriza = ref(null);
const notifica = ref(null);

const myForm = ref(null);
const sucursales = ref([]);
const puestos = ref([]);
const departamentos = ref([]);
const empleados = ref([]);
const empleadosAll = ref([]);
const holidays = ref([]);
const filterEmpleados = ref(null);
const filterEmpleadosC = ref(null);
const selectedEmpleado = ref(null);
const model = ref(null);

const authStore = useAuthStore();
const usuario = authStore.authUser;

const placas = ref(selectedEmpleado.value?.vehicle?.placas);

const formVacation = ref({
  id: vacation ? vacation.id : null,
  empleado_id: vacation ? vacation.empleado_id : null,
  sucursal_id: vacation ? vacation.sucursal_id : null,
  puesto_id: vacation ? vacation.puesto_id : null,
  departamento_id: vacation ? vacation.departamento_id : null,
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
  cubre: vacation ? vacation.cubre : null,
});

// Función para formatear la fecha en YYYY-MM-DD
const formatDate = (date) => {
  const { year, month, day } = date;
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  return `${year}-${paddedMonth}-${paddedDay}`;
};

// Función para sumar un día hábil (evitando domingos y festivos)
const addBusinessDay = (date) => {
  let currentDate = new Date(date.year, date.month - 1, date.day);

  do {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    const formattedDate = formatDate({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    });

    if (dayOfWeek !== 0 && !holidays.value.includes(formattedDate)) {
      break;
    }
  } while (true);

  return formatDate({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
  });
};

// Función para contar días hábiles entre dos fechas
const countBusinessDays = (startDate, endDate) => {
  let start = new Date(startDate.year, startDate.month - 1, startDate.day);
  let end = new Date(endDate.year, endDate.month - 1, endDate.day);

  if (start > end) {
    [start, end] = [end, start];
  }

  let businessDaysCount = 0;
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    const formattedDate = formatDate({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    });

    if (dayOfWeek !== 0 && !holidays.value.includes(formattedDate)) {
      businessDaysCount++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDaysCount;
};

// Manejo de selección de rango de fechas
const onRangeEnd = (date) => {
  formVacation.value.fecha_inicio = formatDate(date.from);
  formVacation.value.fecha_termino = formatDate(date.to);
  formVacation.value.fecha_regreso = addBusinessDay(date.to);
  formVacation.value.dias_disfrute = countBusinessDays(date.from, date.to);
};

const getForms = async () => {
  const year = ref(new Date().getFullYear());
  let res = await sendRequest(
    "GET",
    null,
    "/api/vacationDay/forms/" + year.value,
    ""
  );
  empleados.value = res.empleados;
  sucursales.value = res.sucursales;
  puestos.value = res.puestos;
  departamentos.value = res.departamentos;
  empleadosAll.value = res.empleadosAll;
  holidays.value = res.festivos.map((date) => date.replace(/\//g, "-")); // Convertir a YYYY-MM-DD
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

const filterFnC = (val, update) => {
  if (val === "") {
    update(() => {
      filterEmpleadosC.value = empleadosAll.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterEmpleadosC.value = empleadosAll.value.filter(
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
    selectedEmpleado.value =
      empleados.value.find((empleado) => empleado?.id === newValue) || null;

    if (selectedEmpleado.value) {
      formVacation.value.sucursal_id =
        selectedEmpleado.value.sucursal_id || null;
      formVacation.value.departamento_id =
        selectedEmpleado.value.departamento_id || null;
      formVacation.value.puesto_id = selectedEmpleado.value.puesto_id || null;
      formVacation.value.anios_cumplidos =
        selectedEmpleado.value.aniosVacaciones.cumplidos || null;
      formVacation.value.dias_periodo =
        selectedEmpleado.value.aniosVacaciones.correspondientes || null;
      formVacation.value.subtotal_dias =
        selectedEmpleado.value.aniosVacaciones.subtotal || null;
      formVacation.value.periodo_correspondiente =
        selectedEmpleado.value.vacationPeriod || null;
      formVacation.value.vehiculo_utilitario = selectedEmpleado.value.vehicle
        ? selectedEmpleado.value.vehicle.placas
        : null || null;
      autoriza.value = selectedEmpleado.value.jefe_directo_id || null;
      notifica.value = selectedEmpleado.value.notificar_id || null;
    } else {
      formVacation.value.sucursal_id = null;
      formVacation.value.puesto_id = null;
      formVacation.value.departamento_id = null;
      formVacation.value.anios_cumplidos = null;
      formVacation.value.dias_periodo = null;
      formVacation.value.subtotal_dias = null;
      formVacation.value.periodo_correspondiente = null;
      formVacation.value.vehiculo_utilitario = null;
      autoriza.value = null;
      notifica.value = null;
    }
  }
);

const resetFormDates = () => {
  model.value = null;
  formVacation.value.fecha_inicio = null;
  formVacation.value.fecha_termino = null;
  formVacation.value.fecha_regreso = null;
};

const options = (dateStr) => {
  const today = new Date();
  const originalDate = new Date(dateStr);
  const currentYear = today.getFullYear();

  const thisYearDate = new Date(
    currentYear,
    originalDate.getMonth(),
    originalDate.getDate()
  );

  let startYear, endYear;

  if (thisYearDate <= today) {
    startYear = currentYear;
    endYear = currentYear + 1;
  } else {
    startYear = currentYear - 1;
    endYear = currentYear;
  }

  // Creamos fechas y les sumamos 1 día
  const startDate = new Date(
    startYear,
    originalDate.getMonth(),
    originalDate.getDate() + 1
  );
  const endDate = new Date(
    endYear,
    originalDate.getMonth(),
    originalDate.getDate()
  );

  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    dateArray.push(`${year}/${month}/${day}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms().then(() => {
    if (!vacation && usuario && usuario.empleado) {
      formVacation.value.empleado_id = usuario.empleado.id;
    } else if (
      formVacation.value.departamento_id == null &&
      vacation &&
      vacation.empleado
    ) {
      selectedEmpleado.value = vacation.empleado;
      formVacation.value.departamento_id =
        selectedEmpleado.value.departamento_id;
    }
    empleados.value.push(usuario.empleado);
  });
});

defineExpose({
  formVacation,
  validate,
});
</script>
