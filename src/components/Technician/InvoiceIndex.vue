<template>
  <q-item>
    <q-btn
      dense
      label="Agregar factura"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />
  </q-item>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Facturas"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              dense
              color="primary"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-wo="props">
          <q-td :props="props">
            <q-item>
              <q-item-section>
                <q-item-label caption v-if="props.row.wo.ot">
                  {{ props.row.wo.ot }}
                </q-item-label>
                <q-item-label>
                  {{ props.row.wo.maquina }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

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
          <q-btn label="Agregar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <invoice-form ref="add" :employee="empleado" />
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
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putItem" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="destroyItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <invoice-form
            ref="edit"
            :invoice="selectedItem"
            :employee="empleado"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const $q = useQuasar();

import InvoiceForm from "src/components/Technician/InvoiceForm.vue";

const { employee } = defineProps(["employee"]);

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const empleado = ref(employee);

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
  },
  {
    name: "folio",
    align: "left",
    field: "folio",
    label: "Folio",
  },

  {
    name: "cantidad",
    align: "left",
    field: "cantidad",
    label: "Monto",
  },
  {
    name: "fecha",
    align: "left",
    field: "fecha",
    label: "Fecha",
  },
  {
    name: "horas_facturadas",
    align: "left",
    field: "horas_facturadas",
    label: "Horas facturadas",
  },
  {
    name: "wo",
    align: "left",
    field: "wo",
    label: "wo",
  },
];

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const getRows = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/techniciansInvoice/" + employee.id,
    ""
  );
  rows.value = res;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...add.value.formInvoice,
  };
  let res = await sendRequest("POST", final, "/api/techniciansInvoice", "");
  showAdd.value = false;
  getRows();
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...edit.value.formInvoice,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/techniciansInvoice/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows();
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/techniciansInvoice/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  getRows();
};

onMounted(() => {
  getRows();
});
</script>
