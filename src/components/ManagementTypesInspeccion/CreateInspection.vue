<template>
  <div>
    <el-form :model="form" :rules="rules" ref="createForm" label-width="120px" enctype="multipart/form-data">
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="form.nombre"></el-input>
      </el-form-item>

      <el-form-item label="Descripción" prop="descripcion">
        <el-input v-model="form.descripcion"></el-input>
      </el-form-item>

      <el-form-item label="Tipo de Maquinaria" prop="tipo_maquinaria_id">
        <el-select v-model="form.tipo_maquinaria_id" placeholder="Selecciona tipo de maquinaria" clearable>
          <el-option v-for="maquinaria in maquinarias" :key="maquinaria.id" :label="maquinaria.descripcion"
            :value="maquinaria.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="Subir Imagen (Opcional)">
        <el-upload class="upload-demo" ref="upload" action="" :auto-upload="false" :show-file-list="false"
          :on-change="handleFileChange">
          <el-button size="small" type="primary">Seleccionar Imagen</el-button>
          <div v-if="fileName">{{ fileName }}</div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="createInspection">Crear</el-button>
        <!-- Aquí emitimos el evento 'close' para cerrar el diálogo al presionar cancelar -->
        <el-button @click="emit('close')">Cancelar</el-button>
      </el-form-item>
    </el-form>

    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon></el-alert>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { ElMessage } from 'element-plus'
import { GetUser } from '@/auth'

// Se recibe el objeto `emit` de los props
const emit = defineEmits(['created', 'close'])

const form = ref({
  nombre: '',
  descripcion: '',
  tipo_maquinaria_id: null,
  imagen: null // Archivo de imagen
})

const maquinarias = ref([]) // Arreglo para almacenar los tipos de maquinaria
const errorMessage = ref('')
const fileName = ref('') // Nombre del archivo de imagen seleccionado
const file = ref(null) // Variable para almacenar el archivo seleccionado

// Reglas de validación para el formulario (sin hacer la imagen obligatoria)
const rules = {
  nombre: [{ required: true, message: 'El nombre es obligatorio', trigger: 'blur' }],
  descripcion: [{ required: true, message: 'La descripción es obligatoria', trigger: 'blur' }],
  tipo_maquinaria_id: [{ required: true, message: 'Debe seleccionar un tipo de maquinaria', trigger: 'change' }]
}

const createForm = ref(null)

// Función para traer los tipos de maquinaria desde Supabase
async function fetchMaquinarias() {
  const { data, error } = await supabase
    .from('tipo_de_maquinaria')
    .select('*')

  if (error) {
    errorMessage.value = 'Error al cargar los tipos de maquinaria'
    console.error('Error fetching maquinarias:', error)
  } else {
    maquinarias.value = data
  }
}

// Función para manejar la selección de archivos de imagen
function handleFileChange(file) {
  form.value.imagen = file.raw
  fileName.value = file.name
}

// Función para subir la imagen al bucket "ImagenesServicios" en Supabase (opcional)
async function uploadImage(file) {
  if (!file) return null // Si no se seleccionó una imagen, retornamos null

  const { data, error } = await supabase.storage
    .from('ImagenesServicios')
    .upload(`inspecciones/${Date.now()}_${file.name}`, file)

  if (error) {
    throw new Error('Error al subir la imagen: ' + error.message)
  }

  const { publicURL, error: urlError } = supabase
    .storage
    .from('ImagenesServicios')
    .getPublicUrl(data.path)

  if (urlError) {
    throw new Error('Error al obtener la URL de la imagen: ' + urlError.message)
  }

  return publicURL
}

// Función para crear una nueva inspección
async function createInspection() {
  try {
    // Validate the form before proceeding
    await createForm.value.validate()

    // Subir la imagen si se ha seleccionado una y obtener la URL pública (null si no hay imagen)
    const imageUrl = await uploadImage(form.value.imagen)

    // Obtener el usuario actual
    const autor = GetUser()

    // Check if the name already exists in the database
    const { data, error: checkError } = await supabase
      .from('tipo_de_inspeccion')
      .select('*')
      .eq('nombre', form.value.nombre)

    if (checkError) {
      console.error('Error checking duplicate:', checkError.message)
      throw new Error('Error checking for duplicates')
    }

    if (data.length > 0) {
      throw new Error('El nombre de tipo de inspección ya existe')
    }

    // Insert the new record into the tipo_de_inspeccion table
    const { error } = await supabase
      .from('tipo_de_inspeccion')
      .insert({
        nombre: form.value.nombre,
        descripcion: form.value.descripcion,
        tipo_de_maquinaria_id: form.value.tipo_maquinaria_id,
        autor: autor,
        ultimo_autor: autor,
        URL_IMG: imageUrl || null
      });

    if (error) {
      console.error('Error:', error.message);
      throw new Error('Error al crear el tipo de inspección: ' + error.message);
    }

    // Success message
    ElMessage.success('Tipo de Inspección creado con éxito')

    // Emit event to refresh data
    form.value = { nombre: '', descripcion: '', tipo_maquinaria_id: null, imagen: null }
    fileName.value = ''
    errorMessage.value = ''
    emit('created')

  } catch (err) {
    errorMessage.value = err.message || 'Error desconocido'
  }

}

// Montar el componente y cargar los tipos de maquinaria
onMounted(() => {
  fetchMaquinarias()
})
</script>

<style scoped>
.el-form {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
}
</style>
