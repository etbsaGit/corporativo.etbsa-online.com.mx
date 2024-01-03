<template>
  <q-form class="q-gutter-y-sm text-uppercase">
    <!-- <q-item>
        <q-file
          v-model="formEmployee.foto"
          filled
          outlined
          bottom-slots
          label="Foto Empleado"
          counter
          hint="Seleccionar Foto"
          class="col-12"
        >
          <template v-slot:before>
            <q-avatar size="64px">
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
            </q-avatar>
          </template>
  
          <template v-slot:append>
            <q-icon
              v-if="formEmployee.foto !== null"
              name="close"
              @click.stop.prevent="formEmployee.foto = null"
              class="cursor-pointer"
            />
            <q-icon name="create_new_folder" @click.stop.prevent />
          </template>
        </q-file>
      </q-item> -->

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.nombre"
          filled
          dense
          label="Primer Nombre"
          lazy-rules
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
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.apellido_paterno"
          filled
          dense
          label="Apellido paterno"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.apellido_materno"
          filled
          dense
          label="Apellido materno"
          lazy-rules
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
          mask="##########"
          lazy-rules
          :rules="[
            (val) => (val && val.length === 10) || 'Deben de ser 10 digitos'
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.telefono_institucional"
          filled
          dense
          label="Telefono Institucional"
          mask="##########"
          hint="Opcional"
          :rules="[
            (val) =>
              !val || (val && /^\d{10}$/.test(val)) || 'Debe tener 10 dígitos'
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.calle"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          label="Calle"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.numero_exterior"
          label="# Exterior"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
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
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.colonia"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
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
          v-model="formEmployee.ciudad"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          label="Ciudad"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.estado"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          label="Estado"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formEmployee.fecha_de_nacimiento"
          mask="date"
          label="Fecha de Nacimiento"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
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
        <q-input
          v-model="formEmployee.curp"
          filled
          dense
          label="CURP"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length === 18) ||
              'La CURP debe tener exactamente 18 caracteres'
          ]"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.rfc"
          filled
          dense
          label="RFC"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length === 13) ||
              'La RFC debe tener exactamente 13 caracteres'
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.ine"
          filled
          dense
          label="INE"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length === 18) ||
              'La INE debe tener exactamente 18 caracteres'
          ]"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.licencia_de_manejo"
          filled
          dense
          label="Licencia de manejo"
          hint="(opcional)"
          :rules="[
            (val) =>
              !val ||
              (val && val.length === 16) ||
              'La VISA debe tener exactamente 16 caracteres'
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
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
          :rules="[
            (val) =>
              !val || (val && /^\d{16}$/.test(val)) || 'Debe tener 16 dígitos'
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployee.escolaridad_id"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          lazy-rules
          :rules="[(val) => val !== null || 'Obligatorio']"
          :options="escolaridades"
          label="Escolaridad"
          emit-value
          map-options
          option-disable="inactive"
          option-value="id"
          option-label="nombre"
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
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.nss"
          filled
          dense
          label="Numero de seguridad social"
          mask="###########"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length === 11) ||
              'EL numero de seguro consta de 11 digitos'
          ]"
        />
      </q-item-section>
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
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          v-model="formEmployee.estado_civil_id"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          lazy-rules
          :rules="[(val) => val !== null || 'Obligatorio']"
          :options="estadosCiviles"
          label="Estado civil"
          emit-value
          map-options
          option-disable="inactive"
          option-value="id"
          option-label="nombre"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.tipo_de_sangre_id"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          lazy-rules
          :rules="[(val) => val !== null || 'Obligatorio']"
          :options="tiposDeSangre"
          label="Tipo de sangre"
          emit-value
          map-options
          option-disable="inactive"
          option-value="id"
          option-label="nombre"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.cuenta_bancaria"
          filled
          dense
          label="Numero de cuenta bancarias"
          mask="##################"
          lazy-rules
          :rules="[
            (val) => (val && val.length === 18) || 'Debes ingresar 18 digitos'
          ]"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.correo_institucional"
          filled
          dense
          label="Correo institucional"
          hint="Opcional"
          lazy-rules
          :rules="[
            (v) => !v || /.+@.+\..+/.test(v) || 'Formato de correo inválido'
          ]"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { sendRequest } from "src/boot/functions";

const { empleado } = defineProps(["empleado"]);

const $q = useQuasar();
const estadosCiviles = ref(null);
const tiposDeSangre = ref([]);
const escolaridades = ref([]);

const formEmployee = ref({
  id: empleado.id,
  nombre: empleado.nombre,
  segundo_nombre: empleado.segundo_nombre,
  apellido_paterno: empleado.apellido_paterno,
  apellido_materno: empleado.apellido_materno,
  telefono: empleado.telefono,
  telefono_institucional: empleado.telefono_institucional,
  fecha_de_nacimiento: empleado.fecha_de_nacimiento,
  curp: empleado.curp,
  rfc: empleado.rfc,
  ine: empleado.ine,
  passaporte: empleado.passaporte,
  visa: empleado.visa,
  licencia_de_manejo: empleado.licencia_de_manejo,
  nss: empleado.nss,
  hijos: empleado.hijos,
  dependientes_economicos: empleado.dependientes_economicos,
  escolaridad_id: empleado.escolaridad.id,
  cedula_profecional: empleado.cedula_profecional,
  foto: empleado.foto,
  numero_exterior: empleado.numero_exterior,
  numero_interior: empleado.numero_interior,
  calle: empleado.calle,
  colonia: empleado.colonia,
  codigo_postal: empleado.codigo_postal,
  ciudad: empleado.ciudad,
  estado: empleado.estado,
  cuenta_bancaria: empleado.cuenta_bancaria,
  estado_civil_id: empleado.estado_civil.id,
  tipo_de_sangre_id: empleado.tipo_de_sangre.id,
  correo_institucional: empleado.correo_institucional
});

const getEstadosCiviles = async () => {
  let res = await sendRequest("GET", null, "/api/estadoCivil/all", "");
  estadosCiviles.value = res;
};

const getTiposDeSangre = async () => {
  let res = await sendRequest("GET", null, "/api/tipoDeSangre/all", "");
  tiposDeSangre.value = res;
};

const getEscolaridades = async () => {
  let res = await sendRequest("GET", null, "/api/escolaridad/all", "");
  escolaridades.value = res;
};

onMounted(() => {
  getEstadosCiviles();
  getTiposDeSangre();
  getEscolaridades();
});

defineExpose({
  formEmployee
});
</script>
