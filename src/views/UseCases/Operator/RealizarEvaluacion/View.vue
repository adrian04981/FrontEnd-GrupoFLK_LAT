<template>
  <div class="form-container">
    <!-- Examen Teórico -->
    <div v-if="!mostrarResultados">
      <h1>Examen Teórico</h1>
      <form @submit.prevent="submitAnswers" class="form">
        <div v-for="(pregunta, index) in preguntas" :key="pregunta.id" class="pregunta">
          <h3>{{ index + 1 }}. {{ pregunta.enunciado }}</h3>
          <div v-for="(opcion, idx) in pregunta.opciones" :key="idx" class="opcion">
            <label>
              <input
                type="radio"
                :name="'pregunta-' + pregunta.id"
                :value="opcion"
                v-model="respuestas[pregunta.id]"
                required
              />
              {{ opcion }}
            </label>
          </div>
        </div>
        <button type="submit" class="submit-button">Enviar Respuestas</button>
      </form>
    </div>

    <!-- Resultados del Examen -->
    <div v-if="mostrarResultados" class="vista-resultados">
      <h1>Resultados del Examen</h1>
      
      <!-- Resumen de Resultados -->
      <div class="resultados-summary">
        <div class="score-card" :class="getScoreClass(puntajeTotal, preguntas.length)">
          <h2>Puntaje Final</h2>
          <div class="score">{{ puntajeTotal }} / {{ preguntas.length }}</div>
          <div class="percentage">
            {{ Math.round((puntajeTotal / preguntas.length) * 100) }}%
          </div>
          <div class="status">
            {{ puntajeTotal >= (preguntas.length * 0.7) ? '¡Aprobado!' : 'No Aprobado' }}
          </div>
        </div>
        
        <div class="stats-container">
          <div class="stat-item correct">
            <span class="stat-value">{{ puntajeTotal }}</span>
            <span class="stat-label">Correctas</span>
          </div>
          <div class="stat-item incorrect">
            <span class="stat-value">{{ preguntas.length - puntajeTotal }}</span>
            <span class="stat-label">Incorrectas</span>
          </div>
        </div>
      </div>

      <!-- Tabla Detallada de Respuestas -->
      <div class="resultados-detalle">
        <h2>Detalle de Respuestas</h2>
        <div v-for="(resultado, index) in resultados" :key="resultado.id" class="resultado-item">
          <div class="resultado-header">
            <span class="pregunta-numero">Pregunta {{ index + 1 }}</span>
            <span 
              class="resultado-badge"
              :class="resultado.correcta === resultado.respuesta ? 'correcto' : 'incorrecto'"
            >
              {{ resultado.correcta === resultado.respuesta ? '✓ Correcto' : '✗ Incorrecto' }}
            </span>
          </div>
          
          <div class="resultado-content">
            <p class="pregunta-texto">{{ resultado.enunciado }}</p>
            <div class="respuestas-container">
              <div class="respuesta-item">
                <span class="respuesta-label">Tu respuesta:</span>
                <span 
                  class="respuesta-valor"
                  :class="resultado.correcta === resultado.respuesta ? 'texto-correcto' : 'texto-incorrecto'"
                >
                  {{ resultado.respuesta }}
                </span>
              </div>
              <div class="respuesta-item" v-if="resultado.correcta !== resultado.respuesta">
                <span class="respuesta-label">Respuesta correcta:</span>
                <span class="respuesta-valor texto-correcto">{{ resultado.correcta }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";

export default {
  data() {
    return {
      preguntas: [],
      respuestas: {},
      mostrarResultados: false,
      resultados: [],
      puntajeTotal: 0,
    };
  },
  async created() {
    try {
      const { data, error } = await supabase
        .from('preguntas_teoricas')
        .select('id, enunciado, opciones, respuesta_correcta');

      if (error) {
        console.error('Error al obtener las preguntas:', error);
        return;
      }

      this.preguntas = data.map((pregunta) => ({
        ...pregunta,
        opciones: pregunta.opciones,
      }));
    } catch (error) {
      console.error('Error general:', error);
    }
  },
  methods: {
    async submitAnswers() {
      const respuestasArray = Object.keys(this.respuestas).map((id) => ({
        pregunta_id: parseInt(id),
        respuesta: this.respuestas[id],
        fecha_envio: new Date().toISOString(),
      }));

      try {
        const { data, error } = await supabase.from('respuestas').insert(respuestasArray);

        if (error) {
          console.error('Error al enviar respuestas:', error);
          alert('Hubo un error al enviar las respuestas.');
          return;
        }

        // Procesar resultados
        this.resultados = this.preguntas.map((pregunta) => ({
          id: pregunta.id,
          enunciado: pregunta.enunciado,
          correcta: pregunta.respuesta_correcta,
          respuesta: this.respuestas[pregunta.id] || 'No respondida',
        }));

        // Calcular puntaje
        this.puntajeTotal = this.resultados.filter(
          (resultado) => resultado.correcta === resultado.respuesta
        ).length;

        this.mostrarResultados = true;
      } catch (error) {
        console.error('Error general al enviar:', error);
        alert('Error inesperado al enviar las respuestas.');
      }
    },
    getScoreClass(score, total) {
      const percentage = (score / total) * 100;
      if (percentage >= 70) return 'score-aprobado';
      return 'score-reprobado';
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Estilos existentes */
h1 {
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
}

.pregunta {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pregunta h3 {
  font-size: 1.1rem;
  color: #555;
}

.opcion {
  margin-left: 20px;
  font-size: 1rem;
  color: #555;
}

/* Nuevos estilos para la vista de resultados */
.resultados-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.score-card {
  flex: 1;
  min-width: 250px;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: white;
}

.score-aprobado {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.score-reprobado {
  background: linear-gradient(135deg, #f44336, #e53935);
}

.score {
  font-size: 3rem;
  font-weight: bold;
  margin: 10px 0;
}

.percentage {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.status {
  font-size: 1.2rem;
  font-weight: 500;
}

.stats-container {
  flex: 1;
  min-width: 250px;
  display: flex;
  gap: 15px;
}

.stat-item {
  flex: 1;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-item.correct {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.stat-item.incorrect {
  background-color: #ffebee;
  color: #c62828;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
}

.stat-label {
  font-size: 1rem;
  margin-top: 5px;
}

.resultados-detalle {
  margin-top: 30px;
}

.resultado-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.resultado-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pregunta-numero {
  font-weight: 600;
  color: #666;
}

.resultado-badge {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
}

.resultado-badge.correcto {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.resultado-badge.incorrecto {
  background-color: #ffebee;
  color: #c62828;
}

.resultado-content {
  padding: 10px 0;
}

.pregunta-texto {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 15px;
}

.respuestas-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.respuesta-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.respuesta-label {
  font-weight: 500;
  color: #666;
  min-width: 120px;
}

.respuesta-valor {
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.texto-correcto {
  color: #2e7d32;
}

.texto-incorrecto {
  color: #c62828;
}

/* Estilos responsivos */
@media (max-width: 600px) {
  .form-container {
    padding: 15px;
  }

  .resultados-summary {
    flex-direction: column;
  }

  .stats-container {
    flex-direction: row;
  }

  .resultado-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .respuesta-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>