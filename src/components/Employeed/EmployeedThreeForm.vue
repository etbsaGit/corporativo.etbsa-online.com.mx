<template>
  <div class="q-pa-sm">
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-table
          flat
          bordered
          grid
          :rows="requisitos"
          :columns="columns"
          row-key="name"
          :filter="filter"
          :rows-per-page-options="[0]"
        >
          <template v-slot:top-right>
            <q-input
              bordered
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:top-left>
            <div class="text-h6">
              <q-btn color="primary" icon="add" @click="showDetails = true" />
              Documentos
            </div>
          </template>

          <template v-slot:item="props">
            <q-card
              @click="onRowClick(props.row)"
              :class="{ selected: props.row.isSelected }"
              :style="{
                backgroundColor: getStatusColor(props.row.pivot.estatus_id),
                width: '200px',
                height: '100px',
                margin: '5px',
              }"
            >
              <q-card-section>
                <q-item-label caption v-for="col in props.cols" :key="col.name">
                  {{ props.row[col.name] }}
                </q-item-label>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  icon="delete"
                  size="sm"
                  color="red"
                  filled
                  dense
                  @click="mostrarDialogConfirmacion(props.row.pivot.id)"
                />
              </q-card-actions>
            </q-card>
          </template>
        </q-table>
      </template>

      <template v-slot:after>
        <q-card>
          <q-card-section class="d-flex justify-between items-center q-pa-sm">
            <div class="text-h6">Archivos</div>
            <q-card-actions align="right">
              <q-btn
                v-if="selectedRequisito"
                icon="upload"
                label="Actualizar"
                color="blue"
                @click="actualizarRequisito()"
              />
            </q-card-actions>
          </q-card-section>
          <employeed-four-form
            v-if="selectedRequisito"
            ref="edit_4"
            :key="selectedRequisito.id"
            :requisito="selectedRequisito"
          />
          <q-item v-else class="text-center">
            <h6>Selecciona un requisito para ver los detalles.</h6>
          </q-item>
        </q-card>
      </template>
    </q-splitter>
  </div>
  <q-dialog
    v-model="showDetails"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 1000px">
      <q-card-section>
        <div class="text-h6">Registrar requisito al empleado</div>
      </q-card-section>
      <q-separator />
      <q-card style="height: 100px" class="q-pa-none scroll" flat>
        <add-documento-form ref="edit_5" :empleado="empleado">
        </add-documento-form>
      </q-card>
      <q-separator />

      <q-card-actions align="right">
        <q-btn label="Cancelar" color="red" v-close-popup />
        <q-btn label="Agregar" color="blue" @click="agregarDocumento()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="mostrarDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Confirmar Borrado</div>
      </q-card-section>

      <q-card-section>
        ¿Seguro que deseas borrar este requisito?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancelar" color="grey" @click="cerrarDialog" />
        <q-btn label="Aceptar" color="red" @click="borrarArchivo" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import EmployeedFourForm from "./EmployeedFourForm.vue";
import AddDocumentoForm from "../Documento/AddDocumentoForm.vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";
import { inject } from "vue";

const bus = inject("bus");
const { empleado } = defineProps(["empleado"]);

const expedientes = ref([]);
const requisitos = ref([]);
const selectedRequisito = ref(null);
const splitterModel = ref(50);
const filter = ref("");
const edit_4 = ref(null);
const edit_5 = ref(null);
const showDetails = ref(false);
const $q = useQuasar();
const archivoIdBorrar = ref(null);
const mostrarDialog = ref(false);

const columns = [
  {
    name: "nombre",
    align: "left",
    field: "nombre",
    sortable: true,
  },
];

bus.on("archivo-subido", () => {
  selectedRequisito.value = null;
  obtenerEmpleado();
});

const mapear = () => {
  expedientes.value = empleado.archivable;
  requisitos.value = empleado.archivable[0].requisito;
};

const mostrarDialogConfirmacion = (archivoId) => {
  archivoIdBorrar.value = archivoId;
  mostrarDialog.value = true;
};

const cerrarDialog = () => {
  mostrarDialog.value = false;
};

const borrarArchivo = () => {
  borrar(archivoIdBorrar.value);
  mostrarDialog.value = false;
};

const onRowClick = (row) => {
  selectedRequisito.value = row;
  requisitos.value.forEach((requisito) => (requisito.isSelected = false));
  row.isSelected = true;
};

const agregarDocumento = async () => {
  const edit_5_valid = await edit_5.value.validate();
  if (!edit_5_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = { ...edit_5.value.formDocumento };
  let res = await sendRequest("POST", final, "/api/documento", "");
  showDetails.value = false;
  obtenerEmpleado();
};

const borrar = async (archivoId) => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/documento/" + archivoId,
    ""
  );
  showDetails.value = false;
  selectedRequisito.value = false;
  obtenerEmpleado();
};

const obtenerEmpleado = async () => {
  let res = await sendRequest("GET", null, "/api/empleado/" + empleado.id, "");
  requisitos.value = res.archivable[0].requisito;
};

const actualizarRequisito = async () => {
  const final = edit_4.value.formRequisito;
  let res = await sendRequest(
    "PUT",
    final,
    "/api/documento/" + selectedRequisito.value.pivot.id,
    ""
  );
  selectedRequisito.value = null;
  obtenerEmpleado();
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#b6ffaa"; // Verde claro
    case 2:
      return "#ffcccc"; // Rojo más claro
    case 3:
      return "#fff3b2"; // Amarillo más claro
    case 4:
      return "#b5fff4"; // Verde más claro
    //Añade más casos para otros estados
    default:
      return "#f2f2f2";
  }
};

onMounted(() => {
  mapear();
  obtenerEmpleado();
});
</script>

<style scoped>
.selected {
  border: 2px solid #9596ce;
  background-color: #e6ffe6;
}
</style>
