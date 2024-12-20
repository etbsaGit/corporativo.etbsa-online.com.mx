<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section class="items-center" avatar>
        <q-avatar size="180px" v-if="formEmployee.base64 || path">
          <q-img :src="formEmployee.base64 ? formEmployee.base64 : path" />
        </q-avatar>
        <q-avatar v-else size="180px">
          <q-icon name="account_box" />
        </q-avatar>
        <q-file
          clearable
          color="secondary"
          dense
          filled
          v-model="formEmployee.file"
          label="Subir foto"
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif"
          @clear="formEmployee.base64 = null"
          @input="convertirFile($event)"
        />
      </q-item-section>
      <q-item-section>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formEmployee.nombre"
              filled
              dense
              label="Primer Nombre"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.segundo_nombre"
              filled
              dense
              label="Segundo Nombre"
              hint="(opcional)"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.apellido_paterno"
              filled
              dense
              label="Apellido paterno"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.apellido_materno"
              filled
              dense
              label="Apellido materno"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formEmployee.telefono"
              filled
              dense
              label="Telefono"
              mask="(###) ### - ####"
              hint
              unmasked-value
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.telefono_institucional"
              filled
              dense
              label="Telefono Institucional"
              mask="(###) ### - ####"
              unmasked-value
              hint="Opcional"
              :rules="[
                (val) =>
                  !val ||
                  (val && /^\d{10}$/.test(val)) ||
                  'Debe tener 10 dígitos',
              ]"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.correo_institucional"
              filled
              dense
              label="Correo institucional"
              hint="Opcional"
              :rules="[
                (v) =>
                  !v || /.+@.+\..+/.test(v) || 'Formato de correo inválido',
              ]"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              filled
              readonly
              dense
              v-model="formEmployee.fecha_de_nacimiento"
              mask="date"
              label="Fecha de Nacimiento"
              hint
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formEmployee.fecha_de_nacimiento">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.curp"
              hint
              filled
              dense
              label="CURP"
            />
          </q-item-section>
          <q-item-section>
            <q-input v-model="formEmployee.rfc" filled dense label="RFC" hint />
            <!-- :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) => (val && val.length === 13) || 'El RFC debe tener exactamente 13 dígitos'
          ]" -->
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.nss"
              filled
              dense
              label="NSS"
              mask="###########"
              hint
            />
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
    <q-separator spaced />
    <q-item>
      <q-item-section>
        <q-input v-model="formEmployee.ine" filled dense label="INE" hint />
        <!-- :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) => (val && val.length === 10) || 'El INE debe tener exactamente 10 dígitos'
          ]" -->
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.licencia_de_manejo"
          filled
          dense
          label="Licencia de manejo"
          hint="(opcional)"
        />
        <!-- :rules="[
            (val) =>
              !val ||
              (val && val.length === 16) ||
              'La licencia debe tener exactamente 16 caracteres',
          ]" -->
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.passaporte"
          filled
          dense
          label="Pasaporte"
          hint="(opcional)"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.visa"
          filled
          dense
          label="Visa"
          hint="(opcional)"
          mask="################"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.hijos"
          filled
          dense
          label="Numero de hijos"
          mask="###"
          hint="Opcional"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.dependientes_economicos"
          filled
          dense
          label="Numero de dependientes economicos"
          mask="###"
          hint="Opcional"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.estado_civil_id"
          :options="estadosCiviles"
          label="Estado civil"
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
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.tipo_de_sangre_id"
          :options="tiposDeSangre"
          label="Tipo de sangre"
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
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input filled dense hint v-model="formEmployee.calle" label="Calle" />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.numero_exterior"
          label="# Exterior"
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.numero_interior"
          label="# Interior"
          hint="Opcional"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          hint
          v-model="formEmployee.colonia"
          label="Colonia"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.codigo_postal"
          label="Codigo postal"
          mask="#####"
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          hint
          v-model="formEmployee.ciudad"
          label="Ciudad"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          hint
          v-model="formEmployee.estado"
          label="Estado"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployee.escolaridad_id"
          :options="escolaridades"
          label="Escolaridad"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          hint
          dense
        />
      </q-item-section>
      <q-item-section v-if="[4, 5, 6].includes(formEmployee.escolaridad_id)">
        <q-input
          v-model="formEmployee.cedula_profecional"
          filled
          dense
          label="Cedula Profesional"
          hint
        />
      </q-item-section>
      <q-item-section v-if="[4, 5, 6].includes(formEmployee.escolaridad_id)">
        <q-input
          v-model="formEmployee.carrera"
          filled
          dense
          label="Carrera"
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.cuenta_bancaria"
          filled
          dense
          label="Numero de cuenta bancaria"
          mask="##################"
          hint
        />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label class="text-h6 text-grey-8" align="center">
          -Unidad de negocios-
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.fecha_de_ingreso"
          mask="date"
          label="Fecha de ingreso"
          readonly
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formEmployee.fecha_de_ingreso">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployee.sucursal_id"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.departamento_id"
          :options="departamentos"
          label="Departamento"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.linea_id"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.jefe_directo_id"
          :options="jefesDirectos"
          option-value="id"
          option-label="nombreCompleto"
          label="Jefe directo"
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
        <q-select
          v-model="formEmployee.estatus_id"
          :options="estatus"
          label="Estatus"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.puesto_id"
          :options="puestos"
          label="Puesto a desempeñar"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.descripcion_puesto"
          lazy-rules
          label="Descripcion del puesto"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.sueldo_base"
          label="Sueldo Base"
          prefix="$"
          mask="######"
          hint
        >
          <template v-slot:append>
            <q-toggle
              filled
              dense
              v-model="formEmployee.comision"
              class="text-grey-7"
              label="Comisión"
              :true-value="1"
              :false-value="0"
              hint
            />
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-separator />
    <div v-if="formEmployee.estatus_id == 6">
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6 text-grey-8" align="center">
            -Desvinculacion-
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            filled
            dense
            readonly
            v-model="formEmployee.desvinculacion.date"
            mask="date"
            label="Fecha de baja"
            :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="formEmployee.desvinculacion.date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="formEmployee.desvinculacion.reason_id"
            :options="reasons"
            label="Motivo de baja"
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
            :rules="[(val) => val !== null || 'Obligatorio']"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="formEmployee.desvinculacion.estatus_id"
            :options="terminations"
            label="Tipo de baja"
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
            :rules="[(val) => val !== null || 'Obligatorio']"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="formEmployee.desvinculacion.comments"
            filled
            dense
            label="Comentarios"
          />
        </q-item-section>
      </q-item>
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { empleado } = defineProps(["empleado"]);

