<template>
  <div class="container">
    <h1>Verificar Inspección</h1>
    <h2>Inspección #{{ inspectionId }}</h2>

    <div v-for="(respuesta, index) in respuestas" :key="respuesta.id" class="respuesta-item">
      <strong>{{ index + 1 }}. {{ respuesta.pregunta }}</strong>
      <div class="options">
        <label>
          <input
            type="radio"
            :name="'estado_' + respuesta.id"
            value="true"
            v-model="respuesta.estado"
          />
          Sí
        </label>
        <label>
          <input
            type="radio"
            :name="'estado_' + respuesta.id"
            value="false"
            v-model="respuesta.estado"
          />
          No
        </label>
      </div>
      <textarea
        v-model="respuesta.respuesta"
        placeholder="Añadir observaciones (opcional)"
        class="textarea"
      ></textarea>
    </div>

    <div class="actions">
      <button @click="confirmSubmit" class="submit-btn">Registrar Verificación</button>
      <button @click="cancel" class="cancel-btn">Cancelar</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/supabase";
import { GetUser } from "@/auth";

export default {
  name: "VerificarInspeccion",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const inspectionId = parseInt(route.params.id, 10); // Obtener inspeccion_id de la URL
    const respuestas = ref([]);
    const userId = GetUser();

    const fetchRespuestas = async () => {
      try {
        const { data, error } = await supabase.rpc("obtener_respuestas_por_inspeccion", {
          p_inspeccion_id: inspectionId,
        });

        if (error) {
          console.error("Error al obtener respuestas:", error.message);
          return;
        }

        respuestas.value = data.map((item) => ({
          id: item.id,
          pregunta: item.pregunta,
          estado: item.estado,
          respuesta: item.respuesta || "",
        }));
      } catch (error) {
        console.error("Error inesperado al cargar respuestas.");
      }
    };

    const confirmSubmit = async () => {
      const esApto = respuestas.value.filter((resp) => resp.estado === true).length >= (respuestas.value.length * 0.8);

      try {
        for (const respuesta of respuestas.value) {
          const { error } = await supabase
            .from("evaluaciones_x_inspeccion")
            .update({
              estado: respuesta.estado,
              respuesta: respuesta.respuesta,
              ultimo_autor: userId,
              fecha_de_modificacion: new Date(),
            })
            .eq("id", respuesta.id);

          if (error) {
            console.error("Error al actualizar respuesta:", error.message);
            return;
          }
        }

        const { error: updateError } = await supabase
          .from("inspeccion")
          .update({
            Estado: esApto ? "apto" : "observado",
            ultimo_autor: userId,
            fecha_de_modificacion: new Date(),
          })
          .eq("id", inspectionId);

        if (updateError) {
          console.error("Error al actualizar inspección:", updateError.message);
          return;
        }

        alert(`Inspección registrada como ${esApto ? "Apto" : "Observado"}.`);
        router.push("/operations-assistant-dashboard/VisitasAsignadas");
      } catch (error) {
        console.error("Error inesperado al registrar inspección:", error);
      }
    };

    const cancel = () => {
      router.push("/operations-assistant-dashboard/VisitasAsignadas");
    };

    onMounted(() => {
      fetchRespuestas();
    });

    return {
      inspectionId,
      respuestas,
      confirmSubmit,
      cancel,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

.respuesta-item {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.options {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.textarea {
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.actions {
  text-align: center;
  margin-top: 20px;
}

.submit-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  margin-right: 10px;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}
</style>