<template>
  <div class="certificados-container">
    <h1>Listado de Certificados</h1>

    <!-- Estado de Evaluaciones -->
    <div class="evaluaciones-status" v-if="evaluacionesStatus.length > 0">
      <h2>Estado de Evaluaciones</h2>
      <div class="status-cards">
        <div v-for="status in evaluacionesStatus" :key="status.curso_id" class="status-card">
          <h3>{{ status.nombre_curso }}</h3>
          <div class="status-details">
            <div class="status-item" :class="{ 'aprobado': status.teorica_aprobada }">
              <span class="status-label">Evaluación Teórica:</span>
              <span class="status-value">{{ status.teorica_aprobada ? '✓ Aprobado' : '✗ Pendiente' }}</span>
              <span v-if="status.calificacion_teorica" class="status-score">
                {{ status.calificacion_teorica }}/20
              </span>
            </div>
            <div class="status-item" :class="{ 'aprobado': status.practica_aprobada }">
              <span class="status-label">Evaluación Práctica:</span>
              <span class="status-value">{{ status.practica_aprobada ? '✓ Aprobado' : '✗ Pendiente' }}</span>
              <span v-if="status.calificacion_practica" class="status-score">
                {{ status.calificacion_practica }}/20
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Certificados -->
    <div class="certificados-table-container">
      <h2>Certificados Disponibles</h2>
      <table class="certificados-table">
        <thead>
          <tr>
            <th>#</th>
            <th>DNI</th>
            <th>Nombre del Curso</th>
            <th>Lugar de Servicio</th>
            <th>Fecha de Emisión</th>
            <th>Fecha de Vencimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(certificado, index) in certificados" :key="certificado.Pk_certificado">
            <td>{{ index + 1 }}</td>
            <td>{{ certificado.dni }}</td>
            <td>{{ certificado.nombre_curso }}</td>
            <td>{{ certificado.lugar_servicio }}</td>
            <td>{{ formatDate(certificado.fecha_emision_certificado) }}</td>
            <td>{{ formatDate(certificado.fecha_vencimiento) }}</td>
            <td>
              <span class="estado-badge" :class="getEstadoClass(certificado)">
                {{ getEstadoText(certificado) }}
              </span>
            </td>
            <td>
              <button 
                class="btn btn-descargar" 
                @click="descargarCertificado(certificado)"
                :disabled="!puedeDescargarCertificado(certificado)"
                :title="getMensajeDescarga(certificado)"
              >
                <i class="fas fa-download"></i> Descargar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensaje cuando no hay certificados -->
      <div v-if="certificados.length === 0" class="no-certificados">
        <p>No hay certificados disponibles en este momento.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

