<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="filterForm.empleado_id"
        :options="filterEmpleados"
        label="Empleado"
        option-value="id"
        option-label="nombreCompleto"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        outlined
        dense
        clearable
        options-dense
        use-input
        @filter="filterFn"
        input-debounce="0"
        behavior="menu"
        @update:model-value="onInputChange"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> no options </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-item-section>
    <q-item-section side>
      <q-btn
        dense
        label="Crear solicitud"
        color="primary"
        @click="showAdd = true"
        icon="add_circle"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Solicitudes de vacaciones"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.validated == null || checkRole('RRHH')"
              dense
              color="primary"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-empleado="props">
          <q-td :props="props">
            {{ props.row.empleado.nombreCompleto }}
          </q-td>
        </template>

        <template v-slot:body-cell-fecha_inicio="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_inicio) }}
          </q-td>
        </template>

        <template v-slot:body-cell-fecha_termino="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_termino) }}
          </q-td>
        </template>

        <template v-slot:body-cell-fecha_regreso="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_regreso) }}
          </q-td>
        </template>

        <template v-slot:body-cell-created_at="props">
          <q-td :props="props">
            {{ formatDateSlim(props.row.created_at) }}
          </q-td>
        </template>

        <template v-slot:body-cell-updated_at="props">
          <q-td :props="props">
            {{ formatDateSlim(props.row.updated_at) }}
          </q-td>
        </template>

        <template v-slot:body-cell-validated="props">
          <q-td :props="props">
            <q-btn-dropdown
              :color="getDropdownProps(props.row.validated).color"
              :text-color="getDropdownProps(props.row.validated).textColor"
              :icon="getDropdownProps(props.row.validated).icon"
              :label="getDropdownProps(props.row.validated).label"
            >
              <q-list>
                <q-item
                  v-if="props.row.validated != 0"
                  clickable
                  v-close-popup
                  @click="putOff(props.row.id)"
                  class="bg-red"
                >
                  <q-item-section>
                    <q-chip
                      color="red"
                      text-color="white"
                      icon="disabled_by_default"
                      label="No autorizada"
                    />
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="props.row.validated != 1"
                  clickable
                  v-close-popup
                  @click="putOn(props.row.id)"
                  class="bg-green"
                >
                  <q-item-section>
                    <q-chip
                      color="green"
                      text-color="white"
                      icon="check_box"
                      label="Autorizada"
                    />
                  </q-item-section>
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
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
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
          <q-btn label="Agregar y notificar" color="blue" @click="postRow" />
        </q-item-section>
        <q-item-section side>
          <q-btn
            v-if="checkRole('RRHH')"
            label="Agregar sin notificar"
            color="blue"
            @click="onlyPostRow"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <vacation-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Editar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putRow" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <vacation-form ref="edit" :vacation="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";
import {
  formatDateplusoneSlim,
  formatDateSlim,
} from "src/boot/formatFunctions";

import VacationForm from "src/components/Vacation/VacationForm.vue";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const filterEmpleados = ref(null);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const empleados = ref([]);

const filterForm = ref({
  empleado_id: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
  },
  {
    name: "empleado",
    align: "left",
    field: "empleado",
    label: "Empleado",
  },
  {
    name: "anios_cumplidos",
    align: "left",
    field: "anios_cumplidos",
    label: "Años cumplidos",
  },
  {
    name: "dias_disfrute",
    align: "left",
    field: "dias_disfrute",
    label: "Dias",
  },
  {
    name: "fecha_inicio",
    align: "left",
    field: "fecha_inicio",
    label: "Fecha inicio",
  },
  {
    name: "fecha_termino",
    align: "left",
    field: "fecha_termino",
    label: "Fecha Termino",
  },
  {
    name: "fecha_regreso",
    align: "left",
    field: "fecha_regreso",
    label: "Fecha Regreso",
  },
  {
    name: "created_at",
    align: "left",
    field: "created_at",
    label: "Creado",
  },
  {
    name: "updated_at",
    align: "left",
    field: "updated_at",
    label: "Modificado",
  },
  {
    name: "validated",
    align: "left",
    field: "validated",
    label: "Autorizado",
  },
];

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/vacationDays", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getForms = async () => {
  const year = ref(new Date().getFullYear());
  let res = await sendRequest(
    "GET",
    null,
    "/api/vacationDay/forms/" + year.value,
    ""
  );
  empleados.value = res.empleados;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formVacation,
  };
  let res = await sendRequest("POST", final, "/api/vacationDay", "");
  showAdd.value = false;
  getRows(current_page.value);
};

const onlyPostRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formVacation,
  };
  let res = await sendRequest("POST", final, "/api/vacationDay/storeOnly", "");
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
    ...edit.value.formVacation,
  };
  let res = await sendRequest("PUT", final, "/api/vacationDay/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/vacationDay/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showEdit.value = false;
  getRows();
};

const putOn = async (id) => {
  let res = await sendRequest("GET", null, "/api/vacationDay/on/" + id, "");
  getRows(current_page.value);
};

const putOff = async (id) => {
  let res = await sendRequest("GET", null, "/api/vacationDay/off/" + id, "");
  getRows(current_page.value);
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

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterEmpleados.value = empleados.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterEmpleados.value = empleados.value.filter(
      (empleado) => empleado.nombreCompleto.toLowerCase().indexOf(needle) > -1
    );
  });
};

function getDropdownProps(validated) {
  if (validated === 0) {
    return {
      color: "red",
      textColor: "white",
      icon: "disabled_by_default",
      label: "No autorizada",
    };
  } else if (validated === 1) {
    return {
      color: "green",
      textColor: "white",
      icon: "check_box",
      label: "Autorizada",
    };
  } else {
    return {
      color: "orange",
      textColor: "white",
      icon: "check_box_outline_blank",
      label: "Pendiente",
    };
  }
}

onMounted(() => {
  getRows();
  getForms();
});
</script>
