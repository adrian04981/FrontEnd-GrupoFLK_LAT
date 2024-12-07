<template>
  <div class="container">
    <h1 class="page-title">Gestión de Solicitudes de Capacitación</h1>

    <!-- Tabla de solicitudes generales -->

    <div class="controls-container">
      <div class="pagination-controls">
        <label for="registrosPorPagina">Mostrar</label>
        <select v-model="registrosPorPagina" id="registrosPorPagina">
          <option v-for="num in [5, 10, 20]" :key="num" :value="num">
            {{ num }}
          </option>
        </select>
        <span>registros</span>
      </div>
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Buscar por nombre del curso" class="search-input" />
      </div>
    </div>
    <table class="solicitudes-table">
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
          <td>{{ solicitud.estado_solicitud || "Sin asignar" }}</td>
          <td>
            <button @click="viewSolicitud(solicitud)" class="view-btn">
              Ver
            </button>
            <button @click="gestionarSolicitud(solicitud, 'aceptado')" class="view-btn">
              Aceptar
            </button>
            <button @click="abrirModalRechazo(solicitud)" class="view-btn">
              Rechazar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación (nueva) -->
    <div class="pagination">
      <span>
        Mostrando {{ (paginaActual - 1) * registrosPorPagina + 1 }} a
        {{
          Math.min(
            paginaActual * registrosPorPagina,
            solicitudesFiltradas.length
          )
        }}
        de {{ solicitudesFiltradas.length }} registros
      </span>
      <button @click="irPrimeraPagina" :disabled="paginaActual === 1">
        Primero
      </button>
      <button @click="irPaginaAnterior" :disabled="paginaActual === 1">
        Anterior
      </button>
      <input type="number" v-model.number="paginaActual" min="1" :max="numeroPaginas" @change="validarPagina"
        class="pagina-input" />
      <button @click="irPaginaSiguiente" :disabled="paginaActual === numeroPaginas">
        Siguiente
      </button>
      <button @click="irUltimaPagina" :disabled="paginaActual === numeroPaginas">
        Último
      </button>
    </div>

    <!-- Modal de rechazo -->
    <div v-if="mostrarModalRechazo" class="modal-overlay">
      <div class="modal-content">
        <h3>Motivo de Rechazo</h3>
        <textarea v-model="motivoRechazo" placeholder="Ingrese el motivo del rechazo"></textarea>
        <div class="modal-buttons">
          <button @click="confirmarRechazo" class="btn-cerrar-modal">
            Confirmar
          </button>
          <button @click="cerrarModalRechazo" class="btn-cerrar-modal">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles (Segunda Tabla) -->
    <div v-if="mostrarModalDetalles" class="modal-overlay">
      <div class="modal-content">
        <!-- Botón cerrar en la esquina -->
        <button class="modal-close" @click="cerrarModalDetalles">×</button>
        <h3>Detalles de la Solicitud</h3>
        <div class="modal-details">
          <!-- Campos en diseño compacto -->
          <div class="detail-item">
            <div class="detail-title">ID Solicitud:</div>
            <div class="detail-value">{{ solicitudActual.id_solicitud }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-title">DNI:</div>
            <div class="detail-value">{{ solicitudActual.dni }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Nombre Completo:</div>
            <div class="detail-value">
              {{ solicitudActual.nombre_completo }}
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Número Telefónico:</div>
            <div class="detail-value">{{ solicitudActual.nro_telefonico }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Fecha de Nacimiento:</div>
            <div class="detail-value">
              {{ formatFecha(solicitudActual.fecha_nacimiento) }}
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Dirección:</div>
            <div class="detail-value">{{ solicitudActual.direccion }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Teléfono de Contacto:</div>
            <div class="detail-value">
              {{ solicitudActual.telefono_contacto }}
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Correo Electrónico:</div>
            <div class="detail-value">
              {{ solicitudActual.correo_electronico }}
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Nacionalidad:</div>
            <div class="detail-value">{{ solicitudActual.nacionalidad }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Ocupación Actual:</div>
            <div class="detail-value">
              {{ solicitudActual.ocupacion_actual }}
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Curso Solicitado (ID):</div>
            <div class="detail-value">{{ solicitudActual.fk_curso }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Nombre de la Empresa:</div>
            <div class="detail-value">{{ solicitudActual.nombre_empresa }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Cargo Actual:</div>
            <div class="detail-value">{{ solicitudActual.cargo_actual }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Experiencia en Maquinaria:</div>
            <div class="detail-value">
              {{ solicitudActual.experiencia_maquinaria }}
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-title">Estado:</div>
            <div class="detail-value">{{ solicitudActual.estado }}</div>
          </div>
        </div>
        <!-- Botón de cerrar al final -->
        <div class="modal-buttons">
          <button @click="cerrarModalDetalles" class="btn-cerrar-modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/supabase.js";
import { useRouter } from "vue-router";
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2'

export default {
  setup() {
    // Variables reactivas
    const solicitudes = ref([]);
    const cursos = ref([]);
    const registrosPorPagina = ref(5);
    const paginaActual = ref(1);
    const searchQuery = ref("");
    const searchId = ref("");
    const mostrarModalRechazo = ref(false);
    const mostrarModalDetalles = ref(false);
    const motivoRechazo = ref("");
    const solicitudActual = ref(null);
    const router = useRouter();




    const formEndpoint = ref("https://formspree.io/f/movqylzn");

    // Funciones para cargar datos
    const fetchSolicitudes = async () => {
      try {
        const { data, error } = await supabase
          .from("solicitud_capacitacion")
          .select("*");
        if (error) throw error;

        console.log("Solicitudes cargadas:", data); // Verificar los datos obtenidos en consola
        solicitudes.value = data;
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error.message);
      }
    };

    const fetchCursos = async () => {
      const { data, error } = await supabase.from("cursos").select("*");
      if (!error) cursos.value = data;
    };

    // Computed: Filtrar y paginar solicitudes
    const solicitudesFiltradas = computed(() => {
      return solicitudes.value
        .filter(
          (solicitud) =>
            !searchQuery.value ||
            (getNombreCurso(solicitud.fk_curso) || "")
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
        )
        .sort(
          (a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
        ); // Ordenar por fecha descendente
    });

    const solicitudesPaginadas = computed(() => {
      const inicio = (paginaActual.value - 1) * registrosPorPagina.value;
      return solicitudesFiltradas.value.slice(
        inicio,
        inicio + registrosPorPagina.value
      );
    });

    // Nueva propiedad computada: Filtrar solicitudes aceptadas
    const solicitudesAceptadasFiltradas = computed(() => {
      return solicitudes.value.filter(
        (solicitud) =>
          solicitud.estado === "Aceptada" &&
          (!searchId.value || solicitud.dni.toString().includes(searchId.value))
      );
    });

    // Computed: Número total de páginas
    const numeroPaginas = computed(() => {
      return Math.ceil(
        solicitudesFiltradas.value.length / registrosPorPagina.value
      );
    });

    // Funciones de paginación
    const irPrimeraPagina = () => {
      paginaActual.value = 1;
    };

    const irUltimaPagina = () => {
      paginaActual.value = numeroPaginas.value;
    };

    const irPaginaAnterior = () => {
      if (paginaActual.value > 1) paginaActual.value--;
    };

    const irPaginaSiguiente = () => {
      if (paginaActual.value < numeroPaginas.value) paginaActual.value++;
    };

    const validarPagina = () => {
      if (paginaActual.value < 1) paginaActual.value = 1;
      if (paginaActual.value > numeroPaginas.value)
        paginaActual.value = numeroPaginas.value;
    };

    async function gestionarSolicitud(solicitud, estado, motivoRechazo) {
      try {
        const nuevoEstado = estado === "aceptado" ? "Aceptada" : "Rechazada";

        // Actualizar el estado de la solicitud
        const { error } = await supabase
          .from("solicitud_capacitacion")
          .update({
            estado_solicitud: nuevoEstado,
            motivo_rechazo: estado === "rechazado" ? motivoRechazo : null,
          })
          .eq("id_solicitud", solicitud.id_solicitud);

        if (error) throw error;

        // Buscar si el operador ya existe por correo electrónico
        const { data: operadores, error: operadoresError } = await supabase
          .from("Operador")
          .select("Pk_Alumno")
          .eq("correo_electronico", solicitud.correo_electronico);

        if (operadoresError) throw operadoresError;

        // Si no existe, crear el operador
        if (operadores.length === 0) {
          const operadorCreado = await crearOperador(solicitud);
          if (!operadorCreado) {
            throw new Error("No se pudo crear el operador.");
          }
        }

        // Construir el mensaje de correo
        const saludo = `Hola ${solicitud.nombre_completo},\n\n`;
        const detalleSolicitud = `Detalles de la solicitud:\n- Curso: ${getNombreCurso(solicitud.fk_curso)}\n- Fecha de solicitud: ${formatFecha(solicitud.fecha_solicitud)}\n\n`;

        let mensaje;
        if (nuevoEstado === "Aceptada") {
          mensaje = `${saludo}¡Estamos emocionados de informarte que tu solicitud de capacitación ha sido aceptada con éxito!\n\n${detalleSolicitud}Pronto te contactaremos con más información.\n\nPara completar tu inscripción, por favor realiza el pago en el siguiente enlace:\n\n(https://www.grupo-flk-pago.com)\n\n¡Gracias por confiar en nosotros!`;
        } else {
          mensaje = `${saludo}Lamentamos informarte que tu solicitud de capacitación ha sido rechazada.\n\nMotivo del rechazo:\n"${motivoRechazo}"\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nGracias por tu comprensión.`;
        }

        const templateParams = {
          to_email: solicitud.correo_electronico,
          subject: nuevoEstado === "Aceptada" ? "¡Solicitud Aceptada!" : "Solicitud Rechazada",
          message: mensaje,
        };

        // Enviar el correo usando EmailJS
        emailjs.init("8GJwYc75XE3Qp05j_");
        const { response, status } = await emailjs.send(
          "service_5u4cv8t", // Service ID
          "template_tryi5ab", // Template ID
          templateParams
        );

        if (status === 200) {
          console.log("Correo enviado exitosamente:", response);
          Swal.fire({
            icon: "success",
            title: "Operación exitosa",
            text: `Solicitud ${nuevoEstado.toLowerCase()} y correo enviado correctamente.`,
          });
        } else {
          console.error("Error en el envío del correo:", response);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al enviar el correo de confirmación.",
          });
        }

        // Refrescar la lista de solicitudes
        await fetchSolicitudes();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    }

    async function crearOperador(solicitud) {
      try {
        const { error } = await supabase
          .from("Operador")
          .insert([
            {
              nombre: solicitud.nombre_completo,
              apellidos: solicitud.nombre_completo, // Suponiendo que la contraseña es el usuario
              fecha_nacimiento: solicitud.fecha_nacimiento,
              nro_telefonico: solicitud.nro_telefonico,
              correo_electronico: solicitud.correo_electronico, // Cambié a "usuario" ya que es el correo en la solicitud
              dni: solicitud.dni, // Usamos la contraseña como DNI (ajustar según lo necesario)
              Estado: true, // El estado del operador
            },
          ]);

        if (error) throw error;

        console.log("Operador creado con éxito.");
        return true;
      } catch (error) {
        console.error("Error al crear operador:", error.message);
        alert("Ocurrió un error al crear el operador.");
        return false;
      }
    }

    const confirmarRechazo = async () => {
      await gestionarSolicitud(solicitudActual.value, "rechazado");
      cerrarModalRechazo();
    };

    const abrirModalRechazo = (solicitud) => {
      solicitudActual.value = solicitud;
      mostrarModalRechazo.value = true;
    };

    const cerrarModalRechazo = () => {
      mostrarModalRechazo.value = false;
      motivoRechazo.value = "";
    };

    // Modal de detalles
    const abrirModalDetalles = (solicitud) => {
      solicitudActual.value = solicitud;
      mostrarModalDetalles.value = true;
    };

    const cerrarModalDetalles = () => {
      mostrarModalDetalles.value = false;
    };

    // Funciones del carrusel (segunda tabla)
    const prevCard = () => {
      const grid = document.querySelector(".aceptadas-grid");
      grid.scrollBy({ left: -220, behavior: "smooth" });
    };

    const nextCard = () => {
      const grid = document.querySelector(".aceptadas-grid");
      grid.scrollBy({ left: 220, behavior: "smooth" });
    };

    // Utilidades
    const formatFecha = (fecha) => {
      if (!fecha) return "Fecha no disponible";
      const date = new Date(fecha);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const getNombreCurso = (fk_curso) => {
      const curso = cursos.value.find((c) => c.pk_curso === fk_curso);
      return curso ? curso.titulo_curso : "Curso no encontrado";
    };

    const viewSolicitud = (solicitud) => {
      router.push({
        path: "ManageRequest/Details",
        query: { id: solicitud.id_solicitud },
      });
    };

    // Inicialización
    onMounted(() => {
      fetchSolicitudes();
      fetchCursos();
    });

    return {
      solicitudes,
      cursos,
      registrosPorPagina,
      paginaActual,
      solicitudesFiltradas,
      solicitudesPaginadas,
      solicitudesAceptadasFiltradas, // Nueva propiedad computada
      numeroPaginas,
      irPrimeraPagina,
      irUltimaPagina,
      irPaginaAnterior,
      irPaginaSiguiente,
      validarPagina,
      searchQuery,
      searchId,
      gestionarSolicitud,
      abrirModalRechazo,
      cerrarModalRechazo,
      confirmarRechazo,
      abrirModalDetalles,
      cerrarModalDetalles,
      prevCard,
      nextCard,
      formatFecha,
      getNombreCurso,
      viewSolicitud,
      mostrarModalRechazo,
      mostrarModalDetalles,
      motivoRechazo,
      solicitudActual,
    };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #f9f9f9;
  /* Fondo claro */
  border-radius: 8px;
  /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombras suaves */
}

/* Títulos */
.page-title,
.table-title {
  color: #333333;
  /* Color de texto más suave */
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2.2rem;
}

.table-title {
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
}

/* Tabla */
.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  /* Fondo blanco */
  color: #444444;
  /* Texto más suave */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Sombras suaves */
}

.solicitudes-table th {
  background-color: #4a90e2;
  /* Fondo azul vibrante */
  color: #ffffff;
  /* Texto blanco */
  padding: 0.75rem;
  font-size: 1rem;
  text-align: left;
}

.solicitudes-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eeeeee;
  /* Bordes suaves */
  background-color: #fdfdfd;
  /* Fondo claro */
}

.solicitudes-table tr:nth-child(even) td {
  background-color: #f7f9fc;
  /* Fondo alternado para filas pares */
}

.solicitudes-table tr:hover td {
  background-color: #eaf4ff;
  /* Resaltado en hover */
  transition: background-color 0.2s ease-in-out;
}

/* Botones */
.view-btn {
  background-color: #007bff;
  /* Azul principal */
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.view-btn:hover {
  background-color: #0056b3;
  /* Azul más oscuro */
  transform: scale(1.05);
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  /* Azul vibrante */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination button:hover:enabled {
  background-color: #0056b3;
  /* Azul más oscuro */
}

/* Controles de búsqueda y paginación */
.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-controls label,
.pagination-controls select,
.search-input {
  font-size: 1rem;
  color: #333333;
}

.search-input {
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 0.5rem;
  background-color: #ffffff;
  /* Fondo blanco */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  /* Apariencia de relieve */
}

.search-input:focus {
  border-color: #007bff;
  /* Resaltado azul en foco */
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  /* Sombra azul */
}

/* Carrusel de solicitudes aceptadas */
.dashboard-aceptadas {
  margin-top: 2rem;
}

.aceptada-card {
  background-color: #ffffff;
  /* Fondo blanco */
  border: 1px solid #4a90e2;
  /* Borde azul vibrante */
  color: #333333;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Sombras suaves */
  transition: transform 0.2s, box-shadow 0.3s;
}

.aceptada-card:hover {
  background-color: #eaf4ff;
  /* Fondo azul claro */
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  /* Sombras más intensas */
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333333;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.modal-buttons button.btn-cerrar-modal {
  background-color: #ff4d4f;
  /* Rojo vibrante */
  color: white;
}

.modal-buttons button.btn-cerrar-modal:hover {
  background-color: #cc0000;
}

.modal-buttons button.btn-confirmar {
  background-color: #4caf50;
  /* Verde */
  color: white;
}

.modal-buttons button.btn-confirmar:hover {
  background-color: #2e7d32;
  /* Verde más oscuro */
}

/* Estilos para el carrusel */
.dashboard-aceptadas {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  /* Necesario para las flechas */
}

.aceptadas-grid {
  display: flex;
  gap: 1rem;
  /* Espaciado entre tarjetas */
  overflow-x: auto;
  /* Permitir desplazamiento horizontal */
  scroll-behavior: smooth;
  /* Movimiento suave */
  padding: 1rem;
}

.aceptada-card {
  flex: 0 0 250px;
  /* Cada tarjeta tiene un ancho fijo */
  background-color: #ffffff;
  border: 1px solid #4a90e2;
  color: #333333;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transition: transform 0.2s, box-shadow 0.3s;
}

.aceptada-card:hover {
  background-color: #eaf4ff;
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

/* Flechas del carrusel */
.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1;
  transition: background-color 0.3s ease;
}

.carousel-button.left {
  left: 10px;
}

.carousel-button.right {
  right: 10px;
}

.carousel-button:hover {
  background-color: #0056b3;
}

.carousel-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Fondo translúcido del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fondo oscuro translúcido */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Aparece sobre otros elementos */
}

/* Contenedor del modal */
.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  /* Bordes redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Sombras suaves */
  width: 80%;
  max-width: 500px;
  animation: fadeIn 0.3s ease-out;
  /* Animación de aparición */
  position: relative;
}

/* Título del modal */
.modal-content h3 {
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 1rem;
  text-align: center;
  /* Centrar el texto */
  font-weight: bold;
}

/* Contenido dentro del modal */
.modal-details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  /* Espaciado entre elementos */
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-title {
  font-weight: bold;
  color: #555555;
}

.detail-value {
  color: #333333;
  font-size: 1rem;
}

/* Caja de texto dentro del modal */
textarea {
  width: 100%;
  min-height: 100px;
  resize: none;
  /* Evitar redimensionar */
  padding: 0.8rem;
  border: 1px solid #cccccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 1rem;
  color: #333333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  /* Apariencia de relieve */
  transition: border-color 0.2s ease;
}

textarea:focus {
  border-color: #007bff;
  /* Azul en foco */
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  /* Resaltado en foco */
}

/* Fondo translúcido del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fondo oscuro translúcido */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Contenedor del modal */
.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  /* Bordes redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Sombras suaves */
  width: 90%;
  max-width: 600px;
  /* Ancho máximo del modal */
  max-height: 80%;
  /* Altura máxima del modal */
  overflow-y: auto;
  /* Permitir desplazamiento vertical */
  position: relative;
  /* Necesario para el botón cerrar */
  animation: fadeIn 0.3s ease-out;
  /* Animación */
}

/* Título del modal */
.modal-content h3 {
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: bold;
}

/* Diseño en grid para los campos */
.modal-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Dos columnas iguales */
  gap: 1rem;
  /* Espaciado entre elementos */
  margin-bottom: 1rem;
}

/* Campos individuales */
.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-title {
  font-weight: bold;
  color: #555555;
  margin-bottom: 0.3rem;
}

.detail-value {
  color: #333333;
  font-size: 0.95rem;
}

/* Botón de cerrar en la esquina */
.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background-color: transparent;
  color: #333333;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #ff4d4f;
  /* Cambia a rojo al pasar el mouse */
}

/* Botón de cerrar al final */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-buttons button {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 1rem;
}

.modal-buttons button.btn-cerrar-modal {
  background-color: #ff4d4f;
  color: white;
}

.modal-buttons button.btn-cerrar-modal:hover {
  background-color: #cc0000;
  transform: scale(1.05);
}

/* Animación de aparición */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
