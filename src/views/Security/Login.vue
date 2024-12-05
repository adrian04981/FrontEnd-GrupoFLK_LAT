<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Panel -->
      <div class="login-left-panel">
        <div class="brand-section">
          <img src="@/assets/SELLO_FLK.png" alt="GRUPO FLK" class="brand-logo" />
          <h1 class="brand-name">GRUPO FLK</h1>
        </div>

        <div class="login-form-container">
          <form @submit.prevent="handleLogin" class="login-form">
            <h2 class="form-title">Iniciar Sesión</h2>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">Correo Electrónico</label>
              <div class="input-group">
                <i class="fas fa-envelope input-icon"></i>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  class="form-input"
                  required
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password" class="form-label">Contraseña</label>
              <div class="input-group">
                <i class="fas fa-lock input-icon"></i>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  class="form-input"
                  required
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="togglePassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="submit-button" 
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Ingresar</span>
              <span v-else class="loading-spinner"></span>
            </button>

            <!-- Additional Links -->
            <div class="form-links">
              <router-link to="/reset-password" class="forgot-password">
                ¿Olvidaste tu contraseña?
              </router-link>
              <router-link to="/register" class="register-link">
                ¿No tienes cuenta? Regístrate aquí
              </router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="login-right-panel">
        <img 
          src="@/assets/Portada.png"
          alt="Login Background" 
          class="background-image"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importamos useRouter
import { login } from '@/auth';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter(); // Obtenemos la instancia del router
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const error = ref(null);
    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleLogin = async () => {
      error.value = null;
      isLoading.value = true;

      try {
        const { user, rolId, jwt } = await login(email.value, password.value);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('jwt', jwt);

        const routes = {
          1: '/home',
          2: '/operations-assistant-dashboard',
          3: '/admin-dashboard',
          4: '/receptionist-dashboard',
          5: '/operator-dashboard',
          6: '/instructor-dashboard',
          7: '/formador-dashboard'
        };

        const route = routes[rolId];
        if (route) {
          router.push(route); // Usamos router en lugar de this.$router
        } else {
          error.value = 'No se ha asignado un rol válido a este usuario.';
        }
      } catch (err) {
        error.value = 'Credenciales inválidas. Por favor, intente nuevamente.';
        console.error('Error de login:', err);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      isLoading,
      error,
      showPassword,
      togglePassword,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-container {
  display: flex;
  min-height: 100vh;
}

.login-left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: white;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.brand-logo {
  width: 60px;
  height: auto;
}

.brand-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}

.login-form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #a0aec0;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  outline: none;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
}

.submit-button:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

.form-links {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
}

.forgot-password,
.register-link {
  color: #4299e1;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.forgot-password:hover,
.register-link:hover {
  color: #3182ce;
  text-decoration: underline;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

.login-right-panel {
  flex: 1;
  display: none;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 768px) {
  .login-right-panel {
    display: block;
  }
}

@media (max-width: 768px) {
  .login-left-panel {
    padding: 1.5rem;
  }

  .brand-section {
    margin-bottom: 2rem;
  }

  .brand-name {
    font-size: 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }
}
</style>