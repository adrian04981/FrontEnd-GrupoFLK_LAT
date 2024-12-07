<template>
  <el-container>
    <el-header>
      <h1>Realizar Inspección</h1>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24" style="text-align: center;">
          <h2>Inspección #{{ inspectionId }}</h2>
        </el-col>
      </el-row>

      <!-- Mostrar Preguntas -->
      <el-row>
        <el-col :span="24">
          <div v-for="(pregunta, index) in preguntas" :key="pregunta.pregunta_id" class="pregunta-item">
            <strong>{{ index + 1 }}. {{ pregunta.pregunta }}</strong>
            <el-radio-group
              v-model="answers[pregunta.pregunta_id].estado"
              style="margin-top: 10px; display: flex; justify-content: center;"
            >
              <el-radio-button :value="true">Sí</el-radio-button>
              <el-radio-button :value="false">No</el-radio-button>
            </el-radio-group>

            <!-- Mostrar cuadro de texto si la respuesta es "Sí" o "No" y permitir ingresar una respuesta opcional -->
            <el-input
              v-if="answers[pregunta.pregunta_id].estado !== null"
              type="text"
              v-model="answers[pregunta.pregunta_id].respuesta"
              placeholder="Ingrese una respuesta opcional"
              style="margin-top: 10px;"
            />
          </div>
        </el-col>
      </el-row>

      <!-- Botones de acciones -->
      <el-row style="margin-top: 20px; text-align: center;">
        <el-col :span="24">
          <el-button type="success" size="large" @click="confirmSubmit">
            Enviar Respuestas
          </el-button>
          <el-button type="danger" size="large" @click="cancel">
            Cancelar
          </el-button>
        </el-col>
      </el-row>

      <!-- Modal de Confirmación -->
      <div v-if="showConfirmModal" class="modal-overlay">
        <div class="modal-content">
          <p>¿Está seguro de que desea enviar las respuestas?</p>
          <div class="modal-actions">
            <el-button type="danger" @click="closeConfirmModal">Cancelar</el-button>
            <el-button type="primary" @click="submitAnswers">Confirmar</el-button>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/supabase";
import { ElMessage } from "element-plus";
import { GetUser } from "@/auth";

export default {
  name: "RealizarInspeccion",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const inspectionId = parseInt(route.params.id, 10); // Obtener inspeccion_id de la URL
    const preguntas = ref([]);
    const answers = ref({});
    const showConfirmModal = ref(false);
    const userId = GetUser();

    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase.rpc("obtener_preguntas_por_inspeccion", {
          p_inspeccion_id: inspectionId,
        });

        if (error) {
          ElMessage.error("Error al obtener preguntas: " + error.message);
        } else {
          preguntas.value = data;
          data.forEach((pregunta) => {
            answers.value[pregunta.pregunta_id] = {
              estado: null,
              respuesta: "",
            };
          });
        }
      } catch (error) {
        ElMessage.error("Error inesperado al cargar preguntas.");
        console.error(error);
      }
    };

    const confirmSubmit = () => {
      const incomplete = Object.values(answers.value).some((answer) => answer.estado === null);
      if (incomplete) {
        ElMessage.error("Debe responder todas las preguntas antes de enviar.");
        return;
      }
      showConfirmModal.value = true; // Mostrar modal de confirmación
    };

    const closeConfirmModal = () => {
      showConfirmModal.value = false; // Cerrar modal de confirmación
    };

    const submitAnswers = async () => {
      try {
        const payload = Object.entries(answers.value).map(([preguntaId, answer]) => ({
          pregunta_id: parseInt(preguntaId, 10),
          respuesta: answer.respuesta || null,
          estado: answer.estado,
        }));

        const { error } = await supabase.rpc("registrar_respuestas_inspeccion", {
          p_inspeccion_id: inspectionId,
          p_respuestas: payload,
          p_autor: userId,
        });

        if (error) {
          ElMessage.error("Error al enviar respuestas: " + error.message);
          return;
        }

        ElMessage.success("Respuestas enviadas exitosamente.");
        showConfirmModal.value = false; // Cerrar modal
        router.push("/operations-assistant-dashboard/VisitasAsignadas"); // Redirigir
      } catch (error) {
        console.error("Error inesperado al enviar respuestas:", error);
        ElMessage.error("Error inesperado al enviar respuestas.");
      }
    };

    const cancel = () => {
      router.push("/operations-assistant-dashboard/VisitasAsignadas");
    };

    onMounted(() => {
      fetchQuestions();
    });

    return {
      inspectionId,
      preguntas,
      answers,
      showConfirmModal,
      confirmSubmit,
      closeConfirmModal,
      submitAnswers,
      cancel,
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

h2 {
  margin: 10px 0;
  font-size: 20px;
}

.pregunta-item {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
</style>
