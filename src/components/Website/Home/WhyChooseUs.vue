<template>
  <div class="why-choose-us" data-aos="fade-up">
    <h2>¿Por qué elegirnos?</h2>
    <div class="reasons-grid">
      <div class="reason">
        <h3>Experiencia</h3>
        <p>Contamos con una amplia trayectoria en la formación, certificación y homologación de operadores.</p>
      </div>
      <div class="reason">
        <h3>Calidad</h3>
        <p>Propiciamos la mejora continua en la capacitación y seguridad de los operadores.</p>
      </div>
      <div class="reason">
        <h3>Puntualidad</h3>
        <p>Desarrollamos cursos fuera del Perú, certificando empresas logísticas.</p>
      </div>
      <div class="reason">
        <h3>Pasión</h3>
        <p>Asesoramos a clientes de industrias clave como minería, energía y construcción.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WhyChooseUs'
};
</script>

<style scoped>
.why-choose-us {
  background-color: #000; /* Fondo negro */
  padding: 3rem 1rem;
  text-align: center;
  color: #f2f2f2; /* Texto claro */
}

.why-choose-us h2 {
  color: #f2b950; /* Color dorado para el título */
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.reason {
  background-color: #1e1e1e; /* Fondo oscuro para las tarjetas */
  border: 1px solid #333; /* Borde gris oscuro */
  padding: 1.5rem;
  border-radius: 10px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.reason:hover {
  transform: scale(1.05); /* Efecto de agrandamiento */
  background-color: #333; /* Cambio de color en hover */
}

.reason h3 {
  color: #f26430; /* Color naranja para los títulos de las razones */
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

.reason p {
  color: #e0e0e0; /* Color gris claro para el texto */
  font-size: 1.25rem;
}

/* Responsividad */
@media (max-width: 768px) {
  .why-choose-us h2 {
    font-size: 2rem;
  }

  .reason h3 {
    font-size: 1.5rem;
  }

  .reason p {
    font-size: 1rem;
  }
}
</style>
