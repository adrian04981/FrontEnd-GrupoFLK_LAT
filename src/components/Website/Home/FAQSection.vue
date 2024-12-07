<template>
  <section class="faq-section" data-aos="fade-left">
    <h2>¿Preguntas Frecuentes?</h2>
    <div class="faq">
      <div class="question">
        <h3>¿Qué servicios ofrecemos?</h3>
        <p>Ofrecemos inspecciones, certificaciones y capacitaciones para montacargas y grúas.</p>
      </div>
      <div class="question">
        <h3>¿Cómo puedo contactarlos?</h3>
        <p>Puedes contactarnos a través de redes sociales, WhatsApp o visitándonos en nuestras oficinas.</p>
      </div>
      <div class="question">
        <h3>¿Dónde están ubicados?</h3>
        <p>Estamos en Av. Gerardo Unger Nro. 7903, San Martín de Porres, Lima, Perú.</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FAQSection'
};
</script>

<style scoped>
.faq-section {
  background-color: #000; /* Fondo negro */
  padding: 2rem;
  border-radius: 10px;
  margin: 2rem 0;
  color: #f2f2f2; /* Color de texto claro para contraste */
}

.faq-section h2 {
  font-size: 2.5rem;
  color: #f2b950; /* Título en color dorado */
  text-align: center;
  margin-bottom: 2rem;
}

.faq .question {
  margin-bottom: 1.5rem;
}

.faq h3 {
  color: #f26430; /* Color de preguntas en naranja */
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.faq p {
  font-size: 1.25rem;
  color: #e0e0e0; /* Color gris claro para el texto */
  margin-bottom: 1rem;
}

/* Ajustes responsivos para pantallas pequeñas */
@media (max-width: 768px) {
  .faq-section {
    padding: 1.5rem;
  }

  .faq-section h2 {
    font-size: 2rem;
  }

  .faq h3 {
    font-size: 1.5rem;
  }

  .faq p {
    font-size: 1rem;
  }
}
</style>