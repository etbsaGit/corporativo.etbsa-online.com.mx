<template>
  <div class="q-pa-md">
    <q-card>
      <div class="q-pa-md">
        <q-btn
          label="Registrar Empleado"
          color="primary"
          @click="showAdd = true"
          icon="person_add"
        />

        <div><br /></div>

        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
        />

        <div><br /></div>

        <q-input
          outlined
          class="boton"
          color="green-9"
          v-model="searchTerm"
          label="Buscar empleado"
        >
          <template v-slot:prepend>
            <q-icon name="person_search" />
          </template>

          <template v-slot:before>
            <q-btn color="primary" icon="search" label="Busqueda avanzada" stack @click="onClick" />
          </template>
        </q-input>

        <br />

        <q-table
          flat
          bordered
          title="Empleados"
          :rows="filteredEmployees"
          :columns="columns"
          row-key="name"
          :visible-columns="visibleColumns"
          dense
          :rows-per-page-options="[0]"
          
        >
          <template v-slot:top-right>
            <q-btn
              color="primary"
              icon-right="archive"
              label="Export to csv"
              no-caps
              @click="exportTable"
            />
          </template>

          <template v-slot:top="props">
            <div class="col-2 q-table__title">Empleados</div>

            <q-dialog
              v-model="showAdd"
              transition-show="rotate"
              transition-hide="rotate"
              persistent
            >
              <q-card style="width: 1800px">
                <q-card-section>
                  <div class="text-h6">Registrar Empleado</div>
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
                      <add-employeed-form ref="form_1"></add-employeed-form>
                    </q-tab-panel>

                    <q-tab-panel name="tab_form_two">
                      <add-employeedtwo-form
                        ref="form_2"
                      ></add-employeedtwo-form>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card>

                <q-separator />

                <q-card-actions align="right">
                  <q-btn label="Cancelar" color="red" v-close-popup />
                  <q-btn
                    :disable="!form_1 || !form_2"
                    label="Registrar"
                    color="blue"
                    @click="crearEmpleado()"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!-- ------------------------------------------------ -->
            <q-space />

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

            <q-btn
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md"
            />
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

          <template v-slot:body-cell-expediente="props">
            <q-td @click="onRowClickFile(props.row)">
              <q-btn flat round color="primary" icon="folder" />
            </q-td>
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
          <template v-slot:body-cell-estado_civil="props">
            <q-td :props="props">
              {{ props.row.estado_civil.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-escolaridad="props">
            <q-td :props="props">
              {{ props.row.escolaridad.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-tipo_de_sangre="props">
            <q-td :props="props">
              {{ props.row.tipo_de_sangre.nombre }}
            </q-td>
          </template>
          <template v-slot:body-cell-jefe_directo="props">
            <q-td :props="props">
              <template v-if="props.row.jefe_directo">
                {{ props.row.jefe_directo.nombre }}
              </template>
            </q-td>
          </template>
        </q-table>
        <!-- ------------------------------------------------------------------- -->
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
        <!-- ---------------------------------------------------------------------------- -->
        <q-dialog
          v-model="showFiles"
          transition-show="rotate"
          transition-hide="rotate"
          full-width
          persistent
        >
          <q-card style="width: 1800px">
            <q-card-section>
              <div class="text-h6">
                Expediente de {{ selectedEmployee.nombre }}
                {{ selectedEmployee.apellido_paterno }}
                {{ selectedEmployee.apellido_materno }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card style="height: 70vh" class="q-pa-none scroll" flat>
              <q-tab-panels v-model="tab2" animated keep-alive>
                <q-tab-panel name="tab_form_three">
                  <edit-employeedthree-form
                    ref="edit_3"
                    :empleado="selectedEmployee"
                  />
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </q-card>
        </q-dialog>
        <!-- -------------------------------------------------------------------------------- -->
        <q-dialog
          v-model="showFilters"
          transition-show="rotate"
          transition-hide="rotate"
          full-width
          full-height
          persistent
        >
          <q-card>
            <q-card-section>
              <div class="text-h6">
               Filtrar empleados
              </div>
            </q-card-section>
            <q-separator />
            <q-card style="height: 82vh" class="q-pa-none scroll" flat>
              <q-card-section>

                <filter-employeed
                  ref="edit_4"
                  :empleados="employees"
                />
              </q-card-section>
            </q-card>
            <q-separator />
            <q-card-actions align="right">
              <q-btn label="Cancelar" color="red" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AddEmployeedForm from "src/components/Employeed/AddEmployeedForm.vue";
import AddEmployeedtwoForm from "src/components/Employeed/AddEmployeedtwoForm.vue";
import EditEmployeedForm from "src/components/Employeed/EditEmployeedForm.vue";
import EditEmployeedtwoForm from "src/components/Employeed/EditEmployeedtwoForm.vue";
import EditEmployeedthreeForm from "src/components/Employeed/EditEmployeedthreeForm.vue";
import FilterEmployeed from "src/components/Employeed/FilterEmployeed.vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar, exportFile } from "quasar";
import { inject } from "vue";

const form_1 = ref(null);
const form_2 = ref(null);
const edit_1 = ref(null);
const edit_2 = ref(null);
const edit_3 = ref(null);
const edit_4 = ref(null)
const edit1_valid = ref()
const edit2_valid = ref()

const $q = useQuasar();

const showDetails = ref(false);
const showFiles = ref(false);
const selectedEmployee = ref(null);

const bus = inject("bus"); // inside setup()

const visibleColumns = ref([
  "id",
  "nombre",
  "apellido_paterno",
  "apellido_materno",
  "sucursal",
  "linea",
  "departamento",
  "puesto",
  "expediente"
]);

const tab = ref("tab_form_one");
const tab2 = ref("tab_form_three");
const tab4 = ref("tab_form_four");
const searchTerm = ref("");
const showAdd = ref(false);
const showFilters = ref(false);
const employees = ref([]);

const onRowClick = (row) => {
  selectedEmployee.value = row;
  showDetails.value = true;
};

const onRowClickFile = (row) => {
  selectedEmployee.value = row;
  showFiles.value = true;
};

const onClick = () => {
  showFilters.value = true;
};

const crearEmpleado = async () => {
  const form1_valid = await form_1.value.validate();
  const form2_valid = await form_2.value.validate();
  if (!form1_valid || !form2_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios"
    });
    return;
  }
  const final = {
    ...form_1.value.formEmployee,
    ...form_2.value.formEmployeetwo
  };
  try {
    let res = await sendRequest("POST", final, "/api/empleado", "");

    showAdd.value = false;
    getEmployees();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
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
    getEmployees();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const getEmployees = async () => {
  let res = await sendRequest("GET", null, "/api/empleado/all", "");
  employees.value = res;
};

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
    name: "segundo_nombre",
    label: "Segundo nombre",
    align: "left",
    field: "segundo_nombre",
    sortable: true
  },
  {
    name: "apellido_paterno",
    label: "Apellido Paterno",
    align: "left",
    field: "apellido_paterno",
    sortable: true
  },
  {
    name: "apellido_materno",
    label: "Apellido Materno",
    align: "left",
    field: "apellido_materno",
    sortable: true
  },
  {
    name: "telefono",
    label: "Telefono",
    align: "left",
    field: "telefono",
    sortable: true
  },
  {
    name: "telefono_institucional",
    label: "Telefono institucional",
    align: "left",
    field: "telefono_institucional",
    sortable: true
  },
  {
    name: "correo_institucional",
    label: "Correo institucional",
    align: "left",
    field: "correo_institucional",
    sortable: true
  },
  {
    name: "fecha_de_nacimiento",
    label: "Fecha de nacimiento",
    align: "left",
    field: "fecha_de_nacimiento",
    sortable: true
  },
  {
    name: "rfc",
    label: "RFC",
    align: "left",
    field: "rfc",
    sortable: true
  },
  {
    name: "ine",
    label: "INE",
    align: "left",
    field: "ine",
    sortable: true
  },
  {
    name: "pasaporte",
    label: "Pasaporte",
    align: "left",
    field: "pasaporte",
    sortable: true
  },
  {
    name: "visa",
    label: "VISA",
    align: "left",
    field: "visa",
    sortable: true
  },
  {
    name: "licencia_de_manejo",
    label: "Licencia de manejo",
    align: "left",
    field: "licencia_de_manejo",
    sortable: true
  },
  {
    name: "nss",
    label: "NSS",
    align: "left",
    field: "nss",
    sortable: true
  },
  {
    name: "fecha_de_ingreso",
    label: "Fecha de ingreso",
    align: "left",
    field: "fecha_de_ingreso",
    sortable: true
  },
  {
    name: "hijos",
    label: "Hijos",
    align: "left",
    field: "hijos",
    sortable: true
  },
  {
    name: "dependientes_economicos",
    label: "Depandientes economicos",
    align: "left",
    field: "dependientes_economicos",
    sortable: true
  },
  {
    name: "estado_civil",
    label: "Estado civil",
    align: "left",
    field: "estado_civil",
    sortable: true
  },
  {
    name: "tipo_de_sangre",
    label: "Tipo de sangre",
    align: "left",
    field: "tipo_de_sangre",
    sortable: true
  },
  {
    name: "escolaridad",
    label: "Escolaridad",
    align: "left",
    field: "escolaridad",
    sortable: true
  },
  {
    name: "cedula_profesional",
    label: "Cedula profecional",
    align: "left",
    field: "cedula_profesional",
    sortable: true
  },
  {
    name: "sueldo_base",
    label: "Sueldo base",
    align: "left",
    field: "sueldo_base",
    sortable: true
  },
  {
    name: "comision",
    label: "Comision",
    align: "left",
    field: "comision",
    sortable: true
  },
  {
    name: "numero_exterior",
    label: "Numero exterior",
    align: "left",
    field: "numero_exterior",
    sortable: true
  },
  {
    name: "numero_interior",
    label: "Numero interior",
    align: "left",
    field: "numero_interior",
    sortable: true
  },
  {
    name: "calle",
    label: "Calle",
    align: "left",
    field: "calle",
    sortable: true
  },
  {
    name: "colonia",
    label: "Colonia",
    align: "left",
    field: "colonia",
    sortable: true
  },
  {
    name: "codigo_postal",
    label: "Codigo postal",
    align: "left",
    field: "codigo_postal",
    sortable: true
  },
  {
    name: "ciudad",
    label: "Ciudad",
    align: "left",
    field: "ciudad",
    sortable: true
  },
  {
    name: "estado",
    label: "Estado",
    align: "left",
    field: "estado",
    sortable: true
  },
  {
    name: "cuenta_bancaria",
    label: "Cuenta bancaria",
    align: "left",
    field: "cuenta_bancaria",
    sortable: true
  },
  {
    name: "status",
    label: "Status",
    align: "left",
    field: "status",
    sortable: true
  },
  {
    name: "sucursal",
    label: "Sucursal",
    align: "left",
    field: "sucursal",
    sortable: true
  },
  {
    name: "linea",
    label: "Linea",
    align: "left",
    field: "linea",
    sortable: true
  },
  {
    name: "departamento",
    label: "Departamento",
    align: "left",
    field: "departamento",
    sortable: true
  },
  {
    name: "puesto",
    label: "Puesto",
    align: "left",
    field: "puesto",
    sortable: true
  },
  {
    name: "jefe_directo",
    label: "Jefe directo",
    align: "left",
    field: "jefe_directo",
    sortable: true
  },
  {
    name: "descripcion_puesto",
    label: "Descripcion puesto",
    align: "left",
    sortable: true
  },
  {
    name: "expediente",
    label: "Expediente",
    align: "left",
    sortable: true
  },
];

const filteredEmployees = computed(() => {
  return employees.value.filter((employee) => {
    return (
      employee.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      employee.apellido_paterno
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.apellido_materno
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.sucursal.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.linea.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.departamento.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      employee.puesto.nombre
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    );
  });
});

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
      filteredEmployees.value.map((row) =>
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

bus.on("cargar_empleados", () => {
  getEmployees();
  showDetails.value = false;
});

onMounted(() => {
  getEmployees();
});
</script>

<style>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>
