<template>
  <div class="container">
    <h1 class="page-title">Gestión de Solicitudes de Capacitación</h1>

    <!-- Controles superiores -->
    <div class="controls-container">
      <div class="pagination-controls">
        <label for="registrosPorPagina">Mostrar</label>
        <select v-model="registrosPorPagina" id="registrosPorPagina" class="custom-select">
          <option v-for="num in [5, 10, 20]" :key="num" :value="num">{{ num }}</option>
        </select>
        <span>registros</span>
      </div>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar por nombre del curso"
          class="custom-input"
        />
      </div>
    </div>

    <!-- Tabla -->
    <table class="styled-table">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombre del Solicitante</th>
          <th>Nombre del Curso</th>
          <th>Fecha de Solicitud</th>
          <th>Estado</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solicitud in solicitudesPaginadas" :key="solicitud.id_solicitud">
          <td>{{ solicitud.dni }}</td>
          <td>{{ solicitud.nombre_completo }}</td>
          <td>{{ getNombreCurso(solicitud.fk_curso) }}</td>
          <td>{{ formatFecha(solicitud.fecha_solicitud) }}</td>
          <td>{{ solicitud.estado || "Sin asignar" }}</td>
          <td>
            <button @click="viewSolicitud(solicitud)" class="btn btn-primary">Ver</button>
            <button @click="gestionarSolicitud(solicitud, 'aceptado')" class="btn btn-success">Aceptar</button>
            <button @click="abrirModalRechazo(solicitud)" class="btn btn-danger">Rechazar</button>
          </td>
        </tr>
      </tbody>
    </table>


    <!-- Controles de paginación -->
    <div class="pagination-container">
      <span
        >Mostrando
        {{ paginaActual * registrosPorPagina - registrosPorPagina + 1 }} a
        {{ Math.min(paginaActual * registrosPorPagina, solicitudes.length) }} de
        {{ solicitudes.length }} registros</span
      >
      <button @click="paginaActual = 1" :disabled="paginaActual === 1" class="btn btn-light">
        <i class="fas fa-angle-double-left"></i>
      </button>
      <!-- <button @click="paginaActual--" :disabled="paginaActual === 1">
        Anterior
      </button> -->
      <button @click="paginaActual++" :disabled="paginaActual >= totalPaginas" class="btn btn-light">
        <i class="fas fa-angle-left"></i>
      </button>
      <input
        type="number"
        v-model.number="paginaActual"
        min="1"
        :max="numeroPaginas"
        @change="validarPagina"
        class="pagination-input"
      />
      <!-- <button
        @click="paginaActual = totalPaginas"
        :disabled="paginaActual >= totalPaginas"
      >
        Último
      </button> -->
      <button @click="irPaginaSiguiente" :disabled="paginaActual === numeroPaginas" class="btn btn-light">
        <i class="fas fa-angle-right"></i>
      </button>
      <button @click="irUltimaPagina" :disabled="paginaActual === numeroPaginas" class="btn btn-light">
        <i class="fas fa-angle-double-right"></i>
      </button>

    </div>

    <!-- Sección de Dashboard de Solicitudes Aceptadas -->
    <div class="dashboard-aceptadas">
      <h2 class="dashboard-title">Solicitudes Aceptadas</h2>
      <div class="carousel">
        <button @click="prevCard" class="carousel-button left">‹</button>
        <div class="aceptadas-grid" ref="aceptadasGrid">
          <div
            v-for="solicitud in solicitudesAceptadas"
            :key="solicitud.id_solicitud"
            class="aceptada-card"
            @click="abrirModal(solicitud)"
          >
            <h3>{{ obtenerTituloCurso(solicitud.Fk_Curso) || "Sin curso" }}</h3>
            <p>
              <strong>Fecha de Solicitud:</strong>
              {{ new Date(solicitud.fecha_solicitud).toLocaleDateString() }}
            </p>
            <p><strong>Solicitante:</strong> {{ solicitud.nombre_completo }}</p>
          </div>
        </div>
        <button @click="nextCard" class="carousel-button right">›</button>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <h3>Detalles de la Solicitud</h3>
        <p>
          <strong>Curso:</strong>
          {{ obtenerTituloCurso(detalleSolicitud?.Fk_Curso) || "Sin curso" }}
        </p>
        <p>
          <strong>Fecha de Solicitud:</strong>
          {{
            detalleSolicitud?.fecha_solicitud
              ? new Date(detalleSolicitud.fecha_solicitud).toLocaleDateString()
              : "Sin fecha"
          }}
        </p>
        <p>
          <strong>Solicitante:</strong> {{ detalleSolicitud?.nombre_completo }}
        </p>
        <p>
          <strong>Número Telefónico:</strong>
          {{ detalleSolicitud?.nro_telefonico }}
        </p>
        <p><strong>DNI:</strong> {{ detalleSolicitud?.dni }}</p>
        <p>
          <strong>Fecha de Nacimiento:</strong>
          {{
            detalleSolicitud?.fecha_nacimiento
              ? new Date(detalleSolicitud.fecha_nacimiento).toLocaleDateString()
              : "Sin fecha"
          }}
        </p>
        <p><strong>Dirección:</strong> {{ detalleSolicitud?.direccion }}</p>
        <p>
          <strong>Teléfono de Contacto:</strong>
          {{ detalleSolicitud?.telefono_contacto }}
        </p>
        <p>
          <strong>Correo Electrónico:</strong>
          {{ detalleSolicitud?.correo_electronico }}
        </p>
        <p>
          <strong>Nacionalidad:</strong> {{ detalleSolicitud?.nacionalidad }}
        </p>
        <p>
          <strong>Ocupación Actual:</strong>
          {{ detalleSolicitud?.ocupacion_actual }}
        </p>
        <p>
          <strong>Nombre de Empresa:</strong>
          {{ detalleSolicitud?.nombre_empresa }}
        </p>
        <p>
          <strong>Cargo Actual:</strong> {{ detalleSolicitud?.cargo_actual }}
        </p>
        <p>
          <strong>Experiencia con Maquinaria:</strong>
          {{ detalleSolicitud?.experiencia_maquinaria }}
        </p>
        <p>
          <strong>Contacto de Emergencia:</strong>
          {{ detalleSolicitud?.nombre_contacto_emergencia }}
        </p>
        <p>
          <strong>Relación de Contacto:</strong>
          {{ detalleSolicitud?.relacion_contacto_emergencia }}
        </p>
        <p>
          <strong>Teléfono de Emergencia:</strong>
          {{ detalleSolicitud?.telefono_contacto_emergencia }}
        </p>
        <p>
          <strong>Fecha de Inicio Preferida:</strong>
          {{
            detalleSolicitud?.fecha_inicio_preferida
              ? new Date(
                  detalleSolicitud.fecha_inicio_preferida
                ).toLocaleDateString()
              : "Sin fecha"
          }}
        </p>
        <p>
          <strong>Turno Preferido:</strong>
          {{ detalleSolicitud?.turno_preferido }}
        </p>
        <p>
          <strong>Alergias o Condiciones:</strong>
          {{ detalleSolicitud?.alergias_condiciones }}
        </p>
        <p>
          <strong>Necesidades Especiales:</strong>
          {{ detalleSolicitud?.necesidades_especiales }}
        </p>
        <p>
          <strong>Consentimiento de Participación:</strong>
          {{ detalleSolicitud?.consentimiento_participacion ? "Sí" : "No" }}
        </p>
        <p>
          <strong>Autorización de Imagen:</strong>
          {{ detalleSolicitud?.autorizacion_imagen ? "Sí" : "No" }}
        </p>
        <p>
          <strong>Consentimiento para Tratamiento de Datos:</strong>
          {{ detalleSolicitud?.consentimiento_tratamiento_datos ? "Sí" : "No" }}
        </p>
        <p><strong>Firma:</strong> {{ detalleSolicitud?.firma }}</p>

        <button @click="cerrarModal" class="btn-cerrar-modal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";

