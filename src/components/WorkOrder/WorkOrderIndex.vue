<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar por OT, Maquina o cliente"
        v-model="filterForm.search"
        @update:model-value="onInputChange"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-item-section>
    <q-item-section side>
      <q-btn
        dense
        color="primary"
        label="Agregar Order de trabajo"
        @click="onClickAdd"
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        dense
        :rows-per-page-options="[0]"
        title="Ordenes de trabajo"
        :rows="wos"
        :columns="columns"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="toggleExpand(props.row)"
                :icon="props.row._expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td key="ot" :props="props">
              {{ props.row.ot }}
            </q-td>
            <q-td key="cliente" :props="props">
              {{
                props.row.cliente && props.row.cliente.length > 20
                  ? props.row.cliente.slice(0, 20) + "..."
                  : props.row.cliente
              }}
              <q-tooltip
                class="bg-purple text-body2"
                v-if="props.row.cliente && props.row.cliente.length > 20"
              >
                {{ props.row.cliente }}
              </q-tooltip>
            </q-td>
            <q-td key="maquina" :props="props">
              {{
                props.row.maquina && props.row.maquina.length > 20
                  ? props.row.maquina.slice(0, 20) + "..."
                  : props.row.maquina
              }}
              <q-tooltip
                class="bg-purple text-body2"
                v-if="props.row.maquina && props.row.maquina.length > 20"
              >
                {{ props.row.maquina }}
              </q-tooltip>
            </q-td>
            <q-td key="fecha_ingreso" :props="props">
              {{ formatDateplusoneSlim(props.row.fecha_ingreso) }}
            </q-td>

            <q-td key="fecha_entrega" :props="props">
              {{ formatDateplusoneSlim(props.row.fecha_entrega) }}
            </q-td>
            <q-td key="mano_obra" :props="props">
              {{ formatCurrency(props.row.mano_obra) }}
            </q-td>
            <q-td key="refacciones" :props="props">
              {{ formatCurrency(props.row.refacciones) }}
            </q-td>
            <q-td key="total_factura" :props="props">
              {{
                formatCurrency(
                  total_factura(props.row.refacciones, props.row.mano_obra)
                )
              }}
            </q-td>
            <q-td key="tecnico" :props="props">
              <q-avatar
                color="primary"
                text-color="white"
                v-if="props.row.tecnico.picture"
              >
                <img :src="props.row.tecnico.picture" alt="Foto del empleado" />
              </q-avatar>
              <q-avatar v-else color="primary" text-color="white">
                {{ props.row.tecnico.nombre.charAt(0).toUpperCase()
                }}{{
                  props.row.tecnico.apellido_paterno.charAt(0).toUpperCase()
                }}
              </q-avatar>
              {{ props.row.tecnico.nombre }}
              {{ props.row.tecnico.apellido_paterno }}
            </q-td>
            <q-td key="estatus" :props="props">
              {{ props.row.estatus.nombre }}
            </q-td>
            <q-td key="bay" :props="props">
              {{ props.row.bay ? props.row.bay.nombre : null }}
            </q-td>
            <q-td key="actions">
              <q-btn-dropdown flat color="primary" icon="menu" dense>
                <q-list v-close-popup>
                  <q-item>
                    <q-btn
                      @click="onClickEdit(props.row)"
                      flat
                      size="sm"
                      label="Editar"
                      color="blue"
                      icon="edit"
                    />
                  </q-item>
                  <q-item>
                    <q-btn
                      @click="onClickDocs(props.row)"
                      flat
                      size="sm"
                      label="Archivos"
                      color="green"
                      icon="folder"
                    />
                  </q-item>
                  <q-item>
                    <q-btn
                      @click="onClickDelete(props.row)"
                      flat
                      size="sm"
                      label="Borrar"
                      color="red"
                      icon="delete"
                    />
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </q-tr>
          <q-tr v-show="props.row._expand" :props="props">
            <q-td colspan="100%" class="bg-blue-grey-12">
              <q-item class="text-center">
                <q-item-section>
                  <div><strong>Descripcion:</strong></div>
                  <div>{{ props.row.descripcion }}</div>
                </q-item-section>
                <q-item-section>
                  <strong>Comentarios:</strong>
                  {{ props.row.comentarios }}
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item class="text-center">
                <q-item-section>
                  <strong>Horas facturadas:</strong>
                  {{ props.row.horas_facturadas }}
                </q-item-section>
                <q-item-section>
                  <strong>Horas reales:</strong>
                  {{ props.row.horas_reales }}
                </q-item-section>
                <q-item-section>
                  <strong>Tipo:</strong>
                  {{ props.row.type.nombre }}
                </q-item-section>
                <q-item-section>
                  <strong>Estatus del taller:</strong>
                  {{ props.row.estatus_taller.nombre }}
                </q-item-section>
                <q-item-section>
                  <strong>Linea:</strong>
                  {{ props.row.linea.nombre }}
                </q-item-section>
                <q-item-section>
                  <strong>Sucursal:</strong>
                  {{ props.row.sucursal.nombre }}
                </q-item-section>
              </q-item>
            </q-td>
          </q-tr>
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

  <q-dialog
    v-model="add"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="width: 100%">
      <q-card-section
        class="d-flex justify-between items-center q-pa-sm bg-primary text-white"
      >
        <div class="text-h6">Agregar orden de trabajo</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Guardar" color="blue" @click="storeWO" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <work-order-form ref="addForm" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="edit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="width: 100%">
      <q-card-section
        class="d-flex justify-between items-center q-pa-sm bg-primary text-white"
      >
        <div class="text-h6">Editar orden de trabajo</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn label="Guardar" color="blue" @click="putWO" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <work-order-form ref="editForm" :wo="selectedWO" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="docs"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section
        class="d-flex justify-between items-center q-pa-sm bg-primary text-white"
      >
        <div class="text-h6">Documentos</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup @click="getWOS" />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="q-pa-sm">
        <work-order-docs-list :wo="selectedWO" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="deleteWO"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6"> Borrar Orden de trabajo </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="DestroyWO" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <q-item-label align="center" class="text-h6">
            <strong>
              ¿Deseas borrar la orden "{{ selectedWO.ot }}" y todos sus archivos
              adjuntos?
            </strong>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import {
  formatDateplusoneSlim,
  formatCurrency,
} from "src/boot/formatFunctions";