export default {
  name: "Certificados",
  setup() {
    const certificados = ref([]);
    const evaluacionesStatus = ref([]);

    const cargarCertificados = async () => {
      try {
        const { data, error } = await supabase
          .from("Certificado")
          .select("Pk_certificado, dni, nombre_curso, lugar_servicio, fecha_emision_certificado, fecha_vencimiento, documento_adjunto, fk_curso");

        if (error) throw error;

        certificados.value = data;
        await cargarEstadoEvaluaciones();
      } catch (error) {
        console.error("Error al cargar los certificados:", error.message);
      }
    };

    const cargarEstadoEvaluaciones = async () => {
      const cursosUnicos = [...new Set(certificados.value.map(cert => cert.fk_curso))];
      const userId = await getUserId(); // Implementa esta función según tu sistema de autenticación

      for (const cursoId of cursosUnicos) {
        try {
          // Verificar evaluación teórica
          const { data: dataTeorica } = await supabase
            .from("evaluacion_teorica")
            .select("calificacion")
            .eq("fk_curso", cursoId)
            .eq("fk_operador", userId)
            .single();

          // Verificar evaluación práctica
          const { data: dataPractica } = await supabase
            .from("evaluacion_practica")
            .select("calificacion")
            .eq("fk_curso", cursoId)
            .eq("fk_operador", userId)
            .single();

          // Obtener información del curso
          const { data: dataCurso } = await supabase
            .from("cursos")
            .select("titulo_curso")
            .eq("pk_curso", cursoId)
            .single();

          evaluacionesStatus.value.push({
            curso_id: cursoId,
            nombre_curso: dataCurso?.titulo_curso || 'Curso sin nombre',
            teorica_aprobada: dataTeorica?.calificacion >= 14,
            practica_aprobada: dataPractica?.calificacion >= 11,
            calificacion_teorica: dataTeorica?.calificacion,
            calificacion_practica: dataPractica?.calificacion
          });
        } catch (error) {
          console.error(`Error al cargar estado de evaluaciones para curso ${cursoId}:`, error);
        }
      }
    };

    const puedeDescargarCertificado = (certificado) => {
      const status = evaluacionesStatus.value.find(s => s.curso_id === certificado.fk_curso);
      return status?.teorica_aprobada && status?.practica_aprobada;
    };

    const getMensajeDescarga = (certificado) => {
      const status = evaluacionesStatus.value.find(s => s.curso_id === certificado.fk_curso);
      if (!status) return "Error al verificar estado";
      if (!status.teorica_aprobada && !status.practica_aprobada) {
        return "Debe aprobar ambas evaluaciones para descargar el certificado";
      }
      if (!status.teorica_aprobada) return "Debe aprobar la evaluación teórica";
      if (!status.practica_aprobada) return "Debe aprobar la evaluación práctica";
      return "Descargar certificado";
    };

    const descargarCertificado = async (certificado) => {
      if (!puedeDescargarCertificado(certificado)) {
        alert("No cumple con los requisitos para descargar el certificado");
        return;
      }

      try {
        const { publicURL, error } = supabase.storage
          .from("Certificado")
          .getPublicUrl(certificado.documento_adjunto);

        if (error) throw error;
        window.open(publicURL, "_blank");
      } catch (error) {
        console.error("Error al descargar el certificado:", error.message);
        alert("Error al descargar el certificado");
      }
    };

    const formatDate = (date) => {
      if (!date) return "No especificado";
      return new Date(date).toLocaleDateString();
    };

    const getEstadoClass = (certificado) => {
      if (puedeDescargarCertificado(certificado)) return 'disponible';
      return 'pendiente';
    };

    const getEstadoText = (certificado) => {
      if (puedeDescargarCertificado(certificado)) return 'Disponible';
      return 'Pendiente de Aprobación';
    };

    onMounted(() => {
      cargarCertificados();
    });

    return {
      certificados,
      evaluacionesStatus,
      descargarCertificado,
      formatDate,
      puedeDescargarCertificado,
      getMensajeDescarga,
      getEstadoClass,
      getEstadoText
    };
  },
};
</script>

<style scoped>
.certificados-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 28px;
  color: #333;
}

h2 {
  font-size: 24px;
  color: #444;
}

/* Estado de Evaluaciones */
.evaluaciones-status {
  margin-bottom: 40px;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.status-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-card h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.status-item.aprobado {
  background-color: #e8f5e9;
}

.status-label {
  font-weight: 500;
  color: #666;
}

.status-value {
  font-weight: 600;
}

.status-score {
  font-size: 0.9em;
  color: #666;
}

/* Tabla de Certificados */
.certificados-table-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.certificados-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.certificados-table th,
.certificados-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.certificados-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.certificados-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

/* Estado Badge */
.estado-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
}

.estado-badge.disponible {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.estado-badge.pendiente {
  background-color: #fff3e0;
  color: #ef6c00;
}

/* Botones */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-descargar {
  background-color: #007bff;
  color: white;
}

.btn-descargar:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-descargar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Mensaje sin certificados */
.no-certificados {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .certificados-container {
    padding: 10px;
  }

  .certificados-table {
    display: block;
    overflow-x: auto;
  }

  .status-cards {
    grid-template-columns: 1fr;
  }

  .status-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>

</boltArtifact>

