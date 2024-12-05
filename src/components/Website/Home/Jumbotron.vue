<template>
  <div class="jumbotron text-center">
    <div class="overlay animate-fade-in"></div>
    <div class="content-wrapper">
      <h1 class="display-4 animate-slide-down">Servicios de calidad</h1>
      <p class="lead animate-slide-up">Ofrecemos servicios de inspección, capacitación y certificación.</p>
      <hr class="my-4 animate-scale">
      
      <div class="buttons-container">
        <router-link to="/services" class="btn btn-yellow btn-lg animate-fade-in">
          <span class="btn-content">
            <span class="btn-text">Nuestros Servicios</span>
            <span class="btn-icon">→</span>
          </span>
        </router-link>

        <a href="https://wa.me/51966401791?text=Hola%2C%20Quisiera%20solicitar%20Informes" 
           target="_blank" 
           class="btn btn-whatsapp animate-fade-in">
          <span class="btn-content">
            <i class="fab fa-whatsapp"></i>
            <span class="btn-text">Contáctanos por WhatsApp</span>
          </span>
        </a>

        <router-link to="/RequestTraining" class="btn btn-red btn-lg animate-fade-in">
          <span class="btn-content">
            <span class="btn-text">Solicitar capacitación</span>
            <span class="btn-icon">→</span>
          </span>
        </router-link>

        <router-link to="/ListarInspeccionesPorRUC" class="btn btn-green btn-lg animate-fade-in">
          <span class="btn-content">
            <span class="btn-text">Consultar Inspecciones</span>
            <span class="btn-icon">→</span>
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Jumbotron'
};
</script>

<style scoped>
.jumbotron {
  position: relative;
  background-image: url('/src/assets/Portada.png');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 6rem 2rem;
  margin-bottom: 0;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

.display-4 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.lead {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.btn:hover .btn-icon {
  opacity: 1;
  transform: translateX(0);
}

/* Button Styles */
.btn-yellow {
  background: linear-gradient(135deg, #FFC107, #FF9800);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.btn-yellow:hover {
  background: linear-gradient(135deg, #FF9800, #FFC107);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
}

.btn-red {
  background: linear-gradient(135deg, #ff2c07, #ff5252);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 44, 7, 0.3);
}

.btn-red:hover {
  background: linear-gradient(135deg, #ff5252, #ff2c07);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 44, 7, 0.4);
}

.btn-green {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-green:hover {
  background: linear-gradient(135deg, #20c997, #28a745);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.btn-whatsapp {
  background: linear-gradient(135deg, #25d366, #128C7E);
  color: white;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.btn-whatsapp:hover {
  background: linear-gradient(135deg, #128C7E, #25d366);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-down {
  animation: slideDown 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out forwards;
}

.animate-scale {
  animation: scale 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .jumbotron {
    padding: 4rem 1rem;
  }

  .display-4 {
    font-size: 2.5rem;
  }

  .lead {
    font-size: 1.25rem;
  }

  .buttons-container {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>