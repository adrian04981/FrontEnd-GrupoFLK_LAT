<template>
    <div class="container d-flex justify-content-center">
      <div class="row">
        <form @submit.prevent="handlePasswordReset">
          <div class="mb-3">
            <label for="email" class="form-label">Ingrese su correo electrónico</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              aria-describedby="emailHelp"
              required
            />
            <div id="emailHelp" class="form-text">
              Le enviaremos un enlace para restablecer su contraseña.
            </div>
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-primary">Enviar</button>
          </div>
          <!-- Mostrar mensaje de éxito o error -->
          <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </form>
      </div>
    </div>
  </template>
<script>
import { ref } from 'vue';
import { supabase } from '../../supabase.js'; 

export default {
  setup() {
    const email = ref('');
    const message = ref('');
    const errorMessage = ref('');

    const handlePasswordReset = async () => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.value);
        if (error) {
          errorMessage.value = 'Hubo un problema al enviar el enlace. Inténtalo de nuevo.';
          console.error(error);
        } else {
          message.value = 'Revisa tu correo electrónico para el enlace de restablecimiento.';
        }
      } catch (err) {
        errorMessage.value = 'Ocurrió un error inesperado. Inténtalo más tarde.';
        console.error(err);
      }
    };

    return {
      email,
      message,
      errorMessage,
      handlePasswordReset,
    };
  },
};
</script>