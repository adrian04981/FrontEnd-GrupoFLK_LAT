<template>
  <div class="container">
    <h1 class="page-title">Gestión de Evaluaciones Prácticas</h1>
    <button @click="goToCreateEvaluacion" class="btn-create">Generar Evaluación</button>
    <div class="controls-container">
      <div class="pagination-controls">
        <label for="registrosPorPagina">Mostrar</label>
        <select v-model="registrosPorPagina" id="registrosPorPagina">
          <option v-for="num in [5, 10, 20]" :key="num" :value="num">{{ num }}</option>
        </select>
        <span>registros</span>
      </div>
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Buscar por enunciados" class="search-input" />
      </div>
    </div>
    <table class="evaluaciones-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Operador</th>
          <th>Galería</th>
          <th>Enunciados</th>
          <th>Respuestas</th>
          <th>Observaciones</th>
          <th>Fecha Creación</th>
          <th>Curso</th>
          <th>Calificación</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="evaluacion in evaluacionesPaginadas" :key="evaluacion.pk_evaluacion_practica">
          <td>{{ evaluacion.pk_evaluacion_practica }}</td>
          <td>{{ getOperadorNombre(evaluacion.fk_operador) }}</td>
          <td>
            <img :src="evaluacion.galeria ? getGaleriaURL(evaluacion.galeria) : ''" alt="Galería" class="galeria-img" />
          </td>
          <td>{{ evaluacion.enunciados?.join(", ") }}</td>
          <td>{{ evaluacion.respuestas }}</td>
          <td>{{ evaluacion.observaciones }}</td>
          <td>{{ formatFecha(evaluacion.fecha_creacion) }}</td>
          <td>{{ getCursoTitulo(evaluacion.fk_curso) }}</td>
          <td>
            <div v-if="evaluacion.estado === 'pendiente'" class="calificacion-input">
              <input type="number" v-model.number="evaluacion.puntaje_total" min="0" max="20" class="grade-input"
                placeholder="0-20" />
              <button @click="guardarCalificacion(evaluacion)" class="save-grade-btn">
                Guardar
              </button>
            </div>
            <span v-else>{{ evaluacion.puntaje_total }}/20</span>
          </td>
          <td>
            <span :class="['estado-badge', evaluacion.estado === 1 ? 'aprobado' : 'desaprobado']">
              {{ evaluacion.estado === 1 ? 'Aprobado' : 'Desaprobado' }}
            </span>
          </td>
          <td class="actions-cell">
            <button @click="viewEvaluacion(evaluacion)" class="view-btn">
              <i class="fa fa-eye"></i>
            </button>
            <button v-if="puedeGenerarCertificado(evaluacion)" @click="generarCertificado(evaluacion)"
              class="certificate-btn">
              Generar certificado
            </button>

          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <span>
        Mostrando {{ (paginaActual - 1) * registrosPorPagina + 1 }} a
        {{ Math.min(paginaActual * registrosPorPagina, evaluacionesFiltradas.length) }} de
        {{ evaluacionesFiltradas.length }} registros
      </span>
      <button @click="irPrimeraPagina" :disabled="paginaActual === 1">Primero</button>
      <button @click="irPaginaAnterior" :disabled="paginaActual === 1">Anterior</button>
      <input type="number" v-model.number="paginaActual" min="1" :max="numeroPaginas" @change="validarPagina"
        class="pagina-input" />
      <button @click="irPaginaSiguiente" :disabled="paginaActual === numeroPaginas">Siguiente</button>
      <button @click="irUltimaPagina" :disabled="paginaActual === numeroPaginas">Último</button>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Detalles de la Evaluación</h2>
        <p><strong>ID:</strong> {{ modalData.pk_evaluacion_practica }}</p>
        <p><strong>Operador:</strong> {{ modalData.operador }}</p>
        <p><strong>Curso:</strong> {{ modalData.curso }}</p>
        <p><strong>Enunciados y Respuestas:</strong></p>
        <ul>
          <li v-for="(enunciado, index) in modalData.enunciados" :key="index">
            {{ enunciado }} - {{ modalData.respuestas[index] }}
          </li>
        </ul>
        <p><strong>Observaciones:</strong> {{ modalData.observaciones }}</p>
        <button @click="cerrarModal" class="btn-cancel">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/supabase.js";
import { useRouter } from "vue-router";
import { jsPDF } from 'jspdf';

