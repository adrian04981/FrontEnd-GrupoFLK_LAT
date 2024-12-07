<template>
  <div class="form-container">
    <!-- Lista de Cursos -->
    <div v-if="!mostrarEvaluacion">
      <h1>Mis Cursos</h1>
      <div class="carta-curso" v-for="(curso, index) in cursos" :key="index">
        <h2>{{ curso.titulo_curso }}</h2>
        <button @click="iniciarEvaluacion(curso)" class="iniciar-evaluacion">
          Iniciar Evaluación
        </button>
      </div>
    </div>

    <!-- Examen Teórico -->
    <div v-if="mostrarEvaluacion">
      <h1>Examen Teórico - {{ cursoSeleccionado.titulo_curso }}</h1>
      <form @submit.prevent="submitAnswers" class="form">
        <div v-for="(pregunta, index) in preguntas" :key="pregunta.id" class="pregunta">
          <h3>{{ index + 1 }}. {{ pregunta.enunciado }}</h3>
          <div v-for="(opcion, idx) in pregunta.opciones" :key="idx" class="opcion">
            <label>
              <input type="radio" :name="'pregunta-' + pregunta.id" :value="opcion" v-model="respuestas[pregunta.id]"
                required />
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

      <div v-if="puntajeTotal < 14" class="mensaje-practica">
        <p><strong>Lo siento</strong>, no has alcanzado el puntaje mínimo para realizar la evaluación práctica. Sigue
          intentándolo.</p>
      </div>
      <div class="resultados-detalle">
        <h2>Detalle de Respuestas</h2>
        <div v-for="(resultado, index) in resultados" :key="resultado.id" class="resultado-item">
          <div class="resultado-header">
            <span class="pregunta-numero">Pregunta {{ index + 1 }}</span>
            <span class="resultado-badge"
              :class="resultado.correcta === resultado.respuesta ? 'correcto' : 'incorrecto'">
              {{ resultado.correcta === resultado.respuesta ? '✓ Correcto' : '✗ Incorrecto' }}
            </span>
          </div>
          <div class="resultado-content">
            <p class="pregunta-texto">{{ resultado.enunciado }}</p>
            <div class="respuestas-container">
              <div class="respuesta-item">
                <span class="respuesta-label">Tu respuesta:</span>
                <span class="respuesta-valor"
                  :class="resultado.correcta === resultado.respuesta ? 'texto-correcto' : 'texto-incorrecto'">
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

      <!-- Mensaje de evaluación práctica -->
      <div v-if="puntajeTotal >= 14" class="mensaje-practica">
        <p><strong>¡Felicidades!</strong> Has aprobado la evaluación teórica con un puntaje suficiente. Eres apto para
          realizar la evaluación práctica. ¡Mucha suerte!</p>
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
      mostrarEvaluacion: false,
      resultados: [],
      puntajeTotal: 0,
      cursos: [], // Array para almacenar todos los cursos
      cursoSeleccionado: null, // Curso seleccionado para iniciar evaluación
      operador: null,
    };
  },
  async created() {
    try {
      // Obtener la sesión del usuario logueado
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        console.error('Usuario no autenticado');
        return;
      }

      const usuarioEmail = session.user.email;

      const response = await supabase
        .from('Operador')
        .select('*')
        .eq('correo_electronico', usuarioEmail)

      if (!response) {
        console.error('Error al obtener el operador:', response);
        return;
      }

      // Obtener la matrícula de los cursos en los que está matriculado el operador
      const { data: matriculas, error: matriculasError } = await supabase
        .from('matriculas')
        .select('fk_curso')
        .eq('fk_operador', response.data[0].Pk_Alumno);


      this.operador = response.data[0].Pk_Alumno
      if (matriculasError) {
        console.error('Error al obtener las matrículas:', matriculasError.message);
        return;
      }

      if (matriculas.length === 0) {
        console.error('El usuario no está matriculado en ningún curso');
        return;
      }

      // Obtener los cursos de las matrículas
      const cursosPromises = matriculas.map(async (matricula) => {
        const { data: cursoData, error: cursoError } = await supabase
          .from('cursos')
          .select('*')
          .eq('pk_curso', matricula.fk_curso)
          .single();

        if (cursoError) {
          console.error('Error al obtener el curso:', cursoError.message);
          return null;
        }

        return cursoData;
      });

      const cursosData = await Promise.all(cursosPromises);
      this.cursos = cursosData.filter(curso => curso !== null); // Filtrar nulls si hubo algún error en la consulta

      // Obtener las preguntas del curso
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
    iniciarEvaluacion(curso) {
      this.cursoSeleccionado = curso;
      this.mostrarEvaluacion = true;
    },
    async submitAnswers() {
      // Validar que todas las preguntas tengan respuesta
      const todasRespondidas = this.preguntas.every(pregunta =>
        this.respuestas[pregunta.id] !== undefined
      );

      if (!todasRespondidas) {
        alert('Por favor, responde todas las preguntas antes de enviar.');
        return;
      }

      const respuestasArray = Object.keys(this.respuestas).map((id) => ({
        pregunta_id: parseInt(id),
        respuesta: this.respuestas[id],
        curso_id: this.cursoSeleccionado.pk_curso,
        operador_id: this.operador,
        fecha_envio: new Date().toISOString(),
      }));

      try {
        const { data, error } = await supabase.from('respuestas').insert(respuestasArray);

        if (error) {
          console.error('Error al enviar respuestas:', error);
          alert('Hubo un error al enviar las respuestas.');
          return;
        }

        // Procesar resultados con validación más precisa
        this.resultados = this.preguntas.map((pregunta) => {
          const respuestaUsuario = this.respuestas[pregunta.id];
          const esCorrecta = respuestaUsuario === pregunta.respuesta_correcta;

          return {
            id: pregunta.id,
            enunciado: pregunta.enunciado,
            correcta: pregunta.respuesta_correcta,
            respuesta: respuestaUsuario || 'No respondida',
            esCorrecta: esCorrecta
          };
        });

        // Calcular puntaje total basado en respuestas correctas
        this.puntajeTotal = this.resultados.filter(resultado => resultado.esCorrecta).length;

        // Mostrar vista de resultados
        this.mostrarResultados = true;
        this.mostrarEvaluacion = false;
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
.carta-curso {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.carta-curso h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.mensaje-practica {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
  font-size: 1.1rem;
  color: #333;
}

.mensaje-practica strong {
  font-weight: bold;
}

.mensaje-practica p {
  margin: 0;
}

.carta-curso p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 20px;
}

.iniciar-evaluacion {
  background-color: #4CAF50;
  color: white;
  font-size: 1.1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.iniciar-evaluacion:hover {
  background-color: #45a049;
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
  font-weight: 600;
}

.texto-correcto {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.texto-incorrecto {
  background-color: #ffebee;
  color: #c62828;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  font-size: 1.2rem;
  padding: 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
