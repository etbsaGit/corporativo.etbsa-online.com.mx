<template>
  <q-card flat bordered class="q-pa-none bg-grey-1">
    <!-- Encabezado de la Orden -->
    <q-card-section class="bg-primary text-white q-py-sm q-px-md">
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-x-sm">
          <q-avatar
            icon="receipt_long"
            color="white"
            text-color="primary"
            size="40px"
          />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Orden de Compra #{{ service?.id }}
            </div>
            <div class="text-caption text-blue-1">
              Fecha:
              <strong>{{ formatFecha(service?.fecha_elaboracion) }}</strong>
              <span v-if="service?.orden_compra || service?.id">
                &bull; OC:
                <strong>{{ service.orden_compra || service.id }}</strong>
              </span>
              <span v-if="service?.autorizacion_compras">
                &bull; Aut. Compras:
                <strong>{{ service.autorizacion_compras }}</strong>
              </span>
            </div>
          </div>
        </div>
        <div class="row items-center q-gutter-x-md">
          <q-btn
            v-if="service?.cotizacion_url"
            unelevated
            dense
            color="white"
            text-color="negative"
            icon="picture_as_pdf"
            label="Ver Cotización"
            class="q-px-sm text-weight-bold"
            @click="openPdf(service.cotizacion_url)"
          >
            <q-tooltip>Abrir documento de cotización en PDF</q-tooltip>
          </q-btn>
          <div class="text-right">
            <div class="text-caption text-blue-1">Total Invertido</div>
            <div class="text-h6 text-weight-bolder text-white">
              {{ formatCurrency(orderTotals.total) }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-md">
      <!-- Datos de la Unidad y de la Orden -->
      <div class="row q-col-gutter-md q-mb-md">
        <!-- Tarjeta Unidad -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section
              class="q-py-xs q-px-md bg-grey-2 text-subtitle2 text-weight-bold text-primary flex items-center"
            >
              <q-icon name="directions_car" class="q-mr-xs" size="18px" />
              Datos de la Unidad
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <div class="text-caption text-grey-7">Placas Actuales</div>
                  <div class="text-body1 text-weight-bold text-primary">
                    {{ service?.vehicle?.placas || "S/P" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Tipo de Vehículo</div>
                  <div class="text-body2 text-weight-medium">
                    {{ service?.vehicle?.estatus?.nombre || "No definido" }}
                  </div>
                </div>
                <div class="col-12">
                  <div class="text-caption text-grey-7">Serie (VIN)</div>
                  <div class="text-body2 text-weight-bold font-mono">
                    {{ service?.vehicle?.serie || "Sin serie" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Sucursal Unidad</div>
                  <div class="text-body2">
                    {{ service?.vehicle?.sucursal?.nombre || "-" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">
                    Departamento Unidad
                  </div>
                  <div class="text-body2">
                    {{ service?.vehicle?.departamento?.nombre || "-" }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tarjeta Datos Administrativos -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="full-height bg-white">
            <q-card-section
              class="q-py-xs q-px-md bg-grey-2 text-subtitle2 text-weight-bold text-primary flex items-center"
            >
              <q-icon name="business" class="q-mr-xs" size="18px" />
              Información Administrativa y Cargo
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <div class="text-caption text-grey-7">Proveedor / Taller</div>
                  <div class="text-body2 text-weight-bold text-dark">
                    {{ service?.proveedor?.nombre || "No especificado" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Aut. Compras</div>
                  <div class="text-body2 text-weight-medium">
                    {{ service?.autorizacion_compras || "-" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Factura</div>
                  <div class="text-body2 text-weight-medium">
                    {{ service?.factura || "Sin factura" }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Sucursal Cargo</div>
                  <div class="text-body2">
                    {{
                      service?.sucursal_cargo?.nombre ||
                      service?.sucursalCargo?.nombre ||
                      "-"
                    }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-7">Departamento Cargo</div>
                  <div class="text-body2">
                    {{
                      service?.departamento_cargo?.nombre ||
                      service?.departamentoCargo?.nombre ||
                      "-"
                    }}
                  </div>
                </div>
                <div class="col-12">
                  <div class="text-caption text-grey-7">
                    Empleado Solicitante
                  </div>
                  <div class="text-body2">
                    {{
                      service?.solicitante?.nombreCompleto || "No registrado"
                    }}
                  </div>
                </div>
                <div class="col-12" v-if="service?.cotizacion_url">
                  <div class="text-caption text-grey-7">Cotización (PDF)</div>
                  <q-btn
                    dense
                    outline
                    color="negative"
                    icon="picture_as_pdf"
                    label="Ver Cotización (PDF)"
                    size="sm"
                    class="q-mt-xs"
                    @click="openPdf(service.cotizacion_url)"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Desplegable: Servicios Realizados en la Orden -->
      <q-card flat bordered class="bg-white q-mb-md">
        <q-expansion-item
          default-opened
          header-class="bg-grey-2 text-primary"
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar
                icon="handyman"
                color="primary"
                text-color="white"
                size="30px"
              />
            </q-item-section>
            <q-item-section>
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center"
              >
                Desglose de Conceptos de la Orden
                <q-badge color="primary" class="q-ml-sm">
                  {{ detallesList.length }}
                </q-badge>
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="text-caption text-grey-8">
                Total:
                <strong class="text-positive">{{
                  formatCurrency(orderTotals.total)
                }}</strong>
              </div>
            </q-item-section>
          </template>

          <q-separator />
          <q-markup-table flat dense separator="horizontal">
            <thead>
              <tr class="bg-grey-1 text-grey-8">
                <th class="text-left">Tipo de Concepto</th>
                <th class="text-left">Concepto</th>
                <th class="text-left">Descripción</th>
                <th class="text-center">Llanta</th>
                <th class="text-right">Kilometraje</th>
                <th class="text-center">Cant.</th>
                <th class="text-right">P. Unitario</th>
                <th class="text-right">Subtotal</th>
                <th class="text-right">IVA</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="det in detallesList" :key="det.id">
                <td>
                  <q-badge color="primary" class="q-px-sm">
                    {{
                      det.servicio?.tipo_servicio?.nombre ||
                      det.servicio?.tipoServicio?.nombre ||
                      "General"
                    }}
                  </q-badge>
                </td>
                <td class="text-weight-bold text-primary">
                  {{ det.servicio?.nombre || "Servicio" }}
                </td>
                <td style="max-width: 240px; white-space: normal">
                  {{ det.descripcion }}
                </td>
                <td class="text-center">
                  <q-badge
                    v-if="
                      det.llanta_anchura || det.llanta_altura || det.llanta_rin
                    "
                    color="indigo-7"
                    outline
                  >
                    {{ det.llanta_anchura || "-" }}/{{
                      det.llanta_altura || "-"
                    }}
                    R{{ det.llanta_rin || "-" }}
                  </q-badge>
                  <span v-else class="text-caption text-grey-5">-</span>
                </td>
                <td class="text-right text-weight-medium">
                  {{
                    det.km_evento
                      ? `${Number(det.km_evento).toLocaleString("es-MX")} km`
                      : "N/A"
                  }}
                </td>
                <td class="text-center">
                  {{ det.cantidad || "-" }}
                </td>
                <td class="text-right">
                  {{
                    det.precio_unitario
                      ? formatCurrency(det.precio_unitario)
                      : "-"
                  }}
                </td>
                <td class="text-right">{{ formatCurrency(det.subtotal) }}</td>
                <td class="text-right">{{ formatCurrency(det.iva) }}</td>
                <td class="text-right text-weight-bold text-positive">
                  {{ formatCurrency(det.total) }}
                </td>
              </tr>
              <tr class="bg-green-1 text-weight-bold">
                <td colspan="7" class="text-right">TOTALES DE LA ORDEN:</td>
                <td class="text-right">
                  {{ formatCurrency(orderTotals.subtotal) }}
                </td>
                <td class="text-right">
                  {{ formatCurrency(orderTotals.iva) }}
                </td>
                <td
                  class="text-right text-positive text-subtitle2 text-weight-bolder"
                >
                  {{ formatCurrency(orderTotals.total) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-expansion-item>
      </q-card>

      <!-- Desplegable: Bitácora de Acciones y Movimientos -->
      <q-card flat bordered class="bg-white">
        <q-expansion-item
          default-opened
          header-class="bg-grey-2 text-primary"
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar
                icon="history"
                color="blue-8"
                text-color="white"
                size="30px"
              />
            </q-item-section>
            <q-item-section>
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center"
              >
                Bitácora de Movimientos
                <q-badge color="blue-8" class="q-ml-sm">
                  {{ bitacoraList.length }}
                </q-badge>
              </div>
            </q-item-section>
            <q-item-section side>
              <div
                v-if="bitacoraList.length > 0"
                class="text-caption text-grey-7"
              >
                Último:
                <span class="text-weight-bold">{{
                  bitacoraList[0]?.estatus?.nombre || "Registrado"
                }}</span>
              </div>
            </q-item-section>
          </template>

          <q-separator />

          <div
            v-if="bitacoraList.length === 0"
            class="q-pa-md text-center text-grey-6"
          >
            <q-icon name="history_toggle_off" size="28px" class="q-mb-xs" />
            <div class="text-caption">
              No hay registros en la bitácora de esta orden.
            </div>
          </div>

          <q-markup-table v-else flat dense separator="horizontal">
            <thead>
              <tr class="bg-grey-1 text-grey-8">
                <th class="text-left" style="width: 175px">Fecha y Hora</th>
                <th class="text-left" style="width: 140px">Estatus</th>
                <th class="text-left" style="width: 250px">
                  Usuario / Empleado
                </th>
                <th class="text-left">Comentarios</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in bitacoraList" :key="item.id">
                <td class="text-caption font-mono">
                  <q-icon
                    name="schedule"
                    size="14px"
                    class="q-mr-xs text-grey-7"
                  />
                  {{ formatFechaHora(item.created_at) }}
                </td>
                <td>
                  <q-badge
                    :style="
                      item.estatus?.color
                        ? { backgroundColor: item.estatus.color }
                        : null
                    "
                    :color="!item.estatus?.color ? 'primary' : null"
                    class="q-px-sm"
                  >
                    {{ item.estatus?.nombre || "Sin estatus" }}
                  </q-badge>
                </td>
                <td>
                  <div class="text-weight-medium text-dark flex items-center">
                    <q-icon
                      :name="item.user?.empleado ? 'badge' : 'person'"
                      size="16px"
                      class="q-mr-xs text-grey-7"
                    />
                    <span>{{ getUsuarioNombre(item) }}</span>
                  </div>
                  <div
                    v-if="item.user?.empleado && item.user?.name"
                    class="text-caption text-grey-6 q-ml-md"
                  >
                    Usuario: {{ item.user.name }}
                  </div>
                </td>
                <td style="white-space: normal">
                  {{ item.comentarios || "-" }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-expansion-item>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import { date } from "quasar";

const props = defineProps({
  service: {
    type: Object,
    default: () => ({}),
  },
});

const detallesList = computed(() => {
  return (
    props.service?.detalles ||
    props.service?.detalles_servicio ||
    props.service?.detallesServicio ||
    []
  );
});

const orderTotals = computed(() => {
  return detallesList.value.reduce(
    (acc, d) => {
      acc.subtotal += Number(d.subtotal || 0);
      acc.iva += Number(d.iva || 0);
      acc.total += Number(d.total || 0);
      return acc;
    },
    { subtotal: 0, iva: 0, total: 0 }
  );
});

const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
};

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha";
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return date.formatDate(fechaStr, "DD/MM/YYYY");
};

const bitacoraList = computed(() => {
  const list = props.service?.bitacora || [];
  return [...list].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    if (timeB !== timeA) return timeB - timeA;
    return (b.id || 0) - (a.id || 0);
  });
});

const getUsuarioNombre = (item) => {
  const empleado = item?.user?.empleado;
  if (empleado) {
    if (empleado.nombreCompleto) return empleado.nombreCompleto;
    const partes = [
      empleado.nombre,
      empleado.segundo_nombre,
      empleado.apellido_paterno,
      empleado.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ");
    if (partes.trim()) return partes;
  }
  return item?.user?.name || "Sin usuario";
};

const formatFechaHora = (fechaStr) => {
  if (!fechaStr) return "-";
  return date.formatDate(fechaStr, "DD/MM/YYYY hh:mm A");
};

const openPdf = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
</style>
