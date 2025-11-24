<template>
  <q-item dense v-if="selectedEmpleado">
    <q-item-section>
      <q-chip
        class="glossy"
        :icon="iconChip"
        :color="colorChip"
        text-color="white"
        :label="mensajePermiso"
      />
    </q-item-section>
  </q-item>
  <q-form ref="myForm" greedy>
    <q-item dense>
      <!-- 👤 Empleado -->
      <q-item-section>
        <q-select
          v-model="formPermiso.empleado_id"
          :options="filterEmpleados"
          label="Empleado"
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
          @filter="filterFn"
          input-debounce="0"
          behavior="menu"
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <template v-slot:no-option>
            <q-item dense>
              <q-item-section class="text-grey">Sin opciones</q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>

      <!-- 🏢 Sucursal (readonly) -->
      <q-item-section>
        <q-select
          v-model="formPermiso.sucursal_id"
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
    </q-item>
    <q-item dense>
      <!-- 📅 Fecha -->
      <q-item-section>
        <q-input
          outlined
          v-model="formPermiso.date"
          mask="date"
          :rules="['date']"
          readonly
          dense
          label="Fecha"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formPermiso.date" minimal :options="options">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>

      <!-- ⏰ Hora inicio -->
      <q-item-section>
        <q-input
          outlined
          readonly
          dense
          v-model="formPermiso.start"
          mask="time"
          :rules="['time']"
          label="Hora inicio"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="formPermiso.start" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>

      <!-- 🕓 Hora fin (auto +2h) -->
      <q-item-section>
        <q-input
          outlined
          dense
          v-model="formPermiso.end"
          mask="time"
          :rules="['time']"
          label="Hora fin"
          disable
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="formPermiso.end" format24h readonly>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <!-- <q-item dense> -->
    <!-- 🥗 Lunch Start -->
    <!-- <q-item-section>
        <q-input
          outlined
          dense
          v-model="formPermiso.lunch_start"
          mask="time"
          label="Inicio comida"
          readonly
          hint="Solo si se junta con el permiso de 2 horas"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="formPermiso.lunch_start" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section> -->

    <!-- 🥗 Lunch End (+1h auto) -->
    <!-- <q-item-section>
        <q-input
          outlined
          dense
          v-model="formPermiso.lunch_end"
          mask="time"
          :rules="['time']"
          label="Fin comida"
          disable
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="formPermiso.lunch_end" format24h readonly>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section> -->
    <!-- </q-item> -->

    <q-item>
      <q-item-section>
        <q-input
          v-model="formPermiso.description"
          outlined
          dense
          label="Descripcion"
          type="textarea"
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { checkRole, sendRequest } from "src/boot/functions";

const { permiso } = defineProps(["permiso"]);

const myForm = ref(null);
const filterEmpleados = ref(null);
const empleados = ref([]);
const sucursales = ref([]);
const selectedEmpleado = ref(null);

const formPermiso = ref({
  id: permiso ? permiso.id : null,
  date: permiso ? permiso.date : null,
  start: permiso ? permiso.start : null,
  end: permiso ? permiso.end : null,
  lunch_start: permiso ? permiso.lunch_start : null,
  lunch_end: permiso ? permiso.lunch_end : null,
  status: permiso ? permiso.status : null,
  description: permiso ? permiso.description : null,
  empleado_id: permiso ? permiso.empleado_id : null,
  sucursal_id: permiso ? permiso.sucursal_id : null,
});

const getForms = async () => {
  const res = await sendRequest("GET", null, "/api/salidaPermiso/forms", "");
  empleados.value = res.empleados;
  sucursales.value = res.sucursales;
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
    filterEmpleados.value = empleados.value.filter((empleado) =>
      empleado?.nombreCompleto.toLowerCase().includes(needle)
    );
  });
};

onMounted(() => {
  getForms().then(() => {
    // Si viene un permiso (editar), asignar el empleado al selectedEmpleado
    if (permiso && permiso.empleado_id) {
      selectedEmpleado.value = empleados.value.find(
        (e) => e.id === permiso.empleado_id
      );
    }
  });
});

const options = (date) => {
  const esRH = checkRole("RRHH");

  // ✅ Si es RRHH, NO hay restricciones
  if (esRH) return true;

  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const hoyStr = `${yyyy}/${mm}/${dd}`;

  // Si no hay empleado seleccionado → solo bloquear días pasados
  if (!selectedEmpleado.value) {
    return date >= hoyStr;
  }

  const diasNegativos = selectedEmpleado.value.nuevoPermiso;

  // Empleado normal con días negativos → aplicar restricción
  if (diasNegativos < 0) {
    const nuevaFecha = new Date(hoy);
    nuevaFecha.setDate(nuevaFecha.getDate() + Math.abs(diasNegativos));

    const yyyy2 = nuevaFecha.getFullYear();
    const mm2 = String(nuevaFecha.getMonth() + 1).padStart(2, "0");
    const dd2 = String(nuevaFecha.getDate()).padStart(2, "0");
    const fechaMinima = `${yyyy2}/${mm2}/${dd2}`;

    return date >= fechaMinima;
  }

  // Empleado normal sin bloqueo
  return date >= hoyStr;
};

const mensajePermiso = computed(() => {
  if (!selectedEmpleado.value) return "";

  const dias = selectedEmpleado.value.nuevoPermiso; // o .diaspermiso, según tu campo real

  if (dias < 0) {
    return `Días restantes para pedir permiso a partir de hoy: ${Math.abs(
      dias
    )} días`;
  } else {
    return `El último permiso fue hace ${dias} día${dias === 1 ? "" : "s"}`;
  }
});

const colorChip = computed(() => {
  if (!selectedEmpleado.value) return "grey";
  return selectedEmpleado.value.nuevoPermiso < 0 ? "red" : "green";
});

const iconChip = computed(() => {
  if (!selectedEmpleado.value) return "info";
  return selectedEmpleado.value.nuevoPermiso < 0 ? "warning" : "event";
});

// ⏰ start → end (+2h)
watch(
  () => formPermiso.value.start,
  (newVal) => {
    if (!newVal) return;
    const [hours, minutes] = newVal.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setHours(date.getHours() + 2);
    formPermiso.value.end =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");
  }
);

// 🥗 lunch_start → lunch_end (+1h)
watch(
  () => formPermiso.value.lunch_start,
  (newVal) => {
    if (!newVal) return;
    const [hours, minutes] = newVal.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setHours(date.getHours() + 1);
    formPermiso.value.lunch_end =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");
  }
);

watch(
  () => formPermiso.value.empleado_id,
  (newVal) => {
    if (!newVal) {
      selectedEmpleado.value = null;
      return;
    }

    selectedEmpleado.value =
      empleados.value.find((emp) => emp.id === newVal) || null;
  }
);
watch(
  () => formPermiso.value.empleado_id,
  (newVal) => {
    if (!newVal) {
      selectedEmpleado.value = null;
      formPermiso.value.sucursal_id = null;
      return;
    }

    const empleadoSeleccionado =
      empleados.value.find((emp) => emp.id === newVal) || null;

    selectedEmpleado.value = empleadoSeleccionado;

    if (empleadoSeleccionado) {
      // ✅ Copiamos la sucursal_id del empleado al permiso
      formPermiso.value.sucursal_id = empleadoSeleccionado.sucursal_id;
    }
  }
);

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formPermiso,
  validate,
});
</script>
