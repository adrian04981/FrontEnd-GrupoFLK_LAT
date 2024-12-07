<template>
  <div class="sessions-container">
    <h2>Sesiones Programadas</h2>
    <button class="add-session-button" @click="goToProgramarSesion">Programar Nueva Sesión</button>

    <!-- Carrusel de Sesiones -->
    <div class="sessions-slider-container">
      <div class="arrow left-arrow" @click="prevCard">&#x25C0;</div>

      <div class="sessions-slider" ref="slider">
        <div v-for="(sesion, index) in sesiones" :key="sesion.pk_sesion" class="session-card">
          <h3>{{ sesion.titulo_curso }}</h3>
          <p><strong>Fecha:</strong> {{ sesion.fecha_session }}</p>
          <p><strong>Hora:</strong> {{ sesion.hora_inicio }} - {{ sesion.hora_fin }}</p>
          <p><strong>Modo:</strong> {{ sesion.nombre_modo }}</p>
          <p><strong>Docente Teoría:</strong> {{ sesion.docente_teoria }}</p>
          <p><strong>Docente Práctica:</strong> {{ sesion.docente_practica }}</p>
          <p>
            <strong>Dirección Virtual:</strong>
            <a :href="sesion.direccion_session_virtual" target="_blank">
              {{ sesion.direccion_session_virtual }}
            </a>
          </p>
        </div>
      </div>

      <div class="arrow right-arrow" @click="nextCard">&#x25B6;</div>
    </div>

    <!-- Calendario de Actividades -->
    <div class="calendar-container">
      <h2>Calendario de Actividades</h2>
      <vue3-calendar v-model="currentDate" :events="calendarEvents" @dayClick="handleDayClick" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { Calendar } from "@fullcalendar/core";

export default {
  name: "SessionsList",
  components: {
    Calendar,
  },
  setup() {
    const sesiones = ref([]);
    const slider = ref(null);
    const currentDate = ref(new Date());
    const calendarEvents = ref([]);

    const fetchSesiones = async () => {
      try {
        const { data, error } = await supabase
          .from("sesiones_programadas")
          .select(
            `pk_sesion, fecha_session, hora_inicio, hora_fin, direccion_session_virtual,
             curso:fk_curso (titulo_curso, docente_teoria:fk_docenteteoria (nombre), docente_practica:fk_docentepractico (nombre)),
             modo:fk_modo_curso (nombre_modo)`
          );

        if (error) throw error;

        sesiones.value = data.map((sesion) => ({
          pk_sesion: sesion.pk_sesion,
          titulo_curso: sesion.curso.titulo_curso,
          fecha_session: sesion.fecha_session,
          hora_inicio: sesion.hora_inicio,
          hora_fin: sesion.hora_fin,
          direccion_session_virtual: sesion.direccion_session_virtual,
          nombre_modo: sesion.modo.nombre_modo,
          docente_teoria: sesion.curso.docente_teoria?.nombre || "N/A",
          docente_practica: sesion.curso.docente_practica?.nombre || "N/A",
        }));

        calendarEvents.value = sesiones.value.map((sesion) => ({
          date: sesion.fecha_session,
          title: sesion.titulo_curso,
          description: `${sesion.hora_inicio} - ${sesion.hora_fin}`,
        }));
      } catch (error) {
        console.error("Error al obtener sesiones programadas:", error.message);
      }
    };

    const nextCard = () => {
      if (slider.value) {
        slider.value.scrollBy({
          left: 300,
          behavior: "smooth",
        });
      }
    };

    const prevCard = () => {
      if (slider.value) {
        slider.value.scrollBy({
          left: -300,
          behavior: "smooth",
        });
      }
    };

    const goToProgramarSesion = () => {
      window.location.href = "/ProgrammerSession";
    };

    const handleDayClick = (date) => {
      alert(`Seleccionaste el día: ${date}`);
    };

    onMounted(fetchSesiones);

    return {
      sesiones,
      slider,
      nextCard,
      prevCard,
      currentDate,
      calendarEvents,
      handleDayClick,
      goToProgramarSesion,
    };
  },
};
</script>

<style scoped>
.sessions-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h2 {
  color: #2167ac;
  margin-bottom: 20px;
  font-size: 24px;
}

.add-session-button {
  background-color: #4dac50;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 20px;
}

.add-session-button:hover {
  background-color: #45a049;
}

.sessions-slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  position: relative;
  margin-top: 30px;
}

.sessions-slider {
  display: flex;
  overflow-x: hidden;
  gap: 15px;
  padding: 10px 15px;
  width: 90%;
  transition: transform 0.4s ease;
}

.session-card {
  background-color: #faf8e6;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  flex: 0 0 250px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.session-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.session-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.session-card p {
  font-size: 14px;
  margin: 6px 0;
}

.session-card a {
  color: #007bff;
  font-size: 14px;
  text-decoration: none;
}

.session-card a:hover {
  text-decoration: underline;
}

.arrow {
  width: 50px;
  height: 50px;
  background-color: #4dac50;
  color: white;
  border-radius: 50%;
  border: none;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.arrow:hover {
  transform: scale(1.2);
  background-color: #45a049;
}

.arrow.left-arrow {
  left: -60px;
}

.arrow.right-arrow {
  right: -60px;
}

.calendar-container {
  margin-top: 40px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 40px auto;
}

.calendar-container h2 {
  color: #2167ac;
  font-size: 22px;
  margin-bottom: 20px;
}
</style>
