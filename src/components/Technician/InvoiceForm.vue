<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formInvoice.folio"
          filled
          dense
          label="Folio"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formInvoice.cantidad"
          prefix="$"
          label="Monto"
          hint
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          input-class="text-right"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formInvoice.horas_facturadas"
          filled
          dense
          label="Horas facturadas"
          mask="######"
          :rules="[(val) => (val && val > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formInvoice.fecha"
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
                <q-date v-model="formInvoice.fecha" minimal>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formInvoice.wo_id"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formInvoice.comentarios"
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

const { invoice, employee } = defineProps(["invoice", "employee"]);

const wos = ref([]);

const myForm = ref(null);

const formInvoice = ref({
  id: invoice ? invoice.id : null,
  folio: invoice ? invoice.folio : null,
  cantidad: invoice ? invoice.cantidad : null,
  fecha: invoice ? invoice.fecha : null,
  horas_facturadas: invoice ? invoice.horas_facturadas : null,
  comentarios: invoice ? invoice.comentarios : null,
  tecnico_id: invoice ? invoice.tecnico_id : employee.id,
  wo_id: invoice ? invoice.wo_id : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/techniciansInvoice/wo/" + employee.id,
    ""
  );
  wos.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formInvoice,
  validate,
});
</script>
