<template>
    <div class="asignaciones-container">
      <h1>Asignaciones de Cursos</h1>
  
      <!-- Formulario para Asignar un Curso -->
      <form @submit.prevent="asignarCurso" class="formulario-asignacion">
        <div class="form-group">
          <label for="curso">Curso</label>
          <select v-model="nuevoCurso.fk_curso" required>
            <option v-for="curso in cursos" :key="curso.pk_curso" :value="curso.pk_curso">
              {{ curso.titulo_curso }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="Operador">Operador</label>
          <select v-model="nuevoCurso.fk_operador" required>
            <option v-for="operador in operadores" :key="operador.Pk_Alumno" :value="operador.Pk_Alumno">
              {{ operador.nombre }} {{ operador.apellidos }} - {{ operador.correo_electronico }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-primario">Asignar Curso</button>
      </form>
  
      <!-- Tabla de Asignaciones -->
      <table class="asignaciones-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Curso</th>
            <th>Operador</th>
            <th>Correo Operador</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(asignacion, index) in asignaciones" :key="asignacion.pk_asignatura">
            <td>{{ index + 1 }}</td>
            <td>{{ asignacion.titulo_curso }}</td>
            <td>{{ asignacion.nombre_operador }}</td>
            <td>{{ asignacion.correo_operador }}</td>
            <td>
              <span :class="{ activo: asignacion.estado, inactivo: !asignacion.estado }">
                {{ asignacion.estado ? "Activo" : "Inactivo" }}
              </span>
            </td>
            <td>
              <button class="btn btn-secundario" @click="toggleEstado(asignacion)">
                {{ asignacion.estado ? "Desactivar" : "Activar" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { supabase } from "@/supabase";
  
  export default {
    name: "Asignaciones",
    setup() {
      const asignaciones = ref([]);
      const cursos = ref([]);
      const operadores = ref([]);
      const nuevoCurso = ref({ fk_curso: null, fk_operador: null });
  
      const cargarDatos = async () => {
        try {
          // Obtener asignaciones
          const { data: asignacionesData, error: asignacionesError } = await supabase
            .from("asignatura")
            .select(`
              pk_asignatura,
              fk_curso,
              fk_operador,
              estado,
              cursos:fk_curso(titulo_curso),
              operadores:fk_operador(nombre, apellidos, correo_electronico)
            `);
  
          if (asignacionesError) throw asignacionesError;
  
          asignaciones.value = asignacionesData.map((asignacion) => ({
            pk_asignatura: asignacion.pk_asignatura,
            titulo_curso: asignacion.cursos?.titulo_curso || "Sin Título",
            nombre_operador: `${asignacion.operadores?.nombre || "Sin Nombre"} ${
              asignacion.operadores?.apellidos || ""
            }`,
            correo_operador: asignacion.operadores?.correo_electronico || "Sin Correo",
            estado: asignacion.estado,
          }));
  
          // Obtener cursos
          const { data: cursosData, error: cursosError } = await supabase
            .from("cursos")
            .select("pk_curso, titulo_curso");
  
          if (cursosError) throw cursosError;
          cursos.value = cursosData;
  
          // Obtener operadores
          const { data: operadoresData, error: operadoresError } = await supabase
            .from("operador")
            .select("pk_alumno, nombre, apellidos, correo_electronico");
  
          if (operadoresError) throw operadoresError;
          operadores.value = operadoresData;
        } catch (error) {
          console.error("Error al cargar datos:", error.message);
        }
      };
  
      const asignarCurso = async () => {
        try {
          const { error } = await supabase.from("asignatura").insert({
            fk_curso: nuevoCurso.value.fk_curso,
            fk_operador: nuevoCurso.value.fk_operador,
            correo_operador: operadores.value.find(
              (op) => op.pk_alumno === nuevoCurso.value.fk_operador
            )?.correo_electronico,
            estado: true,
          });
  
          if (error) throw error;
  
          nuevoCurso.value = { fk_curso: null, fk_operador: null };
          cargarDatos();
          alert("Curso asignado exitosamente.");
        } catch (error) {
          console.error("Error al asignar curso:", error.message);
        }
      };
  
      const toggleEstado = async (asignacion) => {
        try {
          const { error } = await supabase
            .from("asignatura")
            .update({ estado: !asignacion.estado })
            .eq("pk_asignatura", asignacion.pk_asignatura);
  
          if (error) throw error;
  
          cargarDatos();
        } catch (error) {
          console.error("Error al actualizar estado:", error.message);
        }
      };
  
      onMounted(() => {
        cargarDatos();
      });
  
      return {
        asignaciones,
        cursos,
        operadores,
        nuevoCurso,
        asignarCurso,
        toggleEstado,
      };
    },
  };
  </script>
  
  <style scoped>
  .asignaciones-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .formulario-asignacion {
    margin-bottom: 30px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .asignaciones-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .asignaciones-table th,
  .asignaciones-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }
  
  .asignaciones-table th {
    background-color: #f4f4f4;
  }
  
  .btn {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-primario {
    background-color: #007bff;
    color: white;
  }
  
  .btn-primario:hover {
    background-color: #0056b3;
  }
  
  .btn-secundario {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-secundario:hover {
    background-color: #5a6268;
  }
  
  .activo {
    color: green;
  }
  
  .inactivo {
    color: red;
  }
  </style>