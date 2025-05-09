<template>
  <q-item>
    <q-item-section>
      <q-input outlined readonly dense v-model="formattedString">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="formattedString" mask="YYYY-MM-DD">
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
            label="Consular corte"
            @click="getData(formattedString)"
          />
          <q-space></q-space>
          <q-btn
            dense
            outline
            icon="fa-solid fa-file-arrow-down"
            @click="getReportExcel(formattedString)"
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
</template>

<script setup>
import { ref, watch } from "vue";
import { date } from "quasar";
import { sendRequest } from "src/boot/functions";

const timeStamp = Date.now();
const formattedString = ref(date.formatDate(timeStamp, "YYYY-MM-DD"));

const data = ref(null);
const treeData = ref([]);

const getData = async (fecha) => {
  const res = await sendRequest(
    "GET",
    null,
    "/api/caja/cajaTransaccion/report/" + fecha,
    ""
  );
  data.value = res;
};

// Adaptar la data para q-tree
watch(data, (newVal) => {
  if (!newVal) return;

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
});

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

  // Creación de un enlace temporal para descargar el archivo con un nombre específico
  const link = document.createElement("a");
  link.href = url;
  link.download = res.file_name; // Nombre que se le asigna al archivo
  link.click();

  // Limpieza
  URL.revokeObjectURL(url);
};
</script>
