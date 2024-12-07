<template>
  <div class="gestionar-personal-view">
    <h1 class="view-title animate__animated animate__bounceIn">Gestionar Servicios</h1>
    <div class="section">
      <ListTypeInspeccion class="animate__animated animate__bounceIn"/>
    </div>

    <div class="section">
      <ListMachinery class="animate__animated animate__bounceIn"/>
    </div>
  </div>
</template>

<script>
import ListTypeInspeccion from '../../../../components/ManagementTypesInspeccion/ListInspection.vue';
import ListMachinery from '../../../../components/ManageTypeMachinery/ListMachinery.vue';
export default {
  components: {
    ListTypeInspeccion,
    ListMachinery,
  },
};
</script> 

<style scoped>
.gestionar-personal-view {
  background-color: #fff;
}
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
