<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="formReport.category_ids"
        :options="categorias"
        option-value="id"
        option-label="nombre"
        label="Categoria"
        multiple
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        outlined
        dense
      />
    </q-item-section>
    <q-item-section>
      <q-input outlined readonly dense v-model="formReport.fecha">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="formReport.fecha" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Cerrar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-item-section>
    <q-item-section class="col-2">
      <q-btn
        dense
        outline
        label="Consular reporte"
        @click="getData(formattedString)"
      />
    </q-item-section>
    <q-item-section class="col-2">
      <q-btn
        dense
        outline
        icon="fa-solid fa-file-arrow-down"
        @click="getReportPdf(formattedString)"
      />
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
import { ref, watch, onMounted } from "vue";
import { date } from "quasar";
import { sendRequest } from "src/boot/functions";

const timeStamp = Date.now();
const formattedString = ref(date.formatDate(timeStamp, "YYYY-MM-DD"));

const data = ref(null);
const treeData = ref([]);
const categorias = ref([]);

const formReport = ref({
  category_ids: [],
  fecha: formattedString.value,
});

const getCategorias = async () => {
  let res = await sendRequest("GET", null, "/api/caja/cajaCategorias/all", "");
  categorias.value = res;
};

const getData = async () => {
  const final = {
    ...formReport.value,
  };
  const res = await sendRequest(
    "POST",
    final,
    "/api/caja/cajaTransaccion/report/category",
    ""
  );
  data.value = res;
};

watch(data, (newVal) => {
  if (!newVal) return;

  treeData.value = newVal.map((categoria) => ({
    label: `📦 ${categoria.nombre} - Total: $${categoria.monto.toFixed(2)}`,
    children: categoria.pagos.map((pago, idx) => ({
      label: `💰 Factura: ${pago.transaccion?.factura || "N/A"}: $${parseFloat(
        pago.monto
      ).toFixed(2)} - ${pago.sucursal?.nombre || "Sucursal desconocida"} - ${
        pago.descripcion
      } - Cliente: ${pago.transaccion?.cliente?.nombre || "Desconocido"}`,
    })),
  }));
});

const getReportPdf = async (fecha) => {
  const final = {
    ...formReport.value,
  };
  const res = await sendRequest(
    "POST",
    final,
    "/api/caja/cajaTransaccion/report/pdf",
    ""
  );
  const base64Response = await fetch(`data:application/pdf;base64,${res}`);

  const blob = await base64Response.blob();
  const url = URL.createObjectURL(blob);

  // Creación de un enlace temporal para descargar el archivo con un nombre específico
  const link = document.createElement("a");
  link.href = url;
  link.download = "Reporte de ventas del dia" + fecha; // Nombre que se le asigna al archivo
  link.click();

  // Limpieza
  URL.revokeObjectURL(url);
};

onMounted(() => {
  getCategorias();
});
</script>

