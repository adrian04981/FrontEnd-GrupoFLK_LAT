<template>
  <div class="container">
    <h1 class="page-title">Crear Evaluación Práctica</h1>
    <form @submit.prevent="submitEvaluacion" class="evaluacion-form">
      <!-- Seleccionar Curso -->
      <div class="curso-container">
        <label for="fk_curso" class="curso-label">Curso</label>
        <select id="fk_curso" v-model="fk_curso" required class="curso-select">
          <option value="" disabled>Selecciona un curso</option>
          <option v-for="curso in cursos" :key="curso.pk_curso" :value="curso.pk_curso">
            {{ curso.titulo_curso }}
          </option>
        </select>
      </div>

      <!-- Seleccionar Operador -->
      <div class="operador-container">
        <label for="fk_operador" class="operador-label">Operador</label>
        <select id="fk_operador" v-model="fk_operador" required class="operador-select">
          <option value="" disabled>Selecciona un operador</option>
          <option v-for="operador in operadores" :key="operador.Pk_Alumno" :value="operador.Pk_Alumno">
            {{ operador.nombre }}
          </option>
        </select>
      </div>

      <!-- Enunciados y Respuestas -->
      <div v-for="(enunciado, index) in enunciados" :key="index" class="enunciado-container">
        <label :for="'enunciado-' + index" class="enunciado-label">
          {{ index + 1 }}. {{ enunciado }}
        </label>
        <div class="respuesta-options">
          <label>
            <input type="radio" :name="'respuesta-' + index" :value="'Sí'" v-model="respuestas[index]" required />
            Sí
          </label>
          <label>
            <input type="radio" :name="'respuesta-' + index" :value="'No'" v-model="respuestas[index]" />
            No
          </label>
        </div>
      </div>

      <!-- Observaciones -->
      <div class="observaciones-container">
        <label for="observaciones" class="observaciones-label">Observaciones</label>
        <textarea id="observaciones" v-model="observaciones"
          placeholder="Ingrese observaciones detalladas sobre el desempeño del operador" class="observaciones-input"
          rows="4"></textarea>
      </div>

      <!-- Galería de Fotos -->
      <div class="galeria-container">
        <label for="fotos" class="galeria-label">Fotos de la Evaluación</label>
        <input type="file" id="fotos" @change="handleFotosUpload" accept="image/*" multiple class="galeria-input" />
        <div v-if="fotosPreview.length > 0" class="preview-container">
          <div v-for="(url, index) in fotosPreview" :key="'foto-' + index" class="preview-item">
            <img :src="url" alt="Preview" class="preview-image" />
            <button type="button" @click="removeFoto(index)" class="remove-button">×</button>
          </div>
        </div>
      </div>

      <!-- Galería de Videos -->
      <div class="galeria-container">
        <label for="videos" class="galeria-label">Videos de la Evaluación</label>
        <input type="file" id="videos" @change="handleVideosUpload" accept="video/*" multiple class="galeria-input" />
        <div v-if="videosPreview.length > 0" class="preview-container">
          <div v-for="(url, index) in videosPreview" :key="'video-' + index" class="preview-item">
            <video :src="url" controls class="preview-video"></video>
            <button type="button" @click="removeVideo(index)" class="remove-button">×</button>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="form-buttons">
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Guardando...' : 'Guardar Evaluación' }}
        </button>
        <button type="button" @click="cancelar" class="btn-cancel" :disabled="isSubmitting">
          Cancelar
        </button>
      </div>

      <!-- Mensaje de Progreso -->
      <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
        <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
        <span class="progress-text">Subiendo archivos: {{ uploadProgress }}%</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { supabase } from "@/supabase.js";

const enunciados = ref([
  "¿El operador conoce las reglas de seguridad?",
  "¿El operador usa equipo de protección personal?",
  "¿El operador sigue los procedimientos correctamente?",
]);

const respuestas = ref(Array(enunciados.value.length).fill(null));
const observaciones = ref("");
const fk_curso = ref(null);
const fk_operador = ref(null);
const cursos = ref([]);
const operadores = ref([]);
const fotos = ref([]);
const fotosPreview = ref([]);
const videos = ref([]);
const videosPreview = ref([]);
const isSubmitting = ref(false);
const uploadProgress = ref(0);

const createPreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

const handleFotosUpload = async (event) => {
  const newFiles = Array.from(event.target.files);
  fotos.value = [...fotos.value, ...newFiles];

  for (const file of newFiles) {
    const preview = await createPreview(file);
    fotosPreview.value.push(preview);
  }
};

const handleVideosUpload = async (event) => {
  const newFiles = Array.from(event.target.files);
  videos.value = [...videos.value, ...newFiles];

  for (const file of newFiles) {
    const preview = await createPreview(file);
    videosPreview.value.push(preview);
  }
};

