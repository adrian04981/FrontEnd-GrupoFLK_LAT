<template>
  <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    <!-- Indicadores del carrusel -->
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>

    <!-- Elementos del carrusel -->
    <div class="carousel-inner" data-aos="fade-up">
      <div class="carousel-item active">
        <img src="@/assets/Carrusel1.png" class="d-block w-100 carousel-image" alt="Carrusel 1" loading="lazy">
      </div>
      <div class="carousel-item">
        <img src="@/assets/Carrusel2.png" class="d-block w-100 carousel-image" alt="Carrusel 2" loading="lazy">
      </div>
      <div class="carousel-item">
        <img src="@/assets/Carrusel3.png" class="d-block w-100 carousel-image" alt="Carrusel 3" loading="lazy">
      </div>
    </div>

    <!-- Controles previos y siguientes -->
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CarouselSection'
};
</script>

<style scoped>
/* Estilos del carrusel */
.carousel-image {
  height: 500px; /* Altura estándar */
  object-fit: cover; /* Asegura que las imágenes mantengan su proporción */
  width: 100%;
}

/* Limita la altura máxima del carrusel */
.carousel-inner {
  max-height: 500px;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 768px) {
  .carousel-image {
    height: 300px; /* Altura menor en dispositivos móviles */
  }
}

/* Ajustes para pantallas muy grandes */
@media (min-width: 1200px) {
  .carousel-image {
    height: 600px; /* Aumenta la altura para pantallas más grandes */
  }
}
</style>
