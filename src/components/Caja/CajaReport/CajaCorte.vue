<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        readonly
        dense
        v-model="formCorte.fecha_corte"
        @update:model-value="getData(formCorte.fecha_corte)"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="formCorte.fecha_corte"
                mask="YYYY-MM-DD"
                @update:model-value="getData(formCorte.fecha_corte)"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Cerrar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:after>
          <q-btn
            dense
            outline
            icon="fa-solid fa-file-arrow-down"
            @click="getReportExcel(formCorte.fecha_corte)"
          />
        </template>
      </q-input>
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-card>
        <q-tree :nodes="treeData" node-key="label" default-expand-all />
      </q-card>
    </q-item-section>
  </q-item>

  <q-item v-if="data.length != 0 && corte == null">
    <q-item-section>
      <q-card>
        <q-input
          v-model="formCorte.descripcion"
          outlined
          type="textarea"
          label="Comentarios"
        />
      </q-card>
    </q-item-section>
    <q-item-section class="col-4">
      <q-card>
        <q-list dense separator>
          <q-item class="bg-grey">
            <q-item-section><strong>Detalle efectivo</strong></q-item-section>
            <q-item-section class="col-4" align="right">
              <q-btn
                size="md"
                dense
                outline
                rounded
                label="Guardar Corte"
                color="green-10"
                @click="guardarCorte"
              />
            </q-item-section>
          </q-item>
          <q-item v-for="(denominacion, index) in denominaciones" :key="index">
            <q-item-section>{{ denominacion.nombre }}</q-item-section>
            <q-item-section>
              <q-input
                dense
                outlined
                type="number"
                v-model.number="formCorte.detalleEfectivo[index].cantidad"
              />
            </q-item-section>
            <q-item-section align="right">
              ${{
                (
                  formCorte.detalleEfectivo[index].cantidad * denominacion.valor
                ).toFixed(2)
              }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section><strong>Total efectivo</strong></q-item-section>
            <q-item-section align="right">
              <strong>${{ efectivoCaja?.toFixed(2) || "0.00" }}</strong>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section><strong>Diferencia</strong></q-item-section>
            <q-item-section align="right">
              <strong :class="diferenciaColor"
                >${{ diferencia.toFixed(2) }}</strong
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { date, useQuasar } from "quasar";
import { sendRequest } from "src/boot/functions";

const $q = useQuasar();
const timeStamp = Date.now();
const formattedString = ref(date.formatDate(timeStamp, "YYYY-MM-DD"));

const data = ref([]);
const treeData = ref([]);
const denominaciones = ref([]);
const efectivoCaja = ref(null);
const corte = ref(null);

const formCorte = ref({
  efectivo: 0,
  tarjeta_debito: 0,
  tarjeta_credito: 0,
  transferencias: 0,
  depositos: 0,
  cheques: 0,
  fecha_corte: formattedString.value,
  descripcion: null,
  detalleEfectivo: [],
});

const getData = async (fecha) => {
  const res = await sendRequest(
    "GET",
    null,
    "/api/caja/cajaTransaccion/report/" + fecha,
    ""
  );
  data.value = res.data;
  denominaciones.value = res.denominaciones;
  corte.value = res.corte;
};

watch(data, (newVal) => {
  if (!Array.isArray(newVal) || newVal.length === 0) {
    formCorte.value.efectivo = 0;
    formCorte.value.tarjeta_debito = 0;
    formCorte.value.tarjeta_credito = 0;
    formCorte.value.transferencias = 0;
    formCorte.value.depositos = 0;
    formCorte.value.cheques = 0;
    formCorte.value.descripcion = null;
    efectivoCaja.value = 0;

    formCorte.value.detalleEfectivo = denominaciones.value.map((d) => ({
      cantidad: 0,
      denominacion_id: d.id,
    }));

    treeData.value = [];
    return;
  }

  treeData.value = newVal.map((formaPago) => ({
    label: `💳 ${formaPago.nombre} - Total: $${formaPago.total.toFixed(2)}`,
    children: formaPago.transaccion.map((trx) => ({
      label: `🧾 Folio: ${trx.folio} | Factura: ${trx.factura} | Serie: ${
        trx.serie
      } | Total: $${trx.total.toFixed(2)} | Fecha: ${
        trx.fecha_pago
      } | Cuenta: ${trx.cuenta.caja_banco.nombre} ${trx.cuenta.numeroCuenta}`,
      children: trx.pagos.map((pago, idx) => ({
        label: `💰 Pago ${idx + 1}: $${parseFloat(pago.monto).toFixed(2)} - ${
          pago.sucursal.nombre
        } - ${pago.categoria.nombre} - ${pago.descripcion}`,
      })),
    })),
  }));

  newVal.forEach((fp) => {
    const nombre = fp.nombre.toLowerCase();
    const total = parseFloat(fp.total.toFixed(2));

    if (nombre.includes("efectivo")) formCorte.value.efectivo = total;
    else if (nombre.includes("débito") || nombre.includes("debito"))
      formCorte.value.tarjeta_debito = total;
    else if (nombre.includes("crédito") || nombre.includes("credito"))
      formCorte.value.tarjeta_credito = total;
    else if (nombre.includes("transferencia"))
      formCorte.value.transferencias = total;
    else if (nombre.includes("depósito") || nombre.includes("deposito"))
      formCorte.value.depositos = total;
    else if (nombre.includes("cheque")) formCorte.value.cheques = total;
  });
});

watch(denominaciones, (newVal) => {
  if (!newVal) return;
  formCorte.value.detalleEfectivo = newVal.map((d) => ({
    cantidad: 0,
    denominacion_id: d.id,
  }));
});

watch(
  () => formCorte.value.detalleEfectivo,
  (nuevoDetalle) => {
    const total = nuevoDetalle.reduce((acc, item, index) => {
      const valor = denominaciones.value[index]?.valor || 0;
      return acc + item.cantidad * valor;
    }, 0);
    efectivoCaja.value = parseFloat(total.toFixed(2));
  },
  { deep: true }
);

const getReportExcel = async (fecha) => {
  const res = await sendRequest(
    "GET",
    null,
    "/api/caja/cajaTransaccion/report/excel/" + fecha,
    ""
  );
  const base64Response = await fetch(
    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.file_base64}`
  );
  const blob = await base64Response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = res.file_name;
  link.click();
  URL.revokeObjectURL(url);
};

const validarCorteCaja = () => {
  for (const item of formCorte.value.detalleEfectivo) {
    if (
      item.cantidad === null ||
      item.cantidad === "" ||
      isNaN(item.cantidad)
    ) {
      return { ok: false, mensaje: "Hay cantidades vacías." };
    }
    if (item.cantidad < 0) {
      return { ok: false, mensaje: "Las cantidades no pueden ser negativas." };
    }
  }
  if (diferencia.value < 0) {
    return {
      ok: false,
      mensaje: "La diferencia no puede ser negativa para realizar el corte.",
    };
  }
  return { ok: true };
};

const diferenciaColor = computed(() => {
  if (diferencia.value < 0) return "text-negative";
  if (diferencia.value > 0) return "text-positive";
  return "text-grey-8";
});

const guardarCorte = async () => {
  const validacion = validarCorteCaja();
  if (!validacion.ok) {
    $q.notify({ type: "negative", message: validacion.mensaje });
    return;
  }
  const final = {
    ...formCorte.value,
  };
  let res = await sendRequest("POST", final, "/api/caja/cajaCorte", "");
  getData(formCorte.value.fecha_corte);
};

const diferencia = computed(() => {
  const efectivoReal = efectivoCaja.value ?? 0.0;
  const efectivoEsperado = formCorte.value.efectivo ?? 0.0;
  return parseFloat((efectivoReal - efectivoEsperado).toFixed(2));
});

onMounted(() => {
  getData(formCorte.value.fecha_corte);
});
</script>

<style scoped>
.q-input {
  background-color: #f0f4f8;
  border-radius: 8px;
}

.q-btn {
  transition: background-color 0.2s;
}

.q-btn:hover {
  background-color: #e0e0e0;
}

.q-icon {
  color: #1976d2;
}

.q-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1.5px solid #cfd8dc;
}

.q-item-section strong {
  font-weight: 600;
  color: #37474f;
}

.q-tree {
  background-color: #fafafa;
  border-radius: 8px;
}

.q-list {
  background-color: #fefefe;
  border-radius: 8px;
}

.q-list .q-item {
  transition: background-color 0.2s;
}

.q-list .q-item:hover {
  background-color: #f5f5f5;
}

.q-input[type="textarea"] {
  min-height: 80px;
}

.q-btn[color="green-10"] {
  font-weight: bold;
}

strong {
  font-weight: bold;
  color: #2e7d32;
}

@media screen and (max-width: 768px) {
  .q-item-section.col-4 {
    width: 100% !important;
  }
}
</style>
