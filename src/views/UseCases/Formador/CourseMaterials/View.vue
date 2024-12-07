<template>
  <div class="upload-container">
    <h2>Subir Materiales</h2>

    <!-- Selección de Curso -->
    <div class="form-group">
      <label for="curso">Selecciona un Curso</label>
      <select v-model="selectedCurso" @change="fetchMaterials">
        <option value="" disabled>Seleccione un curso</option>
        <option v-for="curso in cursos" :key="curso.pk_curso" :value="curso.pk_curso">
          {{ curso.titulo_curso }}
        </option>
      </select>
    </div>

    <!-- Subir Archivo -->
    <div class="file-upload">
      <label for="archivo">Selecciona un Archivo</label>
      <input type="file" @change="handleFileUpload" />
    </div>

    <!-- Botón de Subida -->
    <button class="upload-button" @click="subirMaterial">Subir Material</button>

    <!-- Tabla de materiales -->
    <div class="tabla-materiales">
      <h3>Materiales del Curso Seleccionado</h3>
      <table class="table-rigth" v-if="materiales.length > 0">
        <thead>
          <tr>
            <th>Título del Curso</th>
            <th>Fecha de Publicación</th>
            <th>Documento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="material in materiales" :key="material.pk_material">
            <td>{{ material.titulo_curso }}</td>
            <td>{{ new Date(material.fecha_publicacion).toLocaleString() }}</td>
            <td>
              <a :href="material.ruta_documento" target="_blank">Ver Documento</a>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No hay materiales cargados para este curso.</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "@/supabase";

export default {
  name: "SubirMateriales",
  setup() {
    const file = ref(null);
    const selectedCurso = ref(""); // ID del curso seleccionado
    const cursos = ref([]);
    const materiales = ref([]);

    // Obtener cursos disponibles
    const fetchCursos = async () => {
      try {
        const { data, error } = await supabase
          .from("cursos")
          .select("pk_curso, titulo_curso");

        if (error) throw error;
        cursos.value = data;
      } catch (error) {
        console.error("Error al cargar cursos:", error.message);
      }
    };

    // Obtener materiales del curso seleccionado
    const fetchMaterials = async () => {
      if (!selectedCurso.value) return;
      try {
        const { data, error } = await supabase
          .from("materialesxcurso")
          .select("pk_material, fk_curso, ruta_documento, fecha_publicacion, cursos (titulo_curso)")
          .eq("fk_curso", selectedCurso.value);

        if (error) throw error;

        materiales.value = data.map((material) => ({
          pk_material: material.pk_material,
          titulo_curso: material.cursos.titulo_curso,
          fecha_publicacion: material.fecha_publicacion,
          ruta_documento: material.ruta_documento,
        }));
      } catch (error) {
        console.error("Error al cargar materiales:", error.message);
      }
    };

    // Manejar selección de archivo
    const handleFileUpload = (event) => {
      file.value = event.target.files[0];
    };

    // Subir archivo al bucket y guardar en la tabla
    const subirMaterial = async () => {
      if (!file.value || !selectedCurso.value) {
        alert("Seleccione un curso y un archivo antes de continuar.");
        return;
      }

      try {
        // Obtener el usuario actual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          alert("Usuario no autenticado. Por favor, inicie sesión.");
          return;
        }

        // Generar una ruta única para el archivo
        const filePath = `cursos/${selectedCurso.value}/${file.value.name}`;

        // Subir el archivo al bucket
        const { error: uploadError } = await supabase.storage
          .from("Materiales_Curso")
          .upload(filePath, file.value, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Obtener la URL pública del archivo
        const { data: publicUrlData } = supabase.storage
          .from("Materiales_Curso")
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error("No se pudo obtener la URL pública del archivo.");
        }

        // Guardar los detalles en la tabla `materialesxcurso`
        const { error: insertError } = await supabase.from("materialesxcurso").insert({
          fk_curso: selectedCurso.value,
          ruta_documento: publicUrlData.publicUrl,
          fecha_publicacion: new Date(),
          autor: user.id,
          ultimo_autor: user.id,
          estado: true,
        });

        if (insertError) throw insertError;

        alert("Material subido y registrado con éxito.");
        fetchMaterials(); // Refrescar materiales
      } catch (error) {
        console.error("Error al subir el material:", error.message);
        alert("Hubo un error al subir el material. Inténtelo de nuevo.");
      }
    };

    // Cargar los cursos al montar el componente
    fetchCursos();

    return {
      file,
      selectedCurso,
      cursos,
      materiales,
      handleFileUpload,
      subirMaterial,
      fetchMaterials,
    };
  },
};
</script>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0px;
}

select,
input[type="file"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.upload-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 9px;
  cursor: pointer;
}

h3 {
  color: #0c0c0c;
  margin-bottom: 40px;
  font-size: 24px;
  margin-right: -200px;
}

.upload-button:hover {
  background-color: #45a049;
}

.tabla-materiales {
  margin-top: 20px;
  margin-left: -150px;
  margin-right: 100px;
}

table {
  color: rgb(3, 3, 3);
  width: 150%; /* Ajusta el ancho de la tabla */
  border-collapse: collapse; /* Elimina espacios entre bordes */
  margin: 0; /* Elimina márgenes predeterminados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra alrededor */
  margin-left: auto; /* Configura para centrar o mover a la izquierda */
  margin-right: auto; /* Configura para centrar o mover a la derecha */
}

tbody tr:nth-child(odd) {
  background-color: #f1ef9d; /* Color de fondo para filas impares */
}

tbody tr:nth-child(even) {
  background-color: #f1ef9d; /* Color de fondo para filas pares */
}

thead th {
  background-color: #4991df;
  color: rgb(243, 241, 241);
  padding: 9px;
  text-align: left;
}

tbody td {
  padding: 15px;
  border: 1px solid #ddd;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
