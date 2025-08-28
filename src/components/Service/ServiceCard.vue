<template>
  <q-card flat bordered class="q-pa-md bg-grey-1 shadow-2 rounded-borders">
    <!-- Encabezado -->
    <q-card-section class="row items-center q-pb-none">
      <q-avatar size="64px" rounded>
        <img :src="service.empleado.picture" alt="Empleado" />
      </q-avatar>
      <div class="q-ml-md">
        <div class="text-h6 text-primary">
          {{ service.empleado.nombreCompleto }}
        </div>
        <div class="text-caption text-grey-7">
          {{ service.empleado.correo_institucional }}
        </div>
      </div>
      <q-space />
    </q-card-section>

    <q-separator spaced />

    <!-- Información del vehículo -->
    <q-card-section>
      <q-item class="text-subtitle2 text-indigo-9">🚗 Vehículo</q-item>
      <div class="row q-col-gutter-sm">
        <div class="col-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption>Modelo</q-item-label>
              <q-item-label class="text-weight-bold">{{
                service.vehicle.estatus.nombre
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption>Placas</q-item-label>
              <q-item-label class="text-weight-bold">{{
                service.vehicle.placas
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption>Departamento</q-item-label>
              <q-item-label>{{
                service.vehicle.departamento.nombre
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption>Sucursal</q-item-label>
              <q-item-label>{{ service.vehicle.sucursal.nombre }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>

    <q-separator spaced />

    <!-- Información del servicio -->
    <q-card-section>
      <q-item class="text-subtitle2 text-indigo-9">🛠️ Servicio</q-item>
      <q-list dense>
        <q-item>
          <q-item-section>
            <q-item-label caption>Tipo de servicio</q-item-label>
            <q-item-label>{{ service.estatus.nombre }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Descripción</q-item-label>
            <q-item-label>{{ service.description }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Kilometraje</q-item-label>
            <q-item-label>{{ service.km.toLocaleString() }} km</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Creado</q-item-label>
            <q-item-label>{{ formatDate(service.created_at) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Última actualización</q-item-label>
            <q-item-label>{{ formatDate(service.updated_at) }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>Estatus</q-item-label>
            <q-item-label>{{
              getDropdownPropsStatus(service.status).label
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>Comentarios</q-item-label>
            <q-item-label>{{ service.feedback }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- Files -->
    <q-separator spaced />

    <q-item class="text-subtitle2 text-indigo-9 q-mb-sm">
      📂 Archivos adjuntos
    </q-item>
    <q-list dense>
      <q-item v-for="file in service.archives" :key="file.id" dense>
        <q-item-section avatar>
          <q-btn
            round
            flat
            size="lg"
            color="primary"
            :href="file.realpath"
            target="_blank"
            icon="fa-solid fa-file-invoice"
          />
        </q-item-section>
        <q-item-section>
          {{ file.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup>
import { date } from "quasar";

const { service } = defineProps(["service"]);

const formatDate = (val) => {
  return date.formatDate(val, "DD/MM/YYYY HH:mm");
};

function getDropdownPropsStatus(status) {
  if (status === 0) {
    return {
      color: "red-6",
      textColor: "white",
      icon: "fa-solid fa-x",
      label: "Rechazada",
    };
  } else if (status === 1) {
    return {
      color: "green-6",
      textColor: "white",
      icon: "fa-solid fa-check-double",
      label: "Autorizada",
    };
  } else if (status === 2) {
    return {
      color: "blue-6",
      textColor: "white",
      icon: "fa-solid fa-check",
      label: "Pre-Autorizada",
    };
  } else {
    return {
      color: "primary",
      textColor: "white",
      icon: "fa-regular fa-hourglass-half",
      label: "Esperando autorizacion",
    };
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
