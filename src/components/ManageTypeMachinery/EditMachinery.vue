<template>
  <el-form :model="form" label-width="120px" class="machinery-form">
    <el-form-item label="Descripción">
      <el-input v-model="form.descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <el-form-item class="form-actions">
      <el-button type="primary" class="neon-button" @click="handleSubmit">Actualizar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, watch } from 'vue'
import { supabase } from '@/supabase'

export default {
  props: ['machinery'],
  setup(props, { emit }) {
    const form = ref({
      descripcion: ''
    })

    // Actualiza el formulario cuando cambia la maquinaria seleccionada
    watch(() => props.machinery, (newVal) => {
      if (newVal) {
        form.value.descripcion = newVal.descripcion
      }
    }, { immediate: true })

    const handleSubmit = async () => {
      try {
        const { data, error } = await supabase
          .from('tipo_de_maquinaria')
          .update({
            descripcion: form.value.descripcion,
            ultimo_autor: GetUser() // Actualiza el último autor al usuario autenticado
          })
          .eq('id', props.machinery.id)

        if (error) throw error
        emit('updated')
      } catch (error) {
        console.error('Error al actualizar:', error.message)
      }
    }

    return {
      form,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.machinery-form {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .machinery-form {
    width: 100%;
    margin: 0 auto;
  }
  
  .form-actions {
    justify-content: space-between;
    flex-direction: column;
  }

  .neon-button {
    width: 100%;
  }
}
</style>