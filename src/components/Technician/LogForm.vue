<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          :disable="!checkRole('Servicio')"
          readonly
          v-model="formLog.fecha"
          mask="date"
          label="Fecha"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formLog.fecha" minimal>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          :disable="!checkRole('Servicio')"
          v-model="formLog.tecnico_id"
          :options="employees"
          label="Tecnico"
          option-value="id"
          option-label="nombreCompleto"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          hint
          :rules="[(val) => val !== null || 'Obligatorio']"
          @update:model-value="getOptions(formLog.tecnico_id)"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formLog.wo_id"
          :options="wos"
          label="Orden de trabajo"
          option-value="id"
          option-label="maquina"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          readonly
          label="Hora inicio"
          v-model="formLog.hora_inicio"
          mask="time"
          hint="Formato 24H"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="formLog.hora_inicio">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          readonly
          label="Hora termino"
          v-model="formLog.hora_termino"
          mask="time"
          hint="Formato 24H"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="formLog.hora_termino">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formLog.activity_technician_id"
          :options="types"
          label="Actividad"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formLog.comentarios"
          filled
          dense
          label="Comentarios"
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatTime } from "src/boot/formatFunctions";
import { checkRole } from "src/boot/functions";

const { employee, log, day } = defineProps(["employee", "log", "day"]);

const wos = ref([]);
const types = ref([]);
const employees = ref([]);

const myForm = ref(null);

const getCurrentDate = (dia) => {
  if (!dia) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
  } else {
    return dia;
  }
};

const formLog = ref({
  id: log ? log.id : null,
  fecha: log ? log.fecha : getCurrentDate(day),
  hora_inicio: log ? formatTime(log.hora_inicio) : null,
  hora_termino: log ? formatTime(log.hora_termino) : null,
  comentarios: log ? log.comentarios : null,
  activity_technician_id: log ? log.activity_technician_id : null,
  tecnico_id: log ? log.tecnico_id : employee ? employee.id : null,
  wo_id: log ? log.wo_id : null,
});

const getOptions = async (id) => {
  if (id) {
    let res = await sendRequest(
      "GET",
      null,
      "/api/techniciansLog/options/" + id,
      ""
    );
    wos.value = res.wos;
    types.value = res.types;
  } else {
    wos.value = [];
    types.value = [];
  }
};

const getTechnician = async () => {
  let res = await sendRequest("GET", null, "/api/tech", "");
  employees.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getTechnician();
  if (employee) {
    getOptions(employee.id);
  } else if (log) {
    getOptions(log.tecnico_id);
  }
});

defineExpose({
  formLog,
  validate,
});
</script>
