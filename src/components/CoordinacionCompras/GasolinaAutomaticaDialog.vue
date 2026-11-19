<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    persistent
  >
    <q-card style="min-width: 780px; max-width: 95vw">
      <q-card-section
        class="bg-deep-purple text-white row items-center justify-between q-py-sm"
      >
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="autorenew" size="26px" />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Dispersión Automática Semanal
            </div>
            <div class="text-caption text-deep-purple-1">
              Configura las unidades y litros que se generarán ya autorizados cada lunes a las 8:00 AM
            </div>
          </div>
        </div>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          :disable="saving"
        />
      </q-card-section>

      <q-card-section class="q-gutter-y-md">
        <q-banner
          dense
          rounded
          class="bg-deep-purple-1 text-deep-purple-10"
        >
          <template v-slot:avatar>
            <q-icon name="schedule_send" color="deep-purple" />
          </template>
          Las solicitudes creadas automáticamente los <strong>lunes a las 8:00 AM</strong> nacen en estatus
          <strong>Por dispersar</strong> (ya autorizadas) y quedan listas para marcarse como dispersadas.
        </q-banner>

        <!-- Selector para agregar unidad -->
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm-7">
            <q-select
              v-model="newVehicleId"
              :options="filteredVehicleOptions"
              label="Seleccionar unidad (placa, serie, sucursal)"
              option-value="id"
              :option-label="formatVehicleLabel"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterVehiclesFn"
              clearable
              outlined
              dense
              options-dense
              :disable="loading || saving"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ scope.opt.placas || "S/P" }}
                      <span
                        v-if="scope.opt.linea?.nombre"
                        class="text-weight-normal text-grey-7"
                      >
                        - {{ scope.opt.linea.nombre }}
                      </span>
                    </q-item-label>
                    <q-item-label caption>
                      Serie: {{ scope.opt.serie || "N/A" }} &bull;
                      {{ scope.opt.sucursal?.nombre || "Sin sucursal" }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay unidades disponibles para agregar
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-6 col-sm-3">
            <q-input
              v-model.number="newLts"
              type="number"
              min="1"
              step="1"
              label="Litros (L)"
              outlined
              dense
              suffix="L"
              :disable="loading || saving"
              @keyup.enter="addVehicleRow"
            />
          </div>

          <div class="col-6 col-sm-2">
            <q-btn
              unelevated
              color="deep-purple"
              icon="add"
              label="Agregar"
              class="full-width"
              no-caps
              :disable="!newVehicleId || !newLts || Number(newLts) < 1 || loading || saving"
              @click="addVehicleRow"
            />
          </div>
        </div>

        <q-separator />

        <!-- Lista de unidades configuradas -->
        <div v-if="loading" class="row justify-center q-py-lg">
          <q-spinner color="deep-purple" size="36px" />
        </div>

        <div
          v-else-if="rows.length === 0"
          class="text-center text-grey-6 q-py-lg bg-grey-1 rounded-borders"
        >
          <q-icon name="directions_car" size="36px" class="q-mb-xs" />
          <div class="text-subtitle2">
            No hay unidades configuradas para dispersión automática
          </div>
          <div class="text-caption">
            Selecciona una unidad arriba y asigna los litros semanales para agregarla.
          </div>
        </div>

        <q-markup-table
          v-else
          flat
          bordered
          dense
          separator="horizontal"
          style="max-height: 360px"
        >
          <thead>
            <tr class="bg-grey-2 text-grey-8">
              <th class="text-left">Unidad</th>
              <th class="text-left">Sucursal / Depto</th>
              <th class="text-center" style="width: 170px">Litros cada Lunes</th>
              <th class="text-center" style="width: 70px">Quitar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in rows" :key="item.vehicle_id">
              <td>
                <div class="row items-center q-gutter-x-xs">
                  <q-badge color="deep-purple" class="text-weight-bold">
                    {{ item.vehicle?.placas || "S/P" }}
                  </q-badge>
                  <span class="text-caption text-weight-medium text-grey-9">
                    {{ item.vehicle?.linea?.nombre || "" }}
                  </span>
                </div>
                <div class="text-caption text-grey-6">
                  Serie: {{ item.vehicle?.serie || "N/A" }}
                </div>
              </td>
              <td>
                <div class="text-caption text-weight-medium">
                  {{ item.vehicle?.sucursal?.nombre || "-" }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ item.vehicle?.departamento?.nombre || "-" }}
                </div>
              </td>
              <td class="text-center">
                <q-input
                  v-model.number="item.lts_cargar"
                  type="number"
                  min="1"
                  step="1"
                  dense
                  outlined
                  suffix="L"
                  input-class="text-center text-weight-bold"
                  :error="!item.lts_cargar || Number(item.lts_cargar) < 1"
                  hide-bottom-space
                  :disable="saving"
                />
              </td>
              <td class="text-center">
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  :disable="saving"
                  @click="removeRow(idx)"
                >
                  <q-tooltip>Quitar unidad</q-tooltip>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <!-- Resumen -->
        <div
          class="row items-center justify-between q-pa-sm bg-grey-2 rounded-borders text-caption"
        >
          <span>
            Unidades configuradas:
            <strong class="text-deep-purple">{{ rows.length }}</strong>
          </span>
          <span>
            Total semanal automático:
            <strong class="text-deep-purple">{{ totalLitros }} L</strong>
          </span>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancelar"
          color="grey-7"
          no-caps
          v-close-popup
          :disable="saving"
        />
        <q-btn
          unelevated
          color="deep-purple"
          icon="save"
          label="Guardar configuración"
          no-caps
          :loading="saving"
          :disable="loading"
          @click="saveConfig"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { sendRequest } from "src/boot/functions";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  vehicles: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "saved"]);
