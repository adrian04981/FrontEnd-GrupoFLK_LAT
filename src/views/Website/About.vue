<template>
    <navbar>
    </navbar>
    <section class="image-container">
  <img src="https://grupoflk.com/wp-content/uploads/2023/06/aaaaaaaaaaaaaa.png" alt="Acreditación Internacional" class="responsive-image">
</section>
<section class="image-container">
  <img src="https://grupoflk.com/wp-content/uploads/2023/06/aaaaaaa-tex-1024x449.png" alt="Acreditación Internacional" class="responsive-image">
</section>
<section class="image-container">
  <img src="https://grupoflk.com/wp-content/uploads/2024/01/Mision-y-Vision-1024x543.jpg" alt="Acreditación Internacional" class="responsive-image">
</section>
<section class="image-container">
  <img src="https://grupoflk.com/wp-content/uploads/2024/02/Politicas-760x1024.png" alt="Acreditación Internacional" class="responsive-image">
</section>
<section class="image-container">
  <img src="https://grupoflk.com/wp-content/uploads/2024/02/Alcance-1024x922.png" alt="Acreditación Internacional" class="responsive-image">
</section>
    </template>
    
    <script>
    import navbar from '@/components/Website/Navbar.vue' 
    export default {name:"About",components:{navbar}};
    </script>
<style> 
.image-container {
  display: flex;
  justify-content: center; /* Centra la imagen horizontalmente */
  align-items: center; /* Centra la imagen verticalmente si es necesario */
  padding: 2rem;
  background-color: #262624; /* Un color de fondo claro */
  border: 2px solid #F2B950; /* Borde dorado */
  border-radius: 10px; /* Bordes redondeados */
  max-width: 100%; /* Ajusta a un ancho máximo del contenedor */
  margin: 2rem auto; /* Centra el contenedor */
}

.responsive-image {
  max-width: 100%;
  height: auto;
  border-radius: 5px; /* Bordes ligeramente redondeados para la imagen */
}
</style>