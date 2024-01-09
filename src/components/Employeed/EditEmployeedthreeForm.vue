<template>
  <q-form class="q-gutter-y-sm text-uppercase" ref="myForm" greedy>
    <q-file
      name="poster_file"
      v-model="formExpediente.foto"
      filled
      label="Foto"
      hint="(opcional)"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
      <template v-slot:before>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
        </q-avatar>
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.cv"
      filled
      label="Curriculum Vitae"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.acta_de_nacimiento"
      filled
      label="Acta de nacimiento"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.credencial_de_elector"
      filled
      label="Credencial de elector"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.curp"
      filled
      label="CURP"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.constancia_de_sicuacion_fiscal"
      filled
      label="Constancia de situacion fiscal"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.imss"
      filled
      label="IMSS"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.comprobante_de_domicilio"
      filled
      label="Comprobante de domicilio"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.croquis_de_domicilio"
      filled
      label="Croquis del domicilio"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.certificado_de_estudios"
      filled
      label="Certificado de estudios"
      accept=".pdf"
      hint="(opcional)"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.carta_de_antecedentes_no_penales"
      filled
      label="Carta de antecedentes no penales"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.aviso_de_retencion_credito_infonavit"
      filled
      label="Aviso de retencion credito infonavit"
      accept=".pdf"
      hint="(opcional)"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.acta_de_matrimonio"
      filled
      label="Acta de matrimonio"
      accept=".pdf"
      hint="(opcional)"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.acta_de_nacimiento_hijos"
      filled
      label="Acta de nacimiento de los hijos"
      accept=".pdf"
      hint="(opcional)"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.certificado_medico"
      filled
      label="Certificado medico"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.licencia_de_manejo"
      filled
      label="Licencia de manejo"
      accept=".pdf"
      hint="(opcional)"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.cartas_de_recomendacion"
      filled
      label="Cartas de recomendacion"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.apertura_cuenta_bbva"
      filled
      label="Apertura cuenta BBVA"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.reporte_semanas_cotizadas"
      filled
      label="Reporte de semanas cotizadas"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.nominas_empleo_anterior"
      filled
      label="Nominas de empleo anterior"
      accept=".pdf"
      hint="(opcional)"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.alta_interna"
      filled
      label="Alta interna"
      accept=".pdf"
      :rules="[(val) => val !== null || 'Obligatorio']"
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.alta_imss"
      filled
      label="Alta IMSS"
      accept=".pdf"
      hint
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
    <q-file
      name="poster_file"
      v-model="formExpediente.baja_imss"
      filled
      label="Baja IMSS"
      accept=".pdf"
      hint
    >
      <template v-slot:append>
        <q-icon name="attachment" />
      </template>
    </q-file>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const formExpediente = ref({
  cv: null,
  acta_de_nacimiento: null,
  credencial_de_elector: null,
  curp: null,
  constancia_de_sicuacion_fiscal: null,
  imss: null,
  comprobante_de_domicilio: null,
  croquis_de_domicilio: null,
  certificado_de_estudios: null,
  carta_de_antecedentes_no_penales: null,
  aviso_de_retencion_credito_infonavit: null,
  acta_de_matrimonio: null,
  acta_de_nacimiento_hijos: null,
  certificado_medico: null,
  licencia_de_manejo: null,
  foto: null,
  cartas_de_recomendacion: null,
  apertura_cuenta_bbva: null,
  reporte_semanas_cotizadas: null,
  nominas_empleo_anterior: null,
  alta_interna: null,
  alta_imss: null,
  baja_imss: null
});
</script>
