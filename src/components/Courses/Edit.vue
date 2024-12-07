<template>
    <div>
      <h2>Editar Curso</h2>
      <form @submit.prevent="editCourse">
        <div>
          <label for="curso_id">ID del Curso:</label>
          <input v-model="curso_id" type="number" id="curso_id" required />
        </div>
        <div>
          <label for="titulo_curso">Título del Curso:</label>
          <input v-model="titulo_curso" type="text" id="titulo_curso" required />
        </div>
        <!-- Añadir más campos si es necesario -->
  
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { supabase } from '@/supabase';
  
  const curso_id = ref(null);
  const titulo_curso = ref('');
  
  const editCourse = async () => {
    const { error } = await supabase
      .from('Cursos')
      .update({ titulo_curso: titulo_curso.value })
      .eq('Pk_Curso', curso_id.value);
  
    if (error) {
      console.error('Error al editar el curso:', error.message);
    } else {
      alert('Curso actualizado con éxito');
    }
  };
  </script>
  