<template>
    <div class="calendar-container">
      <vue-cal
        :events="events"
        default-view="day"
        :time="false"
        style="height: 800px; width: 100%;"
      />
    </div>
  </template>
  
  <script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import { supabase } from '@/supabase';
  
  export default {
    components: {
      VueCal,
    },
    data() {
      return {
        events: [],
      };
    },
    async created() {
      try {
        const { data, error } = await supabase
          .from('Sesiones_Programadas')
          .select('fecha_Sesion, hora_inicio, hora_fin, direccion_sesion_virtual, Fk_Curso, Fk_modo_curso, autor, ultimo_autor, Estado');
  
        if (error) {
          console.error('Error al obtener datos de Supabase:', error.message);
          return;
        }
  
        // Formatear los datos obtenidos para que sean compatibles con vue-cal
        this.events = data.map(sesion => ({
          start: `${sesion.fecha_Sesion} ${sesion.hora_inicio}`,
          end: `${sesion.fecha_Sesion} ${sesion.hora_fin}`,
          title: `Curso ${sesion.Fk_Curso} - ${sesion.direccion_sesion_virtual || 'Sesión Programada'}`,
          content: `
            <div>
              <strong>Modo de Curso:</strong> ${sesion.Fk_modo_curso}<br>
              <strong>Autor:</strong> ${sesion.autor}<br>
              <strong>Último Autor:</strong> ${sesion.ultimo_autor}<br>
              <strong>Estado:</strong> ${sesion.Estado ? 'Activo' : 'Inactivo'}
            </div>
          `,
        }));
      } catch (err) {
        console.error('Error inesperado:', err);
      }
    },
  };
  </script>
  
  <style scoped>
  .calendar-container {
    margin: 20px auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  