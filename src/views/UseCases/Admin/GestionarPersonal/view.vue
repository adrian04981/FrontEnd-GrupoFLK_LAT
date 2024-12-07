<template>
  <div class="gestionar-personal-view">
    <h1 class="view-title animate__animated animate__bounceIn">Gestionar Personal</h1>
    <div class="section">
      <GestionarInspectores class="animate__animated animate__bounceIn"/>
    </div>

    <div class="section">
      <GestionarCertificadores class="animate__animated animate__bounceIn"/>
    </div>

    <div class="section">
      <GestionarIntructores class="animate__animated animate__bounceIn"/>
    </div>

    <div class="section">
      <GestionarOperadores class="animate__animated animate__bounceIn"/>
    </div>

    <div class="section">
      <GestionarFormadores class="animate__animated animate__bounceIn"/>
    </div>
  </div>
</template>

<script>
// Importas los componentes GestionarInspectores y GestionarCertificadores
import GestionarInspectores from '@/components/GestionarPersonal/GestionarInspectores/Listar.vue';
import GestionarCertificadores from '@/components/GestionarPersonal/GestionarCertificadores/Listar.vue';
import GestionarIntructores from '@/components/UserList/ListaIntructores.vue';
import GestionarOperadores from '@/components/UserList/ListaOperadores.vue';
import GestionarFormadores from '@/components/UserList/ListaFormadores.vue';
export default {
  components: {
    // Registras los componentes para usarlos en esta vista
    GestionarInspectores,
    GestionarCertificadores,
    GestionarIntructores,
    GestionarOperadores,
    GestionarFormadores
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
  .gestionar-personal-view {
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
  .gestionar-personal-view {
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
