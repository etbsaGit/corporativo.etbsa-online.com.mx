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
            :rules="[(val) => val !== null || 'Obligatorio']"
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
            counter
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
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { api } from "boot/axios";

const { requisito, archivos } = defineProps(["requisito", "archivos"]);

const myForm = ref(null);
const status = ref([]);
const model = ref(null);

const getEstatus = async () => {
  let res = await sendRequest("GET", null, "/api/estatus/all", "");
  status.value = res;
};

const visibleColumns = ref(["nombre", "created_at"]);

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
  }
];

const uploadFile = async () => {
  const formData = new FormData();
  formData.append("file", model.value);
  formData.append("asignableId", requisito.id);
  try {
    let res = await api.post("/archivo/uploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    });
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
});

defineExpose({
  formRequisito
});
</script>
