<template>
  <div class="attendance-container">
    <h2>Gestionar Asistencia</h2>
    <div class="form-group">
      <label for="fk_curso">Curso</label>
      <select id="fk_curso" v-model="selectedCurso" @change="fetchOperadores" required>
        <option value="" disabled>Seleccione un curso</option>
        <option v-for="curso in cursos" :key="curso.pk_curso" :value="curso.pk_curso">
          {{ curso.titulo_curso }}
        </option>
      </select>
    </div>

    <div v-if="operadores.length > 0" class="operadores-table">
      <h3>Asistencia de Operadores</h3>
      <table>
        <thead>
          <tr>
            <th>Operador</th>
            <th class="status-header">P</th>
            <th class="status-header">F</th>
            <th class="status-header">T</th>
            <th class="status-header">J</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="operador in operadores" :key="operador.id">
            <td>{{ operador.nombre_completo_operador }}</td>
            <td>
              <button
                :class="['status-button', operador.estado_asistencia === 'Presente' ? 'selected' : '', 'Presente']"
                @click="marcarAsistencia(operador.id, 'Presente')"
              >
                P
              </button>
            </td>
            <td>
              <button
                :class="['status-button', operador.estado_asistencia === 'Falta' ? 'selected' : '', 'Falta']"
                @click="marcarAsistencia(operador.id, 'Falta')"
              >
                F
              </button>
            </td>
            <td>
              <button
                :class="['status-button', operador.estado_asistencia === 'Tardanza' ? 'selected' : '', 'Tardanza']"
                @click="marcarAsistencia(operador.id, 'Tardanza')"
              >
                T
              </button>
            </td>
            <td>
              <button
                :class="['status-button', operador.estado_asistencia === 'Justificado' ? 'selected' : '', 'Justificado']"
                @click="marcarAsistencia(operador.id, 'Justificado')"
              >
                J
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="save-button" @click="guardarAsistencia">Guardar Asistencia</button>
    </div>
    <div v-else>
      <p>Seleccione un curso para ver los operadores inscritos.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";


export default {
  name: "AttendanceManagement",
  setup() {
    const cursos = ref([]);
    const operadores = ref([]);
    const selectedCurso = ref("");

    // Cargar cursos disponibles
    const fetchCursos = async () => {
      try {
        const { data, error } = await supabase.from("cursos").select("pk_curso, titulo_curso");
        if (error) throw error;
        cursos.value = data;
      } catch (error) {
        console.error("Error al cargar cursos:", error.message);
      }
    };

    // Obtener operadores inscritos en el curso seleccionado
    const fetchOperadores = async () => {
      if (!selectedCurso.value) return;

      try {
        const { data, error } = await supabase
          .from("matriculas")
          .select(
            `
            id,
            fk_curso,
            fk_operador,
            operador:fk_operador (
              nombre,
              apellidos
            )
          `
          )
          .eq("fk_curso", selectedCurso.value);

        if (error) throw error;

        // Mapear los datos para incluir el nombre completo
        operadores.value = data.map((matricula) => ({
          id: matricula.id,
          nombre_completo_operador: `${matricula.operador.nombre} ${matricula.operador.apellidos}`,
          estado_asistencia: "Sin Registrar",
        }));
      } catch (error) {
        console.error("Error al obtener operadores:", error.message);
      }
    };

    // Marcar asistencia
    const marcarAsistencia = (id, estado) => {
      const operador = operadores.value.find((op) => op.id === id);
      if (operador) operador.estado_asistencia = estado;
    };

    // Guardar asistencia en la base de datos
    const guardarAsistencia = async () => {
      try {
        const updates = operadores.value.map((operador) => ({
          id: operador.id,
          estado_asistencia: operador.estado_asistencia,
        }));

        const { error } = await supabase.from("asistencias").upsert(updates, {
          onConflict: "id_matricula", // Reemplaza según el esquema de tu tabla
        });

        if (error) throw error;
        alert("Asistencia guardada con éxito.");
      } catch (error) {
        console.error("Error al guardar asistencia:", error.message);
        alert("Ocurrió un error al guardar la asistencia.");
      }
    };

    // Cargar cursos al montar el componente
    onMounted(fetchCursos);

    return {
      cursos,
      operadores,
      selectedCurso,
      fetchOperadores,
      marcarAsistencia,
      guardarAsistencia,
    };
  },
};
</script>


<style scoped>
.header-container {
  display: flex;
  justify-content: space-between; /* Distribuye el título y el botón */
  align-items: center; /* Centra verticalmente los elementos */
  margin-bottom: 20px; /* Espacio inferior */
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #121213; /* Azul oscuro */
}
h3 {
  text-align: center;
  margin-bottom: 12px;
  color: #121213; /* Azul oscuro */
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.operadores-table {
  margin-top: 20px;
}

table {
  width: 70%;
  border-collapse: collapse;
  text-align: center;
  background-color: #e3f2fd; /* Celeste claro */
  border-radius: 09px;
  overflow: hidden;
}

th, td {
  border: 1px solid #eae4e4;
  padding: 10px;
}

th {
  background-color: #679fcd; /* Azul claro */
  color: rgb(242, 237, 237);
  font-weight: bold;
}

td {
  background-color: #f5f5f5; /* Fondo más claro */
}

.status-header {
  width: 50px;
}

table {
  margin: 0 auto; /* Centramos horizontalmente */
  width: 70%;
  border-collapse: collapse;
  text-align: center;
  background-color: #e3f2fd; /* Celeste claro */
  border-radius: 10px;
  overflow: hidden;
}

.status-button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  color: rgb(250, 246, 246);
  transition: transform 0.2s;
}

.status-button:hover {
  transform: scale(1.1);
}

.status-button.selected {
  border: 1px solid #313030;
}

.status-button.Presente {
  background-color: #6bdd6f; /* Verde */
}

.status-button.Falta {
  background-color: #efc5c1; /* Rojo */
}

.status-button.Tardanza {
  background-color: #ffc107; /* Amarillo */
 
}

.status-button.Justificado {
  background-color: #2196f3; /* Azul */
}
.save-button-container {
  display: flex;
  justify-content: flex-end; /* Mueve el botón hacia la derecha */
  margin-top: 20px; /* Añade espacio entre la tabla y el botón */
  margin-bottom: 50px; /* Más espacio debajo del botón */
}

.save-button {
  background-color: #4dac50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}

.save-button:hover {
  background-color: #45a049;
}
</style>