import WorkOrderForm from "./WorkOrderForm.vue";
import WorkOrderDocsList from "./WorkOrderDocsList.vue";

const wos = ref([]);
const selectedWO = ref(null);
const docs = ref(false);
const add = ref(false);
const edit = ref(false);
const deleteWO = ref(false);
const addForm = ref(null);
const editForm = ref(null);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  tecnico_id: null,
});

const columns = [
  {
    name: "expancion_item",
    field: "expancion_item",
    align: "left",
  },
  {
    name: "ot",
    label: "OT",
    field: "ot",
    sortable: true,
    align: "left",
  },
  {
    name: "cliente",
    label: "Cliente",
    field: "cliente",
    sortable: true,
    align: "left",
  },
  {
    name: "maquina",
    label: "Maquina",
    field: "maquina",
    sortable: true,
    align: "left",
  },
  {
    name: "fecha_ingreso",
    label: "Fecha de ingreso",
    field: "fecha_ingreso",
    sortable: true,
    align: "left",
  },
  {
    name: "fecha_entrega",
    label: "Fecha de entrega",
    field: "fecha_entrega",
    sortable: true,
    align: "left",
  },
  {
    name: "mano_obra",
    label: "Mano de obra",
    field: "mano_obra",
    sortable: true,
    align: "left",
  },
  {
    name: "refacciones",
    label: "Refacciones",
    field: "refacciones",
    sortable: true,
    align: "left",
  },
  {
    name: "total_factura",
    label: "Total factura",
    field: "total_factura",
    sortable: true,
    align: "left",
  },
  {
    name: "tecnico",
    label: "Tecnico",
    field: "tecnico",
    sortable: true,
    align: "left",
  },
  {
    name: "estatus",
    label: "Estatus",
    field: "estatus",
    sortable: true,
    align: "left",
  },
  {
    name: "bay",
    label: "Bahia",
    field: "bay",
    sortable: true,
    align: "left",
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    sortable: true,
    align: "left",
  },
];

const total_factura = (mano_obra, refa) => {
  const manoObra = Number(mano_obra);
  const refacciones = Number(refa);
  const manoObraNumber = isNaN(manoObra) ? 0 : manoObra;
  const refaccionesNumber = isNaN(refacciones) ? 0 : refacciones;
  const subtotal = (manoObraNumber + refaccionesNumber) * 1.16;
  return subtotal.toFixed(2); // Redondea el resultado a dos decimales
};

const toggleExpand = (row) => {
  // Toggle expand state for the clicked row
  row._expand = !row._expand;
};

const onClickAdd = () => {
  add.value = true;
};
const onClickEdit = (wo) => {
  selectedWO.value = wo;
  edit.value = true;
};
const onClickDelete = (wo) => {
  selectedWO.value = wo;
  deleteWO.value = true;
};
const onClickDocs = (wo) => {
  selectedWO.value = wo;
  docs.value = true;
};

const getWOS = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/wos/getAll", "");
  wos.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const storeWO = async () => {
  const add_valid = await addForm.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...addForm.value.formWO,
  };
  let res = await sendRequest("POST", final, "/api/workOrder", "");
  add.value = false;
  getWOS(current_page.value);
};

const putWO = async () => {
  const edit_valid = await editForm.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...editForm.value.formWO,
  };
  let res = await sendRequest("PUT", final, "/api/workOrder/" + final.id, "");
  edit.value = false;
  getWOS(current_page.value);
};

const DestroyWO = async () => {
  const id = selectedWO.value.id;
  let res = await sendRequest("DELETE", null, "/api/workOrder/" + id, "");
  deleteWO.value = false;
  getWOS();
};

watch(current_page, (newPage) => {
  getWOS(newPage);
});

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getWOS();
  }, 2000);
};

onMounted(() => {
  getWOS();
});
</script>
