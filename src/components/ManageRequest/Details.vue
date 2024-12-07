<template>
  <div class="container">
    <h1 class="page-title">Detalles de la Solicitud</h1>
    <div v-if="solicitud" class="detalle-solicitud">
      <!-- Información de la solicitud -->
      <p><strong>Nombre Completo:</strong> {{ solicitud.nombre_completo }}</p>
      <p><strong>DNI:</strong> {{ solicitud.dni }}</p>
      <p><strong>Fecha de Nacimiento:</strong> {{ formatFecha(solicitud.fecha_nacimiento) }}</p>
      <p><strong>Dirección:</strong> {{ solicitud.direccion }}</p>
      <p><strong>Número Telefónico:</strong> {{ solicitud.nro_telefonico }}</p>
      <p><strong>Teléfono de Contacto:</strong> {{ solicitud.telefono_contacto }}</p>
      <p><strong>Correo Electrónico:</strong> {{ solicitud.correo_electronico }}</p>
      <p><strong>Nacionalidad:</strong> {{ solicitud.nacionalidad }}</p>
      <p><strong>Ocupación Actual:</strong> {{ solicitud.ocupacion_actual }}</p>
      <p><strong>Nombre de Empresa:</strong> {{ solicitud.nombre_empresa }}</p>
      <p><strong>Cargo Actual:</strong> {{ solicitud.cargo_actual }}</p>
      <p><strong>Experiencia con Maquinaria:</strong> {{ solicitud.experiencia_maquinaria }}</p>
      <p><strong>Nombre del Contacto de Emergencia:</strong> {{ solicitud.nombre_contacto_emergencia }}</p>
      <p><strong>Relación con Contacto de Emergencia:</strong> {{ solicitud.relacion_contacto_emergencia }}</p>
      <p><strong>Teléfono de Contacto de Emergencia:</strong> {{ solicitud.telefono_contacto_emergencia }}</p>
      <p><strong>Curso Solicitado:</strong> {{ solicitud.cursos?.titulo_curso || 'Sin título de curso' }}</p>
      <p><strong>Fecha de Inicio Preferida:</strong> {{ formatFecha(solicitud.fecha_inicio_preferida) }}</p>
      <p><strong>Turno Preferido:</strong> {{ solicitud.turno_preferido }}</p>
      <p><strong>Alergias o Condiciones:</strong> {{ solicitud.alergias_condiciones }}</p>
      <p><strong>Necesidades Especiales:</strong> {{ solicitud.necesidades_especiales }}</p>
      <p><strong>Consentimiento de Participación:</strong> {{ solicitud.consentimiento_participacion ? 'Sí' : 'No' }}</p>
      <p><strong>Autorización de Imagen:</strong> {{ solicitud.autorizacion_imagen ? 'Sí' : 'No' }}</p>
      <p><strong>Fecha de Solicitud:</strong> {{ formatFecha(solicitud.fecha_solicitud) }}</p>
      <p><strong>Consentimiento para Tratamiento de Datos:</strong> {{ solicitud.consentimiento_tratamiento_datos ? 'Sí' : 'No' }}</p>
      <p><strong>Firma:</strong> {{ solicitud.firma }}</p>

      <!-- Adjuntos -->
      <div v-if="solicitud.dni_adjunto">
        <p><strong>DNI Adjunto:</strong></p>
        <img :src="solicitud.dni_adjunto" alt="DNI Adjunto" class="imagen-adjunta" />
      </div>

      <div v-if="solicitud.certificado_medico_adjunto">
        <p><strong>Certificado Médico Adjunto:</strong></p>
        <img :src="solicitud.certificado_medico_adjunto" alt="Certificado Médico Adjunto" class="imagen-adjunta" />
      </div>

      <div v-if="solicitud.licencia_conducir_adjunto">
        <p><strong>Licencia de Conducir Adjunto:</strong></p>
        <img :src="solicitud.licencia_conducir_adjunto" alt="Licencia de Conducir Adjunto" class="imagen-adjunta" />
      </div>

      <!-- Botón de Cerrar -->
      <button @click="$router.push({ path: '/admin-dashboard/ManageRequest' })" class="card-btn">Cerrar</button>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";

export default {
  name: "DetallesSolicitud",
  data() {
    return {
      solicitud: null,
    };
  },
  async mounted() {
    const solicitudId = this.$route.query.id;

    if (!solicitudId) {
      console.error("ID de solicitud no encontrado en la URL.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("solicitud_capacitacion")
        .select(
          `*, 
           cursos!fk_curso (titulo_curso)` // Especificar la relación
        )
        .eq("id_solicitud", solicitudId)
        .single();

      if (error) throw error;

      this.solicitud = data;
    } catch (error) {
      console.error("Error al cargar los detalles de la solicitud:", error);
    }
  },
  methods: {
    formatFecha(fecha) {
      if (!fecha) return "Sin fecha";
      const date = new Date(fecha);
      return date.toLocaleDateString("es-ES");
    },
  },
};
</script>


<style scoped>
.container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.page-title {
  font-size: 2rem;
  color: #34495e;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.detalle-solicitud {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  font-size: 1rem;
  color: #2c3e50;
}

.detalle-solicitud p {
  margin: 0;
  background-color: #f7f9fc;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.detalle-solicitud p strong {
  color: #2980b9;
}

.imagen-adjunta {
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  background-color: #1A5276;
  color: white;
  transition: all 0.3s ease;
}

.card-btn:hover {
  background-color: #2980b9;
}
</style>
