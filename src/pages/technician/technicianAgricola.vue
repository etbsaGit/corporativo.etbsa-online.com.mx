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
      <q-tab name="Imagen1" />
      <q-tab name="Bahia1" label="Bahia" />
      <q-tab name="Imagen2" />
      <q-tab name="Bahia2" label="Bahia" />
      <q-tab name="Imagen3" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Tecnicos">
        <div class="grid-container">
          <q-card
            class="card"
            v-for="(employee, index) in technicians"
            :key="index"
          >
            <q-card-section align="center">
              <q-avatar
                size="150px"
                color="primary"
                text-color="white"
                v-if="employee.picture"
              >
                <img :src="employee.picture" alt="Foto del empleado" />
              </q-avatar>
              <q-avatar size="150px" v-else color="primary" text-color="white">
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

      <q-tab-panel name="Bahia1">
        <div class="grid-container-bay">
          <q-card
            flat
            bordered
            v-for="(bay, index) in firstHalfBays"
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
                    <q-item-label><strong>Cliente: </strong></q-item-label>
                    <q-item-label>{{ bay.cliente }}</q-item-label>
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
                        size="50px"
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
      <q-tab-panel name="Bahia2">
        <div class="grid-container-bay">
          <q-card
            flat
            bordered
            v-for="(bay, index) in secondHalfBays"
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
                    <q-item-label><strong>Cliente: </strong></q-item-label>
                    <q-item-label>{{ bay.cliente }}</q-item-label>
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
                        size="50px"
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
      <q-tab-panel name="Imagen1" class="q-pa-none">
        <q-img class="img-container" :src="extractPostDoc(posts)[0].realpath" />
      </q-tab-panel>
      <q-tab-panel name="Imagen2" class="q-pa-none">
        <q-img class="img-container" :src="extractPostDoc(posts)[0].realpath" />
      </q-tab-panel>
      <q-tab-panel name="Imagen3" class="q-pa-none">
        <q-img class="img-container" :src="extractPostDoc(posts)[0].realpath" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>

  <!-- ------------------------------ -->
</template>


<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const technicians = ref(null);
const bays = ref(null);
const sucursales = ref(null);
const tab = ref("Tecnicos");
const posts = ref(null);

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
  const options = [
    "Tecnicos",
    "Imagen1",
    "Bahia1",
    "Imagen2",
    "Bahia2",
    "Imagen3",
  ];
  let currentIndex = 0;

  return () => {
    tab.value = options[currentIndex];
    currentIndex = (currentIndex + 1) % options.length;
  };
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
    "/api/technicians/agricola/" + id,
    ""
  );
  technicians.value = resp.tecnicos;
  posts.value = resp.post;
  let res = await sendRequest("GET", null, "/api/bays/agricola/" + id, "");
  bays.value = res;
};

onMounted(() => {
  getSucursales();
  const switchBetweenTabs = switchTab();
  intervalId = setInterval(switchBetweenTabs, 60000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

// const extractPostDoc = (posts) => {
//   let postDocs = [];
//   for (const post of posts) {
//     if (post.hasOwnProperty("post_doc")) {
//       for (const doc of post.post_doc) {
//         postDocs.push(doc);
//       }
//     }
//   }
//   return postDocs;
// };

const firstHalfBays = computed(() => {
  const halfIndex = Math.ceil(bays.value.length / 2);
  return bays.value.slice(0, halfIndex);
});

const secondHalfBays = computed(() => {
  const halfIndex = Math.ceil(bays.value.length / 2);
  return bays.value.slice(halfIndex);
});

const extractPostDoc = (posts) => {
  let postDocs = [];
  // Extraer todas las imágenes de los posts
  for (const post of posts) {
    if (post.hasOwnProperty("post_doc")) {
      for (const doc of post.post_doc) {
        postDocs.push(doc);
      }
    }
  }
  // Mezclar aleatoriamente las imágenes
  for (let i = postDocs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [postDocs[i], postDocs[j]] = [postDocs[j], postDocs[i]];
  }
  return postDocs;
};
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(200px, 1fr)
  ); /* Ajusta el tamaño mínimo aquí 200px para que sean 6 y 300px para 4 px*/
  gap: 10px;
}

.grid-container-bay {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(400px, 1fr)
  ); /* Ajusta el tamaño mínimo aquí 200px para que sean 6 y 300px para 4 px*/
  gap: 10px;
}

.card {
  height: 100%; /* Para asegurar que todas las tarjetas tengan la misma altura */
  box-sizing: border-box;
  font-size: 1.1em; /* Tamaño de fuente más pequeño */
}

.img-container {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 90vh;
}
</style>
