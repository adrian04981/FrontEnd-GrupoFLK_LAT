<template>
  <div class="session-form-container">
    <h2>Programar Nueva Sesión</h2>
    <form @submit.prevent="programarSesion">
      <div class="form-group">
        <label for="fk_curso">Curso</label>
        <select id="fk_curso" v-model="nuevaSesion.fk_curso" required>
          <option value="" disabled>Seleccione un curso</option>
          <option v-for="curso in cursos" :key="curso.pk_curso" :value="curso.pk_curso">
            {{ curso.titulo_curso }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="fk_modo_curso">Modo del Curso</label>
        <select id="fk_modo_curso" v-model="nuevaSesion.fk_modo_curso" required>
          <option value="" disabled>Seleccione un modo</option>
          <option v-for="modo in modos" :key="modo.Pk_modocurso" :value="modo.Pk_modocurso">
            {{ modo.nombre_modo }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="direccion_session_virtual">Dirección Sesión Virtual</label>
        <input id="direccion_session_virtual" type="url" v-model="nuevaSesion.direccion_session_virtual"
          placeholder="https://enlace-sesion.com" />
      </div>

      <div class="form-group">
        <label for="fecha_session">Fecha de la Sesión</label>
        <input id="fecha_session" type="date" v-model="nuevaSesion.fecha_session" required />
      </div>

      <div class="form-group">
        <label for="hora_inicio">Hora de Inicio</label>
        <input id="hora_inicio" type="time" v-model="nuevaSesion.hora_inicio" required />
      </div>

      <div class="form-group">
        <label for="hora_fin">Hora de Fin</label>
        <input id="hora_fin" type="time" v-model="nuevaSesion.hora_fin" required />
      </div>

      <button type="submit" class="submit-button">Guardar Sesión</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

export default {
  name: "ProgrammerSession",
  setup() {
    const cursos = ref([]);
    const modos = ref([]);
    const nuevaSesion = ref({
      fk_curso: "",
      fk_modo_curso: "",
      direccion_session_virtual: "",
      fecha_session: "",
      hora_inicio: "",
      hora_fin: "",
    });

    // Función para obtener cursos
    const fetchCursos = async () => {
      try {
        const { data, error } = await supabase
          .from("cursos")
          .select("pk_curso, titulo_curso");

        if (error) throw error;
        cursos.value = data || [];
      } catch (error) {
        console.error("Error al cargar los cursos:", error.message);
      }
    };

    // Función para obtener modos
    const fetchModos = async () => {
      try {
        const { data, error } = await supabase
          .from("Modo_Curso")
          .select("Pk_modocurso, nombre_modo");

        if (error) throw error;
        modos.value = data || [];
      } catch (error) {
        console.error("Error al cargar los modos:", error.message);
      }
    };

    const fetchSesionConDocente = async () => {
  try {
    const { data, error } = await supabase
      .from("sesiones_programadas")
      .select(`
        *,
        curso:fk_curso (
          titulo_curso,
          docente_teoria:fk_docenteteoria (
            nombre,
            correo
          )
        )
      `);

    if (error) throw error;

    console.log(data);
  } catch (error) {
    console.error("Error al obtener la sesión:", error.message);
  }
};


    const programarSesion = async () => {
      try {
        const { data, error } = await supabase
          .from("sesiones_programadas")
          .insert([
            {
              fk_curso: nuevaSesion.value.fk_curso,
              fk_modo_curso: nuevaSesion.value.fk_modo_curso,
              direccion_session_virtual: nuevaSesion.value.direccion_session_virtual,
              fecha_session: nuevaSesion.value.fecha_session,
              hora_inicio: nuevaSesion.value.hora_inicio,
              hora_fin: nuevaSesion.value.hora_fin,
            },
          ]);

        if (error) throw error;

        alert("Sesión programada correctamente.");
      } catch (error) {
        console.error("Error al programar la sesión:", error.message);
      }
    };


    onMounted(() => {
      fetchCursos();
      fetchModos();
      fetchSesionConDocente();
    });

    return {
      cursos,
      modos,
      nuevaSesion,
      programarSesion,
    };
  },
};
</script>


<style scoped>
.session-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ddeaeb;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.submit-button {
  background-color: #4dac50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
