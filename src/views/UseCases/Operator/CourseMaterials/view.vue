<template>
  
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase.js';
import Drawer from '@/views/Layout/Admin/Drawer.vue'; // Importamos el Drawer

export default {
  components: {
    Drawer, // Registramos el componente Drawer
  },
  setup() {
    const cursos = ref([]);
    const isMobile = ref(window.innerWidth <= 768);
    const isSidebarOpen = ref(false);

    const fetchCourses = async () => {
      let { data: Cursos, error } = await supabase.from('Cursos').select('*');
      if (!error) {
        cursos.value = Cursos;
      }
    };

    fetchCourses();

    const viewCourse = (curso) => {
      alert(`Detalles del curso: ${curso.titulo_curso}`);
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 768;
    });

    return {
      cursos,
      viewCourse,
      isMobile,
      isSidebarOpen,
      toggleSidebar,
    };
  },
};
</script>

<style scoped>
/* Estilo para el contenedor principal del dashboard */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.hamburger {
  display: none;
}

.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px auto;
  background-color: #fff;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #2e2e2e;
  color: white;
  padding: 20px;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  transition: transform 0.3s ease;
}

.collapsed {
  transform: translateX(-250px);
}

.sidebar-header {
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  color: white;
  text-decoration: none;
}

.sidebar ul li a:hover {
  text-decoration: underline;
}

.logo-img {
  max-width: 90%;
  height: auto;
  display: block;
  margin: 10px auto;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.sidebar ul li a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.sidebar ul li a i {
  margin-right: 10px;
  font-size: 18px;
}

.sidebar ul li a:hover {
  background-color: #444;
  padding: 10px;
  border-radius: 5px;
}

/* Contenido principal */
.content {
  flex-grow: 1;
  padding: 20px;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.collapsed ~ .content {
  margin-left: 0;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
}

.courses-table th,
.courses-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.courses-table th {
  background-color: #f4f4f4;
}

.logout-btn {
  background-color: #3498db;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  text-align: left;
}

.logout-btn i {
  margin-right: 10px;
}

.logout-btn:hover {
  background-color: #3498db;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-250px);
  }

  .hamburger {
    display: block;
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 20;
  }

  .sidebar.collapsed {
    transform: translateX(0);
  }

  .content {
    margin-left: 0;
  }
}
</style>
