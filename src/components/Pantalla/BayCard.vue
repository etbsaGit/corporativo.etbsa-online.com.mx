<template>
  <q-card
    flat
    bordered
    v-for="(bay, index) in bays"
    :key="index"
    class="card-bay"
  >
    <q-item class="text-center q-pa-none">
      <q-item-section>
        <q-item-label v-if="bay.work_order && bay.work_order.work_order_doc">
          <q-avatar size="80px" rounded v-if="bay.work_order.work_order_doc[0]">
            <img :src="bay.work_order.work_order_doc[0].realpath" alt />
          </q-avatar>
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Bahia: </strong></q-item-label>
        <q-item-label class="text-h6">{{ bay.nombre }}</q-item-label>
      </q-item-section>
      <q-separator vertical spaced />
      <q-item-section>
        <q-item-label>
          <strong>Estatus de la bahia: </strong>
        </q-item-label>
        <q-item-label>{{ bay.estatus.nombre }}</q-item-label>
      </q-item-section>
      <q-separator vertical spaced />
      <q-item-section>
        <q-item-label><strong>OT: </strong></q-item-label>
        <q-item-label v-if="bay.work_order">{{
          bay.work_order.ot
        }}</q-item-label>
      </q-item-section>
      <q-separator vertical spaced />
      <q-item-section>
        <q-item-label
          ><strong>Dias restantes para entrega: </strong></q-item-label
        >
        <q-item-label v-if="bay.work_order">
          {{ calcularDiasRestantes(bay.work_order.fecha_entrega) }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section horizontal v-if="bay.work_order">
      <q-card-section class="col-9 text-left q-pa-none">
        <q-item>
          <q-item-section>
            <q-item-label><strong>Maquina: </strong></q-item-label>
            <q-item-label>{{ bay.work_order.maquina }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label><strong>Cliente: </strong></q-item-label>
            <q-item-label>{{ bay.work_order.cliente }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item class="text-center">
          <q-item-section>
            <q-item-label>
              <strong>Fecha ingreso: </strong>
            </q-item-label>
            <q-item-label>
              {{ formatDateplusoneSlim(bay.work_order.fecha_ingreso) }}
            </q-item-label>
          </q-item-section>
          <q-separator vertical spaced />
          <q-item-section>
            <q-item-label>
              <strong>Fecha entrega: </strong>
            </q-item-label>
            <q-item-label>
              {{ formatDateplusoneSlim(bay.work_order.fecha_entrega) }}
            </q-item-label>
          </q-item-section>
          <q-separator vertical spaced />
          <q-item-section>
            <q-item-label>
              <strong>Horas facturadas</strong>
            </q-item-label>
            <q-item-label>
              {{ bay.work_order.horas_facturadas }}
            </q-item-label>
          </q-item-section>
          <q-separator vertical spaced />
          <q-item-section>
            <q-item-label>
              <strong>Mano de obra</strong>
            </q-item-label>
            <q-item-label> ${{ bay.work_order.mano_obra }} </q-item-label>
          </q-item-section>
          <q-separator vertical spaced />
          <q-item-section>
            <q-item-label>
              <strong>Refacciones</strong>
            </q-item-label>
            <q-item-label> ${{ bay.work_order.refacciones }} </q-item-label>
          </q-item-section>
          <q-separator vertical spaced />
          <q-item-section>
            <q-item-label>
              <strong>Factura</strong>
            </q-item-label>
            <q-item-label>
              ${{
                total_factura(
                  bay.work_order.refacciones,
                  bay.work_order.mano_obra
                )
              }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator vertical />

      <q-card-section class="col-3 text-center q-pa-none">
        <q-item>
          <q-item-section>
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
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label v-if="bay.work_order.tecnico">
              <q-avatar v-if="bay.work_order.tecnico.picture">
                <img :src="bay.work_order.tecnico.picture" alt />
              </q-avatar>
              <q-avatar v-else color="primary" text-color="white">
                {{ bay.work_order.tecnico.nombre.charAt(0).toUpperCase()
                }}{{
                  bay.work_order.tecnico.apellido_paterno
                    .charAt(0)
                    .toUpperCase()
                }}
              </q-avatar>
            </q-item-label>
            <q-item-label>
              {{ bay.work_order.tecnico.nombre }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-item v-if="bay.work_order" class="text-left q-pa-none">
        <q-item-section>
          <q-item-label><strong>Descripcion: </strong></q-item-label>
          <q-item-label>{{ bay.work_order.descripcion }}</q-item-label>
          <q-separator spaced></q-separator>
          <q-item-label><strong>Comentarios: </strong></q-item-label>
          <q-item-label>{{ bay.work_order.comentarios }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup>
import {
  formatDateplusoneSlim,
  calcularDiasRestantes,
} from "src/boot/formatFunctions";

const { bays } = defineProps(["bays"]);

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

const total_factura = (mano_obra, refa) => {
  const manoObra = Number(mano_obra);
  const refacciones = Number(refa);
  const manoObraNumber = isNaN(manoObra) ? 0 : manoObra;
  const refaccionesNumber = isNaN(refacciones) ? 0 : refacciones;
  const subtotal = (manoObraNumber + refaccionesNumber) * 1.16;
  return subtotal.toFixed(2); // Redondea el resultado a dos decimales
};
</script>

<style>
.card-bay {
  height: 100%; /* Para asegurar que todas las tarjetas tengan la misma altura */
  box-sizing: border-box;
  font-size: 0.8em; /* Tamaño de fuente más pequeño */
  border: 1px solid black;
}
</style>
