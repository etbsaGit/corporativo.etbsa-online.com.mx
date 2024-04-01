<template>
  <div class="q-pa-md">
    <q-hierarchy bordered flat dense :columns="columns" :data="formattedData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const { qualifications } = defineProps(["qualifications"]);

// Función para formatear los datos con hijos
const formatDataWithChildren = (qualifications) => {
  const formattedData = [];

  for (const key in qualifications) {
    const children = qualifications[key].map((item) => ({
      label: item.name,
      ...item,
    }));

    formattedData.push({
      label: key,
      children: children,
    });
  }

  return formattedData;
};

const formattedData = ref(formatDataWithChildren(qualifications));

const columns = [
  {
    name: "label",
    required: true,
    label: "Nivel",
    align: "left",
    field: "label",
    sortable: false,
    filterable: false,
  },
];
</script>