const $q = useQuasar();

const loading = ref(false);
const saving = ref(false);
const rows = ref([]);
const newVehicleId = ref(null);
const newLts = ref(null);
const vehicleSearchTerm = ref("");

const availableVehicles = computed(() => {
  const usedIds = new Set(rows.value.map((r) => Number(r.vehicle_id)));
  return (props.vehicles || []).filter((v) => !usedIds.has(Number(v.id)));
});

const filteredVehicleOptions = computed(() => {
  const term = vehicleSearchTerm.value.trim().toLowerCase();
  if (!term) return availableVehicles.value;
  return availableVehicles.value.filter((v) => {
    const placas = (v.placas || "").toLowerCase();
    const serie = (v.serie || "").toLowerCase();
    const suc = (v.sucursal?.nombre || "").toLowerCase();
    const linea = (v.linea?.nombre || "").toLowerCase();
    return (
      placas.includes(term) ||
      serie.includes(term) ||
      suc.includes(term) ||
      linea.includes(term)
    );
  });
});

const totalLitros = computed(() =>
  rows.value.reduce((acc, r) => acc + (Number(r.lts_cargar) || 0), 0)
);

const formatVehicleLabel = (v) => {
  if (!v) return "";
  const placas = v.placas || "S/P";
  const linea = v.linea?.nombre ? ` - ${v.linea.nombre}` : "";
  return `${placas}${linea}`;
};

const filterVehiclesFn = (val, update) => {
  update(() => {
    vehicleSearchTerm.value = val;
  });
};

const loadConfig = async () => {
  loading.value = true;
  try {
    const res = await sendRequest("GET", null, "/api/gasolina/automatica", "");
    const list = Array.isArray(res) ? res : res?.data || [];
    rows.value = list.map((item) => ({
      vehicle_id: Number(item.vehicle_id),
      lts_cargar: Number(item.lts_cargar) || 1,
      vehicle:
        item.vehicle ||
        props.vehicles.find((v) => Number(v.id) === Number(item.vehicle_id)) ||
        null,
    }));
  } catch (error) {
    console.error("Error cargando dispersión automática:", error);
  } finally {
    loading.value = false;
  }
};

const addVehicleRow = () => {
  if (!newVehicleId.value || !newLts.value || Number(newLts.value) < 1) {
    return;
  }
  const veh = props.vehicles.find(
    (v) => Number(v.id) === Number(newVehicleId.value)
  );
  rows.value.push({
    vehicle_id: Number(newVehicleId.value),
    lts_cargar: Math.round(Number(newLts.value)),
    vehicle: veh || null,
  });
  newVehicleId.value = null;
  newLts.value = null;
};

const removeRow = (index) => {
  rows.value.splice(index, 1);
};

const saveConfig = async () => {
  const invalid = rows.value.some(
    (r) => !r.lts_cargar || Number(r.lts_cargar) < 1
  );
  if (invalid) {
    $q.notify({
      type: "warning",
      message: "Todas las unidades deben tener al menos 1 litro asignado.",
      position: "top",
    });
    return;
  }

  saving.value = true;
  try {
    const payload = {
      items: rows.value.map((r) => ({
        vehicle_id: Number(r.vehicle_id),
        lts_cargar: Math.round(Number(r.lts_cargar)),
      })),
    };
    const res = await sendRequest(
      "POST",
      payload,
      "/api/gasolina/automatica",
      ""
    );
    if (res !== null) {
      $q.notify({
        type: "positive",
        message: "Configuración de dispersión automática guardada correctamente.",
        position: "top",
      });
      emit("saved");
      emit("update:modelValue", false);
    }
  } catch (error) {
    console.error("Error guardando dispersión automática:", error);
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      newVehicleId.value = null;
      newLts.value = null;
      loadConfig();
    }
  }
);
</script>
