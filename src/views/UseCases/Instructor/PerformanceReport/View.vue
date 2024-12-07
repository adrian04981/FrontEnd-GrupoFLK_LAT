<template>
    <div class="container">
      <h1 class="page-title">Calificar Evaluación del Operador</h1>
      <form @submit.prevent="submitCalificacion" class="calificacion-form">
        <!-- Seleccionar Evaluación -->
        <div class="evaluacion-container">
          <label for="fk_evaluacion" class="evaluacion-label">Evaluación</label>
          <select
            id="fk_evaluacion"
            v-model="fk_evaluacion"
            required
            class="evaluacion-select"
            @change="fetchEvaluacionDetalles"
          >
            <option value="" disabled>Selecciona una evaluación</option>
            <option v-for="evaluacion in evaluaciones" :key="evaluacion.pk_evaluacion_practica" :value="evaluacion.pk_evaluacion_practica">
              Operador: {{ evaluacion.nombre_operador }} - Curso: {{ evaluacion.titulo_curso }}
            </option>
          </select>
        </div>
  
        <!-- Detalles de la evaluación -->
        <div v-if="evaluacionDetalles" class="evaluacion-detalles">
          <h3>Detalles de la Evaluación</h3>
          <p><strong>Operador:</strong> {{ evaluacionDetalles.nombre_operador }}</p>
          <p><strong>Curso:</strong> {{ evaluacionDetalles.titulo_curso }}</p>
          <p><strong>Observaciones:</strong> {{ evaluacionDetalles.observaciones }}</p>
        </div>
  
        <!-- Calificación -->
        <div class="calificacion-container">
          <label for="puntaje_total" class="calificacion-label">Puntaje Total</label>
          <input
            type="number"
            id="puntaje_total"
            v-model="puntaje_total"
            min="0"
            max="20"
            required
            class="calificacion-input"
          />
        </div>
  
        <div class="resultado-container">
          <label for="resultado_evaluacion" class="resultado-label">Resultado</label>
          <select id="resultado_evaluacion" v-model="resultado_evaluacion" required class="resultado-select">
            <option value="" disabled>Selecciona el resultado</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Desaprobado">Desaprobado</option>
          </select>
        </div>
  
        <!-- Botones -->
        <div class="form-buttons">
          <button type="submit" class="btn-submit">Guardar Calificación</button>
          <button type="button" @click="cancelar" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { supabase } from "@/supabase.js";
  
  export default {
    setup() {
      const evaluaciones = ref([]);
      const evaluacionDetalles = ref(null);
      const fk_evaluacion = ref(null);
      const puntaje_total = ref(null);
      const resultado_evaluacion = ref("");
  
      // Obtener evaluaciones disponibles
      const fetchEvaluaciones = async () => {
        const { data, error } = await supabase
          .from("evaluacion_practica")
          .select("pk_evaluacion_practica, fk_operador, fk_curso, observaciones")
          .eq("resultado_evaluacion", null); // Solo mostrar evaluaciones sin calificar
  
        if (!error) {
          // Obtener nombres de operadores y cursos
          const operadores = await supabase.from("operadores").select("Pk_Alumno, nombre");
          const cursos = await supabase.from("cursos").select("pk_curso, titulo_curso");
  
          evaluaciones.value = data.map((evaluacion) => {
            const operador = operadores.data.find((op) => op.Pk_Alumno === evaluacion.fk_operador);
            const curso = cursos.data.find((cu) => cu.pk_curso === evaluacion.fk_curso);
  
            return {
              ...evaluacion,
              nombre_operador: operador ? operador.nombre : "Desconocido",
              titulo_curso: curso ? curso.titulo_curso : "Desconocido",
            };
          });
        } else {
          console.error("Error al obtener evaluaciones:", error.message);
        }
      };
  
      // Obtener detalles de una evaluación seleccionada
      const fetchEvaluacionDetalles = async () => {
        if (!fk_evaluacion.value) return;
  
        const { data, error } = await supabase
          .from("evaluacion_practica")
          .select("fk_operador, fk_curso, observaciones")
          .eq("pk_evaluacion_practica", fk_evaluacion.value)
          .single();
  
        if (!error) {
          const operador = await supabase
            .from("operadores")
            .select("nombre")
            .eq("Pk_Alumno", data.fk_operador)
            .single();
  
          const curso = await supabase
            .from("cursos")
            .select("titulo_curso")
            .eq("pk_curso", data.fk_curso)
            .single();
  
          evaluacionDetalles.value = {
            ...data,
            nombre_operador: operador.data.nombre,
            titulo_curso: curso.data.titulo_curso,
          };
        } else {
          console.error("Error al obtener detalles de la evaluación:", error.message);
        }
      };
  
      // Guardar calificación y generar certificado si corresponde
      const submitCalificacion = async () => {
        if (puntaje_total.value === null || resultado_evaluacion.value === "") {
          alert("Por favor, complete todos los campos.");
          return;
        }
  
        try {
          // Actualizar la evaluación práctica
          const { error } = await supabase
            .from("evaluacion_practica")
            .update({
              puntaje_total: puntaje_total.value,
              resultado_evaluacion: resultado_evaluacion.value,
            })
            .eq("pk_evaluacion_practica", fk_evaluacion.value);
  
          if (error) throw error;
  
          // Generar certificado si aplica
          if (puntaje_total.value >= 11 && resultado_evaluacion.value === "Aprobado") {
            await generarCertificado();
          }
  
          alert("Calificación guardada con éxito");
          resetForm();
        } catch (error) {
          console.error("Error al guardar calificación:", error.message);
          alert("Hubo un error al guardar la calificación.");
        }
      };
  
      // Generar certificado
      const generarCertificado = async () => {
        try {
          const { error } = await supabase.from("certificados").insert({
            fk_operador: evaluacionDetalles.value.fk_operador,
            fk_curso: evaluacionDetalles.value.fk_curso,
            fecha_emision: new Date(),
            fecha_vencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
          });
  
          if (error) throw error;
  
          alert("Certificado generado con éxito.");
        } catch (error) {
          console.error("Error al generar certificado:", error.message);
          alert("Hubo un error al generar el certificado.");
        }
      };
  
      // Resetear formulario
      const resetForm = () => {
        fk_evaluacion.value = null;
        puntaje_total.value = null;
        resultado_evaluacion.value = "";
        evaluacionDetalles.value = null;
      };
  
      // Cancelar acción
      const cancelar = () => {
        resetForm();
        alert("Calificación cancelada.");
      };
  
      // Cargar evaluaciones al montar
      onMounted(() => {
        fetchEvaluaciones();
      });
  
      return {
        evaluaciones,
        evaluacionDetalles,
        fk_evaluacion,
        puntaje_total,
        resultado_evaluacion,
        submitCalificacion,
        cancelar,
        fetchEvaluacionDetalles,
      };
    },
  };
  </script>
  <style scoped>
  /* Contenedor principal */
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  /* Título de la página */
  .page-title {
    font-size: 2rem;
    color: #333;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: bold;
  }
  
  /* Formulario */
  .calificacion-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  /* Campos de selección */
  .evaluacion-container,
  .calificacion-container,
  .resultado-container {
    display: flex;
    flex-direction: column;
  }
  
  .evaluacion-label,
  .calificacion-label,
  .resultado-label {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .evaluacion-select,
  .calificacion-input,
  .resultado-select {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
  }
  
  .evaluacion-select:focus,
  .calificacion-input:focus,
  .resultado-select:focus {
    border-color: #007bff;
    outline: none;
  }
  
  /* Detalles de la evaluación */
  .evaluacion-detalles {
    padding: 1rem;
    background-color: #eef6ff;
    border-left: 4px solid #007bff;
    border-radius: 5px;
    color: #333;
  }
  
  .evaluacion-detalles h3 {
    margin-top: 0;
    color: #007bff;
    font-weight: bold;
  }
  
  .evaluacion-detalles p {
    margin: 0.5rem 0;
    font-size: 1rem;
  }
  
  /* Botones */
  .form-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .btn-submit {
    background-color: #4caf50;
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .btn-submit:hover {
    background-color: #388e3c;
    transform: scale(1.05);
  }
  
  .btn-cancel {
    background-color: #f44336;
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .btn-cancel:hover {
    background-color: #d32f2f;
    transform: scale(1.05);
  }
  
  /* Estilo general para inputs y selects */
  input,
  select {
    width: 100%;
    box-sizing: border-box;
  }
  
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  </style>