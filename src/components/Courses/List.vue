<template>
  <div>
    <h2>Lista de Cursos</h2>
    <ul>
      <li v-for="curso in cursos" :key="curso.Pk_Curso">
        <router-link :to="`/courses/${curso.Pk_Curso}`">
          {{ curso.titulo_curso }} - Desde: {{ curso.fecha_hora_inicio_teoria }} a {{ curso.fecha_hora_fin_practica }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';

const cursos = ref([]);

const fetchCursos = async () => {
  const { data, error } = await supabase
    .from('Cursos')
    .select('*');

  if (error) {
    console.error('Error al obtener los cursos:', error.message);
  } else {
    cursos.value = data;
  }
};

onMounted(() => {
  fetchCursos();
});
</script>
