<template>
  <el-form :model="form" label-width="120px" class="machinery-form">
    <el-form-item label="Descripción">
      <el-input v-model="form.descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <el-form-item class="form-actions">
      <el-button type="primary" class="neon-button" @click="handleSubmit">Guardar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { GetUser } from '@/auth'

export default {
  setup(props, { emit }) {
    const form = ref({
      descripcion: '',
      userId: GetUser() // Obtiene el ID del usuario actual para asignarlo a 'autor' y 'ultimo_autor'
    })

    const handleSubmit = async () => {
      try {
        const autor = JSON.parse(localStorage.getItem('user'));
        if (!autor) {
          throw new Error("No se ha encontrado el autor en el localStorage.");
        }
        const { data, error } = await supabase
          .from('tipo_de_maquinaria')
          .insert([{
            descripcion: form.value.descripcion,
            autor: autor.id,
            ultimo_autor: autor.id
          }])

        if (error) throw error
        emit('created') // Emite un evento para actualizar la lista
      } catch (error) {
        console.error('Error al insertar:', error.message)
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
