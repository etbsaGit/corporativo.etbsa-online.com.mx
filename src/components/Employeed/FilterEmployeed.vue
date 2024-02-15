<template>
   <q-form class="q-gutter-y-sm" ref="myForm">
    <q-item>
        <q-item-section>
            <q-select
              v-model="formFilter.sucursal_id"
              :options="sucursales"
              label="Sucursal"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              filled
              dense
              />
        </q-item-section>
        <q-item-section>
            <q-select
              v-model="formFilter.linea_id"
              :options="lineas"
              label="Linea"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              filled
              dense
              />
        </q-item-section>
        <q-item-section>
            <q-select
              v-model="formFilter.departamento_id"
              :options="departamentos"
              label="Departamentos"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              clearable
              filled
              dense
              />
        </q-item-section>
        <q-item-section>
            <q-btn color="primary" icon="search" label="Buscar" dense filled @click="filter"/>
        </q-item-section>
    </q-item>
    <q-separator/>
    <q-item>
        <div style="width: 100%;">
            <q-table
                flat
                bordered
                title="Empleados encontrados"
                dense
                :rows="empleados"
                :columns="columns"
                row-key="name"
            >
            <template v-slot:top-right>
                <q-btn
                v-if="empleados.length > 0"
                color="primary"
                icon-right="archive"
                label="Export to csv"
                no-caps
                @click="exportTable"
                dense
                />
            </template>
            <template v-slot:body-cell-puesto="props">
            <q-td :props="props">
              {{ props.row.puesto.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-sucursal="props">
            <q-td :props="props">
              {{ props.row.sucursal.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-linea="props">
            <q-td :props="props">
              {{ props.row.linea.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-departamento="props">
            <q-td :props="props">
              {{ props.row.departamento.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-nombre="props">
            <q-td @click="onRowClick(props.row)">
              <q-item class="q-my-none" dense>
                <q-item-section avatar>
                  <q-avatar
                    color="primary"
                    text-color="white"
                    v-if="props.row.picture"
                  >
                    <img :src="props.row.picture" alt="Foto del empleado" />
                  </q-avatar>
                  <q-avatar v-else color="primary" text-color="white">
                    {{ props.row.nombre.charAt(0).toUpperCase()
                    }}{{ props.row.apellido_paterno.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ props.row.nombre }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
          </template>
        </q-table>
        </div>
    </q-item>

    <q-dialog
          v-model="showDetails"
          transition-show="rotate"
          transition-hide="rotate"
          persistent
        >
          <q-card style="width: 1800px">
            <q-card-section>
              <div class="text-h6">Actualizar Empleado</div>
            </q-card-section>
            <q-separator />

            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="tab_form_one" label="Datos Personales" />
              <q-tab name="tab_form_two" label="Unidad Negocio" />
            </q-tabs>

            <q-separator />
            <q-card style="height: 65vh" class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab" animated keep-alive>
                <q-tab-panel name="tab_form_one">
                  <edit-employeed-form
                    ref="edit_1"
                    :empleado="selectedEmployee"
                  ></edit-employeed-form>
                </q-tab-panel>

                <q-tab-panel name="tab_form_two">
                  <edit-employeedtwo-form
                    ref="edit_2"
                    :empleado="selectedEmployee"
                  ></edit-employeedtwo-form>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>

            <q-separator />

            <q-card-actions align="right">
              <q-btn label="Cancelar" color="red" v-close-popup />
              <q-btn
                :disable="!edit_1 || !edit_2"
                label="Actualizar"
                color="blue"
                @click="actualizarEmpleado()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

   </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar, exportFile } from "quasar";

import EditEmployeedForm from "src/components/Employeed/EditEmployeedForm.vue";
import EditEmployeedtwoForm from "src/components/Employeed/EditEmployeedtwoForm.vue";

//const { empleados } = defineProps(["empleados"]);

const sucursales = ref([])
const lineas = ref([])
const departamentos = ref([])
const empleados = ref([])
const showDetails = ref(false);
const selectedEmployee = ref(null);
const tab = ref("tab_form_one");
const edit_2 = ref(null);
const edit_1 = ref(null);
const edit1_valid = ref()
const edit2_valid = ref()

const formFilter = ref({
    sucursal_id: null,
    linea_id: null,
    departamento_id: null,
})

const columns = [
    { name: "id", label: "ID", field: "id", sortable: true, align: "left" },
    { name: "nombre", label: "Primer nombre", field: "nombre", sortable: true, align: "left" },
    { name: "segundo_nombre", label: "Segundo nombre", field: "segundo_nombre", sortable: true, align: "left" },
    { name: "apellido_paterno", label: "Apellido Paterno", field: "apellido_paterno", sortable: true, align: "left" },
    { name: "apellido_materno", label: "Apellido Materno", field: "apellido_materno", sortable: true, align: "left" },
    { name: "rfc", label: "RFC", align: "left", field: "rfc", sortable: true },
    { name: "ine", label: "INE", align: "left", field: "ine", sortable: true },
    { name: "sucursal", label: "Sucursal", align: "left", field: "sucursal", sortable: true },
    { name: "linea", label: "Linea", align: "left", field: "linea", sortable: true },
    { name: "departamento", label: "Departamento", align: "left", field: "departamento", sortable: true },
    { name: "puesto", label: "Puesto", align: "left", field: "puesto", sortable: true },
    { name: "jefe_directo", label: "Jefe directo", align: "left", field: "jefe_directo", sortable: true },
];

const wrapCsvValue = (val, formatFn, row) => {
    let formatted = formatFn !== undefined ? formatFn(val, row) : val;

    formatted =
        formatted === undefined || formatted === null ? "" : String(formatted);

    formatted = formatted.split('"').join('""');

    if (typeof val === "object" && val !== null) {
        // Si val es un objeto, intentamos acceder a una propiedad específica
        const propertyName = "nombre"; // Cambia 'nombre' por la propiedad que deseas mostrar
        formatted = val[propertyName] || ""; // Utilizamos 'nombre' como ejemplo
    }
    return `"${formatted}"`;
};


const exportTable = () => {
    const content = [columns.map((col) => wrapCsvValue(col.label))]
        .concat(
            empleados.value.map((row) =>
                columns
                    .map((col) =>
                        wrapCsvValue(
                            typeof col.field === "function"
                                ? col.field(row)
                                : row[col.field === undefined ? col.name : col.field],
                            col.format,
                            row
                        )
                    )
                    .join(",")
            )
        )
        .join("\r\n");

    const status = exportFile("employees-export.csv", content, "text/csv");

    if (status !== true) {
        $q.notify({
            message: "Browser denied file download...",
            color: "negative",
            icon: "warning"
        });
    }
};

const onRowClick = (row) => {
    selectedEmployee.value = row;
    showDetails.value = true;
};

const filter = async () => {
    const final = { ...formFilter.value }
    let res = await sendRequest("POST", final, "/api/empleado/filter", "")
    empleados.value = res
    console.log(formFilter.value);
};

const getSucursales = async () => {
    let res = await sendRequest("GET", null, "/api/sucursal/all", "");
    sucursales.value = res;
};

const getLineas = async () => {
    let res = await sendRequest("GET", null, "/api/linea/all", "");
    lineas.value = res;
};

const getDepartamentos = async () => {
    let res = await sendRequest("GET", null, "/api/departamento/all", "");
    departamentos.value = res;
};

const actualizarEmpleado = async () => {
    edit1_valid.value = await edit_1.value.validate();
    edit2_valid.value = await edit_2.value.validate();
    if (!edit1_valid.value || !edit2_valid.value) {
        $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "Por favor completa todos los campos obligatorios"
        });
        return;
    }
    const final = {
        ...edit_1.value.formEmployee,
        ...edit_2.value.formEmployeetwo
    };
    try {
        let res = await sendRequest("PUT", final, "/api/empleado/" + final.id, "");

        showDetails.value = false;
        filter();
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
    }
};

onMounted(() => {
    getSucursales()
    getLineas()
    getDepartamentos()
});

</script>