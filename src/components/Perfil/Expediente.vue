<template>
   <div>
    <q-splitter v-model="splitterModel" style="height: 700px;">
        <template v-slot:before>
            <div class="q-pa-md">
                <q-table
                    flat
                    bordered
                    grid
                    :rows="requisitos"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :rows-per-page-options="[0]"
                >
                <template v-slot:top-right>
                    <q-input
                        bordered
                        dense
                        debounce="300"
                        v-model="filter"
                        placeholder="Search"
                    >
                        <template v-slot:append>
                        <q-icon name="search" />
                        </template>
                    </q-input>
                    </template>
                    <template v-slot:top-left>
                        <div class="text-h6 q-mb-md">
                            Documentos
                        </div>
                    </template>

                    <template v-slot:item="props">
                        <q-card
                            @click="onRowClick(props.row)"
                            :class="{ selected: props.row.isSelected }"
                            :style="{
                                backgroundColor: getStatusColor(props.row.pivot.estatus_id),
                                width: '200px',
                                height: '100px',
                                margin: '5px'
                            }"
                        >
                            <q-card-section>
                            <q-item v-for="col in props.cols" :key="col.name">
                                <q-item-section side>
                                <q-item-label caption>{{
                                    props.row[col.name]
                                }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            </q-card-section>
                        </q-card>
                        </template>
                </q-table>
            </div>
        </template>
        <template v-slot:after>
            <div class="q-pa-md">
                <div class="text-h6 q-mb-md">Archivos</div>
                <archivos
                    v-if="selectedRequisito"
                    ref="edit_4"
                    :key="selectedRequisito.id"
                    :requisito="selectedRequisito"
                />
                <div v-else>Selecciona un requisito para ver los detalles.</div>
                    </div>

        </template>
    </q-splitter>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Archivos from "src/components/Perfil/Archivos.vue";

const splitterModel = ref(50);
const { empleado } = defineProps(["empleado"])
const requisitos = ref([])
const filter = ref("");
const selectedRequisito = ref(null);

const columns = [
    {
        name: "nombre",
        align: "left",
        field: "nombre",
        sortable: true
    }
];

const getStatusColor = (status) => {
    switch (status) {
        case 1:
            return "#b6ffaa"; // Verde claro
        case 2:
            return "#ffcccc"; // Rojo más claro
        case 3:
            return "#fff3b2"; // Amarillo más claro
        case 4:
            return "#b5fff4"; // Verde más claro
        //Añade más casos para otros estados
        default:
            return "#f2f2f2";
    }
};

const onRowClick = (row) => {
    selectedRequisito.value = row;
    requisitos.value.forEach((requisito) => (requisito.isSelected = false));
    row.isSelected = true;
};

onMounted(() => {
    requisitos.value = empleado.archivable[0].requisito
});

</script>

<style scoped>
.selected {
    border: 2px solid #9596ce;
    background-color: #e6ffe6;
}
</style>