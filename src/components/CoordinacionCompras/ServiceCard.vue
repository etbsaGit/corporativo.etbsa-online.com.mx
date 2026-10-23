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
                <div class="col-12 q-mt-xs">
                  <q-badge
                    :color="onlyGasolina ? 'amber-1' : 'indigo-1'"
                    :text-color="onlyGasolina ? 'amber-10' : 'indigo-9'"
                    class="q-px-sm q-py-xs"
                  >
                    <q-icon
                      :name="onlyGasolina ? 'local_gas_station' : 'analytics'"
                      size="14px"
                      class="q-mr-xs"
                    />
                    {{
                      onlyGasolina
                        ? "Historial de cargas de gasolina disponible abajo"
                        : "Historial de servicios de la unidad disponible abajo"
                    }}
                  </q-badge>
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
                  <span
                    v-if="isGasolinaDetalle(det) && det.cantidad"
                    class="text-weight-bolder text-orange-9 q-ml-xs"
                  >
                    ({{ det.cantidad }} Lts)
                  </span>
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

      <!-- Desplegable: Historial de Servicios de la Unidad (Dashboard) -->
      <q-card flat bordered class="bg-white q-mb-md">
        <q-expansion-item
          default-opened
          header-class="bg-grey-2 text-primary"
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar
                :icon="onlyGasolina ? 'local_gas_station' : 'analytics'"
                :color="onlyGasolina ? 'amber-9' : 'indigo-8'"
                text-color="white"
                size="30px"
              />
            </q-item-section>
            <q-item-section>
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center"
              >
                {{
                  onlyGasolina
                    ? "Historial de Cargas de Gasolina de la Unidad (Dashboard)"
                    : "Historial de Servicios de la Unidad (Dashboard)"
                }}
                <q-badge
                  :color="onlyGasolina ? 'amber-9' : 'indigo-8'"
                  class="q-ml-sm"
                >
                  {{ dashboardOrdersCount }}
                  órdenes registradas
                </q-badge>
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="text-caption text-grey-8">
                Unidad:
                <strong class="text-primary">{{
                  service?.vehicle?.placas || "S/P"
                }}</strong>
              </div>
            </q-item-section>
          </template>

          <q-separator />

          <vehicle-services-dashboard
            :vehicle="vehicleHistory || service?.vehicle"
            :loading="loadingHistory"
            :only-gasolina="onlyGasolina"
            embedded
          />
        </q-expansion-item>
      </q-card>

      <!-- Desplegable: Bitácora de Acciones y Movimientos -->
      <q-card flat bordered class="bg-white q-mb-md">
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

      <!-- SECCIÓN: Autorización de la Orden de Compra -->
      <q-card
        flat
        bordered
        class="bg-white q-mt-md shadow-1"
        v-if="checkPuesto(['Director administrativo'])"
      >
        <q-card-section
          class="q-py-xs q-px-md flex items-center justify-between"
          :class="autorizacionForm.autorizado ? 'bg-green-1' : 'bg-red-1'"
        >
          <div class="row items-center q-gutter-x-sm">
            <q-avatar
              :icon="autorizacionForm.autorizado ? 'verified' : 'gpp_bad'"
              :color="autorizacionForm.autorizado ? 'positive' : 'negative'"
              text-color="white"
              size="28px"
            />
            <div
              class="text-subtitle2 text-weight-bold"
              :class="
                autorizacionForm.autorizado ? 'text-positive' : 'text-negative'
              "
            >
              Autorización de la Orden de Compra
            </div>
          </div>
          <q-badge
            :color="autorizacionForm.autorizado ? 'positive' : 'negative'"
            class="text-weight-bold q-px-sm"
          >
            {{ autorizacionForm.autorizado ? "AUTORIZAR" : "NO AUTORIZAR" }}
          </q-badge>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-md">
          <q-form ref="autorizarFormRef" @submit.prevent="submitAutorizacion">
            <div class="row q-col-gutter-md items-center">
              <!-- Switch de Autorización (Verdadero o Falso) -->
              <div class="col-12 col-md-5">
                <div class="q-pa-sm rounded-borders bg-grey-1 border-grey">
                  <div
                    class="text-caption text-grey-8 text-weight-medium q-mb-xs"
                  >
                    Decisión de Autorización *
                  </div>
                  <q-toggle
                    v-model="autorizacionForm.autorizado"
                    :label="
                      autorizacionForm.autorizado
                        ? 'Autorizar compra'
                        : 'No autorizar compra'
                    "
                    :color="
                      autorizacionForm.autorizado ? 'positive' : 'negative'
                    "
                    keep-color
                    class="text-weight-bold"
                  />
                  <div class="text-caption text-grey-6 q-mt-xs">
                    {{
                      autorizacionForm.autorizado
                        ? 'Al marcar como verdadero, la orden pasará a estatus "Autorizado".'
                        : 'Al marcar como falso, la orden pasará a estatus "No Autorizado" y es obligatorio indicar los motivos o comentarios.'
                    }}
                  </div>
                </div>
              </div>

              <!-- TextInput para notas o comentario -->
              <div class="col-12 col-md-7">
                <q-input
                  v-model="autorizacionForm.comentarios"
                  type="textarea"
                  rows="2"
                  autogrow
                  outlined
                  dense
                  bg-color="white"
                  :label="
                    autorizacionForm.autorizado
                      ? 'Notas o comentarios (Opcional)'
                      : 'Notas o comentarios del motivo *'
                  "
                  :placeholder="
                    autorizacionForm.autorizado
                      ? 'Observaciones o notas opcionales...'
                      : 'Indique obligatoriamente el motivo por el cual no se autoriza la orden...'
                  "
                  :rules="[
                    (val) =>
                      autorizacionForm.autorizado ||
                      (val && String(val).trim().length > 0) ||
                      'El comentario es obligatorio cuando no se autoriza la orden',
                  ]"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon
                      name="comment"
                      :color="
                        autorizacionForm.autorizado ? 'primary' : 'negative'
                      "
                    />
                  </template>
                </q-input>
              </div>

              <!-- Botón para confirmar -->
              <div class="col-12 text-right">
                <q-btn
                  unelevated
                  :color="autorizacionForm.autorizado ? 'positive' : 'negative'"
                  :icon="
                    autorizacionForm.autorizado ? 'check_circle' : 'cancel'
                  "
                  :label="
                    autorizacionForm.autorizado
                      ? 'Confirmar Autorización'
                      : 'Confirmar Rechazo'
                  "
                  :loading="submittingAuth"
                  type="submit"
                  class="q-px-md text-weight-bold"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { date } from "quasar";
