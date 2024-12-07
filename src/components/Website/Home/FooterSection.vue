<template>
  <footer class="contact-section" data-aos="fade-up">
    <h2>Contáctanos</h2>
    <p><strong>Dirección:</strong> Jirón Larrabure y Unanue N°231, Jesús María, Lima, Perú</p>
    <div class="contact-buttons">
      <a href="https://www.facebook.com" class="btn btn-social" target="_blank">Facebook</a>
      <a href="https://www.instagram.com" class="btn btn-social" target="_blank">Instagram</a>
      <a href="https://www.linkedin.com" class="btn btn-social" target="_blank">LinkedIn</a>
      <a href="https://wa.me/51987654321" class="btn btn-social" target="_blank">WhatsApp</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection'
};
</script>

<style scoped>
.contact-section {
  padding: 2rem;
  background-color: #000; /* Fondo negro */
  color: #f2f2f2; /* Texto claro */
  text-align: center;
  border-top: 2px solid #f2b950; /* Borde superior dorado */
}

.contact-section h2 {
  color: #f2b950;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.contact-section p {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.contact-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-social {
  background-color: #f26430; /* Color naranja */
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn-social:hover {
  background-color: #bf391b; /* Color más oscuro al hacer hover */
}

/* Responsividad para pantallas más pequeñas */
@media (max-width: 768px) {
  .contact-section h2 {
    font-size: 2rem;
  }

  .contact-section p {
    font-size: 1rem;
  }

  .btn-social {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}
</style>
