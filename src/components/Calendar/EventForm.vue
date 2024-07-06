<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEvent.title"
          filled
          dense
          label="Motivo del viaje"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section side>
        <q-input
          v-model="formEvent.available_seats"
          filled
          dense
          mask="##"
          label="asientos disponibles"
          hint
        >
          <template v-slot:prepend>
            <q-icon name="airport_shuttle" />
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEvent.description"
          filled
          dense
          label="Descripcion general de las actividades"
          hint
        />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label align="center">Rutas</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card bordered v-for="(travel, index) in formEvent.travels" :key="index">
      <q-item>
        <q-item-section>
          <q-select
            v-model="travel.start_point"
            :options="sucursales"
            label="Sale de "
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            filled
            dense
            hint="Si se deja vacio no sales de ninguna sucursal"
          />
        </q-item-section>
        <q-item-section side>
          <q-input
            filled
            dense
            label="Hora de salida"
            v-model="travel.start_time"
            mask="time"
            :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="travel.start_time">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="travel.end_point"
            :options="sucursales"
            label="llegas a "
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            filled
            dense
            hint="Si se deja vacio no llegas a ninguna sucursal"
          />
        </q-item-section>
        <q-item-section side>
          <q-input
            filled
            dense
            label="Hora de llegada"
            v-model="travel.end_time"
            mask="time"
            :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="travel.end_time">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-btn
            color="red"
            size="xs"
            label="Borrar ruta"
            icon="delete"
            @click="eliminarTravel(index, travel)"
          />
        </q-item-section>
      </q-item>
    </q-card>
    <q-item>
      <q-item-section>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar ruta"
          @click="agregarTravel"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { currentDay, event } = defineProps(["currentDay", "event"]);

const myForm = ref(null);
const sucursales = ref([]);

const formEvent = ref({
  title: event ? event.title : null,
  description: event ? event.description : null,
  date: event ? event.date : currentDay,
  available_seats: event ? calculateAvailableSeats(event) : 0,
  travels: event ? event.travel : [],
});

function calculateAvailableSeats(event) {
  let availableSeats = event.available_seats || 0; // Initialize with event.available_seats or 0

  // Add number of child events if they exist
  if (event.child_events && event.child_events.length > 0) {
    availableSeats += event.child_events.length;
  }

  return availableSeats;
}

const agregarTravel = () => {
  const newTravel = {
    id: null,
    start_point: null,
    end_point: null,
    start_time: null,
    end_time: null,
  };

  formEvent.value.travels = [...formEvent.value.travels, newTravel];
};

const eliminarTravel = async (index, travel) => {
  if (formEvent.value.travels.length <= 1) {
    return;
  }
  if (travel.id) {
    let res = await sendRequest(
      "DELETE",
      null,
      "/api/event/travel/delete/" + travel.id,
      ""
    );
  }
  formEvent.value.travels.splice(index, 1);
};

const getSucursales = async () => {
  let res = await sendRequest("GET", null, "/api/sucursal/all", "");
  sucursales.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getSucursales();
});

defineExpose({
  formEvent,
  validate,
});
</script>
