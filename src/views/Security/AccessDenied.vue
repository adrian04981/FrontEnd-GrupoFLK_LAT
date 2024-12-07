<!-- src/views/AccessDenied.vue -->
<template>
    <div class="access-denied">
      <h2>Acceso denegado</h2>
      <p>No tienes los permisos necesarios para acceder a esta página.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AccessDenied'
  };
  </script>
  
  <style scoped>
  .access-denied {
    text-align: center;
    margin-top: 50px;
  }
  </style>
  