export default {
  setup() {
    const router = useRouter();
    const evaluaciones = ref([]);
    const cursos = ref([]);
    const operadores = ref([]);
    const registrosPorPagina = ref(5);
    const paginaActual = ref(1);
    const searchQuery = ref("");
    const mostrarModal = ref(false);
    const modalData = ref({});

    const fetchEvaluaciones = async () => {
      const { data, error } = await supabase
        .from("evaluacion_practica")
        .select("*");
      if (!error) evaluaciones.value = data.map(ev => ({
        ...ev,
        estado: ev.estado || 'pendiente',
        calificacion: ev.calificacion || null
      }));
      else console.error("Error al obtener las evaluaciones:", error.message);
    };

    const fetchCursos = async () => {
      const { data, error } = await supabase.from("cursos").select("*");
      if (!error) cursos.value = data;
      else console.error("Error al obtener los cursos:", error.message);
    };

    const fetchOperadores = async () => {
      const { data, error } = await supabase.from("Operador").select("*");
      if (!error) operadores.value = data;
      else console.error("Error al obtener los operadores:", error.message);
    };

    const guardarCalificacion = async (evaluacion) => {
      if (evaluacion.puntaje_total < 0 || evaluacion.puntaje_total > 20) {
        alert("La calificación debe estar entre 0 y 20");
        return;
      }

      const { error } = await supabase
        .from("evaluacion_practica")
        .update({
          puntaje_total: evaluacion.puntaje_total,
          estado: 1
        })
        .eq('pk_evaluacion_practica', evaluacion.pk_evaluacion_practica);

      if (error) {
        console.error("Error al guardar la calificación:", error.message);
        alert("Error al guardar la calificación");
      } else {
        evaluacion.estado = 'calificado';
        alert("Calificación guardada exitosamente");
      }
    };

    const verificarAprobacionTeorica = async (operadorId, cursoId) => {
      const { data, error } = await supabase
        .from("evaluacion_teorica")
        .select("puntaje_total")
        .eq("fk_operador", operadorId)
        .eq("fk_curso", cursoId)
        .single();

      if (error) return false;
      return data && data.puntaje_total >= 14;
    };

    const puedeGenerarCertificado = async (evaluacion) => {
      if (!evaluacion.puntaje_total || evaluacion.puntaje_total < 11) return false;
      return await verificarAprobacionTeorica(evaluacion.fk_operador, evaluacion.fk_curso);
    };

    const generarCertificado = async (evaluacion) => {
      const operador = operadores.value.find(op => op.Pk_Alumno === evaluacion.fk_operador);
      const curso = cursos.value.find(c => c.pk_curso === evaluacion.fk_curso);

      if (!operador || !curso) {
        alert("Error: No se encontraron los datos del operador o curso");
        return;
      }

      // Obtener el autor desde el localStorage
      const autor = JSON.parse(localStorage.getItem('user'));
      if (!autor) {
        alert("Error: No se encontró el autor en el localStorage.");
        return;
      }

      // Verificar si ya existe un certificado con el mismo operador y curso
      try {
        const { data: certificadosExistentes, error: errorConsulta } = await supabase
          .from('Certificado')
          .select('Pk_certificado') // Solo seleccionamos el ID del certificado
          .eq('FK_operador', operador.Pk_Alumno)
          .eq('fk_cursos', curso.pk_curso);

        if (errorConsulta) {
          throw errorConsulta;
        }

        // Si ya existe un certificado, mostramos un mensaje y no generamos el nuevo
        if (certificadosExistentes.length > 0) {
          alert('Error: Ya existe un certificado para este operador y curso.');
          return; // Detenemos el proceso
        }

        // Crear el PDF si no existe el certificado
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        // Añadir imagen de fondo
        const backgroundImg = '/certificado-background.jpg'; // Asegúrate de tener esta imagen
        doc.addImage(backgroundImg, 'JPEG', 0, 0, 297, 210);

        // Añadir logo
        const logoImg = '/entech-logo.png'; // Asegúrate de tener esta imagen
        doc.addImage(logoImg, 'PNG', 20, 20, 60, 30);

        // Configurar fuentes
        doc.setFont('times', 'normal');

        // Título "Certificado"
        doc.setFontSize(48);
        doc.setTextColor(0, 48, 135); // Azul corporativo
        doc.text('Certificado', 148, 60, { align: 'center' });

        // Texto "Otorgado a:"
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Otorgado a:', 148, 80, { align: 'center' });

        // Nombre del operador
        doc.setFontSize(24);
        doc.setFont('times', 'bold');
        doc.text(operador.nombre, 148, 90, { align: 'center' });

        // Detalles de la certificación
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        const certificacionTexto = `
      Identificado con DNI ${operador.dni}, como ${curso.titulo_curso}

      La Empresa EQUIPMENT TECHNICAL SERVICES DEL PERÚ SAC, otorga el presente CERTIFICADO,
      por haber aprobado el curso Teórico-Práctico, desarrollado los días ${formatFecha(evaluacion.fecha_creacion)}.

      La certificación se rige bajo lineamientos de la Ley N° 29783 (SST) y su Modif. 30222 – DS. 005-2012-TR.
      Y alineados a las Normas Internacionales ANSI/ASME B56.1 - 2012.

      Tiempo de capacitación 40 horas efectivas.
    `;

        doc.text(certificacionTexto, 148, 110, {
          align: 'center',
          maxWidth: 200
        });

        // Fecha
        const fecha = new Date().toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        doc.text(`Lima, ${fecha}`, 200, 170);

        // Firma y sello
        doc.addImage('/firma.png', 'PNG', 120, 150, 50, 30); // Asegúrate de tener esta imagen
        doc.addImage('/sello.png', 'PNG', 180, 150, 30, 30); // Asegúrate de tener esta imagen

        // Guardar el PDF
        const pdfName = `certificado_${operador.nombre}_${curso.titulo_curso}.pdf`;
        doc.save(pdfName);

        // Insertar datos en Supabase
        const { data, error } = await supabase
          .from('Certificado')
          .insert([
            {
              FK_operador: operador.Pk_Alumno, // FK_operador
              dni: operador.dni, // dni
              nombre_curso: curso.titulo_curso, // nombre_curso
              lugar_servicio: operador.lugar_servicio || 'LIMA', // lugar_servicio
              fecha_emision_certificado: new Date(), // fecha_emision_certificado
              fecha_vencimiento: new Date(), // fecha_vencimiento (ajustar según lógica)
              firma_instructor: 'firma_instructor.png', // firma_instructor (nombre de archivo)
              firma_gerente: 'firma_gerente.png', // firma_gerente (nombre de archivo)
              codigo_certificado: 'codigo_' + Math.random().toString(36).substring(2, 15), // codigo_certificado
              autor: autor.id || null, // autor (UUID o null)
              ultimo_autor: autor.id || null, // ultimo_autor (UUID o null)
              Estado: true, // Estado (activo)
              fk_cursos: curso.pk_curso, // fk_cursos
            },
          ]);

        if (error) {
          throw error;
        }

        console.log('Certificado guardado con éxito:', data);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el certificado o generar el PDF.');
      }
    };


    const getCursoTitulo = (fk_curso) => {
      const curso = cursos.value.find((c) => c.pk_curso === fk_curso);
      return curso ? curso.titulo_curso : "Curso no encontrado";
    };

    const getOperadorNombre = (fk_operador) => {
      const operador = operadores.value.find((op) => op.Pk_Alumno === fk_operador);
      return operador ? operador.nombre : "Operador no encontrado";
    };

    const getGaleriaURL = (galeria) => {
      return galeria ? `data:image/png;base64,${galeria}` : '';
    };

    const formatFecha = (fecha) => {
      if (!fecha) return "Sin fecha";
      const date = new Date(fecha);
      return date.toLocaleDateString();
    };

    const evaluacionesFiltradas = computed(() => {
      return evaluaciones.value.filter((evaluacion) =>
        evaluacion.enunciados &&
        evaluacion.enunciados.some((enunciado) =>
          enunciado.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );
    });

    const evaluacionesPaginadas = computed(() => {
      const inicio = (paginaActual.value - 1) * registrosPorPagina.value;
      return evaluacionesFiltradas.value.slice(inicio, inicio + registrosPorPagina.value);
    });

    const numeroPaginas = computed(() => {
      return Math.ceil(evaluacionesFiltradas.value.length / registrosPorPagina.value);
    });

    const irPrimeraPagina = () => paginaActual.value = 1;
    const irUltimaPagina = () => paginaActual.value = numeroPaginas.value;
    const irPaginaAnterior = () => { if (paginaActual.value > 1) paginaActual.value--; };
    const irPaginaSiguiente = () => { if (paginaActual.value < numeroPaginas.value) paginaActual.value++; };

    const validarPagina = () => {
      if (paginaActual.value < 1) paginaActual.value = 1;
      if (paginaActual.value > numeroPaginas.value) paginaActual.value = numeroPaginas.value;
    };

    const goToCreateEvaluacion = () => {
      router.push({ path: "/ManageEvaluation/CrearEvaluacion" });
    };

    const viewEvaluacion = (evaluacion) => {
      modalData.value = {
        ...evaluacion,
        operador: getOperadorNombre(evaluacion.fk_operador),
        curso: getCursoTitulo(evaluacion.fk_curso)
      };
      mostrarModal.value = true;
    };

    const cerrarModal = () => {
      mostrarModal.value = false;
      modalData.value = {};
    };

    const deleteEvaluacion = async (id) => {
      if (!confirm('¿Está seguro de eliminar esta evaluación?')) return;

      const { error } = await supabase
        .from('evaluacion_practica')
        .delete()
        .eq('pk_evaluacion_practica', id);

      if (error) {
        console.error("Error al eliminar la evaluación:", error.message);
        alert("Error al eliminar la evaluación");
      } else {
        evaluaciones.value = evaluaciones.value.filter(e => e.pk_evaluacion_practica !== id);
        alert("Evaluación eliminada exitosamente");
      }
    };

    onMounted(() => {
      fetchEvaluaciones();
      fetchCursos();
      fetchOperadores();
    });

    return {
      evaluaciones,
      cursos,
      operadores,
      registrosPorPagina,
      paginaActual,
      evaluacionesFiltradas,
      evaluacionesPaginadas,
      numeroPaginas,
      irPrimeraPagina,
      irUltimaPagina,
      irPaginaAnterior,
      irPaginaSiguiente,
      validarPagina,
      formatFecha,
      getCursoTitulo,
      getOperadorNombre,
      getGaleriaURL,
      goToCreateEvaluacion,
      viewEvaluacion,
      searchQuery,
      mostrarModal,
      modalData,
      cerrarModal,
      deleteEvaluacion,
      guardarCalificacion,
      puedeGenerarCertificado,
      generarCertificado
    };
  },
};
</script>

<style>
/* Estilos existentes... */

/* Nuevos estilos para calificación y certificados */
.calificacion-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.estado-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  color: white;
}