const removeFoto = (index) => {
  fotos.value = fotos.value.filter((_, i) => i !== index);
  fotosPreview.value = fotosPreview.value.filter((_, i) => i !== index);
};

const removeVideo = (index) => {
  videos.value = videos.value.filter((_, i) => i !== index);
  videosPreview.value = videosPreview.value.filter((_, i) => i !== index);
};

// Función para obtener los cursos
const fetchCursos = async () => {
  const { data, error } = await supabase.from("cursos").select("pk_curso, titulo_curso");
  if (!error) {
    cursos.value = data;
  } else {
    console.error("Error al obtener cursos:", error.message);
  }
};

// Función para obtener los operadores por curso
const fetchOperadores = async (fk_curso) => {
  if (!fk_curso) return;

  // Obtener las matrículas del curso
  const { data: matriculas, error: matriculasError } = await supabase
    .from("matriculas")
    .select("fk_operador")
    .eq("fk_curso", fk_curso);

  if (matriculasError) {
    console.error("Error al obtener las matrículas:", matriculasError.message);
    return;
  }

  // Obtener los operadores basándonos en los fk_operador
  const operadoresIds = matriculas.map(matricula => matricula.fk_operador);

  if (operadoresIds.length > 0) {
    const { data: operadoresData, error: operadoresError } = await supabase
      .from("Operador")
      .select("Pk_Alumno, nombre")
      .in("Pk_Alumno", operadoresIds);

    if (operadoresError) {
      console.error("Error al obtener los operadores:", operadoresError.message);
      return;
    }

    // Verificar la estructura de la respuesta y acceder directamente al array
    operadores.value = operadoresData || [];
    console.log(operadores.value); // Verifica que aquí ya estás obteniendo un array plano
  } else {
    operadores.value = []; // No hay operadores si no hay matrículas
  }
};

// Watch para detectar cuando cambia el curso seleccionado
watch(fk_curso, (newCurso) => {
  if (newCurso) {
    fetchOperadores(newCurso);
  } else {
    operadores.value = []; // Limpiar operadores si no hay curso seleccionado
  }
});

const uploadFile = async (file, bucket, folder) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data.path;
};

const submitEvaluacion = async () => {
  try {
    isSubmitting.value = true;

    const totalFiles = fotos.value.length + videos.value.length;
    let filesProcessed = 0;
    const fotosPaths = [];
    const videosPaths = [];

    // Subir fotos
    for (const foto of fotos.value) {
      const path = await uploadFile(foto, 'evaluaciones', 'fotos');
      fotosPaths.push(path);
      filesProcessed++;
      uploadProgress.value = (filesProcessed / totalFiles) * 100;
    }

    // Subir videos
    for (const video of videos.value) {
      const path = await uploadFile(video, 'evaluaciones', 'videos');
      videosPaths.push(path);
      filesProcessed++;
      uploadProgress.value = (filesProcessed / totalFiles) * 100;
    }

    // Guardar evaluación
    const { error } = await supabase.from("evaluacion_practica").insert({
      fk_curso: fk_curso.value,
      fk_operador: fk_operador.value,
      enunciados: enunciados.value,
      respuestas: respuestas.value,
      observaciones: observaciones.value,
      galeria: fotosPaths,
      video: videosPaths,
      fecha_creacion: new Date(),
    });

    if (error) throw error;

    alert("Evaluación registrada con éxito");
    limpiarFormulario();
  } catch (error) {
    console.error("Error al registrar evaluación:", error.message);
    alert("Hubo un error al registrar la evaluación.");
  } finally {
    isSubmitting.value = false;
    uploadProgress.value = 0;
  }
};

const limpiarFormulario = () => {
  respuestas.value = Array(enunciados.value.length).fill(null);
  observaciones.value = "";
  fk_curso.value = null;
  fk_operador.value = null;
  fotos.value = [];
  fotosPreview.value = [];
  videos.value = [];
  videosPreview.value = [];
};

const cancelar = () => {
  limpiarFormulario();
  alert("Evaluación cancelada.");
};

onMounted(() => {
  fetchCursos();
});
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
}

.evaluacion-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.curso-container,
.operador-container,
.enunciado-container,
.observaciones-container,
.galeria-container {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.curso-label,
.operador-label,
.enunciado-label,
.observaciones-label,
.galeria-label {
  display: block;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.curso-select,
.operador-select,
.observaciones-input,
.galeria-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.observaciones-input {
  resize: vertical;
  min-height: 100px;
}

.respuesta-options {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
}

.preview-image,
.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #e74c3c;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit {
  background-color: #4caf50;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #d32f2f;
}

.upload-progress {
  margin-top: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  height: 24px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 0.875rem;
  font-weight: 500;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .form-buttons {
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
  }
}
</style>