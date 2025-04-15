<template>
  <div class="carousel-container">
    <q-carousel
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
      arrows
      control-type="push"
      control-color="green"
      class="full-height"
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide
        v-for="(img, index) in images"
        :key="index"
        :name="index + 1"
        :img-src="img"
        class="no-bg"
      >
        <img :src="img" class="slide-img" />
      </q-carousel-slide>
    </q-carousel>
  </div>

  <q-page-sticky position="bottom-right" :offset="[50, 50]">
    <q-btn
      fab
      icon="fa-solid fa-cloud-arrow-down"
      color="blue"
      href="https://drive.google.com/file/d/1LwQJwRiGL1uVCnwVztddHp0RwUVft9fH/view?usp=sharing"
      target="_blank"
    >
      <q-tooltip
        class="bg-blue text-body2"
        :offset="[10, 10]"
        anchor="center left"
        self="center right"
      >
        Descargar PDF
      </q-tooltip>
    </q-btn>
  </q-page-sticky>
</template>

<script setup>
import { ref } from "vue";

const slide = ref(1);

// Array con las rutas de las imágenes
const images = [
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-01.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-02.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-03.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-04.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-05.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-06.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-07.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-08.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-09.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-10.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-11.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-12.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-13.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-14.png",
  "https://codigoeticaetbsa.s3.us-west-1.amazonaws.com/C%C3%93DIGO+DE+%C3%89TICA+ETBSA+CORPORATIVO-15.png",
];
</script>

<style scoped>
.carousel-container {
  height: 92vh;
  width: 100%;
}

.full-height {
  height: 100%;
}

.slide-img {
  height: 100%;
  width: 100%;
  object-fit: contain;
  transition: transform 0.3s ease; /* Animación al pasar el cursor */
}

.no-bg {
  background: none !important;
}
</style>
