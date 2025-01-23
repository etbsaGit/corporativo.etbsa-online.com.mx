<template>
  <q-card align="center" class="no-shadow">
    <img
      v-if="
        bay.work_order &&
        bay.work_order.work_order_doc &&
        bay.work_order.work_order_doc[0]
      "
      :src="bay.work_order.work_order_doc[0].realpath"
      alt
    />
    <q-icon v-else name="no_photography" size="xl" class="default-icon" />
  </q-card>

  <q-card>
    <q-item>
      <q-item-section class="col-2">
        <q-item-label><strong>OT: </strong></q-item-label>
        <q-item-label v-if="bay.work_order">
          {{ bay.work_order.ot }}
        </q-item-label>
      </q-item-section>
      <q-separator vertical spaced />
      <q-item-section>
        <q-item-label><strong>Maquina</strong></q-item-label>
        <q-item-label>{{ bay.work_order.maquina }}</q-item-label>
      </q-item-section>
      <q-separator vertical spaced />
      <q-item-section>
        <q-item-label><strong>Cliente</strong></q-item-label>
        <q-item-label>{{ bay.work_order.cliente }}</q-item-label>
      </q-item-section>
      <q-separator vertical spaced />
      <q-item-section v-if="bay.work_order.tecnico">
        <q-item>
          <q-item-section>
            <q-avatar v-if="bay.work_order.tecnico.picture">
              <img :src="bay.work_order.tecnico.picture" alt />
            </q-avatar>
            <q-avatar v-else color="primary" text-color="white">
              {{ bay.work_order.tecnico.nombre.charAt(0).toUpperCase()
              }}{{
                bay.work_order.tecnico.apellido_paterno.charAt(0).toUpperCase()
              }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Tecnico</strong></q-item-label>
            <q-item-label>
              {{ bay.work_order.tecnico.nombre }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label><strong>Descripcion: </strong></q-item-label>
        <q-item-label>{{ bay.work_order.descripcion }}</q-item-label>
      </q-item-section>
      <q-separator vertical spaced />
      <q-item-section>
        <q-item-label><strong>Comentarios: </strong></q-item-label>
        <q-item-label>{{ bay.work_order.comentarios }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>

  <q-card>
    <q-item class="q-pa-none">
      <q-item-section avatar>
        <q-list separator dense bordered padding class="rounded-borders">
          <q-item>
            <q-item-section>
              <strong>Mano de obra</strong>
            </q-item-section>
            <q-item-section side>
              {{ formatCurrency(bay.work_order.mano_obra) }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <strong>Refacciones</strong>
            </q-item-section>
            <q-item-section side>
              {{ formatCurrency(bay.work_order.refacciones) }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <strong>KM</strong>
            </q-item-section>
            <q-item-section side>
              {{ formatCurrency(bay.work_order.km) }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <strong>Foraneo</strong>
            </q-item-section>
            <q-item-section side>
              {{ formatCurrency(bay.work_order.foraneo) }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <strong>Total</strong>
            </q-item-section>
            <q-item-section side>
              {{
                formatCurrency(
                  total_factura(
                    bay.work_order.refacciones,
                    bay.work_order.mano_obra,
                    bay.work_order.km,
                    bay.work_order.foraneo
                  )
                )
              }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>
      <q-item-section>
        <bay-chart-date
          :index="bay.work_order.id"
          :start="bay.work_order.fecha_ingreso"
          :end="bay.work_order.fecha_entrega"
        />
      </q-item-section>
      <q-item-section align="center">
        <!-- <q-item-label>
          <strong>Ingreso: </strong>
          {{ formatDateplusoneSlim(bay.work_order.fecha_ingreso) }}
        </q-item-label>
        <q-item-label>
          <strong>Entrega: </strong>
          {{ formatDateplusoneSlim(bay.work_order.fecha_entrega) }}
        </q-item-label>
        <q-separator spaced></q-separator> -->
        <q-item-label>
          <strong>Estatus: </strong>
        </q-item-label>
        <q-item-label>
          <q-avatar
            size="40px"
            :color="getStatusColor(bay.work_order.estatus.nombre)"
          />
        </q-item-label>
        <q-item-label>
          {{ bay.work_order.estatus.nombre }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import {
  formatCurrency,
  formatDateplusoneSlim,
} from "src/boot/formatFunctions";
import BayChartDate from "src/components/Bays/BayChartDate.vue";

const { bay } = defineProps(["bay"]);

const getStatusColor = (status) => {
  switch (status) {
    case "En diagnostico":
    case "En armado":
    case "En espera de piezas":
      return "green";
    case "En pruebas finales":
      return "yellow";
    case "Fuera de tiempo de entrega":
    case "Urgencia de entrega":
      return "red";
    case "Retrabajo":
      return "black";
    default:
      return "primary"; // Color predeterminado si el estado no coincide con ninguno de los anteriores
  }
};

const total_factura = (mano_obra, refa, km, fora) => {
  const manoObra = Number(mano_obra);
  const refacciones = Number(refa);
  const KM = Number(km);
  const foraneo = Number(fora);
  const manoObraNumber = isNaN(manoObra) ? 0 : manoObra;
  const refaccionesNumber = isNaN(refacciones) ? 0 : refacciones;
  const kmNumber = isNaN(KM) ? 0 : KM;
  const foraneoNumber = isNaN(foraneo) ? 0 : foraneo;
  const subtotal =
    (manoObraNumber + refaccionesNumber + kmNumber + foraneoNumber) * 1.16;
  return subtotal.toFixed(2); // Redondea el resultado a dos decimales
};
</script>
