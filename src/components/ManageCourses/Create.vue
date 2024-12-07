<template>
  <div class="form-container">
    <h3>Crear Curso</h3>
    <form @submit.prevent="createCourse">
      <!-- Título del curso -->
      <div class="form-group">
        <label for="titulo_curso">Título del Curso:</label>
        <input v-model="titulo_curso" type="text" id="titulo_curso" required />
      </div>

      <!-- Docente Teoría -->
      <div class="form-group">
        <label for="docente_teoria">Docente Teoría:</label>
        <select v-model="Fk_docenteteoria" id="docente_teoria" required>
          <option v-for="docente in docentesTeoria" :key="docente.Pk_docenteteoria" :value="docente.Pk_docenteteoria">
            {{ docente.nombre }}
          </option>
        </select>
      </div>

      <!-- Docente Práctica -->
      <div class="form-group">
        <label for="docente_practica">Docente Práctica:</label>
        <select v-model="Fk_docentepractico" id="docente_practica" required>
          <option v-for="docente in docentesPractica" :key="docente.Pk_docentepractico" :value="docente.Pk_docentepractico">
            {{ docente.nombre }}
          </option>
        </select>
      </div>

      <!-- Ubicación Teoría -->
      <div class="form-group">
        <label for="ubicacion_teoria">Ubicación Teoría:</label>
        <select v-model="Fk_ubicacion_teoria" id="ubicacion_teoria" required>
          <option v-for="ubicacion in ubicacionesTeoria" :key="ubicacion.Pk_Ubicacion" :value="ubicacion.Pk_Ubicacion">
            {{ ubicacion.nombre_ubicacion }}
          </option>
        </select>
      </div>

      <!-- Ubicación Práctica -->
      <div class="form-group">
        <label for="ubicacion_practica">Ubicación Práctica:</label>
        <select v-model="Fk_ubicacion_practica" id="ubicacion_practica" required>
          <option v-for="ubicacion in ubicacionesPractica" :key="ubicacion.Pk_Ubicacion" :value="ubicacion.Pk_Ubicacion">
            {{ ubicacion.nombre_ubicacion }}
          </option>
        </select>
      </div>

      <!-- Fecha y Hora Inicio Teoría -->
      <div class="form-group">
        <label for="fecha_hora_inicio_teoria">Fecha y Hora Inicio Teoría:</label>
        <input v-model="fecha_hora_inicio_teoria" type="datetime-local" id="fecha_hora_inicio_teoria" required />
      </div>

      <!-- Fecha y Hora Fin Teoría -->
      <div class="form-group">
        <label for="fecha_hora_fin_teoria">Fecha y Hora Fin Teoría:</label>
        <input v-model="fecha_hora_fin_teoria" type="datetime-local" id="fecha_hora_fin_teoria" required />
      </div>

      <!-- Fecha y Hora Inicio Práctica -->
      <div class="form-group">
        <label for="fecha_hora_inicio_practica">Fecha y Hora Inicio Práctica:</label>
        <input v-model="fecha_hora_inicio_practica" type="datetime-local" id="fecha_hora_inicio_practica" required />
      </div>

      <!-- Fecha y Hora Fin Práctica -->
      <div class="form-group">
        <label for="fecha_hora_fin_practica">Fecha y Hora Fin Práctica:</label>
        <input v-model="fecha_hora_fin_practica" type="datetime-local" id="fecha_hora_fin_practica" required />
      </div>

      <!-- Botón para crear curso -->
      <button type="submit" class="btn-create">Crear Curso</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase.js';

export default {
  setup() {
    const router = useRouter();
    const titulo_curso = ref('');
    const Fk_docenteteoria = ref(null);
    const Fk_docentepractico = ref(null);
    const Fk_ubicacion_teoria = ref('');
    const Fk_ubicacion_practica = ref('');
    const fecha_hora_inicio_teoria = ref(null);
    const fecha_hora_fin_teoria = ref(null);
    const fecha_hora_inicio_practica = ref(null);
    const fecha_hora_fin_practica = ref(null);

    const docentesTeoria = ref([]);
    const docentesPractica = ref([]);
    const ubicacionesTeoria = ref([]);
    const ubicacionesPractica = ref([]);

    const fetchDocentesTeoria = async () => {
      let { data: docentes, error } = await supabase
        .from('Formador')
        .select('Pk_docenteteoria, nombre');
      if (!error) {
        docentesTeoria.value = docentes;
      }
    };

    const fetchDocentesPractica = async () => {
      let { data: docentes, error } = await supabase
        .from('Instructor') // Tabla actualizada
        .select('Pk_docentepractico, nombre');
      if (!error) {
        docentesPractica.value = docentes;
      }
    };

    const fetchUbicaciones = async () => {
      let { data: ubicaciones, error } = await supabase.from('Ubicaciones').select('*');
      if (!error) {
        ubicacionesTeoria.value = ubicaciones.filter(u => u.Fk_modo_curso === 1);
        ubicacionesPractica.value = ubicaciones.filter(u => u.Fk_modo_curso === 2);
      }
    };

    onMounted(() => {
      fetchDocentesTeoria();
      fetchDocentesPractica();
      fetchUbicaciones();
    });

    const createCourse = async () => {
      try {
        const autorUUID = "e6dc41d2-228b-409f-95e1-1ee113235f1c"; // UUID válido
        const ultimoAutorUUID = "e6dc41d2-228b-409f-95e1-1ee113235f1c"; // UUID válido

        const { error } = await supabase.from('cursos').insert({
          titulo_curso: titulo_curso.value,
          fk_docenteteoria: Fk_docenteteoria.value,
          fk_docentepractico: Fk_docentepractico.value,
          fk_ubicacion_teoria: Fk_ubicacion_teoria.value,
          fk_ubicacion_practica: Fk_ubicacion_practica.value,
          fecha_hora_inicio_teoria: fecha_hora_inicio_teoria.value,
          fecha_hora_fin_teoria: fecha_hora_fin_teoria.value,
          fecha_hora_inicio_practica: fecha_hora_inicio_practica.value,
          fecha_hora_fin_practica: fecha_hora_fin_practica.value,
          autor: autorUUID,
          ultimo_autor: ultimoAutorUUID,
          estado: "Activo",
        });

        if (error) {
          console.error('Error al crear el curso:', error.message);
          alert('Error al crear el curso: ' + error.message);
        } else {
          alert('Curso creado con éxito');
          router.push({ path: '/admin-dashboard/ManageCourses' });
        }
      } catch (err) {
        console.error('Error inesperado:', err.message);
        alert('Error inesperado: ' + err.message);
      }
    };

    return {
      titulo_curso,
      Fk_docenteteoria,
      Fk_docentepractico,
      Fk_ubicacion_teoria,
      Fk_ubicacion_practica,
      fecha_hora_inicio_teoria,
      fecha_hora_fin_teoria,
      fecha_hora_inicio_practica,
      fecha_hora_fin_practica,
      docentesTeoria,
      docentesPractica,
      ubicacionesTeoria,
      ubicacionesPractica,
      createCourse,
    };
  },
};
</script>


<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

input:focus,
select:focus {
  border-color: #3498db;
  outline: none;
}

.btn-create {
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  width: 100%;
}

.btn-create:hover {
  background-color: #2980b9;
}
</style>
