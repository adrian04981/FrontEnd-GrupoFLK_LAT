<!-- src/layouts/MainLayout.vue -->
<template>
  <el-container style="height: 100vh;" class="instructor-layout">
    <Drawer ref="drawer" class="d-md-none" />
    <el-main>
      <router-view></router-view> 
    </el-main>
  </el-container>
</template>

<script>
import Drawer from './Drawer.vue';

export default {
  components: {
    Drawer
  },
};
</script>
<style scoped>
/* Aplicar fondo al layout principal */
.instructor-layout {
background-image: linear-gradient(rgba(255, 255, 255, 0.774), rgba(255, 255, 255, 0.877)), url('/src/assets/Carrusel3.png');
background-repeat: no-repeat;
background-size: cover; /* Asegura que ocupe todo el espacio */
background-position: center;
height: 100vh; /* Asegura que ocupe la altura completa */
width: 100%;
position: fixed; /* Fija el fondo para que no se desplace */
z-index: -1; /* Asegura que el contenido esté encima del fondo */
}
</style>