import { sendRequest, dataIncomplete, checkPuesto } from "src/boot/functions";
import VehicleServicesDashboard from "src/components/Vehicle/VehicleServicesDashboard.vue";

const props = defineProps({
  service: {
    type: Object,
    default: () => ({}),
  },
  authEndpoint: {
    type: String,
    default: "/api/service/autorizar",
  },
  onlyGasolina: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["authorized"]);

const vehicleHistory = ref(null);
const loadingHistory = ref(false);

const loadVehicleHistory = async (vehicleId) => {
  if (!vehicleId) {
    vehicleHistory.value = null;
    return;
  }
  loadingHistory.value = true;
  try {
    const res = await sendRequest("GET", null, `/api/vehicle/${vehicleId}`, "");
    if (res) {
      vehicleHistory.value = res;
    }
  } catch (e) {
    console.error("Error al cargar historial del vehículo:", e);
  } finally {
    loadingHistory.value = false;
  }
};

const isGasolinaDetalle = (det) => {
  const sName = (det.servicio?.nombre || "").toLowerCase();
  const tName = (
    det.servicio?.tipo_servicio?.nombre ||
    det.servicio?.tipoServicio?.nombre ||
    ""
  ).toLowerCase();
  const tId = Number(
    det.servicio?.tipo_servicio_id || det.servicio?.tipoServicio?.id || 0
  );
  return tName === "gasolina" || tId === 14 || sName.includes("gasolina");
};

const isGasolinaOrden = (orden) => {
  const detalles =
    orden.detalles ||
    orden.detalles_servicio ||
    orden.detallesServicio ||
    [];
  return detalles.some((d) => {
    const sName = (d.servicio?.nombre || "").toLowerCase();
    const tName = (
      d.servicio?.tipo_servicio?.nombre ||
      d.servicio?.tipoServicio?.nombre ||
      ""
    ).toLowerCase();
    const tId = Number(
      d.servicio?.tipo_servicio_id || d.servicio?.tipoServicio?.id || 0
    );
    return tName === "gasolina" || tId === 14 || sName.includes("gasolina");
  });
};

const dashboardOrdersCount = computed(() => {
  const raw =
    vehicleHistory.value?.ordenes_servicio ||
    vehicleHistory.value?.ordenesServicio ||
    props.service?.vehicle?.ordenes_servicio ||
    props.service?.vehicle?.ordenesServicio ||
    [];
  if (!props.onlyGasolina) {
    return raw.length;
  }
  return raw.filter(isGasolinaOrden).length;
});

watch(
  () => props.service?.vehicle_id || props.service?.vehicle?.id,
  (newId) => {
    if (newId) {
      loadVehicleHistory(newId);
    } else {
      vehicleHistory.value = null;
    }
  },
  { immediate: true }
);

const autorizarFormRef = ref(null);
const submittingAuth = ref(false);

const autorizacionForm = ref({
  autorizado: true,
  comentarios: "",
});

watch(
  () => props.service,
  (newSrv) => {
    if (newSrv) {
      const isNoAutorizado =
        (newSrv.estatus?.nombre || "").toLowerCase() === "no autorizado";
      autorizacionForm.value = {
        autorizado: !isNoAutorizado,
        comentarios: "",
      };
      if (autorizarFormRef.value) {
        autorizarFormRef.value.resetValidation();
      }
    }
  },
  { immediate: true }
);

watch(
  () => autorizacionForm.value.autorizado,
  (val) => {
    if (val && autorizarFormRef.value) {
      autorizarFormRef.value.resetValidation();
    }
  }
);

const submitAutorizacion = async () => {
  if (!props.service?.id) return;

  const isValid = await autorizarFormRef.value.validate();
  if (!isValid) {
    dataIncomplete();
    return;
  }

  submittingAuth.value = true;
  try {
    const payload = {
      orden_servicio_id: props.service.id,
      autorizado: autorizacionForm.value.autorizado,
      comentarios: autorizacionForm.value.comentarios?.trim() || null,
    };

    const res = await sendRequest(
      "POST",
      payload,
      props.authEndpoint || "/api/service/autorizar"
    );
    emit("authorized", res || props.service);
  } finally {
    submittingAuth.value = false;
  }
};

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
.border-grey {
  border: 1px dashed #b0bec5;
}
</style>
