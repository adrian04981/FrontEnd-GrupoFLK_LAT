<template>
  <div class="attendance-container">
    <h2>Gestionar Asistencia Operadores</h2>

    <!-- Filtros -->
    <div class="filter-form">
      <!-- Curso -->
      <div class="filter-item">
        <label for="fk_curso">Curso:</label>
        <select id="fk_curso" v-model="filtros.curso" @change="fetchSesiones">
          <option value="" disabled>Seleccione un curso</option>
          <option v-for="curso in cursosFiltrados" :key="curso.pk_curso" :value="curso.pk_curso">
            {{ curso.titulo_curso }}
          </option>
        </select>
      </div>

      <!-- Modo -->
      <div class="filter-item">
        <label for="modo_curso">Modo:</label>
        <select id="modo_curso" v-model="filtros.modo" @change="filtrarCursos">
          <option value="">Todos</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
        </select>
      </div>

      <!-- Fecha -->
      <div class="filter-item">
        <label for="fecha_sesion">Fecha:</label>
        <select id="fecha_sesion" v-model="selectedFecha" @change="filtrarHorasPorFecha">
          <option value="" disabled>Seleccione una fecha</option>
          <option v-for="fecha in fechasUnicas" :key="fecha" :value="fecha">
            {{ fecha }}
          </option>
        </select>
      </div>

      <!-- Hora -->
      <div class="filter-item">
        <label for="hora_sesion">Hora:</label>
        <select id="hora_sesion" v-model="selectedHora" @change="fetchOperadores">
          <option value="" disabled>Seleccione una hora</option>
          <option v-for="hora in horasFiltradas" :key="hora" :value="hora">
            {{ hora }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tabla de operadores -->
    <div v-if="operadores.length > 0" class="operadores-table">
      <table>
        <thead>
          <tr>
            <th>Operador</th>
            <th>Presente</th>
            <th>Falta</th>
            <th>Tardanza</th>
            <th>Justificado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="operador in operadores" :key="operador.id">
            <td>{{ operador.nombre_completo_operador }}</td>
            <td>
              <input type="checkbox" :checked="operador.attendance.present"
                @change="actualizarEstado(operador, 'present')" />
            </td>
            <td>
              <input type="checkbox" :checked="operador.attendance.absent"
                @change="actualizarEstado(operador, 'absent')" />
            </td>
            <td>
              <input type="checkbox" :checked="operador.attendance.late" @change="actualizarEstado(operador, 'late')" />
            </td>
            <td>
              <input type="checkbox" :checked="operador.attendance.justified"
                @change="actualizarEstado(operador, 'justified')" />
            </td>
          </tr>
        </tbody>
      </table>

      <button @click="guardarAsistencia">Guardar Asistencia</button>
    </div>
    <div v-else>
      <p>Seleccione un curso, modo, fecha y hora para ver los operadores inscritos.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { supabase } from "@/supabase";

export default {
  name: "GestionarAsistencia",
  setup() {
    const cursos = ref([]); // Almacena los cursos
    const filtros = ref({ curso: "", modo: "" }); // Almacena los filtros seleccionados
    const sesiones = ref([]); // Almacena las sesiones programadas
    const selectedFecha = ref(""); // Fecha seleccionada
    const selectedHora = ref(""); // Hora seleccionada
    const fechasUnicas = ref([]); // Fechas únicas disponibles para el curso seleccionado
    const horasFiltradas = ref([]); // Horas disponibles para la fecha seleccionada
    const operadores = ref([]); // Operadores cargados para la sesión seleccionada

    // Función para cargar los cursos desde la base de datos
    const fetchCursos = async () => {
      try {
        const { data, error } = await supabase
          .from("cursos")
          .select("pk_curso, titulo_curso, fk_modo_curso, Modo_Curso(nombre_modo)");
        if (error) throw error;
        cursos.value = data; // Asegúrate de actualizar la lista de cursos
      } catch (error) {
        console.error("Error al cargar cursos:", error.message);
      }
    };

    // Computed property para filtrar cursos por modo
    const cursosFiltrados = computed(() => {
      if (!filtros.value.modo) return cursos.value; // Si no hay filtro, retorna todos los cursos
      return cursos.value.filter(
        (curso) => curso.Modo_Curso.nombre_modo === filtros.value.modo
      );
    });


    // Obtener las sesiones programadas para el curso seleccionado
    const fetchSesiones = async () => {
      try {
        const { data, error } = await supabase
          .from("sesiones_programadas")
          .select("pk_sesion, fecha_session, hora_inicio")
          .eq("fk_curso", filtros.value.curso);
        if (error) throw error;

        sesiones.value = data;
        fechasUnicas.value = [...new Set(data.map((sesion) => sesion.fecha_session))];
      } catch (error) {
        console.error("Error al cargar sesiones:", error.message);
      }
    };

    // Filtrar horas disponibles según la fecha seleccionada
    const filtrarHorasPorFecha = () => {
      horasFiltradas.value = sesiones.value
        .filter((sesion) => sesion.fecha_session === selectedFecha.value)
        .map((sesion) => sesion.hora_inicio);
    };

    // Obtener operadores para la fecha y hora seleccionadas
    const fetchOperadores = async () => {
      if (!selectedHora.value || !selectedFecha.value) return;

      try {
        const { data, error } = await supabase
          .from("matriculas")
          .select("id, fk_operador, operador:fk_operador (nombre, apellidos)")
          .eq(
            "fk_sesion",
            sesiones.value.find(
              (sesion) =>
                sesion.fecha_session === selectedFecha.value &&
                sesion.hora_inicio === selectedHora.value
            ).pk_sesion
          );
        if (error) throw error;

        operadores.value = data.map((matricula) => ({
          id: matricula.id,
          nombre_completo_operador: `${matricula.operador.nombre} ${matricula.operador.apellidos}`,
          attendance: {
            present: false,
            absent: false,
            late: false,
            justified: false,
          },
        }));
      } catch (error) {
        console.error("Error al cargar operadores:", error.message);
      }
    };

    const guardarAsistencia = async () => {
      if (!selectedHora.value || !selectedFecha.value) {
        alert("Debe seleccionar fecha y hora.");
        return;
      }

      try {
        // Obtener la sesión seleccionada
        const sesionSeleccionada = sesiones.value.find(
          (sesion) =>
            sesion.fecha_session === selectedFecha.value &&
            sesion.hora_inicio === selectedHora.value
        );

        if (!sesionSeleccionada) {
          alert("No se encontró la sesión correspondiente.");
          return;
        }

        // Recorrer cada operador y actualizar/inserción según corresponda
        for (const operador of operadores.value) {
          const estadoAsistencia = Object.keys(operador.attendance).find(
            (key) => operador.attendance[key]
          ) || "sin_marcar";

          // Verificar si ya existe un registro de asistencia para este operador en la sesión seleccionada
          const { data: asistenciaExistente, error: fetchError } = await supabase
            .from("asistencias")
            .select("*")
            .eq("fk_sesion", sesionSeleccionada.pk_sesion)
            .eq("fk_operador", operador.id)
            .single();

          if (fetchError && fetchError.code !== "PGRST116") {
            // Manejo de errores diferentes a registro no encontrado
            console.error("Error al verificar asistencia existente:", fetchError.message);
            continue;
          }

          if (asistenciaExistente) {
            // Si la asistencia existe, actualizamos el estado
            const { error: updateError } = await supabase
              .from("asistencias")
              .update({ estado_asistencia: estadoAsistencia })
              .eq("id", asistenciaExistente.id);

            if (updateError) {
              console.error("Error al actualizar asistencia:", updateError.message);
            }
          } else {
            // Si no existe, creamos un nuevo registro
            const { error: insertError } = await supabase.from("asistencias").insert({
              fk_sesion: sesionSeleccionada.pk_sesion,
              fk_operador: operador.id,
              fk_curso: filtros.value.curso,
              fecha: new Date(),
              estado_asistencia: estadoAsistencia,
            });

            if (insertError) {
              console.error("Error al insertar asistencia:", insertError.message);
            }
          }
        }

        alert("Asistencia guardada exitosamente.");
      } catch (error) {
        console.error("Error al guardar asistencia:", error.message);
        alert("Error al guardar la asistencia.");
      }
    };

    const actualizarEstado = (operador, estadoSeleccionado) => {
      const estados = ["present", "absent", "late", "justified"];
      estados.forEach((estado) => {
        operador.attendance[estado] = estado === estadoSeleccionado;
      });
    };
    
    // Cargar los cursos al iniciar
    fetchCursos();

    return {
      cursos,
      filtros,
      cursosFiltrados,
      sesiones,
      selectedFecha,
      selectedHora,
      fechasUnicas,
      horasFiltradas,
      operadores,
      fetchSesiones,
      filtrarHorasPorFecha,
      fetchOperadores,
      guardarAsistencia,
      actualizarEstado
    };
  },
};
</script>

<style scoped>
.attendance-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  color: #0c0c0c;
  margin-bottom: 30px;
  font-size: 23px;
}

/* Contenedor de los filtros */
.filter-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

/* Estilo para cada filtro */
.filter-item {
  display: flex;
  flex-direction: column;
  align-items: start;
  flex: 1;
  max-width: 200px;
}

.filter-item label {
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
  font-size: 14px;
  color: #333;
}

.filter-item select {
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #f08a8a;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead th {
  background-color: #2f80d6;
  color: white;
  padding: 10px;
}

tbody td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #218838;
}
</style>
