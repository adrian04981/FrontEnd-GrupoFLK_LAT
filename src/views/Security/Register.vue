<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <img src="@/assets/SELLO_FLK.png" alt="Logo" class="register-logo" />
        <h1>Crear Cuenta</h1>
        <p class="subtitle">Complete los campos para registrarse</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <div class="input-container">
            <i class="fas fa-envelope input-icon"></i>
            <input type="email" id="email" v-model="email" placeholder="ejemplo@correo.com" required
              class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-container">
            <i class="fas fa-lock input-icon"></i>
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
              placeholder="Ingrese su contraseña" required class="form-input" />
            <button type="button" class="password-toggle" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="rol">Rol</label>
          <div class="input-container">
            <i class="fas fa-user-tag input-icon"></i>
            <select id="rol" v-model="selectedRol" required class="form-select">
              <option value="">Seleccione un rol</option>
              <option v-for="rol in roles" :key="rol.id" :value="rol.id">
                {{ rol.nombre }}
              </option>
            </select>
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          <span v-if="!isLoading">Registrarse</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <div class="form-footer">
          <p>¿Ya tienes una cuenta? <a href="/login">Iniciar Sesión</a></p>
        </div>
      </form>

      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </div>

      <div v-if="message" class="success-message">
        <i class="fas fa-check-circle"></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';

export default {
  name: 'RegisterView',
  setup() {
    const email = ref('');
    const password = ref('');
    const selectedRol = ref('');
    const roles = ref([]);
    const error = ref(null);
    const message = ref(null);
    const isLoading = ref(false);
    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const fetchRoles = async () => {
      try {
        const { data, error: rolesError } = await supabase
          .from('roles')
          .select('*')
          .neq('nombre', 'Operador');
        if (rolesError) throw rolesError;
        roles.value = data;
      } catch (err) {
        error.value = 'Error al cargar los roles';
        console.error('Error:', err);
      }
    };

    onMounted(fetchRoles);

    const handleRegister = async () => {
      error.value = null;
      message.value = null;
      isLoading.value = true;

      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.value,
          password: password.value,
        });

        if (signUpError) throw signUpError;

        const user = signUpData.user;

        if (user) {
          const { error: insertError } = await supabase
            .from('asignaciondeusuario')
            .insert([
              { id: user.id, rol: selectedRol.value },
            ]);

          if (insertError) throw insertError;

          message.value = 'Registro exitoso. Por favor revisa tu email para confirmar.';
          email.value = '';
          password.value = '';
          selectedRol.value = '';
        }
      } catch (err) {
        error.value = err.message || 'Error en el proceso de registro.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      selectedRol,
      roles,
      error,
      message,
      isLoading,
      showPassword,
      togglePassword,
      handleRegister,
    };
  },
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
}

.register-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-logo {
  width: 120px;
  height: auto;
  margin-bottom: 1.5rem;
}

h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #95a5a6;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #95a5a6;
  cursor: pointer;
  padding: 0;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.submit-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #7f8c8d;
}

.form-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}

.error-message,
.success-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
}

.success-message {
  background: #dcfce7;
  color: #16a34a;
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .form-input,
  .form-select {
    font-size: 0.9rem;
  }
}
</style>