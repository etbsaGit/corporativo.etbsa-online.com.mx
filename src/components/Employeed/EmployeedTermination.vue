<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formTermination.reason_id"
          :options="reasons"
          label="Motivo de baja"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formTermination.date"
          mask="date"
          label="Fecha de baja"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formTermination.date">
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
          v-model="formTermination.estatus_id"
          :options="estatus"
          label="Tipo de baja"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTermination.comments"
          filled
          dense
          label="Comentarios"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
const { empleado } = defineProps(["empleado"]);

const estatus = ref([]);
const reasons = ref([]);
const myForm = ref(null);

const formTermination = ref({
  reason_id:
    empleado && empleado.termination ? empleado.termination.reason_id : null,
  comments:
    empleado && empleado.termination ? empleado.termination.comments : null,
  date: empleado && empleado.termination ? empleado.termination.date : null,
  estatus_id:
    empleado && empleado.termination ? empleado.termination.estatus_id : null,
});

const getEstatus = async () => {
  let res = await sendRequest("GET", null, "/api/estatus/termination", "");
  estatus.value = res;
};

const getReason = async () => {
  let res = await sendRequest("GET", null, "/api/estatus/terminationType", "");
  reasons.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getEstatus();
  getReason();
});

defineExpose({
  formTermination,
  validate,
});
</script>
