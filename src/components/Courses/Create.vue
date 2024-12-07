<template>
  <div>
    <h2>Crear Curso</h2>
    <form @submit.prevent="createCourse">
      <div>
        <label for="titulo_curso">Título del Curso:</label>
        <input v-model="titulo_curso" type="text" id="titulo_curso" required />
      </div>

      <div>
        <label for="docente_teoria">Docente Teoría:</label>
        <!-- Desplegable para seleccionar el docente de teoría -->
        <select v-model="fk_docenteteoria" id="docente_teoria" required>
          <option v-for="docente in docentesTeoria" :key="docente.id" :value="docente.id">
            {{ docente.nombre }}
          </option>
        </select>
      </div>

      <div>
        <label for="docente_practica">Docente Práctica:</label>
        <!-- Desplegable para seleccionar el docente de práctica -->
        <select v-model="fk_docentepractico" id="docente_practica" required>
          <option v-for="docente in docentesPractica" :key="docente.id" :value="docente.id">
            {{ docente.nombre }}
          </option>
        </select>
      </div>

      <div>
        <label for="ubicacion_teoria">Ubicación Teoría:</label>
        <input v-model="fk_ubicacion_teoria" type="number" id="ubicacion_teoria" required />
      </div>

      <div>
        <label for="ubicacion_practica">Ubicación Práctica:</label>
        <input v-model="fk_ubicacion_practica" type="number" id="ubicacion_practica" required />
      </div>

      <div>
        <label for="inicio_teoria">Fecha y Hora Inicio Teoría:</label>
        <input v-model="fecha_hora_inicio_teoria" type="datetime-local" id="inicio_teoria" required />
      </div>

      <div>
        <label for="fin_teoria">Fecha y Hora Fin Teoría:</label>
        <input v-model="fecha_hora_fin_teoria" type="datetime-local" id="fin_teoria" required />
      </div>

      <div>
        <label for="inicio_practica">Fecha y Hora Inicio Práctica:</label>
        <input v-model="fecha_hora_inicio_practica" type="datetime-local" id="inicio_practica" required />
      </div>

      <div>
        <label for="fin_practica">Fecha y Hora Fin Práctica:</label>
        <input v-model="fecha_hora_fin_practica" type="datetime-local" id="fin_practica" required />
      </div>

      <button type="submit">Crear Curso</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';  // Asegúrate de ajustar esta ruta

// Definir variables para los campos del formulario
const titulo_curso = ref('');
const fk_docenteteoria = ref(null);
const fk_docentepractico = ref(null);
const fk_ubicacion_teoria = ref(null);
const fk_ubicacion_practica = ref(null);
const fecha_hora_inicio_teoria = ref(null);
const fecha_hora_fin_teoria = ref(null);
const fecha_hora_inicio_practica = ref(null);
const fecha_hora_fin_practica = ref(null);

// Listas para los docentes disponibles
const docentesTeoria = ref([]);
const docentesPractica = ref([]);

// Obtener la lista de docentes de teoría y práctica desde la base de datos
const fetchDocentes = async () => {
  const { data: teoria, error: errorTeoria } = await supabase
    .from('Docentes')
    .select('id, nombre')
    .eq('tipo', 'teoria'); // Ajusta el filtro según tu estructura
  const { data: practica, error: errorPractica } = await supabase
    .from('Docentes')
    .select('id, nombre')
    .eq('tipo', 'practica'); // Ajusta el filtro según tu estructura
  
  if (!errorTeoria) docentesTeoria.value = teoria;
  if (!errorPractica) docentesPractica.value = practica;
};

// Llamar a la función para obtener los docentes cuando el componente se monte
onMounted(() => {
  fetchDocentes();
});

// Método para crear un curso
const createCourse = async () => {
  const { error } = await supabase
    .from('Cursos')
    .insert({
      titulo_curso: titulo_curso.value,
      fk_docenteteoria: fk_docenteteoria.value,
      fk_docentepractico: fk_docentepractico.value,
      fk_ubicacion_teoria: fk_ubicacion_teoria.value,
      fk_ubicacion_practica: fk_ubicacion_practica.value,
      fecha_hora_inicio_teoria: fecha_hora_inicio_teoria.value,
      fecha_hora_fin_teoria: fecha_hora_fin_teoria.value,
      fecha_hora_inicio_practica: fecha_hora_inicio_practica.value,
      fecha_hora_fin_practica: fecha_hora_fin_practica.value,
      autor: 'your-uuid-here',  // Sustituye por el UUID del autor
      ultimo_autor: 'your-uuid-here'  // Sustituye por el UUID del autor
    });

  if (error) {
    console.error('Error al crear el curso:', error.message);
  } else {
    alert('Curso creado con éxito');
  }
};
</script>

<style scoped>
form {
  max-width: 600px;
  margin: auto;
}

div {
  margin-bottom: 15px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
