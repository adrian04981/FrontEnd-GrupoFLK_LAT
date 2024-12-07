<template>
  <div>
    <h3>Editar Servicio</h3>
    <el-form ref="editForm" label-width="120px" class="edit-form">
      <el-form-item label="Nombre del Servicio">
        <el-input v-model="editedService.nombre" placeholder="Ingrese el nombre del servicio" />
      </el-form-item>
      
      <el-form-item label="Tipo de Maquinaria">
        <el-select v-model="editedService.tipo_de_maquinaria_id" placeholder="Seleccione el tipo de maquinaria">
          <el-option v-for="item in maquinariaOptions" :key="item.id" :label="item.descripcion" :value="item.id" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Descripción">
        <el-input v-model="editedService.descripcion" placeholder="Ingrese la descripción del servicio" />
      </el-form-item>
      
      <el-form-item label="Imagen">
        <input type="file" @change="handleFileChange" accept="image/*" />
        <p v-if="editedService.URL_IMG">Imagen actual: <a :href="editedService.URL_IMG" target="_blank">{{ editedService.URL_IMG }}</a></p>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="updateService">Guardar Cambios</el-button>
        <el-button @click="$emit('closeModal')">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import supabase from '@/supabase';
import { GetUser } from '@/auth';

export default {
  props: {
    service: Object, // Servicio a editar
  },
  emits: ['serviceUpdated', 'closeModal'],
  setup(props, { emit }) {
    // Crear una copia editable del servicio que se pasa como prop
    const editedService = ref({ ...props.service });
    const maquinariaOptions = ref([]);
    const selectedFile = ref(null);

    // Observar cambios en `props.service` y actualizar `editedService` en consecuencia
    watch(
      () => props.service,
      (newService) => {
        editedService.value = { ...newService };
      },
      { immediate: true }
    );

    // Cargar opciones de maquinaria
    const fetchMaquinariaOptions = async () => {
      const { data, error } = await supabase.from('tipo_de_maquinaria').select('id, descripcion');
      if (error) {
        console.error('Error al obtener tipos de maquinaria:', error.message);
      } else {
        maquinariaOptions.value = data;
      }
    };

    // Manejo de cambio de archivo
    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0];
    };

    // Genera la URL de la imagen basada en el nombre del archivo
    const generateImageUrl = (imageName) => {
      const BASE_URL = "https://qyfrfgcefvwpkqtzjjxi.supabase.co/storage/v1/object/public/ServiciosDeInspeccion/imagenes/";
      return `${BASE_URL}${encodeURIComponent(imageName)}`;
    };

    // Función para actualizar el servicio
    const updateService = async () => {
      if (!editedService.value.nombre || !editedService.value.tipo_de_maquinaria_id || !editedService.value.descripcion) {
        alert('Por favor complete todos los campos');
        return;
      }

      // Si se ha seleccionado un nuevo archivo, subirlo y actualizar la URL de la imagen
      if (selectedFile.value) {
        const { error: uploadError } = await supabase.storage
          .from('ServiciosDeInspeccion')
          .upload(`imagenes/${selectedFile.value.name}`, selectedFile.value);

        if (uploadError) {
          console.error('Error al subir la imagen:', uploadError.message);
          alert(`Error al subir la imagen: ${uploadError.message}`);
          return;
        }

        // Actualizar la URL de la imagen en el servicio
        editedService.value.URL_IMG = generateImageUrl(selectedFile.value.name);
      }

      // Actualizar el campo `ultimo_autor`
      editedService.value.ultimo_autor = GetUser();

      // Actualizar el servicio en la base de datos
      const { error } = await supabase
        .from('tipo_de_inspeccion')
        .update({
          nombre: editedService.value.nombre,
          tipo_de_maquinaria_id: editedService.value.tipo_de_maquinaria_id,
          descripcion: editedService.value.descripcion,
          ultimo_autor: editedService.value.ultimo_autor,
          URL_IMG: editedService.value.URL_IMG,
        })
        .eq('id', editedService.value.id);

      if (error) {
        console.error('Error al actualizar el servicio:', error.message);
        alert(`Error al actualizar el servicio: ${error.message}`);
      } else {
        alert('Servicio actualizado con éxito');
        emit('serviceUpdated'); // Emitir evento para actualizar la lista de servicios
        emit('closeModal'); // Cerrar el modal
      }
    };

    onMounted(fetchMaquinariaOptions);

    return {
      editedService,
      maquinariaOptions,
      handleFileChange,
      updateService,
    };
  },
};
</script>

<style scoped>
.edit-form {
  max-width: 400px;
  margin: auto;
}
</style>
