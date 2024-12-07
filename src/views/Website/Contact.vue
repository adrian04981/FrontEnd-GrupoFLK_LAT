<template>
    <navbar>    
    </navbar>
    <section class="contact-form">
  <h2>Contáctanos</h2>
  <form action="#" method="post">
    <div class="form-group">
      <label for="razon-social">Razón social *</label>
      <input type="text" id="razon-social" name="razon-social" required>
    </div>
    <div class="form-group">
      <label for="info">¿Qué información desea?</label>
      <select id="info" name="info">
        <option value="Cursos de Operadores">Cursos de Operadores</option>
        <option value="Servicios de Inspección">Servicios de Inspección</option>
        <option value="Consultoría">Servicio de Consultoría</option>
      </select>
    </div>
    <div class="form-group">
      <label for="numero">Número de contacto *</label>
      <input type="tel" id="numero" name="numero" required>
    </div>
    <div class="form-group">
      <label for="correo">Correo electrónico *</label>
      <input type="email" id="correo" name="correo" required>
    </div>
    <div class="form-group">
      <label for="lugar">Lugar de Servicios</label>
      <select id="lugar" name="lugar">
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
      <textarea id="comentario" name="comentario" rows="4"></textarea>
    </div>
    <button type="submit">Enviar</button>
  </form>
</section>
    </template>
    
    <script>
    import navbar from '@/components/Website/Navbar.vue' 
    export default {name:"Contact",components:{navbar}};
    </script>

<style> 
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

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-group label {
  font-weight: normal;
}

.contact-form button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #BF391B;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.contact-form button:hover {
  background-color: #F26430;
}
</style>