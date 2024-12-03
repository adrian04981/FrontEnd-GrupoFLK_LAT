<template>
  <div class="create-evaluation-container">
    <img src="@/assets/SELLO_FLK.png" alt="Logo FLK" class="logo" />
    <h2>Creación de Evaluación</h2>

    <form @submit.prevent="guardarEvaluacion" class="evaluation-form">
      <div v-for="(pregunta, index) in preguntas" :key="index" class="pregunta-container">
        <div class="form-group">
          <label :for="'pregunta-' + index">Pregunta {{ index + 1 }}</label>
          <input
            type="text"
            v-model="pregunta.enunciado"
            :id="'pregunta-' + index"
            placeholder="Escriba el enunciado de la pregunta"
            required
          />
        </div>

        <div class="form-group">
          <label>Opciones:</label>
          <div v-for="i in 4" :key="i">
            <input
              type="text"
              v-model="pregunta.opciones[i - 1]"
              :placeholder="'Opción ' + i"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label :for="'respuestaCorrecta-' + index">Respuesta Correcta</label>
          <select
            v-model="pregunta.respuestaCorrecta"
            :id="'respuestaCorrecta-' + index"
            required
          >
            <option value="" disabled selected>Seleccione la respuesta correcta</option>
            <option v-for="(opcion, i) in pregunta.opciones" :key="i" :value="i">
              {{ opcion || `Opción ${i + 1}` }}
            </option>
          </select>
        </div>
      </div>

      <div class="button-container">
        <button 
          type="button" 
          @click="agregarPregunta" 
          :disabled="preguntas.length >= 15"
          class="editar-button"
        >
          Agregar Pregunta ({{ preguntasFaltantes }})
        </button>
        <button 
          type="submit" 
          class="guardar-button"
          :disabled="!esFormularioValido || !cumpleMinimoPreguntasRequeridas"
        >
          Guardar Evaluación
        </button>
      </div>

      <div v-if="mostrarMensajeValidacion" class="mensaje-validacion">
        <p v-if="!cumpleMinimoPreguntasRequeridas">
          Se requieren {{ preguntasFaltantes }} preguntas más para completar la evaluación.
        </p>
        <p v-if="!todasPreguntasCompletas">
          Por favor complete todos los campos en las preguntas existentes.
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { supabase } from '@/supabase';

export default {
  name: 'CreateEvaluation',
  setup() {
    const preguntas = ref([{
      enunciado: '',
      opciones: ['', '', '', ''],
      respuestaCorrecta: ''
    }]);

    const preguntasFaltantes = computed(() => {
      return 15 - preguntas.value.length;
    });

    const todasPreguntasCompletas = computed(() => {
      return preguntas.value.every(pregunta => 
        pregunta.enunciado.trim() !== '' &&
        pregunta.opciones.every(opcion => opcion.trim() !== '') &&
        pregunta.respuestaCorrecta !== ''
      );
    });

    const cumpleMinimoPreguntasRequeridas = computed(() => {
      return preguntas.value.length >= 15;
    });

    const esFormularioValido = computed(() => {
      return todasPreguntasCompletas.value;
    });

    const mostrarMensajeValidacion = computed(() => {
      return !cumpleMinimoPreguntasRequeridas.value || !todasPreguntasCompletas.value;
    });

    const agregarPregunta = () => {
      if (preguntas.value.length < 15) {
        preguntas.value.push({
          enunciado: '',
          opciones: ['', '', '', ''],
          respuestaCorrecta: ''
        });
      }
    };

    const guardarEvaluacion = async () => {
      if (!esFormularioValido.value || !cumpleMinimoPreguntasRequeridas.value) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('evaluaciones')
          .insert([{
            preguntas: preguntas.value,
            fecha_creacion: new Date().toISOString()
          }])
          .select();

        if (error) throw error;

        alert('Evaluación guardada exitosamente');
        preguntas.value = [{
          enunciado: '',
          opciones: ['', '', '', ''],
          respuestaCorrecta: ''
        }];
      } catch (error) {
        console.error('Error al guardar la evaluación:', error);
        alert('Error al guardar la evaluación');
      }
    };

    return {
      preguntas,
      preguntasFaltantes,
      esFormularioValido,
      cumpleMinimoPreguntasRequeridas,
      mostrarMensajeValidacion,
      todasPreguntasCompletas,
      agregarPregunta,
      guardarEvaluacion
    };
  }
};
</script>

<style scoped>
.create-evaluation-container {
  max-width: 800px;
  text-align: left;
  padding-left: 50px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f3e2;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 10px;
  margin-top: -58px;
  font-size: 24px;
}

.logo {
  width: 200px;
  height: auto;
  margin-left: auto;
  display: block;
}

.form-group {
  margin-bottom: 20px;
}

.pregunta-container {
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.guardar-button {
  background-color: #2196f3;
  color: white;
}

.guardar-button:hover:not(:disabled) {
  background-color: #1e88e5;
}

.editar-button {
  background-color: #f57c00;
  color: white;
}

.editar-button:hover:not(:disabled) {
  background-color: #e65100;
}

.mensaje-validacion {
  margin-top: 20px;
  padding: 10px;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  color: #856404;
}

@media (max-width: 768px) {
  .create-evaluation-container {
    padding: 15px;
  }

  .button-container {
    flex-direction: column;
  }

  button {
    width: 100%;
    margin-bottom: 10px;
    margin-right: 0;
  }
}
</style>