const path = empleado ? empleado.picture : null;

const myForm = ref(null);

const estadosCiviles = ref([]);
const tiposDeSangre = ref([]);
const escolaridades = ref([]);
const lineas = ref([]);
const sucursales = ref([]);
const departamentos = ref([]);
const puestos = ref([]);
const jefesDirectos = ref([]);
const estatus = ref([]);
const terminations = ref([]);
const reasons = ref([]);

const formEmployee = ref({
  id: empleado ? empleado.id : null,
  nombre: empleado ? empleado.nombre : null,
  segundo_nombre: empleado ? empleado.segundo_nombre : null,
  apellido_paterno: empleado ? empleado.apellido_paterno : null,
  apellido_materno: empleado ? empleado.apellido_materno : null,
  telefono: empleado ? empleado.telefono : null,
  telefono_institucional: empleado ? empleado.telefono_institucional : null,
  correo_institucional: empleado ? empleado.correo_institucional : null,

  hijos: empleado ? empleado.hijos : null,
  dependientes_economicos: empleado ? empleado.dependientes_economicos : null,
  estado_civil_id: empleado ? empleado.estado_civil_id : null,
  tipo_de_sangre_id: empleado ? empleado.tipo_de_sangre_id : null,

  numero_exterior: empleado ? empleado.numero_exterior : null,
  numero_interior: empleado ? empleado.numero_interior : null,
  calle: empleado ? empleado.calle : null,
  colonia: empleado ? empleado.colonia : null,
  codigo_postal: empleado ? empleado.codigo_postal : null,
  ciudad: empleado ? empleado.ciudad : null,
  estado: empleado ? empleado.estado : null,

  escolaridad_id: empleado ? empleado.escolaridad_id : null,
  cedula_profecional: empleado ? empleado.cedula_profecional : null,
  carrera: empleado ? empleado.carrera : null,

  cuenta_bancaria: empleado ? empleado.cuenta_bancaria : null,

  fecha_de_nacimiento: empleado ? empleado.fecha_de_nacimiento : null,
  curp: empleado ? empleado.curp : null,
  rfc: empleado ? empleado.rfc : null,
  nss: empleado ? empleado.nss : null,
  ine: empleado ? empleado.ine : null,
  licencia_de_manejo: empleado ? empleado.licencia_de_manejo : null,
  passaporte: empleado ? empleado.passaporte : null,
  visa: empleado ? empleado.visa : null,

  sueldo_base: empleado ? empleado.sueldo_base : null,
  comision: empleado ? empleado.comision : 0,
  matriz: empleado ? empleado.matriz : false,
  fecha_de_ingreso: empleado ? empleado.fecha_de_ingreso : null,
  estatus_id: empleado ? empleado.estatus_id : null,
  puesto_id: empleado ? empleado.puesto.id : null,
  descripcion_puesto: empleado ? empleado.descripcion_puesto : null,
  sucursal_id: empleado ? empleado.sucursal.id : null,
  linea_id: empleado ? empleado.linea.id : null,
  departamento_id: empleado ? empleado.departamento.id : null,
  jefe_directo_id: empleado ? empleado.jefe_directo_id : null,

  // Incluyendo siempre la propiedad desvinculacion
  desvinculacion: {
    reason_id: empleado?.termination?.reason_id || null,
    comments: empleado?.termination?.comments || null,
    date: empleado?.termination?.date || null,
    estatus_id: empleado?.termination?.estatus_id || null,
  },

  base64: null,
  file: [],
});

const convertirFile = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formEmployee.value.base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formEmployee.value.base64.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/empleado/forms", "");
  estadosCiviles.value = res.estados_civiles;
  tiposDeSangre.value = res.tipos_de_sangre;
  escolaridades.value = res.escolaridades;
  jefesDirectos.value = res.empleados;
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
  estatus.value = res.estatus;
  terminations.value = res.terminations;
  reasons.value = res.reasons;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getForms();
});

defineExpose({
  formEmployee,
  validate,
});
</script>
