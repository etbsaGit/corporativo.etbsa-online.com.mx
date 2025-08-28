<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formService.estatus_id"
          :options="estatus"
          label="Tipo"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          options-dense
          clearable
          :rules="[requiredSelect]"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formService.km"
          outlined
          dense
          type="number"
          label="Kilometraje"
          :rules="[requiredGreaterThan0]"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formService.description"
          outlined
          dense
          type="textarea"
          label="Descripcion del servicio"
          :rules="[required]"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formService.empleado_id"
          :options="empleados"
          label="Empleado"
          option-value="id"
          option-label="apellidoCompleto"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          options-dense
          clearable
          :rules="[requiredSelect]"
          @update:model-value="formService.vehicle_id = null"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formService.vehicle_id"
          :options="filteredVehicles"
          label="Vehiculo"
          option-value="id"
          option-label="placas"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          options-dense
          clearable
          :rules="[requiredSelect]"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <strong>Placas:</strong>
                  {{ scope.opt.placas }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <strong>Tipo de vehiculo:</strong>
                  {{ scope.opt.estatus.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item v-if="checkRole('cc')">
      <q-item-section>
        <q-input
          v-model="formService.feedback"
          outlined
          dense
          type="textarea"
          label="Retroalimentacion o motivo de rechazo"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-file
          clearable
          color="secondary"
          dense
          outlined
          v-model="formService.file"
          label="Subir cotizacion"
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif, .pdf"
          multiple
          @clear="formService.base64 = []"
          @input="convertirFile($event)"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section align="center">
        <q-item-label caption>- Archivos ya guardados -</q-item-label>
      </q-item-section>
    </q-item>
    <q-list v-if="service">
      <q-item v-for="(archive, index) in formService.archives" :key="index">
        <q-item-section avatar>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-trash"
            color="red"
            @click="deleteArchive(archive.id)"
          />
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-file-arrow-down"
            @click="openFile(archive.realpath)"
          />
        </q-item-section>
        <q-item-section>
          {{ archive.name }}
        </q-item-section>
        <q-item-section side>
          <q-btn-dropdown
            v-if="checkRole('cc')"
            dense
            :color="getDropdownPropsStatus(archive.status).color"
            :text-color="getDropdownPropsStatus(archive.status).textColor"
            :icon="getDropdownPropsStatus(archive.status).icon"
            :label="getDropdownPropsStatus(archive.status).label"
          >
            <q-list dense>
              <q-item
                v-if="archive.status != 1"
                clickable
                v-close-popup
                class="bg-green-3"
                @click="changeEstatus(archive.id, 1)"
              >
                <q-item-section>
                  <q-chip
                    color="green-3"
                    text-color="white"
                    icon="fa-solid fa-circle-check"
                    label="Autorizada"
                  />
                </q-item-section>
              </q-item>

              <q-item
                v-if="archive.status != 0"
                clickable
                v-close-popup
                class="bg-red-3"
                @click="changeEstatus(archive.id, 0)"
              >
                <q-item-section>
                  <q-chip
                    color="red-3"
                    text-color="white"
                    icon="fa-solid fa-circle-xmark"
                    label="Rechazada"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-chip
            v-else
            square
            :color="getDropdownPropsStatus(archive.status).color"
            :text-color="getDropdownPropsStatus(archive.status).textColor"
            :icon="getDropdownPropsStatus(archive.status).icon"
            :label="getDropdownPropsStatus(archive.status).label"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { checkRole, sendRequest } from "src/boot/functions";
import { requiredSelect, required, requiredGreaterThan0 } from "src/boot/rules";

const { service } = defineProps(["service"]);

const myForm = ref(null);

const estatus = ref([]);
const vehicles = ref([]);
const empleados = ref([]);

const formService = ref({
  id: service ? service.id : null,
  description: service ? service.description : null,
  status: service ? service.status : null,
  km: service ? service.km : null,
  vehicle_id: service ? service.vehicle_id : null,
  empleado_id: service ? service.empleado_id : null,
  estatus_id: service ? service.estatus_id : null,
  feedback: service ? service.feedback : null,
  archives: service ? service.archives : [],

  base64: [],
  file: [],
});

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/service/forms", "");
  empleados.value = res.empleados;
  vehicles.value = res.vehicles;
  estatus.value = res.estatus;
};

const changeEstatus = async (id, status) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/serviceArchive/status/" + id + "/" + status,
    ""
  );
  // 🔹 Si la petición fue exitosa, busca el archivo y actualiza su estatus
  const archive = formService.value.archives.find((a) => a.id === id);
  if (archive) {
    archive.status = status;
  }
};

const deleteArchive = async (id) => {
  let res = await sendRequest("DELETE", null, "/api/serviceArchive/" + id, "");
  formService.value.archives = formService.value.archives.filter(
    (archive) => archive.id !== id
  );
};

const filteredVehicles = computed(() => {
  if (!formService.value.empleado_id) return [];

  const empleado = empleados.value.find(
    (e) => e.id === formService.value.empleado_id
  );
  if (!empleado) return [];

  return vehicles.value.filter((v) => v.sucursal_id === empleado.sucursal_id);
});

const convertirFile = (event) => {
  const archivos = event.target.files;
  formService.value.base64 = []; // limpiar antes de agregar nuevos

  if (archivos && archivos.length > 0) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const objetoArchivo = {
          name: archivo.name,
          base64: base64Data,
        };
        formService.value.base64.push(objetoArchivo);
      };
      reader.readAsDataURL(archivo);
    });
  }
};

function getDropdownPropsStatus(validated) {
  if (validated === 0) {
    return {
      color: "red-3",
      textColor: "white",
      icon: "fa-solid fa-circle-xmark",
      label: "Rechazada",
    };
  } else if (validated === 1) {
    return {
      color: "green-3",
      textColor: "white",
      icon: "fa-solid fa-circle-check",
      label: "Autorizada",
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

const openFile = (url) => {
  window.open(url, "_blank");
};

onMounted(() => {
  getForms();
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formService,
  validate,
});
</script>