export default {
  name: "GestionarSolicitudes",
  data() {
    return {
      solicitudes: [],
      cursos: [],
      solicitudesAceptadas: [],
      modalVisible: false,
      detalleSolicitud: null,
      paginaActual: 1,
      registrosPorPagina: 5,
      cardIndex: 0, // Índice para el desplazamiento de una tarjeta a la vez
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.solicitudes.length / this.registrosPorPagina);
    },
    solicitudesPaginadas() {
      const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
      const fin = inicio + this.registrosPorPagina;
      return this.solicitudes.slice(inicio, fin);
    },
  },
  async mounted() {
    let { data: solicitudes, error: errorSolicitudes } = await supabase
      .from("Solicitud_Capacitacion")
      .select("*");

    if (errorSolicitudes) {
      console.error("Error fetching solicitudes: ", errorSolicitudes);
    } else {
      this.solicitudes = solicitudes;
      this.solicitudesAceptadas = solicitudes.filter(
        (solicitud) => solicitud.estado === "Aceptada"
      );
    }

    let { data: cursos, error: errorCursos } = await supabase
      .from("Cursos")
      .select("Pk_Curso, titulo_curso");

    if (errorCursos) {
      console.error("Error fetching cursos: ", errorCursos);
    } else {
      this.cursos = cursos;
    }
  },
  methods: {
    obtenerTituloCurso(fkCurso) {
      const curso = this.cursos.find((curso) => curso.Pk_Curso === fkCurso);
      return curso ? curso.titulo_curso : null;
    },
    verDetalles(idSolicitud) {
      this.$router.push({ name: "Details", params: { id: idSolicitud } });
    },
    getEstadoClase(estado) {
      if (estado === "Aceptada") {
        return "estado-aceptada";
      } else if (estado === "Rechazada") {
        return "estado-rechazada";
      } else {
        return "estado-pendiente";
      }
    },
    prevCard() {
      if (this.cardIndex > 0) {
        this.cardIndex--;
        this.scrollToCurrentCard();
      }
    },
    nextCard() {
      if (this.cardIndex < this.solicitudesAceptadas.length - 4) {
        this.cardIndex++;
        this.scrollToCurrentCard();
      }
    },
    scrollToCurrentCard() {
      const grid = this.$refs.aceptadasGrid;
      const cardWidth = grid.querySelector(".aceptada-card").offsetWidth;
      grid.scrollTo({
        left: this.cardIndex * (cardWidth + 10), // Ajuste para margen
        behavior: "smooth",
      });
    },
    abrirModal(solicitud) {
      this.detalleSolicitud = solicitud;
      this.modalVisible = true;
    },
    cerrarModal() {
      this.modalVisible = false;
      this.detalleSolicitud = null;
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title,
.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.controls-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.custom-select,
.custom-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.styled-table th,
.styled-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.styled-table th {
  background-color: #2c3e50;
  color: white;
}

.styled-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.styled-table tr:hover {
  background-color: #eaeaea;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.btn-primary {
  background-color: #3498db;
}

.btn-success {
  background-color: #2ecc71;
}

.btn-danger {
  background-color: #e74c3c;
}

.btn-light {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-input {
  width: 50px;
  text-align: center;
  padding: 5px;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.carousel-button {
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>

<!-- <style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #1a5276;
  margin-bottom: 2rem;
  font-weight: bold;
}

.pagination-controls {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-controls label,
.pagination-controls span {
  margin-right: 0.5rem;
}

.table-container {
  overflow-x: auto;
}

.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.solicitudes-table th,
.solicitudes-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.solicitudes-table th {
  background-color: #f2f2f2;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.solicitudes-table td {
  font-size: 1rem;
}

.btn-ver {
  background-color: #2ecc71;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-ver:hover {
  background-color: #27ae60;
}

/* Paginación */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination button:hover:enabled {
  background-color: #2980b9;
}

/* Dashboard de Solicitudes Aceptadas */
.dashboard-aceptadas {
  margin-top: 2rem;
}

.dashboard-title {
  text-align: center;
  font-size: 2rem;
  color: #1a5276;
  margin-bottom: 1rem;
  font-weight: bold;
}

.carousel {
  display: flex;
  align-items: center;
}

.aceptadas-grid {
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding: 1rem;
}

.aceptada-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-width: 200px;
  max-width: 200px;
  text-align: center;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease,
    background-color 0.2s ease;
}

.aceptada-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  background-color: #f0f8ff;
}

.aceptada-card:active {
  transform: scale(0.97);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Modal de Detalles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 700px; /* Mayor ancho */
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 90vh;
  padding: 2rem 3rem; /* Espaciado adicional */
  animation: slideDown 0.3s ease-in-out;
}

.modal-content h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.modal-content p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

.btn-cerrar-modal {
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cerrar-modal:hover {
  background-color: #c0392b;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}
</style> -->
