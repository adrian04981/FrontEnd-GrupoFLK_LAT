<template>
  <div>
    <el-form ref="serviceForm" label-width="100px" class="service-form">
      <el-form-item label="Nombre">
        <el-input v-model="service.nombre" placeholder="Ingrese nombre del servicio" />
      </el-form-item>
      
      <el-form-item label="Tipo_Maquinaria">
        <el-select v-model="service.tipo_de_maquinaria_id" placeholder="Seleccione un tipo de maquinaria">
          <el-option v-for="item in maquinariaOptions" :key="item.id" :label="item.descripcion" :value="item.id" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Descripción">
        <el-input v-model="service.descripcion" placeholder="Ingrese descripción del servicio" />
      </el-form-item>
      
      <el-form-item label="Imagen">
        <input type="file" @change="handleFileChange" accept="image/*" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="registerService">Registrar</el-button>
        <el-button @click="$emit('closeModal')">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import supabase from '@/supabase';
import { GetUser } from '@/auth';

export default {
  setup(_, { emit }) {
    const service = ref({
      nombre: '',
      tipo_de_maquinaria_id: null,
      descripcion: '',
      autor: GetUser(),
      ultimo_autor: GetUser(),
      URL_IMG: '',
    });
    const selectedFile = ref(null);
    const maquinariaOptions = ref([]);
    
    // URL base de Supabase
    const BASE_URL = "https://qyfrfgcefvwpkqtzjjxi.supabase.co/storage/v1/object/public/ServiciosDeInspeccion/imagenes/";

    // Función para generar la URL de la imagen a partir del nombre
    const generateImageUrl = (imageName) => {
      const encodedImageName = encodeURIComponent(imageName);
      return `${BASE_URL}${encodedImageName}`;
    };

    const fetchMaquinariaOptions = async () => {
      const { data, error } = await supabase.from('tipo_de_maquinaria').select('id, descripcion');
      if (error) {
        console.error('Error al obtener tipos de maquinaria:', error.message);
      } else {
        maquinariaOptions.value = data;
      }
    };

    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0];
    };

    const registerService = async () => {
      if (!service.value.autor || !service.value.ultimo_autor) {
        alert('Error: Usuario no autenticado.');
        return;
      }

      if (!selectedFile.value) {
        alert('Seleccione una imagen');
        return;
      }

      // Subida de imagen a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('ServiciosDeInspeccion')
        .upload(`imagenes/${selectedFile.value.name}`, selectedFile.value);

      if (uploadError) {
        console.error('Error al subir la imagen:', uploadError.message);
        return;
      }

      // Generar la URL de la imagen automáticamente usando el nombre del archivo
      service.value.URL_IMG = generateImageUrl(selectedFile.value.name);
      
      // Insertar el servicio en la tabla Tipo_de_Inspeccion
      const { error } = await supabase.from('tipo_de_inspeccion').insert([service.value]);

      if (error) {
        console.error('Error al registrar servicio:', error.message);
        alert(`Error al registrar el servicio: ${error.message}`);
      } else {
        alert('Servicio registrado exitosamente');
        emit('refreshTable'); // Emitir evento para actualizar la tabla en Listar.vue
        emit('closeModal'); // Emitir evento para cerrar el modal
      }
    };

    onMounted(fetchMaquinariaOptions);

    return {
      service,
      selectedFile,
      maquinariaOptions,
      handleFileChange,
      registerService,
    };
  },
};
</script>

<style scoped>
.service-form {
  max-width: 400px;
  margin: auto;
}
</style>
