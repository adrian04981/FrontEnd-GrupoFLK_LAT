<template>
  <navbar></navbar>
  
  <!-- Título de la página -->
  <h1 class="page-title">Servicios Inspecciones</h1>

  <!-- Grupo de tarjetas -->
  <div class="card-group">
    <div v-for="inspeccion in inspecciones" :key="inspeccion.id" class="card">
      <img
        class="card-img-top"
        :src="inspeccion.URL_IMG || 'default-image-url.jpg'"
      />
      <div class="card-body">
        <h5 class="card-title">{{ inspeccion.nombre || 'Nombre no disponible' }}</h5>
        <p class="card-text">{{ inspeccion.descripcion || 'Descripción no disponible' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Website/Navbar.vue';
import { supabase } from '@/supabase.js';

export default {
  name: "Services",
  components: { Navbar },
  data() {
    return {
      inspecciones: []  // Datos de las inspecciones que se obtendrán desde la base de datos
    };
  },
  async mounted() {
    const { data: tipo_de_inspeccion, error } = await supabase
      .from('tipo_de_inspeccion')
      .select('*');

    if (error) {
      console.error("Error fetching data: ", error);
    } else {
      this.inspecciones = tipo_de_inspeccion;  // Asignamos los datos de inspección a la propiedad reactiva
    }
  }
};
</script>

<style scoped>
/* Contenedor general */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #2c2c2e; /* Fondo oscuro */
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Título */
.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #F26430; /* Color anaranjado industrial */
  margin-bottom: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

/* Diseño del grupo de tarjetas */
.card-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
}

/* Tarjeta individual */
.card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  flex: 1 1 250px; /* Tarjetas adaptables con un mínimo de 250px */
  max-width: 100%; /* Máximo tamaño para dispositivos pequeños */
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* Hover en las tarjetas */
.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Imagen de la tarjeta */
.card-img-top {
  width: 100%;
  height: 150px;
  object-fit: contain; /* Imagen adaptada */
  background-color: #f9f9f9;
  padding: 10px;
}

/* Cuerpo de la tarjeta */
.card-body {
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
}

/* Título de la tarjeta */
.card-title {
  font-size: 1.25rem; /* Reducimos el tamaño del texto para evitar cortes */
  color: #333;
  margin-bottom: 0.5rem;
  word-wrap: break-word; /* Evita cortar palabras */
}

/* Texto de la tarjeta */
.card-text {
  font-size: 1rem;
  color: #555;
  flex-grow: 1; /* Permitir que el texto crezca */
  word-wrap: break-word; /* Evita cortar palabras */
}

/* Botón de la tarjeta */
.card-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #BF391B;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.card-btn:hover {
  background-color: #F26430;
}
</style>