.aprobado {
  background-color: #38a169;
  /* Verde */
}

.desaprobado {
  background-color: #e53e3e;
  /* Rojo */
}

.grade-input {
  width: 60px;
  padding: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.save-grade-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.save-grade-btn:hover {
  background-color: #388e3c;
}

.certificate-btn {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

.certificate-btn:hover {
  background-color: #f57c00;
}

.estado-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.estado-badge.pendiente {
  background-color: #fff3cd;
  color: #856404;
}

.estado-badge.calificado {
  background-color: #d4edda;
  color: #155724;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Contenedor principal */
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f7f3f3;
  /* Fondo claro */
  border-radius: 10px;
  /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombras suaves */
}

/* Título de la página */
.page-title {
  font-size: 2rem;
  color: #333;
  /* Color del texto */
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
}

/* Botón para generar evaluación */
.btn-create {
  background-color: #3ca3c2;
  /* Verde */
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-create:hover {
  background-color: #6097d6;
  /* Verde más oscuro */
  transform: scale(1.05);
  /* Pequeño efecto de agrandamiento */
}

/* Tabla */
.evaluaciones-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.evaluaciones-table th,
.evaluaciones-table td {
  padding: 0.8rem;
  border: 1px solid #ddd;
  /* Bordes suaves */
  text-align: left;
}

.evaluaciones-table th {
  background-color: #6096dd;
  /* Verde */
  color: white;
  font-size: 1rem;
}

.evaluaciones-table td {
  background-color: #fff;
  /* Fondo blanco */
  color: #333;
  /* Texto gris oscuro */
}

.evaluaciones-table tr:nth-child(even) {
  background-color: #f2f2f2;
  /* Fondo alternado para filas pares */
}

.evaluaciones-table tr:hover {
  background-color: #e8f5e9;
  /* Resaltado verde claro */
  transition: background-color 0.3s ease;
}

/* Imagen de galería */
.galeria-img {
  max-width: 50px;
  max-height: 50px;
  border-radius: 5px;
  /* Bordes redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Sombras suaves */
}

/* Botones de acción */
.view-btn {
  background-color: #007bff;
  /* Azul */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.view-btn:hover {
  background-color: #0056b3;
  /* Azul más oscuro */
  transform: scale(1.05);
  /* Pequeño efecto de agrandamiento */
}

/* Controles de paginación y búsqueda */
.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #333;
}

.pagination-controls label {
  font-weight: bold;
}

.pagination-controls select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  /* Fondo blanco */
  font-size: 1rem;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 300px;
  font-size: 1rem;
}

/* Paginación */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.pagination span {
  font-size: 0.9rem;
  color: #333;
}

.pagination button {
  background-color: #4caf50;
  /* Verde */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ddd;
  /* Gris */
  color: #999;
  /* Texto gris */
  cursor: not-allowed;
}

.pagination button:hover:enabled {
  background-color: #388e3c;
  /* Verde más oscuro */
}

/* Input para seleccionar página */
.pagina-input {
  width: 50px;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

/* Animaciones */
.evaluaciones-table tr {
  transition: all 0.3s ease;
}

delete-btn {
  background-color: #da0d22;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 500px;
}

.modal-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-content p {
  margin: 0.5rem 0;
}

.btn-cancel {
  background-color: #6c757d;
  color: rgb(213, 20, 20);
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #5a6268;
}
</style>
