<template>
  <div class="sessions-container">
    <h2>Sesiones Programadas</h2>
    <button class="add-session-button" @click="goToProgramarSesion">Programar Nueva Sesión</button>

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
        </div>
      </div>
      <div class="arrow right-arrow" @click="nextCard">&#x25B6;</div>
    </div>

    <div class="calendar-container">
      <h2>Agenda de Sesiones</h2>
      <div id="calendar" ref="calendar"></div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h3>Detalles de la Sesión</h3>
        <p><strong>ID:</strong> {{ selectedSession.pk_sesion }}</p>
        <p><strong>Título:</strong> {{ selectedSession.titulo_curso }}</p>
        <p><strong>Fecha:</strong> {{ selectedSession.fecha_session }}</p>
        <p><strong>Hora:</strong> {{ selectedSession.hora_inicio }} - {{ selectedSession.hora_fin }}</p>
        <p><strong>Modo:</strong> {{ selectedSession.nombre_modo }}</p>
        <p><strong>Docente Teoría:</strong> {{ selectedSession.docente_teoria }}</p>
        <p><strong>Docente Práctica:</strong> {{ selectedSession.docente_practica }}</p>
        <p>
          <strong>Dirección Virtual:</strong>
          <a :href="selectedSession.direccion_session_virtual" target="_blank">
            {{ selectedSession.direccion_session_virtual }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  name: "CalendarActivities",
  setup() {
    const sesiones = ref([]);
    const slider = ref(null);
    const calendar = ref(null);
    const showModal = ref(false);
    const selectedSession = ref({});
    const userEmail = ref("");

    const fetchSesiones = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session) {
          throw new Error("Usuario no autenticado");
        }

        userEmail.value = session.user.email;

        const { data, error } = await supabase
          .from("sesiones_programadas")
          .select(
            `pk_sesion, fecha_session, hora_inicio, hora_fin, direccion_session_virtual,
             curso:fk_curso (
              titulo_curso,
              docente_teoria:fk_docenteteoria (nombre, correo),
              docente_practica:fk_docentepractico (nombre)
            ),
            modo:fk_modo_curso (nombre_modo)`
          )
          .eq("curso.docente_teoria.correo", userEmail.value);

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

        updateCalendarEvents();
      } catch (error) {
        console.error("Error al obtener sesiones programadas:", error.message);
      }
    };

    const updateCalendarEvents = () => {
      if (calendar.value) {
        calendar.value.removeAllEvents();
        sesiones.value.forEach((sesion) => {
          calendar.value.addEvent({
            title: sesion.titulo_curso,
            start: `${sesion.fecha_session}T${sesion.hora_inicio}`,
            end: `${sesion.fecha_session}T${sesion.hora_fin}`,
            extendedProps: sesion,
          });
        });
      }
    };

    const initializeCalendar = () => {
      const calendarEl = document.getElementById("calendar");
      calendar.value = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        events: [],
        eventClick: (info) => {
          selectedSession.value = info.event.extendedProps;
          showModal.value = true;
        },
      });
      calendar.value.render();
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
      window.location.href = "/Instructor-dashboard/ProgrammerSession";
    };

    onMounted(async () => {
      await fetchSesiones();
      initializeCalendar();
    });

    return {
      sesiones,
      slider,
      nextCard,
      prevCard,
      goToProgramarSesion,
      showModal,
      selectedSession,
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

