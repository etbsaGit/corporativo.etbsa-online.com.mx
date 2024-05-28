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
        <div class="row">
          <q-card
            class="col-4"
            v-for="(employee, index) in technicians"
            :key="index"
          >
            <q-card-section align="center">
              <q-avatar
                size="100px"
                color="primary"
                text-color="white"
                v-if="employee.picture"
              >
                <img :src="employee.picture" alt="Foto del empleado" />
              </q-avatar>
              <q-avatar size="100px" v-else color="primary" text-color="white">
                {{ employee.nombre.charAt(0).toUpperCase()
                }}{{ employee.apellido_paterno.charAt(0).toUpperCase() }}
              </q-avatar>
              <q-item-label class="q-pa-xs">
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
                  <strong>Tipo de tecnico: </strong
                  >{{ employee.technician.name }}
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
        <div class="text-h6">Bahia</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </q-card>

  <!-- ------------------------------ -->
</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { sendRequest } from "src/boot/functions";

const technicians = ref(null);
const sucursales = ref(null);
const tab = ref("Tecnicos");

const switchTab = () => {
  tab.value = tab.value === "Tecnicos" ? "Bahia" : "Tecnicos";
};

let intervalId;

const getSucursales = async () => {
  let res = await sendRequest("GET", null, "/api/sucursal/all", "");
  sucursales.value = res;
};

const clickSucursal = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/technicians/agricola/" + id,
    ""
  );
  technicians.value = res;
};

onMounted(() => {
  getSucursales();
  intervalId = setInterval(switchTab, 1000); // Cambia cada 1 segundos
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
</style>
