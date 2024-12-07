<template>
  <div class="container">
    <h2 class="title">Registrar Nuevo Curso</h2>
    <form @submit.prevent="registrarCurso" class="form">
      <div class="form-group">
        <label for="titulo">Título del Curso</label>
        <input v-model="curso.titulo" type="text" id="titulo" placeholder="Ingresa el título del curso" required />
      </div>

      <div class="form-group">
        <label for="docenteTeoria">Formador (Docente Teoría)</label>
        <select v-model="curso.docenteTeoria" id="docenteTeoria" required>
          <option value="" disabled>Selecciona un formador</option>
          <option v-for="formador in formadores" :key="formador.Pk_docenteteoria" :value="formador.Pk_docenteteoria">
            {{ formador.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="docentePractica">Instructor (Docente Práctica)</label>
        <select v-model="curso.docentePractica" id="docentePractica" required>
          <option value="" disabled>Selecciona un instructor</option>
          <option v-for="instructor in instructores" :key="instructor.Pk_docentepractico" :value="instructor.Pk_docentepractico">
            {{ instructor.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="ubicacionTeoria">Ubicación Teoría</label>
        <select v-model="curso.ubicacionTeoria" id="ubicacionTeoria" required>
          <option value="" disabled>Selecciona una ubicación</option>
          <option v-for="ubicacion in ubicaciones" :key="ubicacion.Pk_Ubicacion" :value="ubicacion.Pk_Ubicacion">
            {{ ubicacion.nombre_ubicacion }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="ubicacionPractica">Ubicación Práctica</label>
        <select v-model="curso.ubicacionPractica" id="ubicacionPractica" required>
          <option value="" disabled>Selecciona una ubicación</option>
          <option v-for="ubicacion in ubicaciones" :key="ubicacion.Pk_Ubicacion" :value="ubicacion.Pk_Ubicacion">
            {{ ubicacion.nombre_ubicacion }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="fechaInicioTeoria">Inicio Teoría</label>
        <input v-model="curso.fechaInicioTeoria" type="datetime-local" id="fechaInicioTeoria" required />
      </div>

      <div class="form-group">
        <label for="fechaFinTeoria">Fin Teoría</label>
        <input v-model="curso.fechaFinTeoria" type="datetime-local" id="fechaFinTeoria" required />
      </div>

      <div class="form-group">
        <label for="fechaInicioPractica">Inicio Práctica</label>
        <input v-model="curso.fechaInicioPractica" type="datetime-local" id="fechaInicioPractica" required />
      </div>

      <div class="form-group">
        <label for="fechaFinPractica">Fin Práctica</label>
        <input v-model="curso.fechaFinPractica" type="datetime-local" id="fechaFinPractica" required />
      </div>

      <button type="submit" class="btn">Registrar Curso</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Curso {
  titulo: string;
  docenteTeoria: string;
  docentePractica: string;
  ubicacionTeoria: string;
  ubicacionPractica: string;
  fechaInicioTeoria: string;
  fechaFinTeoria: string;
  fechaInicioPractica: string;
  fechaFinPractica: string;
  autor: string | null;
}

const curso = ref<Curso>({
  titulo: '',
  docenteTeoria: '',
  docentePractica: '',
  ubicacionTeoria: '',
  ubicacionPractica: '',
  fechaInicioTeoria: '',
  fechaFinTeoria: '',
  fechaInicioPractica: '',
  fechaFinPractica: '',
  autor: null,
});

const formadores = ref([]);
const instructores = ref([]);
const ubicaciones = ref([]);

// Cargar datos desde Supabase
const cargarDatos = async () => {
  const { data: formadoresData } = await supabase.from('Formador').select('Pk_docenteteoria,nombre');
  formadores.value = formadoresData || [];

  const { data: instructoresData } = await supabase.from('Instructor').select('Pk_docentepractico,nombre');
  instructores.value = instructoresData || [];

  const { data: ubicacionesData } = await supabase.from('Ubicaciones').select('Pk_Ubicacion,nombre_ubicacion');
  ubicaciones.value = ubicacionesData || [];
};

// Obtener el usuario autenticado
const obtenerAutor = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    console.error('Error obteniendo usuario:', error);
    alert('No se pudo obtener el usuario autenticado. Por favor, inicia sesión.');
    return null;
  }
  return user.id;
};

// Registrar el curso en la base de datos
const registrarCurso = async () => {
  curso.value.autor = await obtenerAutor();

  if (!curso.value.autor) {
    alert('No se pudo asignar un autor al curso.');
    return;
  }

  curso.value.estado = "activo";  // Asignamos un valor predeterminado para el estado

  try {
    const { error } = await supabase.from('cursos').insert([{
      titulo_curso: curso.value.titulo,
      fk_docenteteoria: curso.value.docenteTeoria,
      fk_docentepractico: curso.value.docentePractica,
      fk_ubicacion_teoria: curso.value.ubicacionTeoria,
      fk_ubicacion_practica: curso.value.ubicacionPractica,
      fecha_hora_inicio_teoria: curso.value.fechaInicioTeoria,
      fecha_hora_fin_teoria: curso.value.fechaFinTeoria,
      fecha_hora_inicio_practica: curso.value.fechaInicioPractica,
      fecha_hora_fin_practica: curso.value.fechaFinPractica,
      autor: curso.value.autor,
      ultimo_autor: curso.value.autor,  // Aquí enviamos el mismo autor.
      estado: curso.value.estado,  // Se envía el valor de estado
    }]);

    if (error) {
      console.error('Error al registrar curso:', error);
      alert('No se pudo registrar el curso: ' + error.message);
      return;
    }

    alert('Curso registrado exitosamente.');
    router.push('/admin-dashboard/ManageCourses');
  } catch (err) {
    console.error('Error inesperado:', err);
    alert('Ocurrió un error inesperado.');
  }
};



onMounted(cargarDatos);
</script>

<style scoped>
/* Estilos mejorados */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
}

button:hover {
  background-color: #0056b3;
}
</style>
