<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase.js";

// Variables reactivas
const capacitaciones = ref([]);
const cursos = ref([]);
const operadores = ref([]);
const mostrarVerModal = ref(false);
const mostrarActualizarModal = ref(false);
const cursoSeleccionado = ref<any>(null);
const errorMessage = ref("");

// Función para obtener capacitaciones
const fetchCapacitaciones = async () => {
  try {
    const { data, error } = await supabase
      .from("capacitacion_cursos")
      .select(`
        *,
        curso:cursos(titulo_curso),
        operador:Operador(nombre)
      `);
    if (error) throw error;
    capacitaciones.value = data || [];
  } catch (error) {
    errorMessage.value = "Error al cargar las capacitaciones.";
    console.error(error);
  }
};

// Funciones para obtener datos auxiliares
const fetchCursos = async () => {
  try {
    const { data, error } = await supabase.from("cursos").select("*");
    if (error) throw error;
    cursos.value = data || [];
  } catch (error) {
    console.error(error);
  }
};

const fetchOperadores = async () => {
  try {
    const { data, error } = await supabase.from("Operador").select("*");
    if (error) throw error;
    operadores.value = data || [];
  } catch (error) {
    console.error(error);
  }
};

// Formatear fechas
const formatFecha = (fecha) => {
  return fecha
    ? new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";
};

// Modal Ver detalles
const abrirVerModal = (curso) => {
  cursoSeleccionado.value = { ...curso };
  mostrarVerModal.value = true;
};

const cerrarVerModal = () => {
  mostrarVerModal.value = false;
  cursoSeleccionado.value = null;
};

// Modal Editar
const abrirActualizarModal = (curso) => {
  cursoSeleccionado.value = { ...curso };
  mostrarActualizarModal.value = true;
};

const cerrarActualizarModal = () => {
  mostrarActualizarModal.value = false;
  cursoSeleccionado.value = null;
  errorMessage.value = "";
};

// Actualizar capacitación
const actualizarCapacitacion = async () => {
  try {
    const { error } = await supabase
      .from("capacitacion_cursos")
      .update({
        fk_curso: cursoSeleccionado.value.fk_curso,
        fk_operador: cursoSeleccionado.value.fk_operador,
        titulo: cursoSeleccionado.value.titulo,
        fecha_inicio: cursoSeleccionado.value.fecha_inicio,
        fecha_fin: cursoSeleccionado.value.fecha_fin,
        estado: cursoSeleccionado.value.estado === "true",
      })
      .eq("pk_capacitacion", cursoSeleccionado.value.pk_capacitacion);

    if (error) throw error;

    alert("Capacitación actualizada con éxito.");
    cerrarActualizarModal();
    await fetchCapacitaciones();
  } catch (error) {
    errorMessage.value = "Error al actualizar la capacitación: " + error.message;
    console.error(error);
  }
};

// Llamar funciones al montar
onMounted(async () => {
  await Promise.all([fetchCapacitaciones(), fetchCursos(), fetchOperadores()]);
});
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1>
        <i class="fas fa-graduation-cap mr-2"></i> Gestión de Capacitaciones
      </h1>
     
    </header>

    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <div v-if="capacitaciones.length === 0" class="empty-state">
      <i class="fas fa-box-open"></i>
      <p>No hay capacitaciones registradas.</p>
    </div>

    <div v-else class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Operador</th>
            <th>Título</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="curso in capacitaciones" :key="curso.pk_capacitacion">
            <td>{{ curso.curso?.titulo_curso || "N/A" }}</td>
            <td>{{ curso.operador?.nombre || "N/A" }}</td>
            <td>{{ curso.titulo }}</td>
            <td>{{ formatFecha(curso.fecha_inicio) }}</td>
            <td>{{ formatFecha(curso.fecha_fin) }}</td>
            <td>
              <span :class="['badge', curso.estado ? 'badge-success' : 'badge-danger']">
                {{ curso.estado ? "Activo" : "Inactivo" }}
              </span>
            </td>
            <td>
              <button class="btn btn-info" @click="abrirVerModal(curso)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-warning" @click="abrirActualizarModal(curso)">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Ver -->
    <div v-if="mostrarVerModal" class="modal" @click.self="cerrarVerModal">
      <div class="modal-content">
        <h2>Detalles de Capacitación</h2>
        <p><strong>Curso:</strong> {{ cursoSeleccionado.curso?.titulo_curso || "N/A" }}</p>
        <p><strong>Operador:</strong> {{ cursoSeleccionado.operador?.nombre || "N/A" }}</p>
        <p><strong>Título:</strong> {{ cursoSeleccionado.titulo }}</p>
        <p><strong>Fecha Inicio:</strong> {{ formatFecha(cursoSeleccionado.fecha_inicio) }}</p>
        <p><strong>Fecha Fin:</strong> {{ formatFecha(cursoSeleccionado.fecha_fin) }}</p>
        <p><strong>Estado:</strong> {{ cursoSeleccionado.estado ? "Activo" : "Inactivo" }}</p>
        <button class="btn btn-secondary" @click="cerrarVerModal">Cerrar</button>
      </div>
    </div>

    <!-- Modal Actualizar -->
    <div v-if="mostrarActualizarModal" class="modal" @click.self="cerrarActualizarModal">
      <div class="modal-content">
        <h2>Actualizar Capacitación</h2>
        <form @submit.prevent="actualizarCapacitacion">
          <label for="curso">Curso</label>
          <select v-model="cursoSeleccionado.fk_curso" id="curso">
            <option v-for="curso in cursos" :key="curso.pk_curso" :value="curso.pk_curso">
              {{ curso.titulo_curso }}
            </option>
          </select>

          <label for="operador">Operador</label>
          <select v-model="cursoSeleccionado.fk_operador" id="operador">
            <option v-for="operador in operadores" :key="operador.pk_operador" :value="operador.pk_operador">
              {{ operador.nombre }}
            </option>
          </select>

          <label for="titulo">Título</label>
          <input type="text" v-model="cursoSeleccionado.titulo" id="titulo" />

          <label for="fecha_inicio">Fecha Inicio</label>
          <input type="date" v-model="cursoSeleccionado.fecha_inicio" id="fecha_inicio" />

          <label for="fecha_fin">Fecha Fin</label>
          <input type="date" v-model="cursoSeleccionado.fecha_fin" id="fecha_fin" />

          <label>Estado</label>
          <div>
            <label>
              <input type="radio" value="true" v-model="cursoSeleccionado.estado" /> Activo
            </label>
            <label>
              <input type="radio" value="false" v-model="cursoSeleccionado.estado" /> Inactivo
            </label>
          </div>

          <button class="btn btn-primary" type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo mejorado */
.dashboard {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.table-container {
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-info {
  background: #17a2b8;
  color: #fff;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.badge {
  padding: 0.5rem;
  border-radius: 4px;
}

.badge-success {
  background: #28a745;
  color: #fff;
}

.badge-danger {
  background: #dc3545;
  color: #fff;
}
</style>
