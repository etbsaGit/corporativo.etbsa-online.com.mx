<template>
  <div class="q-pa-md">
    <q-table title="Encuesta" :rows="user.evaluee" :columns="columns" row-key="id" :rows-per-page-options="[0]">
      <template v-slot:body-cell-action="props">
        <q-td>
          <q-btn v-if="props.row.status === 1" flat round color="primary" icon="play_arrow"
            @click="onRowClick(props.row)" />
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div v-if="props.row.status == 1">Activa</div>
          <div v-else>Inactiva</div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted } from 'vue';



const auth = useAuthStore();
const { user } = storeToRefs(auth);

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  { name: "title", label: "Titulo", align: "left", field: "title", sortable: true },
  { name: "status", label: "Status", align: "left", field: "status", sortable: true },
  { name: "description", label: "Descripcion", align: "left", field: "description", sortable: true },
  { name: "expire_date", label: "Fecha de expiracion", align: "left", field: "expire_date", sortable: true },
  { name: "action", label: "Action", align: "left", field: "action", sortable: true },
]

const onRowClick = (row) => {
  console.log(row);
};



onMounted(() => {

});


</script>
