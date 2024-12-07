<template>
  <section class="services-section" data-aos="fade-up">
    <h2>Nuestros Servicios</h2>
    <div class="services-grid">
      <!-- Servicio: Inspección y Certificación -->
      <router-link to="/services/Inspección" class="service-card" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
        <img src="@/assets/ServicioInspeccion.png" alt="Inspección y Certificación" class="service-image">
        <h3>Inspección y Certificación</h3>
        <p>Realizamos inspecciones rigurosas y certificaciones para garantizar el óptimo funcionamiento de tus equipos industriales.</p>
      </router-link>

      <!-- Servicio: Capacitación de Operarios -->
      <router-link to="/services/CapacitaciónDeOperarios" class="service-card" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
        <img src="@/assets/ServicioCapacitacion.png" alt="Capacitación de Operarios" class="service-image">
        <h3>Capacitación de Operarios</h3>
        <p>Brindamos formación especializada para operadores de maquinaria pesada, asegurando el correcto uso y seguridad en el trabajo.</p>
      </router-link>

      <!-- Servicio: Consultoría Industrial -->
      <router-link to="/services/Consultoría Industrial" class="service-card" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
        <img src="@/assets/ServicioConsultoria.png" alt="Consultoría Industrial" class="service-image">
        <h3>Consultoría Industrial</h3>
        <p>Nuestros expertos ofrecen soluciones personalizadas para optimizar la eficiencia y seguridad en la industria.</p>
      </router-link>

      <!-- Servicio: Mantenimiento de Maquinaria -->
      <router-link to="/services/Mantenimiento" class="service-card" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
        <img src="@/assets/ServicioMantenimiento.png" alt="Mantenimiento de Maquinaria" class="service-image">
        <h3>Mantenimiento de Maquinaria</h3>
        <p>Ofrecemos mantenimiento preventivo y correctivo para asegurar la operatividad continua de tus equipos industriales.</p>
      </router-link>

      <!-- Servicio: Certificacion de Operarios -->
      <router-link to="/services/CertificacionDeOperarios" class="service-card" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
        <img src="@/assets/ServicioCapacitacion.png" alt="Capacitación de Operarios" class="service-image">
        <h3>Certificacion de Operarios</h3>
        <p>Certificamos la experiencia y competencia de los operadores</p>
      </router-link>

            <!-- Servicio: Mantenimiento de Maquinaria -->
       <router-link to="/services/Mantenimiento" class="service-card" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
        <img src="@/assets/ServicioMantenimiento.png" alt="Mantenimiento de Maquinaria" class="service-image">
        <h3>Homologacion de Maquinaria</h3>
        <p>Ofrecemos servicios de Homologacion de Maquinaria.</p>
      </router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Servicios',
  methods: {
    onMouseOver(event) {
      event.currentTarget.style.opacity = '0.8';
    },
    onMouseLeave(event) {
      event.currentTarget.style.opacity = '1';
    }
  }
};
</script>

<style scoped>
/* Sección general de servicios */
.services-section {
  background-color: #000; /* Fondo negro */
  padding: 3rem 1rem;
  text-align: center;
  color: #f2f2f2; /* Texto claro */
}

.services-section h2 {
  font-size: 2.5rem;
  color: #f2b950; /* Color dorado para el título */
  margin-bottom: 2rem;
}

/* Grid de servicios */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Ajuste automático */
  gap: 2rem;
  justify-content: center;
}

/* Tarjetas de servicios */
.service-card {
  background-color: #1e1e1e; /* Fondo oscuro */
  border: 1px solid #333; /* Borde gris oscuro */
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
}

.service-card:hover {
  transform: scale(1.05); /* Efecto de agrandamiento en hover */
  background-color: #333; /* Cambio de color en hover */
  opacity: 0.8;
}

/* Imágenes de los servicios */
.service-image {
  width: 100%;
  height: 150px;
  object-fit: cover; /* Mantener proporciones de la imagen */
  border-radius: 10px;
  margin-bottom: 1rem;
}

/* Títulos de las tarjetas */
.service-card h3 {
  color: #f26430; /* Color naranja para los títulos */
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

/* Descripciones de los servicios */
.service-card p {
  color: #e0e0e0; /* Color gris claro para el texto */
  font-size: 1.125rem;
}

/* Responsividad */
@media (max-width: 768px) {
  .services-section h2 {
    font-size: 2rem;
  }

  .service-card h3 {
    font-size: 1.5rem;
  }

  .service-card p {
    font-size: 1rem;
  }

  .service-image {
    height: 120px;
  }
}
</style>
