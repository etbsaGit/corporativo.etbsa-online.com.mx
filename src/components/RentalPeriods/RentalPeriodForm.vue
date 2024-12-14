<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formPeriod.cliente_id"
          :options="filterClientes"
          label="Cliente"
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
                <q-btn
                  outline
                  dense
                  color="primary"
                  icon="add"
                  label="Click para agregar cliente nuevo"
                  @click="showAdd = true"
                />
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:after>
            <q-item v-if="selectedCliente">
              <q-item-section side>
                <q-item-label>
                  <strong>RFC:</strong>
                  {{ selectedCliente.rfc }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  <strong>CURP:</strong>
                  {{ selectedCliente.curp }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  <strong>Telefono:</strong>
                  {{ formatPhoneNumber(selectedCliente.telefono) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                {{ scope.opt.nombre }}
              </q-item-section>
              <q-item-section>
                Telefono: {{ formatPhoneNumber(scope.opt.telefono) }}
              </q-item-section>
              <q-item-section> RFC: {{ scope.opt.rfc }} </q-item-section>
              <q-item-section> CURP: {{ scope.opt.curp }} </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formPeriod.empleado_id"
          :options="filterEmpleados"
          label="Empleado o vendedor"
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
          @filter="filterFnE"
          input-debounce="0"
          behavior="menu"
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Sin resultados
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                {{ scope.opt.nombreCompleto }}
              </q-item-section>
              <q-item-section>
                Telefono: {{ formatPhoneNumber(scope.opt.telefono) }}
              </q-item-section>
              <q-item-section>
                Sucursal: {{ scope.opt.sucursal.nombre }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formPeriod.folio"
          outlined
          dense
          label="Folio"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formPeriod.rental_machine_id"
          :options="machines"
          label="Maquinas"
          option-value="id"
          option-label="model"
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
          outlined
          dense
          v-model="formPeriod.rental_value"
          prefix="$"
          label="Valor de renta"
          hint
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          input-class="text-right"
        />
      </q-item-section>
      <q-item-section>
        <q-file
          clearable
          color="secondary"
          dense
          outlined
          hint
          v-model="formPeriod.file"
          label="Subir documento o contrato"
          lazy-rules
          accept=".jpg, .jpeg, .png, .pdf"
          @clear="formPeriod.base64 = null"
          @input="convertirFile($event)"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          readonly
          outlined
          dense
          v-model="formPeriod.start_date"
          mask="date"
          label="Fecha de inicio"
          hint
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formPeriod.start_date">
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
        <q-input
          readonly
          outlined
          dense
          v-model="formPeriod.end_date"
          mask="date"
          label="Fecha de termino"
          hint
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formPeriod.end_date">
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
        <q-input
          v-model="formPeriod.billing_day"
          outlined
          dense
          label="Dia del mes para facturacion"
          lazy-rules
          mask="##"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formPeriod.comments"
          outlined
          dense
          label="Comentarios"
          lazy-rules
        />
      </q-item-section>
    </q-item>
  </q-form>

  <q-dialog
    v-model="showAdd"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    full-width
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <cliente-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/formatFunctions";

import ClienteForm from "src/components/Cliente/ClienteForm.vue";

const { rentalPeriod } = defineProps(["rentalPeriod"]);

const myForm = ref(null);
const filterClientes = ref(null);
const selectedCliente = ref(null);
const machines = ref([]);
const clientes = ref([]);
const empleados = ref([]);
const filterEmpleados = ref(null);

const showAdd = ref(false);
const add = ref(null);

const formPeriod = ref({
  id: rentalPeriod ? rentalPeriod.id : null,
  folio: rentalPeriod ? rentalPeriod.folio : null,
  start_date: rentalPeriod ? rentalPeriod.start_date : null,
  end_date: rentalPeriod ? rentalPeriod.end_date : null,
  billing_day: rentalPeriod ? rentalPeriod.billing_day : null,
  rental_value: rentalPeriod ? rentalPeriod.rental_value : null,
  comments: rentalPeriod ? rentalPeriod.comments : null,
  empleado_id: rentalPeriod ? rentalPeriod.empleado_id : null,
  cliente_id: rentalPeriod ? rentalPeriod.cliente_id : null,
  rental_machine_id: rentalPeriod ? rentalPeriod.rental_machine_id : null,
  base64: null,
  file: [],
});

const getMachines = async () => {
  let res = await sendRequest("GET", null, "/api/rentalMachines/all", "");
  machines.value = res.rentalMachinesOn;
  clientes.value = res.clientes;
  empleados.value = res.empleados;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formCliente,
  };
  let res = await sendRequest("POST", final, "/api/intranet/cliente", "");
  showAdd.value = false;
  getMachines();
};

const convertirFile = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formPeriod.value.base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formPeriod.value.base64.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterClientes.value = clientes.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterClientes.value = clientes.value.filter(
      (customer) => customer.nombre.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterFnE = (val, update) => {
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
  () => formPeriod.value.cliente_id,
  (newValue) => {
    selectedCliente.value =
      clientes.value.find((cliente) => cliente.id === newValue) || null;
  }
);

onMounted(() => {
  getMachines();
});

defineExpose({
  formPeriod,
  validate,
});
</script>
