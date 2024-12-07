<!-- src/views/UseCases/Admin/GestionarInspecciones/View.vue -->
<template>
    <div class="gestionar-inspecciones-view">
      <h1 class="view-title animate__animated animate__bounceIn">Gestionar Inspecciones</h1>
      
      <!-- Aquí se invoca el componente GestionarInspecciones -->
      <div class="section">
        <GestionarInspecciones class="animate__animated animate__bounceIn"/>
      </div>
    </div>
  </template>
  
  <script>
  // Importa el componente GestionarInspecciones
  import GestionarInspecciones from '@/components/GesionarInspecciones/ListarInspecciones.vue';
  
  export default {
    components: {
      // Registra el componente para usarlo en esta vista
      GestionarInspecciones
    }
  }
  </script>
  
  <style scoped>
  .view-title {
    text-align: center;
    font-family: Arial Black;
    font-weight: bold;
    font-size: 30px;
    color: #fff;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
  }
  
  .section {
    margin-bottom: 40px;
  }
  
  /* Media Queries for responsiveness */
  
  /* Tablets */
  @media (max-width: 768px) {
    .gestionar-inspecciones-view {
      padding: 10px;
    }
  
    .view-title {
      font-size: 1.75rem;
      margin-bottom: 15px;
    }
  
    .section {
      margin-bottom: 30px;
    }
  }
  
  /* Móviles */
  @media (max-width: 480px) {
    .gestionar-inspecciones-view {
      padding: 5px;
    }
  
    .view-title {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
  
    .section {
      margin-bottom: 20px;
    }
  }
  </style>