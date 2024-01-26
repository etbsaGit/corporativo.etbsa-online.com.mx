<template>
  <q-form>
    <q-item>
      <q-item-label header> Selecciona tu RFC </q-item-label>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formExpediente.empleado_id"
          :options="optionsEmpleados"
          option-value="id"
          option-label="rfc"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          use-input
          hide-selected
          clearable
          fill-input
          input-debounce="0"
          @filter="filterFn"
          :rules="[(val) => val !== null || 'Obligatorio']"
          hint="Selecciona tu RFC"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-label header> Carga tus archivos en formato PDF </q-item-label>
    </q-item>
    <q-item>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="CV"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Acta de nacimiento"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Credencial de elector por los dos lados"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="CURP"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Constancia de situacion fiscal"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="IMSS"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Comprobante de domicilio (no mayor a 3 meses)"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Croquis del domicilio"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Certificado de estudios"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Carta de antecedentes no penales"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Aviso de retencion credito infonavit"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Acta de matrimonio"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Acta de nacimiento de los hijos"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Certificado medico"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Licencia de manejo"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Cartas de recomendacion"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Apertura cuenta BBVA"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Reporte de semanas cotizadas"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Nomina de empleo anterior"
        />
      </q-item-section>
      <q-item-section>
        <q-uploader
          url="http://localhost:4444/upload"
          accept=".pdf"
          class="full-width"
          label="Foto"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { sendRequest } from "src/boot/functions";
import { ref, onMounted } from "vue";

const empleados = ref([]);
const optionsEmpleados = ref([]);
const empleado = ref(null);

const formExpediente = ref({ empleado_id: null });

const getEmpleados = async () => {
  let res = await sendRequest("GET", null, "/api/empleado/all", "");
  empleados.value = res;
  optionsEmpleados.value = empleados.value;
};

const filterFn = (val, update) => {
  const needle = val.toLowerCase();
  update(() => {
    optionsEmpleados.value = empleados.value.filter(
      (v) => v.rfc.toLowerCase().indexOf(needle) > -1
    );
  });
};

onMounted(() => {
  getEmpleados();
});
</script>
