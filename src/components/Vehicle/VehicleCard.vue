<template>
  <q-card style="width: 700px; max-width: 95vw;" class="q-pa-none">
    <!-- Encabezado -->
    <q-card-section class="bg-primary text-white q-py-sm">
      <div class="row items-center no-wrap">
        <q-avatar icon="directions_car" color="white" text-color="primary" size="md" class="q-mr-sm" />
        <div class="col">
          <div class="text-h6 leading-tight">Ficha Informativa de la Unidad</div>
          <div class="text-caption text-blue-1">
            Placa actual: <span class="text-weight-bold text-white">{{ vehicle?.placas || 'Sin placa' }}</span>
            <span v-if="vehicle?.serie"> &bull; Serie: <span class="text-weight-bold text-white">{{ vehicle.serie }}</span></span>
          </div>
        </div>
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-md scroll" style="max-height: 80vh">
      <!-- Placa y Estatus Principal -->
      <div class="row q-col-gutter-sm items-center q-mb-md">
        <div class="col-12 col-sm-6">
          <div class="q-pa-sm rounded-borders bg-grey-2 flex items-center justify-between border-plate">
            <div class="text-caption text-grey-8">Placa actual:</div>
            <div class="plate-badge text-h6 text-weight-bolder text-primary q-px-md q-py-xs bg-white rounded-borders shadow-1">
              {{ vehicle?.placas || 'S/P' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="q-pa-sm rounded-borders bg-grey-2 flex items-center justify-between">
            <div class="text-caption text-grey-8">Estatus de la unidad:</div>
            <q-badge
              :color="vehicle?.activo == 1 ? 'positive' : 'negative'"
              :label="vehicle?.activo == 1 ? 'Activo' : 'Inactivo'"
              class="q-px-sm q-py-xs text-subtitle2"
            >
              <q-icon :name="vehicle?.activo == 1 ? 'check_circle' : 'cancel'" class="q-mr-xs" />
            </q-badge>
          </div>
        </div>

        <!-- Alerta de Baja -->
        <div v-if="vehicle?.activo == 0 && vehicle?.motivo_baja" class="col-12">
          <q-banner dense rounded class="bg-red-1 text-negative border-negative">
            <template v-slot:avatar>
              <q-icon name="warning" color="negative" />
            </template>
            <div><strong>Motivo de baja:</strong> {{ vehicle.motivo_baja }}</div>
          </q-banner>
        </div>
      </div>

      <!-- Datos Generales -->
      <div class="text-subtitle1 text-weight-bold text-primary q-mb-xs flex items-center">
        <q-icon name="info" class="q-mr-xs" size="sm" />
        Datos Generales
      </div>
      <q-card flat bordered class="q-mb-md bg-grey-1">
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Número de Serie (VIN):</div>
              <div class="text-body1 text-weight-bold text-dark font-mono">
                {{ vehicle?.serie || 'No registrado' }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Tipo de Vehículo:</div>
              <div class="text-body1 text-weight-medium">
                {{ vehicle?.estatus?.nombre || 'No definido' }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Sucursal:</div>
              <div class="text-body1 text-weight-medium">
                <q-icon name="store" size="xs" color="grey-7" class="q-mr-xs" />
                {{ vehicle?.sucursal?.nombre || 'No asignada' }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Línea:</div>
              <div class="text-body1 text-weight-medium">
                <q-icon name="category" size="xs" color="grey-7" class="q-mr-xs" />
                {{ vehicle?.linea?.nombre || 'No asignada' }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Departamento:</div>
              <div class="text-body1 text-weight-medium">
                <q-icon name="domain" size="xs" color="grey-7" class="q-mr-xs" />
                {{ vehicle?.departamento?.nombre || 'No asignado' }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Responsable y Usuarios -->
      <div class="text-subtitle1 text-weight-bold text-primary q-mb-xs flex items-center">
        <q-icon name="groups" class="q-mr-xs" size="sm" />
        Responsable y Usuarios Asignados
      </div>
      <q-card flat bordered class="q-mb-md bg-grey-1">
        <q-card-section class="q-pa-md q-gutter-y-sm">
          <!-- Responsable Mayor -->
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              Responsable (Responsable mayor):
            </div>
            <div v-if="responsableUnidad">
              <q-chip
                color="primary"
                text-color="white"
                icon="manage_accounts"
                size="md"
                class="q-ma-none"
              >
                {{
                  responsableUnidad.nombreCompleto ||
                  `${responsableUnidad.nombre || ""} ${responsableUnidad.apellido_paterno || ""}`
                }}
                <q-badge
                  color="amber-9"
                  text-color="white"
                  label="Responsable"
                  class="q-ml-sm"
                />
              </q-chip>
            </div>
            <div v-else class="text-caption text-grey-6 italic">
              Sin responsable asignado.
            </div>
          </div>

          <q-separator />

          <!-- Usuarios de la Unidad -->
          <div>
            <div class="text-caption text-grey-7 q-mb-xs">
              Usuarios de la unidad ({{ usuariosUnidad.length }}):
            </div>
            <div v-if="usuariosUnidad.length > 0" class="row q-gutter-xs">
              <q-chip
                v-for="emp in usuariosUnidad"
                :key="emp.id"
                :color="isResponsable(emp) ? 'primary' : 'blue-grey-7'"
                text-color="white"
                :icon="isResponsable(emp) ? 'manage_accounts' : 'person'"
                size="md"
              >
                {{
                  emp.nombreCompleto ||
                  `${emp.nombre || ""} ${emp.apellido_paterno || ""}`
                }}
                <q-badge
                  v-if="isResponsable(emp)"
                  color="amber-9"
                  text-color="white"
                  label="Responsable"
                  class="q-ml-xs"
                />
              </q-chip>
            </div>
            <div v-else class="text-caption text-grey-6 italic">
              Sin usuarios asignados actualmente.
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Historial de Placas -->
      <div class="text-subtitle1 text-weight-bold text-primary q-mb-xs flex items-center justify-between">
        <div class="flex items-center">
          <q-icon name="history" class="q-mr-xs" size="sm" />
          Historial de Placas
        </div>
        <q-badge color="primary" outline :label="`${historialList.length} placa(s) registrada(s)`" />
      </div>

      <q-card flat bordered class="bg-grey-1">
        <q-card-section class="q-pa-none">
          <q-list separator v-if="historialList.length > 0">
            <q-item
              v-for="(item, index) in historialList"
              :key="item.id || index"
              dense
              class="q-py-sm"
              :class="{ 'bg-blue-1': item.placa === vehicle?.placas }"
            >
              <q-item-section avatar>
                <q-avatar
                  size="32px"
                  :color="item.placa === vehicle?.placas ? 'positive' : 'grey-5'"
                  text-color="white"
                  :icon="item.placa === vehicle?.placas ? 'check' : 'tag'"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-subtitle1">
                  {{ item.placa }}
                  <q-badge
                    v-if="item.placa === vehicle?.placas"
                    color="positive"
                    label="Placa Actual"
                    class="q-ml-sm"
                  />
                  <q-badge
                    v-else
                    color="grey-6"
                    label="Placa Anterior"
                    class="q-ml-sm"
                  />
                </q-item-label>
                <q-item-label caption v-if="item.created_at">
                  Registrada el {{ formatFecha(item.created_at) }}
                </q-item-label>
                <q-item-label caption v-else class="text-grey-5">
                  Registro histórico
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="q-pa-md text-center text-grey-6">
            <q-icon name="info" size="md" color="grey-5" class="q-mb-xs block" />
            No hay registros de historial de placas para esta unidad.
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="q-pa-sm bg-grey-2">
      <q-btn flat label="Cerrar" color="grey-8" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import { date } from "quasar";

const props = defineProps({
  vehicle: {
    type: Object,
    default: () => ({}),
  },
});

const responsableUnidad = computed(() => {
  if (props.vehicle?.responsable) {
    return props.vehicle.responsable;
  }
  const list = props.vehicle?.empleados || [];
  return (
    list.find((e) => Number(e.vehicle_id) === Number(props.vehicle?.id)) || null
  );
});

const isResponsable = (emp) => {
  if (!emp) return false;
  return (
    Number(responsableUnidad.value?.id) === Number(emp.id) ||
    Number(emp.vehicle_id) === Number(props.vehicle?.id)
  );
};

const usuariosUnidad = computed(() => {
  const list = [...(props.vehicle?.empleados || [])];
  if (
    responsableUnidad.value &&
    !list.some((e) => Number(e.id) === Number(responsableUnidad.value.id))
  ) {
    list.unshift(responsableUnidad.value);
  }
  return list;
});

const historialList = computed(() => {
  return props.vehicle?.historial_placas || props.vehicle?.historialPlacas || [];
});

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha";
  return date.formatDate(fechaStr, "DD/MM/YYYY hh:mm A");
};
</script>

<style scoped>
.plate-badge {
  letter-spacing: 2px;
  border: 1px solid #c2c2c2;
}
.font-mono {
  font-family: monospace;
  letter-spacing: 1px;
}
.border-negative {
  border-left: 4px solid var(--q-negative);
}
</style>
