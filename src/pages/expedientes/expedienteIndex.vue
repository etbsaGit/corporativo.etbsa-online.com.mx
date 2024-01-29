<template>
  <div class="q-pa-md">
    <q-form>
      <q-item v-if="!empleado">
        <q-item-section>
          <q-item-label>
            <q-input filled v-model="formEmpleado.rfc" label="RFC" dense />
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-input filled v-model="formEmpleado.ine" label="INE" dense />
          </q-item-label>
        </q-item-section>
        <q-item>
          <q-item-section>
            <q-btn label="Buscar" color="primary" @click="buscarEmpleado" />
          </q-item-section>
        </q-item>
      </q-item>
      <q-item>
        <q-item-label header>
          Carga tus archivos en formato pdf, jpeg, png, jpg</q-item-label
        >
      </q-item>
      <q-item>
        <q-item-section>
          <div v-if="empleado">
            <q-item-section>
              <template v-if="empleado.picture">
                <img
                  :src="empleado.picture"
                  alt="Foto del empleado"
                  style="width: 100px; height: 100px; border-radius: 50%"
                />
              </template>
              <template v-else>
                <div
                  style="
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background-color: #ccc;
                    text-align: center;
                    line-height: 100px;
                    font-size: 40px;
                  "
                >
                  {{ empleado.nombre.charAt(0).toUpperCase()
                  }}{{ empleado.apellido_paterno.charAt(0).toUpperCase() }}
                </div>
              </template>
            </q-item-section>
            <q-item-label header>
              <strong> Nombre completo: </strong>
              {{ empleado.nombre }} {{ empleado.segundo_nombre }}
              {{ empleado.apellido_paterno }}
              {{ empleado.apellido_materno }}
            </q-item-label>
            <q-item-label header>
              <strong> Sucursal: </strong>
              {{ empleado.sucursal.nombre }}
            </q-item-label>
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="q-pa-md example-col-gutter-size">
          <div class="row q-col-gutter-md">
            <div
              v-for="requisito in requisitos"
              :key="requisito.id"
              class="col-3"
            >
              <div
                class="window"
                :style="{
                  backgroundColor: getStatusColor(requisito.pivot.estatus_id)
                }"
              >
                <q-file
                  filled
                  dense
                  bottom-slots
                  v-model="formRequisito[requisito.id]"
                  :label="requisito.nombre"
                  accept=".pdf,.jpeg,.png,.jpg"
                  max-files="1"
                  :hint="
                    requisito.pivot.comentario ? requisito.pivot.comentario : ''
                  "
                >
                  <template v-slot:after>
                    <q-btn
                      round
                      dense
                      flat
                      icon="send"
                      @click="uploadFile(requisito)"
                    />
                  </template>
                </q-file>
              </div>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-form>
  </div>
</template>

<script setup>
import { sendRequest } from "src/boot/functions";
import { ref } from "vue";
import { api } from "boot/axios";

const requisitos = ref([]);

const empleado = ref(null);

const formRequisito = ref({});

const formEmpleado = ref({ rfc: null, ine: null });

const buscarEmpleado = async () => {
  try {
    let res = await sendRequest(
      "GET",
      null,
      `/api/empleado/archivos/${formEmpleado.value.rfc}/${formEmpleado.value.ine}`,
      ""
    );
    empleado.value = res;
    requisitos.value = empleado.value.archivable[0].requisito;
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const uploadFile = async (requisito) => {
  const model = formRequisito.value[requisito.id];
  const formData = new FormData();
  formData.append("file", model);
  formData.append("asignableId", requisito.pivot.id);
  try {
    let res = await api.post(
      `/documento/uploadFile/${requisito.pivot.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      }
    );
    delete formRequisito.value[requisito.id];
    buscarEmpleado();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#b6ffaa"; // Verde claro
    case 2:
      return "#ffcccc"; // Rojo más claro
    case 3:
      return "#fff3b2"; // Amarillo más claro
    case 4:
      return "#b5fff4"; // Azul más claro
    //Añade más casos para otros estados
    default:
      return "#f2f2f2";
  }
};
</script>

<style lang="scss" scoped>
.window {
  padding: 10px; /* Ajusta el padding según sea necesario */
  border: 1px solid #ccc; /* Agrega borde para hacer que los cuadros sean visibles */
  border-radius: 5px; /* Ajusta el radio de borde según sea necesario */
  margin-bottom: 10px; /* Espacio entre cada cuadro */
}
</style>
