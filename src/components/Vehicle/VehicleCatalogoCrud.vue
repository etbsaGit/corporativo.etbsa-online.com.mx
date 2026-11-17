<template>
  <div>
    <div class="row q-col-gutter-sm items-center q-mb-md">
      <div class="col-12 col-sm-6">
        <q-input
          outlined
          dense
          clearable
          label="Buscar por nombre"
          v-model="search"
          @update:model-value="onSearchChange"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 flex justify-end">
        <q-btn
          unelevated
          color="primary"
          icon="add_circle"
          :label="`Agregar ${singular.toLowerCase()}`"
          @click="openCreate"
        />
      </div>
    </div>

    <q-table
      flat
      bordered
      dense
      :title="titulo"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[0]"
      no-data-label="No se encontraron registros"
    >
      <template v-slot:body-cell-vehicles_count="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.vehicles_count > 0 ? 'primary' : 'grey-6'"
            :label="props.row.vehicles_count ?? 0"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            flat
            color="blue"
            icon="edit_square"
            @click="openEdit(props.row)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            color="red"
            icon="delete"
            :disable="(props.row.vehicles_count ?? 0) > 0"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>
              {{
                (props.row.vehicles_count ?? 0) > 0
                  ? "No se puede eliminar porque tiene vehículos asociados"
                  : "Eliminar"
              }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:bottom>
        <q-space />
        <td>
          <q-pagination
            v-if="lastPage > 1"
            color="primary"
            v-model="currentPage"
            :max="lastPage"
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

    <q-dialog v-model="showForm" persistent>
      <q-card style="min-width: 360px; max-width: 90vw">
        <q-item class="text-white bg-primary">
          <q-item-section>
            <q-item-label class="text-h6">
              {{ editingId ? `Editar ${singular}` : `Agregar ${singular}` }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn dense flat round icon="close" color="white" v-close-popup />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-form ref="formRef" @submit.prevent="saveRow">
          <q-card-section>
            <q-input
              v-model="form.nombre"
              outlined
              dense
              autofocus
              :label="`Nombre de ${singular.toLowerCase()} *`"
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) || 'El nombre es obligatorio',
              ]"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              :label="editingId ? 'Guardar cambios' : 'Guardar'"
              color="primary"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { sendRequest, dataIncomplete } from "src/boot/functions";

const props = defineProps({
  tipo: {
    type: String,
    required: true,
    validator: (val) => ["marcas", "modelos", "tipos"].includes(val),
  },
  titulo: {
    type: String,
    required: true,
  },
  singular: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["updated"]);

const $q = useQuasar();

const rows = ref([]);
const search = ref("");
const currentPage = ref(1);
const lastPage = ref(1);

const showForm = ref(false);
const formRef = ref(null);
const editingId = ref(null);
const form = ref({
  nombre: "",
});

const columns = [
  {
    name: "nombre",
    label: "Nombre",
    field: "nombre",
    align: "left",
    sortable: true,
  },
  {
    name: "vehicles_count",
    label: "Vehículos asociados",
    field: "vehicles_count",
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
  },
];

const getRows = async (page = 1) => {
  const params = new URLSearchParams({ page: String(page) });
  if (search.value && search.value.trim()) {
    params.append("search", search.value.trim());
  }

  const res = await sendRequest(
    "GET",
    null,
    `/api/vehicle/catalogos/${props.tipo}?${params.toString()}`
  );
  rows.value = res.data || [];
  currentPage.value = res.current_page || 1;
  lastPage.value = res.last_page || 1;
};

const openCreate = () => {
  editingId.value = null;
  form.value = { nombre: "" };
  showForm.value = true;
};

const openEdit = (row) => {
  editingId.value = row.id;
  form.value = { nombre: row.nombre };
  showForm.value = true;
};

const saveRow = async () => {
  const valid = await formRef.value.validate();
  if (!valid) {
    dataIncomplete();
    return;
  }

  const payload = { nombre: form.value.nombre.trim() };

  if (editingId.value) {
    await sendRequest(
      "PUT",
      payload,
      `/api/vehicle/catalogos/${props.tipo}/${editingId.value}`
    );
  } else {
    await sendRequest("POST", payload, `/api/vehicle/catalogos/${props.tipo}`);
  }

  showForm.value = false;
  emit("updated");
  await getRows(currentPage.value);
};

const confirmDelete = (row) => {
  $q.dialog({
    title: `Eliminar ${props.singular.toLowerCase()}`,
    message: `¿Estás seguro de eliminar "${row.nombre}"?`,
    cancel: {
      label: "Cancelar",
      flat: true,
      color: "grey-7",
    },
    ok: {
      label: "Eliminar",
      color: "red",
      unelevated: true,
    },
    persistent: true,
  }).onOk(async () => {
    await sendRequest(
      "DELETE",
      null,
      `/api/vehicle/catalogos/${props.tipo}/${row.id}`
    );
    emit("updated");
    await getRows(currentPage.value);
  });
};

let searchTimeout = null;
const onSearchChange = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    getRows(1);
  }, 500);
};

watch(currentPage, (newPage) => {
  getRows(newPage);
});

onMounted(() => {
  getRows(1);
});
</script>
