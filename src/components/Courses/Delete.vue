<template>
    <div>
      <h2>Eliminar Curso</h2>
      <form @submit.prevent="deleteCourse">
        <div>
          <label for="curso_id">ID del Curso:</label>
          <input v-model="curso_id" type="number" id="curso_id" required />
        </div>
        <button type="submit">Eliminar Curso</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { supabase } from '@/supabase';// Asegúrate de ajustar esta ruta
  
  const curso_id = ref(null);
  
  const deleteCourse = async () => {
    const { error } = await supabase
      .from('Cursos')
      .delete()
      .eq('Pk_Curso', curso_id.value);  // Asegúrate de que el campo coincida con tu tabla
  
    if (error) {
      console.error('Error al eliminar el curso:', error.message);
    } else {
      alert('Curso eliminado con éxito');
    }
  };
  </script>
  