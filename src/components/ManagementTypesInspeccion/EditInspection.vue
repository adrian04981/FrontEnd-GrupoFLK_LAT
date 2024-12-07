<template>
  <el-form :model="form" label-width="120px" class="inspection-form">
    <el-form-item label="Nombre">
      <el-input v-model="form.Nombre" placeholder="Nombre"></el-input>
    </el-form-item>
    <el-form-item label="Descripción">
      <el-input v-model="form.Descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <!-- Campo de carga de archivos -->
    <el-form-item label="Subir Imagen">
      <el-upload
        class="upload-demo"
        action=""
        :on-change="handleFileChange"
        :file-list="fileList"
        :auto-upload="false"
        list-type="picture-card">
        <el-button>Seleccionar Imagen</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="neon-button" @click="handleSubmit">Actualizar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, watch } from 'vue'
import { supabase } from '@/supabase'
import { GetUser } from '@/auth'

export default {
  props: ['inspection'],
  setup(props, { emit }) {
    const form = ref({
      Nombre: '',
      Descripcion: '',
      URL_IMG: '',
      userId: GetUser()
    });

    const fileList = ref([]);
    const selectedFile = ref(null);

    const handleFileChange = (file) => {
      selectedFile.value = file.raw;
    };

    const uploadImage = async () => {
      if (!selectedFile.value) return '';

      const filePath = `ImagenesInspecciones/${Date.now()}_${selectedFile.value.name}`;
      const { error } = await supabase.storage
        .from('ImagenesInspecciones')
        .upload(filePath, selectedFile.value);

      if (error) {
        console.error('Error al subir la imagen:', error.message);
        return '';
      }

      const { publicURL } = supabase.storage
        .from('ImagenesInspecciones')
        .getPublicUrl(filePath);

      return publicURL;
    };

    watch(() => props.inspection, (newVal) => {
      if (newVal) {
        form.value.Nombre = newVal.nombre;
        form.value.Descripcion = newVal.descripcion;
      }
    }, { immediate: true });

    const handleSubmit = async () => {
      try {
        const imageUrl = await uploadImage();
        form.value.URL_IMG = imageUrl;

        const { data, error } = await supabase
          .from('tipo_de_inspeccion')
          .update({
            nombre: form.value.Nombre,
            descripcion: form.value.Descripcion,
            URL_IMG: form.value.URL_IMG,
            ultimo_autor: form.value.userId
          })
          .eq('id', props.inspection.id);

        if (error) throw error;
        emit('updated');
      } catch (error) {
        console.error('Error al actualizar:', error.message);
      }
    };

    return {
      form,
      handleSubmit,
      handleFileChange,
      fileList
    };
  }
}
</script>

<style scoped>
.inspection-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.upload-demo {
  width: 100%;
  margin-bottom: 20px;
}

@media screen and (max-width: 768px) {
  .inspection-form {
    padding: 10px;
  }

  .neon-button {
    width: 100%;
  }
}
</style>