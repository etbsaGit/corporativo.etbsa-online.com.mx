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
        @click="add = true"
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
        <template v-slot:body-cell-fecha_ingreso="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_ingreso) }}
          </q-td>
        </template>
        <template v-slot:body-cell-fecha_entrega="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_entrega) }}
          </q-td>
        </template>
        <template v-slot:body-cell-mano_obra="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.mano_obra) }}
          </q-td>
        </template>
        <template v-slot:body-cell-refacciones="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.refacciones) }}
          </q-td>
        </template>
        <template v-slot:body-cell-km="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.km) }}
          </q-td>
        </template>
        <template v-slot:body-cell-foraneo="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.foraneo) }}
          </q-td>
        </template>
        <template v-slot:body-cell-total_factura="props">
          <q-td :props="props">
            {{
              formatCurrency(
                total_factura(
                  props.row.refacciones,
                  props.row.mano_obra,
                  props.row.km,
                  props.row.foraneo
                )
              )
            }}
          </q-td>
        </template>

        <template v-slot:body-cell-cliente="props">
          <q-td :props="props">
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
        </template>

        <template v-slot:body-cell-maquina="props">
          <q-td :props="props">
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
        </template>

        <template v-slot:body-cell-tecnico="props">
          <q-td :props="props">
            <q-avatar
              color="primary"
              text-color="white"
              v-if="props.row.tecnico.picture"
            >
              <img :src="props.row.tecnico.picture" alt="Foto del empleado" />
            </q-avatar>
            <q-avatar v-else color="primary" text-color="white">
              {{ props.row.tecnico.nombre.charAt(0).toUpperCase()
              }}{{ props.row.tecnico.apellido_paterno.charAt(0).toUpperCase() }}
            </q-avatar>
            {{ props.row.tecnico.nombre }}
            {{ props.row.tecnico.apellido_paterno }}
          </q-td>
        </template>

        <template v-slot:body-cell-estatus="props">
          <q-td :props="props">
            {{ props.row.estatus.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-bay="props">
          <q-td :props="props">
            {{ props.row.bay?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
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
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Guardar" color="blue" @click="storeWO" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item class="q-pa-none">
        <q-item-section>
          <work-order-form ref="addForm" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="edit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putWO" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item class="q-pa-none">
        <q-item-section>
          <work-order-form ref="editForm" :wo="selectedWO" />
        </q-item-section>
      </q-item>
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
  // {
  //   name: "mano_obra",
  //   label: "Mano de obra",
  //   field: "mano_obra",
  //   sortable: true,
  //   align: "left",
  // },
  // {
  //   name: "refacciones",
  //   label: "Refacciones",
  //   field: "refacciones",
  //   sortable: true,
  //   align: "left",
  // },
  // {
  //   name: "km",
  //   label: "KM",
  //   field: "km",
  //   sortable: true,
  //   align: "left",
  // },
  // {
  //   name: "foraneo",
  //   label: "Foraneo",
  //   field: "foraneo",
  //   sortable: true,
  //   align: "left",
  // },
  {
    name: "total_factura",
    label: "Monto total",
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

const total_factura = (mano_obra, refa, km, fora) => {
  const manoObra = Number(mano_obra);
  const refacciones = Number(refa);
  const KM = Number(km);
  const foraneo = Number(fora);
  const manoObraNumber = isNaN(manoObra) ? 0 : manoObra;
  const refaccionesNumber = isNaN(refacciones) ? 0 : refacciones;
  const kmNumber = isNaN(KM) ? 0 : KM;
  const foraneoNumber = isNaN(foraneo) ? 0 : foraneo;
  const subtotal =
    (manoObraNumber + refaccionesNumber + kmNumber + foraneoNumber) * 1.16;
  return subtotal.toFixed(2); // Redondea el resultado a dos decimales
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
  }, 1000);
};

onMounted(() => {
  getWOS();
});
</script>
