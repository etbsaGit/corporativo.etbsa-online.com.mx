<template>
  <q-form ref="myForm" greedy>
    <q-item dense>
      <q-item-section>
        <q-select
          v-model="formTransaccion.cliente_id"
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
            <q-item dense>
              <q-item-section>
                <q-btn
                  outline
                  flat
                  color="primary"
                  icon="add"
                  label="Agregar cliente"
                  @click="showAdd = true"
                />
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
    <q-item dense>
      <q-item-section>
        <q-input
          v-model="formTransaccion.factura"
          outlined
          dense
          label="Factura"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formTransaccion.tipo_factura_id"
          :options="tiposFacturas"
          option-value="id"
          option-label="nombre"
          label="Tipo de factura"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formTransaccion.folio"
          outlined
          dense
          label="Folio"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item dense>
      <q-item-section>
        <q-input
          v-model="formTransaccion.serie"
          outlined
          dense
          label="Serie"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formTransaccion.uuid"
          outlined
          dense
          label="UUID"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item dense>
      <q-item-section>
        <q-input
          outlined
          dense
          readonly
          v-model="formTransaccion.fecha_pago"
          mask="date"
          label="Fecha del pago"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formTransaccion.fecha_pago" minimal>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="gray" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formTransaccion.cuenta_id"
          :options="cuentas"
          option-value="id"
          option-label="numeroCuenta"
          label="Cuenta"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
          behavior="dialog"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                Cuenta: {{ scope.opt.numeroCuenta }}
              </q-item-section>
              <q-item-section>
                Banco: {{ scope.opt.caja_banco?.nombre }}
              </q-item-section>
              <q-item-section>
                Sucursal: {{ scope.opt.sucursal?.nombre }}
              </q-item-section>
              <q-item-section>
                Categoria: {{ scope.opt.categoria?.nombre }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formTransaccion.tipo_pago_id"
          :options="tiposPagos"
          option-value="id"
          option-label="nombre"
          label="Tipo de pago"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item dense>
      <q-item-section>
        <q-input
          outlined
          dense
          readonly
          v-model="totalFactura"
          prefix="$"
          label="Total factura"
          hint
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          input-class="text-right"
          :rules="[
            (val) =>
              (val != null && val !== '' && parseFloat(val) !== 0) ||
              'El monto debe ser mayor que 0',
          ]"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formTransaccion.comentarios"
          outlined
          dense
          type="textarea"
          label="Comentarios"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
    <q-item dense>
      <q-item-section>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar pago"
          @click="addPago"
        />
      </q-item-section>
    </q-item>
    <q-item v-for="(pago, index) in formTransaccion.pagos" :key="index">
      <q-item-section>
        <q-card>
          <q-card-actions align="right">
            <q-btn
              align="left"
              icon="delete"
              size="sm"
              color="red"
              label="Eliminar pago"
              filled
              dense
              @click="eliminarPago(pago, index)"
            />
          </q-card-actions>
          <q-item>
            <q-item-section>
              <q-input
                outlined
                dense
                v-model="pago.monto"
                prefix="$"
                label="Monto"
                hint
                mask="#.##"
                fill-mask="0"
                reverse-fill-mask
                input-class="text-right"
                :rules="[
                  (val) =>
                    (val != null && val !== '' && parseFloat(val) !== 0) ||
                    'El monto debe ser mayor que 0',
                ]"
              />
            </q-item-section>

            <q-item-section>
              <q-select
                v-model="pago.sucursal_id"
                :options="sucursales"
                option-value="id"
                option-label="nombre"
                label="Sucursal"
                option-disable="inactive"
                emit-value
                map-options
                transition-show="jump-up"
                transition-hide="jump-up"
                outlined
                dense
                :rules="[(val) => val !== null || 'Obligatorio']"
              />
            </q-item-section>
            <q-item-section>
              <q-select
                v-model="pago.categoria_id"
                :options="categorias"
                option-value="id"
                option-label="nombre"
                label="Departamento"
                option-disable="inactive"
                emit-value
                map-options
                transition-show="jump-up"
                transition-hide="jump-up"
                outlined
                dense
                :rules="[(val) => val !== null || 'Obligatorio']"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input
                v-model="pago.descripcion"
                outlined
                dense
                label="Descripcion de la compra"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
              />
            </q-item-section>
          </q-item>
        </q-card>
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
import { ref, onMounted, computed } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/formatFunctions";

import ClienteForm from "src/components/Cliente/ClienteForm.vue";

const { transaccion } = defineProps(["transaccion"]);

const myForm = ref(null);

const clientes = ref([]);
const filterClientes = ref([]);
const tiposFacturas = ref([]);
const sucursales = ref([]);
const categorias = ref({});
const cuentas = ref([]);
const tiposPagos = ref({});

const showAdd = ref(false);
const add = ref(null);

const formTransaccion = ref({
  id: transaccion ? transaccion.id : null,
  factura: transaccion ? transaccion.factura : null,
  folio: transaccion ? transaccion.folio : null,
  serie: transaccion ? transaccion.serie : null,
  uuid: transaccion ? transaccion.uuid : null,
  comentarios: transaccion ? transaccion.comentarios : null,
  validado: transaccion ? transaccion.validado : 0,
  cliente_id: transaccion ? transaccion.cliente_id : null,
  tipo_factura_id: transaccion ? transaccion.tipo_factura_id : null,
  cuenta_id: transaccion ? transaccion.cuenta_id : null,
  fecha_pago: transaccion ? transaccion.fecha_pago : null,
  tipo_pago_id: transaccion ? transaccion.tipo_pago_id : null,
  pagos: transaccion ? transaccion.pagos : [],
});

const addPago = () => {
  formTransaccion.value.pagos.push({
    monto: null,
    descripcion: null,
    sucursal_id: null,
    categoria_id: null,
  });
};

const getForms = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/caja/cajaTransaccion/forms",
    ""
  );
  clientes.value = res.clientes;
  tiposFacturas.value = res.tipos_factura;
  sucursales.value = res.sucursales;
  categorias.value = res.categorias;
  cuentas.value = res.cuentas;
  tiposPagos.value = res.tipos_pago;
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
      (cliente) => cliente?.nombre.toLowerCase().indexOf(needle) > -1
    );
  });
};

const eliminarPago = async (pago, index) => {
  if (pago.id) {
    let res = await sendRequest(
      "DELETE",
      null,
      "/api/caja/cajaPago/" + pago.id,
      ""
    );
  }
  formTransaccion.value.pagos.splice(index, 1);
};

const totalFactura = computed(() => {
  return formTransaccion.value.pagos
    .reduce((acc, pago) => {
      const monto = parseFloat(pago.monto);
      return acc + (isNaN(monto) ? 0 : monto);
    }, 0)
    .toFixed(2); // Opcional: toFixed para mostrar dos decimales
});

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
  getForms();
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formTransaccion,
  validate,
});
</script>
