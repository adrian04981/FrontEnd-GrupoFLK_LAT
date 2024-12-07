<template>
    <section class="contact-form" data-aos="fade-up">
      <h2>Contáctanos</h2>
      <form action="#" method="post">
        <div class="form-group">
          <label for="razon-social">Razón social *</label>
          <input type="text" id="razon-social" name="razon-social" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="info">¿Qué información desea?</label>
          <select id="info" name="info" class="form-control">
            <option value="Cursos de Operadores">Cursos de Operadores</option>
            <option value="Servicios de Inspección">Servicios de Inspección</option>
            <option value="Consultoría">Servicio de Consultoría</option>
          </select>
        </div>
        <div class="form-group">
          <label for="numero">Número de contacto *</label>
          <input type="tel" id="numero" name="numero" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="correo">Correo electrónico *</label>
          <input type="email" id="correo" name="correo" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="lugar">Lugar de Servicios</label>
          <select id="lugar" name="lugar" class="form-control">
            <option value="Lima">Lima</option>
            <option value="Arequipa">Arequipa</option>
            <option value="Cajamarca">Cajamarca</option>
          </select>
        </div>
        <div class="form-group">
          <label>Experiencia</label>
          <div class="radio-group">
            <input type="radio" id="con-experiencia" name="experiencia" value="Con Experiencia" checked>
            <label for="con-experiencia">Con Experiencia</label>
            <input type="radio" id="sin-experiencia" name="experiencia" value="Sin Experiencia">
            <label for="sin-experiencia">Sin Experiencia</label>
          </div>
        </div>
        <div class="form-group">
          <label for="comentario">Comentario</label>
          <textarea id="comentario" name="comentario" rows="4" class="form-control"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </form>
    </section>
  </template>
  
  <script>
  export default {
    name: 'ContactForm'
  };
  </script>
  
  <style scoped>
  .contact-form {
    background-color: #F2913D;
    padding: 2rem;
    border-radius: 10px;
    max-width: 600px;
    margin: 2rem auto;
  }
  
  .contact-form h2 {
    text-align: center;
    color: #BF391B;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .radio-group {
    display: flex;
    gap: 1rem;
  }
  
  .contact-form button {
    width: 100%;
    padding: 1rem;
  }
  </style>
  