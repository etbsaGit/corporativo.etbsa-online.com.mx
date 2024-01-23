<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 585px">
      <template v-slot:before>
        <div class="q-pa-md">
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
              <div class="text-h6 q-mb-md">
                <q-btn color="primary" icon="add" @click="showDetails = true" />
                Requisitos
              </div>
            </template>

            <template v-slot:item="props">
              <q-card
                @click.stop="onRowClick(props.row)"
                :class="[selectedClass(props.row.isSelected)]"
                :style="{
                  backgroundColor: getStatusColor(props.row.pivot.estatus_id),
                  width: '200px',
                  height: '100px',
                  margin: '5px'
                }"
              >
                <q-card-section>
                  <q-item v-for="col in props.cols" :key="col.name">
                    <q-item-section side>
                      <q-item-label caption>{{
                        props.row[col.name]
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item-section side>
                    <q-btn
                      icon="delete"
                      size="sm"
                      color="red"
                      filled
                      dense
                      :disable="isAnyRequisitoSelected || props.row.isSelected"
                      @click="mostrarDialogConfirmacion(props.row.pivot.id)"
                    />
                  </q-item-section>
                </q-card-section>
              </q-card>
            </template>
          </q-table>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">Documentos</div>
          <edit-employeedfour-form
            v-if="selectedRequisito"
            ref="edit_4"
            v-model:requisito="selectedRequisito"
          />
          <div v-else>Selecciona un requisito para ver los detalles.</div>
        </div>
      </template>
    </q-splitter>
    <q-separator />
    <q-card-actions align="right">
      <q-btn
        v-if="selectedRequisito"
        label="Resetear selección"
        color="negative"
        @click="btnReset"
      />
      <q-btn
        v-if="selectedRequisito"
        icon="upload"
        label="Actualizar"
        color="blue"
        @click="actualizarRequisito()"
      />
      <q-btn label="Cancelar" color="red" v-close-popup />
    </q-card-actions>
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
import EditEmployeedfourForm from "./EditEmployeedfourForm.vue";
import AddDocumentoForm from "../Documento/AddDocumentoForm.vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

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
const clickable = ref(true);
const archivoIdBorrar = ref(null);
const mostrarDialog = ref(false);
const isAnyRequisitoSelected = ref(false);

const columns = [
  {
    name: "nombre",
    align: "left",
    field: "nombre",
    sortable: true
  }
];

const mapear = () => {
  expedientes.value = empleado.archivable;
  requisitos.value = empleado.archivable[0].requisito;
};

const selectedClass = (isSelected) => {
  return isSelected ? "selected" : "";
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

const onRowClick = async (row) => {
  if (!clickable.value) {
    return;
  }

  resetSelection();
  selectedRequisito.value = row;
  row.isSelected = true;
  isAnyRequisitoSelected.value = true;
  requisitos.value.forEach((requisito) => {
    requisito.isClickable = false;
  });
  clickable.value = false;
};

const agregarDocumento = async () => {
  const edit_5_valid = await edit_5.value.validate();
  if (!edit_5_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  const final = { ...edit_5.value.formDocumento };
  try {
    let res = await sendRequest("POST", final, "/api/documento", "");
    showDetails.value = false;
    obtenerEmpleado();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const borrar = async (archivoId) => {
  try {
    let res = await sendRequest(
      "DELETE",
      null,
      "/api/documento/" + archivoId,
      ""
    );
    showDetails.value = false;
    obtenerEmpleado();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const btnReset = () => {
  obtenerEmpleado();
  resetSelection();
};

const resetSelection = () => {
  requisitos.value.forEach((requisito) => {
    requisito.isSelected = false;
  });
  selectedRequisito.value = null;
  clickable.value = true;
  isAnyRequisitoSelected.value = false;
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
  obtenerEmpleado();
  resetSelection();
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#fff3b2"; // Amarillo más claro
    case 2:
      return "#b5fff4"; // Verde más claro
    case 3:
      return "#ffcccc"; // Rojo más claro
    case 4:
      return "#b6ffaa"; // Verde claro
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
.selected-enter-active,
.selected-leave-active {
  transition: opacity 0.5s;
}
.selected-enter,
.selected-leave-to {
  opacity: 0;
}
.selected {
  border: 2px solid #9596ce;
  background-color: #e6ffe6;
}
</style>
