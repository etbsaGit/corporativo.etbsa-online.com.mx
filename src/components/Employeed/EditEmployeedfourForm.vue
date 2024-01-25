<template>
  <div class="q-pa-md">
    <q-form class="q-gutter-y-sm text-uppercase" ref="myForm" greedy>
      <q-item>
        <q-item-section>
          <q-input
            :model-value="requisito.nombre"
            disable
            filled
            dense
            label="Nombre"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          />
        </q-item-section>
        <q-item-section>
          <q-input
            :model-value="requisito.descripcion"
            disable
            filled
            dense
            label="Descripcion"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            filled
            dense
            v-model="formRequisito.fecha_de_vencimiento"
            mask="date"
            label="Fecha de vencimiento"
            lazy-rules
            hint
            clearable
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="formRequisito.fecha_de_vencimiento">
                    <div class="row items-center justify-end">
                      <q-btn flat v-close-popup label="Close" color="gray" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="formRequisito.estatus_id"
            :options="status"
            option-value="id"
            option-label="nombre"
            label="Estatus"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            filled
            dense
            hint
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="formRequisito.comentario"
            filled
            dense
            label="Comentarios"
            lazy-rules
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-file
            filled
            dense
            bottom-slots
            v-model="model"
            label="Sube aqui los archivos"
            accept=".pdf"
            max-files="1"
          >
            <template v-slot:after>
              <q-btn round dense flat icon="send" @click="uploadFile" />
            </template>
          </q-file>
        </q-item-section>
      </q-item>
      <q-item>
        <q-table
          flat
          bordered
          title="Archivos"
          :rows="archivos"
          :columns="columns"
          row-key="name"
          virtual-scroll
          :rows-per-page-options="[0]"
          :visible-columns="visibleColumns"
          style="width: 800px"
        >
          <template v-slot:body-cell-opciones="props">
            <q-td>
              <q-btn-group spread style="width: 100px" flat>
                <q-btn
                  color="blue"
                  icon="visibility"
                  @click="show(props.row)"
                />
                <q-btn
                  color="red"
                  icon="delete"
                  @click="mostrarDialogConfirmacion(props.row.id)"
                />
              </q-btn-group>
            </q-td>
          </template>
          <template v-slot:top>
            <q-select
              v-model="visibleColumns"
              multiple
              borderless
              dense
              options-dense
              :display-value="$q.lang.table.columns"
              emit-value
              map-options
              :options="columns"
              style="min-width: 150px"
              option-value="name"
            />
          </template>
        </q-table>
      </q-item>
      <q-dialog v-model="mostrarDialog" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Confirmar Borrado</div>
          </q-card-section>

          <q-card-section>
            ¿Seguro que deseas borrar este archivo?
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Cancelar" color="grey" @click="cerrarDialog" />
            <q-btn label="Aceptar" color="red" @click="borrarArchivo" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { inject } from "vue";

const bus = inject("bus"); // inside setup()
const { requisito } = defineProps(["requisito"]);

const myForm = ref(null);
const status = ref([]);
const model = ref(null);
const archivoIdBorrar = ref(null);
const mostrarDialog = ref(false);
const archivos = ref([]);
const $q = useQuasar();

const cargarArchivos = async () => {
  if (!requisito || !requisito.pivot) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Seleccione un a validar"
    });
    return;
  }
  const id = requisito.pivot.id;
  let res = await sendRequest("GET", null, "/api/documento/" + id, "");
  archivos.value = res.asignable;
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

const getEstatus = async () => {
  let res = await sendRequest("GET", null, "/api/estatus/all", "");
  status.value = res;
};

const visibleColumns = ref(["nombre", "created_at", "opciones"]);

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true
  },
  {
    name: "path",
    label: "Path",
    align: "left",
    field: "path",
    sortable: true
  },
  {
    name: "tamano_de_archivo",
    label: "Tamaño del archivo",
    align: "left",
    field: "tamano_de_archivo",
    sortable: true
  },
  {
    name: "tipo_de_archivo",
    label: "Tipo de archivo",
    align: "left",
    field: "tipo_de_archivo",
    sortable: true
  },
  {
    name: "created_at",
    label: "Fecha de creacion",
    align: "left",
    field: "created_at",
    sortable: true
  },
  {
    name: "opciones",
    label: "Opciones",
    align: "left",
    field: "opciones",
    sortable: true
  }
];

const uploadFile = async () => {
  const formData = new FormData();
  formData.append("file", model.value);
  formData.append("asignableId", requisito.pivot.id);
  try {
    let res = await api.post(
      `/documento/uploadFile/${requisito.pivot.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      }
    );
    model.value = null;
    cargarArchivos();
    bus.emit("archivo-subido");
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const show = (archivoId) => {
  window.open(archivoId.path_absolute, "_blank");
};

const borrar = async (archivoId) => {
  try {
    let res = await sendRequest(
      "DELETE",
      null,
      "/api/archivo/" + archivoId,
      ""
    );
    cargarArchivos();
    bus.emit("archivo-subido");
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const formRequisito = ref({
  requisito_id: requisito.pivot.requisito_id,
  expediente_id: requisito.pivot.expediente_id,
  fecha_de_vencimiento: requisito.pivot.fecha_de_vencimiento,
  comentario: requisito.pivot.comentario,
  estatus_id: requisito.pivot.estatus_id
});

onMounted(() => {
  getEstatus();
  cargarArchivos();
});

defineExpose({
  formRequisito
});
</script>
