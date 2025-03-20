<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar"
        v-model="filterForm.search"
        @update:model-value="onInputChange"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-item-section>
    <q-item-section avatar>
      <q-btn
        rounded
        color="primary"
        @click="showAdd = true"
        icon="add_circle"
      />
    </q-item-section>
    <q-item-section avatar v-if="checkRole('Admin')">
      <q-btn rounded color="red" @click="getOnlyTrashed()" icon="delete_sweep">
        <q-tooltip
          anchor="center left"
          self="center right"
          class="bg-red text-body2"
        >
          Obtener registros eliminados
        </q-tooltip>
      </q-btn>
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Buzon"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              v-if="checkRole('RRHH')"
              dense
              color="primary"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-user="props">
          <q-td :props="props">
            {{
              props.row.user.empleado?.nombreCompleto || props.row.user.email
            }}
          </q-td>
        </template>

        <template v-slot:body-cell-estatus="props">
          <q-td :props="props">
            {{ props.row.estatus.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-feedback="props">
          <q-td :props="props">
            <q-item dense v-if="props.row.feedback">
              <q-item-section avatar>
                <q-icon name="info">
                  <q-tooltip
                    anchor="center left"
                    self="center right"
                    class="bg-blue text-body2"
                  >
                    {{ props.row.feedback }}
                  </q-tooltip>
                </q-icon>
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-application="props">
          <q-td :props="props">
            <q-chip
              class="glossy text-white"
              :icon="
                props.row.application === 1
                  ? 'check'
                  : props.row.application === 0
                  ? 'close'
                  : 'hourglass_top'
              "
              :color="
                props.row.application === 1
                  ? 'green'
                  : props.row.application === 0
                  ? 'red'
                  : 'amber'
              "
              :label="
                props.row.application === 1
                  ? 'Concedida'
                  : props.row.application === 0
                  ? 'Rechazada'
                  : 'En proceso'
              "
            />
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              class="glossy text-white"
              :icon="
                props.row.status === 1
                  ? 'verified'
                  : props.row.status === 0
                  ? 'hourglass_top'
                  : 'hourglass_top'
              "
              :color="
                props.row.status === 1
                  ? 'blue'
                  : props.row.status === 0
                  ? 'amber'
                  : 'amber'
              "
              :label="
                props.row.status === 1
                  ? 'Cerrada'
                  : props.row.status === 0
                  ? 'Abierta'
                  : 'En proceso'
              "
            />
          </q-td>
        </template>

        <template v-slot:top-right>
          <q-btn outline dense color="primary" @click="getRows" icon="refresh">
            <q-tooltip
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
              class="text-h6"
            >
              Recargar
            </q-tooltip>
          </q-btn>
        </template>

        <template v-slot:bottom>
          <q-space />
          <td>
            <q-pagination
              color="primary"
              v-model="current_page"
              :max="last_page"
              :max-pages="6"
              direction-links
              boundary-links
              gutter="10px"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </td>
          <q-space />
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-page-sticky position="bottom-right" :offset="[20, 20]">
    <div class="feedback-box">
      👉 ¡Tu opinión importa!
      <div class="q-mt-xs text-caption">
        Todos los comentarios serán revisados de manera confidencial y
        utilizados para mejorar el entorno de trabajo. No dudes en compartir tus
        ideas y preocupaciones.
      </div>
    </div>
  </q-page-sticky>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <suggestion-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side v-if="!selectedRow.deleted_at">
          <q-btn label="Actualizar" color="blue" @click="putRow" />
        </q-item-section>
        <q-item-section side v-if="!selectedRow.deleted_at">
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <suggestion-form ref="edit" :suggestion="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";

import SuggestionForm from "src/components/Suggestion/SuggestionForm.vue";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
  },
  {
    name: "title",
    label: "Titulo",
    align: "left",
    field: "title",
    sortable: false,
  },
  {
    name: "status",
    label: "Estatus",
    align: "left",
    field: "status",
    sortable: false,
  },
  {
    name: "application",
    label: "Solicitud",
    align: "left",
    field: "application",
    sortable: false,
  },
  {
    name: "estatus",
    label: "Tipo",
    align: "left",
    field: "estatus",
    sortable: false,
  },
  {
    name: "user",
    label: "Solicitante",
    align: "left",
    field: "user",
    sortable: false,
  },
  {
    name: "feedback",
    align: "left",
    field: "feedback",
    sortable: false,
  },
];

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const getOnlyTrashed = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/suggestion/trash", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/suggestions", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formSuggestion,
  };
  let res = await sendRequest("POST", final, "/api/suggestion", "");
  showAdd.value = false;
  getRows(current_page.value);
};

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formSuggestion,
  };
  let res = await sendRequest("PUT", final, "/api/suggestion/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/suggestion/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showEdit.value = false;
  getRows();
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getRows();
  }, 1000);
};

onMounted(() => {
  getRows();
});
</script>

<style scoped>
.feedback-box {
  background-color: #e3f2fd; /* Azul claro */
  color: #0d47a1; /* Azul oscuro */
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #90caf9;
  max-width: 320px;
  position: relative;
  right: 0; /* Cargado hacia la derecha */
  animation: pulse 1.5s infinite ease-in-out;
  font-size: 16px;
  font-weight: bold;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(33, 150, 243, 0.7);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
  }
}
</style>
