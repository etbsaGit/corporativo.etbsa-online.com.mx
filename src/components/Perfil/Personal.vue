<template>
  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.nombre"
        dense
        label="Primer Nombre"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.segundo_nombre"
        dense
        label="Segundo Nombre"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.apellido_paterno"
        dense
        label="Apellido paterno"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.apellido_materno"
        dense
        label="Apellido materno"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.telefono"
        dense
        label="Telefono"
        mask="##########"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.telefono_institucional"
        dense
        label="Telefono Institucional"
        mask="##########"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.correo_institucional"
        dense
        label="Correo institucional"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployee.calle"
        label="Calle"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployee.numero_exterior"
        label="# Exterior"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployee.numero_interior"
        label="# Interior"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployee.colonia"
        label="Colonia"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployee.codigo_postal"
        label="Codigo postal"
        mask="#####"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployee.ciudad"
        label="Ciudad"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployee.estado"
        label="Estado"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        dense
        v-model="formEmployee.fecha_de_nacimiento"
        mask="date"
        label="Fecha de Nacimiento"
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
        readonly
        outlined
        v-model="formEmployee.curp"
        dense
        label="CURP"
      />
    </q-item-section>
    <q-item-section>
      <q-input readonly outlined v-model="formEmployee.rfc" dense label="RFC" />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-input readonly outlined v-model="formEmployee.ine" dense label="INE" />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.licencia_de_manejo"
        dense
        label="Licencia de manejo"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.passaporte"
        dense
        label="Pasaporte"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.visa"
        dense
        label="Visa"
        mask="################"
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
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        dense
        readonly
        outlined
      />
    </q-item-section>
  </q-item>
  <q-item v-if="[4, 5, 6].includes(formEmployee.escolaridad_id)">
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.cedula_profecional"
        dense
        label="Cedula Profesional"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.carrera"
        dense
        label="Carrera"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.nss"
        dense
        label="Numero de seguridad social"
        mask="###########"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.hijos"
        dense
        label="Numero de hijos"
        mask="###"
      />
    </q-item-section>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.dependientes_economicos"
        dense
        label="Numero de dependientes economicos"
        mask="###"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-select
        v-model="formEmployee.estado_civil_id"
        :options="estadosCiviles"
        label="Estado civil"
        option-value="id"
        option-label="nombre"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        dense
        readonly
        outlined
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="formEmployee.tipo_de_sangre_id"
        :options="tiposDeSangre"
        label="Tipo de sangre"
        option-value="id"
        option-label="nombre"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        dense
        readonly
        outlined
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-input
        readonly
        outlined
        v-model="formEmployee.cuenta_bancaria"
        dense
        label="Numero de cuenta bancarias"
        mask="##################"
      />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref } from "vue";

const { empleado } = defineProps(["empleado"]);

const estadosCiviles = ref(null);
const tiposDeSangre = ref([]);
const escolaridades = ref([]);

const formEmployee = ref({
  fotografia: empleado.fotografia,
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
  escolaridad_id: empleado.escolaridad_id ? empleado.escolaridad.nombre : null,
  cedula_profecional: empleado.cedula_profecional,
  carrera: empleado.carrera,
  numero_exterior: empleado.numero_exterior,
  numero_interior: empleado.numero_interior,
  calle: empleado.calle,
  colonia: empleado.colonia,
  codigo_postal: empleado.codigo_postal,
  ciudad: empleado.ciudad,
  estado: empleado.estado,
  cuenta_bancaria: empleado.cuenta_bancaria,
  estado_civil_id: empleado.estado_civil_id
    ? empleado.estado_civil.nombre
    : null,
  tipo_de_sangre_id: empleado.tipo_de_sangre_id
    ? empleado.tipo_de_sangre.nombre
    : null,
  correo_institucional: empleado.correo_institucional,
});
</script>

