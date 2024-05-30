<template>
  <div class="grid-container q-pa-sm" v-if="technicians == null">
    <q-btn
      v-for="(sucursal, index) in sucursales"
      :key="index"
      dense
      :label="sucursal.nombre"
      class="fixed-height-btn text-caption"
      @click="clickSucursal(sucursal.id)"
    />
  </div>
  <!-- ------------------- -->

  <q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="Tecnicos" label="Tecnicos" />
      <q-tab name="Bahia" label="Bahia" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Tecnicos">
        <div class="card-container">
          <q-card
            class="card"
            v-for="(employee, index) in technicians"
            :key="index"
          >
            <q-card-section align="center">
              <q-avatar
                size="70px"
                color="primary"
                text-color="white"
                v-if="employee.picture"
              >
                <img :src="employee.picture" alt="Foto del empleado" />
              </q-avatar>
              <q-avatar size="70px" v-else color="primary" text-color="white">
                {{ employee.nombre.charAt(0).toUpperCase()
                }}{{ employee.apellido_paterno.charAt(0).toUpperCase() }}
              </q-avatar>
              <q-item-label class="q-pa-xs text-h6">
                {{ employee.nombreCompleto }}
              </q-item-label>
            </q-card-section>
            <q-separator />
            <q-card-section align="center">
              <q-item-label caption>
                <strong>Sucursal: </strong>{{ employee.sucursal.nombre }}
              </q-item-label>
              <q-item-label caption>
                <strong>Fecha de ingreso: </strong
                >{{ employee.fecha_de_ingreso }}
              </q-item-label>
              <q-item-label caption>
                <div v-if="employee.technician">
                  <strong>Tipo de tecnico: </strong>
                  {{ employee.technician.name }}
                </div>
                <div v-else>
                  <strong>Sin tipo de tecnico</strong>
                </div>
              </q-item-label>
              <q-item-label caption>
                <div v-if="employee.productividad">
                  <div>
                    <strong>Productividad: </strong>{{ employee.productividad }}
                  </div>
                </div>
                <div v-else>
                  <strong>Sin productividad</strong>
                </div>
              </q-item-label>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Bahia">
        <div class="card-container">
          <q-card
            flat
            bordered
            v-for="(bay, index) in bays"
            :key="index"
            class="card"
          >
            <q-item>
              <q-item-section><strong>Bahia: </strong></q-item-section>
              <q-item-section>{{ bay.nombre }}</q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-8 text-center q-pa-none">
                <q-item>
                  <q-item-section>
                    <q-item-label><strong>Maquina: </strong></q-item-label>
                    <q-item-label>{{ bay.maquina }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label><strong>Tecnico: </strong></q-item-label>
                    <q-item-label>
                      <q-chip v-if="bay.tecnico">
                        <q-avatar v-if="bay.tecnico.picture">
                          <img :src="bay.tecnico.picture" alt />
                        </q-avatar>
                        <q-avatar v-else color="primary" text-color="white">
                          {{ bay.tecnico.nombre.charAt(0).toUpperCase()
                          }}{{
                            bay.tecnico.apellido_paterno.charAt(0).toUpperCase()
                          }}
                        </q-avatar>
                        {{ bay.tecnico.nombre }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>

              <q-separator vertical />

              <q-card-section class="col-4 text-center q-pa-none">
                <q-item>
                  <q-item-section>
                    <q-item-label><strong>Status</strong></q-item-label>
                    <q-item-label>
                      <q-avatar
                        size="30px"
                        :color="getStatusColor(bay.status)"
                      />
                    </q-item-label>
                    <q-item-label>
                      {{ bay.status }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label><strong>Descripcion: </strong></q-item-label>
                  <q-item-label>{{ bay.descripcion }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>

  <!-- ------------------------------ -->
</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { sendRequest } from "src/boot/functions";

const technicians = ref(null);
const bays = ref(null);
const sucursales = ref(null);
const tab = ref("Tecnicos");

const getStatusColor = (status) => {
  switch (status) {
    case "en diagnóstico":
    case "en armando":
    case "en espera de piezas":
      return "green";
    case "en pruebas finales":
      return "yellow";
    case "fuera de tiempo de entrega":
    case "urgencia de entrega":
      return "red";
    case "retrabajo":
      return "black";
    default:
      return "primary"; // Color predeterminado si el estado no coincide con ninguno de los anteriores
  }
};

const switchTab = () => {
  tab.value = tab.value === "Tecnicos" ? "Bahia" : "Tecnicos";
};

let intervalId;

const getSucursales = async () => {
  let res = await sendRequest("GET", null, "/api/sucursal/all", "");
  sucursales.value = res;
};

const clickSucursal = async (id) => {
  let resp = await sendRequest(
    "GET",
    null,
    "/api/technicians/construccion/" + id,
    ""
  );
  technicians.value = resp;
  let res = await sendRequest("GET", null, "/api/bays/construccion/" + id, "");
  bays.value = res;
};

onMounted(() => {
  getSucursales();
  intervalId = setInterval(switchTab, 60000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 10px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Espacio entre tarjetas */
  justify-content: space-between;
}

.card {
  flex: 1 1 calc(16.66% - 16px); /* Para mostrar 6 tarjetas por fila */
  box-sizing: border-box;
  min-width: 150px; /* Ancho mínimo para asegurar que las tarjetas no sean demasiado pequeñas */
  font-size: 0.85em; /* Tamaño de fuente más pequeño */
}

@media (max-width: 1200px) {
  .card {
    flex: 1 1 calc(33.33% - 16px); /* Para mostrar 3 tarjetas por fila en pantallas más pequeñas */
  }
}

@media (max-width: 900px) {
  .card {
    flex: 1 1 calc(50% - 16px); /* Para mostrar 2 tarjetas por fila en pantallas más pequeñas */
  }
}

@media (max-width: 600px) {
  .card {
    flex: 1 1 100%; /* Para mostrar 1 tarjeta por fila en pantallas pequeñas */
  }
}
</style>
