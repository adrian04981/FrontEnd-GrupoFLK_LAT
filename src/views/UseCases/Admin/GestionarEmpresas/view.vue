<!-- src/views/UseCases/Admin/GestionarEmpresa/View.vue -->
<template>
    <div class="gestionar-empresa-view">
      <h1 class="view-title animate__animated animate__bounceIn">Gestionar Empresa</h1>
      
      <!-- Aquí se invoca el componente GestionarEmpresa -->
      <div class="section">
        <GestionarEmpresas class="animate__animated animate__bounceIn"/>
      </div>
    </div>
  </template>
  
  <script>
  // Importa el componente GestionarEmpresa
  import GestionarEmpresas from '@/components/GestionarEmpresas/Listar.vue';
  
  export default {
    components: {
      GestionarEmpresas
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
    .gestionar-empresa-view {
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
    .gestionar-empresa-view {
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