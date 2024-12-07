<template>
  <div class="evaluation-container">
    <h1>Gestionar Evaluaciones</h1>
    <div v-if="cursos.length === 0">
      <p>No tienes cursos asignados.</p>
    </div>
    <div v-else class="cards-container">
      <div v-for="curso in cursos" :key="curso.pk_curso" class="card">
        <h2>{{ curso.titulo_curso }}</h2>
        <p><strong>Docente de Teoría:</strong> {{ curso.docenteTeoria }}</p>
        <p><strong>Ubicación Teoría:</strong> {{ curso.ubicacionTeoria }}</p>
        <p><strong>Inicio de Teoría:</strong> {{ formatDate(curso.fecha_hora_inicio_teoria) }}</p>
        <p><strong>Fin de Teoría:</strong> {{ formatDate(curso.fecha_hora_fin_teoria) }}</p>
        <button class="create-evaluation-button" @click="irACrearEvaluacion(curso.pk_curso)">
          Crear Evaluación
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { useRouter } from "vue-router";

export default {
  name: "View",
  setup() {
    const cursos = ref([]);
    const router = useRouter();

    const cargarCursos = async () => {
      try {
        // Obtener la sesión del usuario autenticado
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) throw new Error("Usuario no autenticado");

        const usuarioEmail = session.user.email;

        // Obtener los cursos asignados al operador mediante la tabla asignatura
        const { data, error } = await supabase
          .from("asignatura")
          .select(`
            fk_curso,
            cursos:pk_curso(
              titulo_curso,
              fecha_hora_inicio_teoria,
              fecha_hora_fin_teoria,
              ubicacionTeoria:fk_ubicacion_teoria(nombre_ubicacion),
              docenteTeoria:fk_docenteteoria(nombre, correo)
            )
          `)
          .eq("correo_operador", usuarioEmail);

        if (error) throw error;

        // Transformar los datos para usarlos en la vista
        cursos.value = data.map((row) => ({
          pk_curso: row.fk_curso,
          titulo_curso: row.cursos?.titulo_curso || "Sin título",
          docenteTeoria: row.cursos?.docenteTeoria?.nombre || "No asignado",
          ubicacionTeoria: row.cursos?.ubicacionTeoria?.nombre_ubicacion || "No especificada",
          fecha_hora_inicio_teoria: row.cursos?.fecha_hora_inicio_teoria,
          fecha_hora_fin_teoria: row.cursos?.fecha_hora_fin_teoria,
        }));
      } catch (error) {
        console.error("Error al cargar los cursos asignados:", error.message);
      }
    };

    const irACrearEvaluacion = (cursoId) => {
      router.push({ name: "Create", params: { cursoId } });
    };

    const formatDate = (date) => (date ? new Date(date).toLocaleString() : "No especificado");

    onMounted(() => {
      cargarCursos();
    });

    return {
      cursos,
      irACrearEvaluacion,
      formatDate,
    };
  },
};
</script>
<style scoped>
.evaluation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: #000000;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 50px;
}

.card {
  position: relative;
  border-radius: 10px;
  overflow: hidden; /* Mantiene los bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Fondo con imagen y transparencia */
    background: linear-gradient(
      rgba(255, 255, 255, 0.5), /* Color blanco semitransparente */
      rgba(255, 255, 255, 0.5)
    ),
    url('@/assets/imagen-Solicitud.jpg'); /* Ruta de la imagen */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(0px); /* Difumina la imagen */
}

.card-content {
  position: relative; /* Asegura que el contenido esté encima del fondo */
  padding: 20px;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.7); /* Fondo blanco semitransparente */
  border-radius: 10px; /* Bordes redondeados */
  z-index: 1; /* Asegura que el contenido esté encima del fondo */
}

.card h2 {
  font-size: 20px;
  color: #030303;
  margin-bottom: 10px;
  padding: 5px 10px; /* Espaciado interno */
  background-color: rgba(255, 255, 255, 0.8); /* Fondo blanco semitransparente */
  display: inline-block; /* Ajusta el tamaño al contenido */
  border-radius: 5px; /* Bordes redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra del título */
}

.card p {
  font-size: 16px;
  margin: 5px 0;
  color: #0e0d0d;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
p {
  text-align: center;
  font-size: 18px;
  color: #080707;
}

/* Estilo para el botón */
.create-evaluation-button {
  background-color: #2ec933ee;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.create-button:hover {
  background-color: #45a049;
}
</style>
