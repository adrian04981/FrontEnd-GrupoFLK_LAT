<template>
  <div class="delete-container">
    <p>¿Está seguro de que desea eliminar este tipo de inspección?</p>
    <div class="delete-actions">
      <el-button type="danger" :loading="isDeleting" @click="handleDelete">Eliminar</el-button>
      <el-button @click="$emit('close')" :disabled="isDeleting">Cancelar</el-button>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'
import { ElMessage } from 'element-plus'

export default {
  props: {
    inspectionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isDeleting: false // Estado de eliminación
    };
  },
  methods: {
    async handleDelete() {
      this.isDeleting = true; // Mostrar el spinner y deshabilitar los botones

      try {
        const { error } = await supabase
          .from('tipo_de_inspeccion')
          .delete()
          .eq('id', this.inspectionId)

        if (error) throw error;

        // Mostrar mensaje de éxito
        ElMessage.success('Tipo de inspección eliminado correctamente');
        
        // Emitir evento para que el componente padre refresque la lista y cierre el diálogo
        this.$emit('deleted');  // Refrescar el componente LIST
        this.$emit('close');    // Cerrar el diálogo de eliminación
      } catch (error) {
        // Mostrar mensaje de error si ocurre algún problema
        ElMessage.error('Error al eliminar el tipo de inspección: ' + error.message);
        console.error('Error al eliminar:', error.message);
      } finally {
        this.isDeleting = false; // Reiniciar estado de eliminación
      }
    }
  }
}
</script>
<style scoped>
.delete-container {
  text-align: center;
  padding: 20px;
}

.delete-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

@media screen and (max-width: 768px) {
  .delete-actions {
    flex-direction: column;
  }

  .el-button {
    width: 100%;
  }
}
</style>
