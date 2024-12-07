<template>
  <!-- Menú lateral (drawer) con diseño profesional -->
  <el-menu
    v-if="!isMobile || !isCollapse"
    default-active="1-1"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <div class="logo">
      <img src="@/assets/FLK_Logo.png" alt="Logo" />
    </div>
<!-- Submenú Gestión General -->
<el-sub-menu index="1">
      <template #title>
        <img src="@/assets/clases.png" alt="Icono Sesiones" class="menu-icon1" />
        <span>GESTIONAR CLASE</span>
      </template>
        <!-- Subgrupo de Gestión Operativa con opciones -->
        <el-menu-item index="1-1">
          <img src="@/assets/clases.png" alt="Icono Sesiones" class="menu-icon1" />
          <router-link class="nav-link" to="/formador-dashboard/ScheduleSessions">
            Sesiones Programadas
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-2">
          <img src="@/assets/MATERIALES.png" alt="Icono Sesiones" class="menu-icon2" />
          <router-link class="nav-link" to="/formador-dashboard/CourseMaterials">
            Materiales de Curso
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-2">
          <img src="@/assets/asistencia.png" alt="Icono Sesiones" class="menu-icon3" />
          <router-link class="nav-link" to="/formador-dashboard/AttendanceManagement">
          Gestion de asistencia
          </router-link>
        </el-menu-item>
    </el-sub-menu>
    <!-- Submenú Gestión de Alumnos y Solicitudes -->
    <el-sub-menu index="2">
      <template #title>
        <img src="@/assets/evaluacion.png" alt="Icono Sesiones" class="menu-icon3" />
        <span>GESTION EVALUACION </span>
      </template>
      <el-menu-item index="2-1">
        <img src="@/assets/evaluacion.png" alt="Icono Sesiones" class="menu-icon3" />
        <router-link class="nav-link" to="/formador-dashboard/ManageEvaluation">
          Evaluacion
        </router-link>
      </el-menu-item>
      <el-menu-item index="2-2">
        <img src="@/assets/informe de desempeño.png" alt="Icono Sesiones" class="menu-icon3" />
        <router-link class="nav-link" to="/formador-dashboard/PerformanceReport">
          Informe de Desempeño
        </router-link>
      </el-menu-item>
    </el-sub-menu>
    <!-- Botón de Cerrar Sesión -->
    <el-menu-item index="4" @click="handleLogout">
      <el-icon><User /></el-icon>
      <template #title>CERRAR SESION</template>
    </el-menu-item>
  </el-menu>

  <!-- Botón de hamburguesa (solo visible en móviles) -->
  <button 
    v-if="isMobile" 
    class="hamburger-menu"
    @click="toggleCollapse"
    :class="{ 'active': isCollapse }"
  >
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { supabase } from '@/supabase';
import { useRouter } from 'vue-router';

// Importar íconos de Element Plus
import { Document, Menu as IconMenu, Location, Setting, User } from '@element-plus/icons-vue';

// Estado para controlar si el menú está colapsado o no
const isCollapse = ref(false)
// Estado para detectar si es móvil o no
const isMobile = ref(false)

// Obtener la funcionalidad del enrutador para redirigir al usuario
const router = useRouter()

// Función para cerrar sesión
const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem('user') // Eliminar el usuario del almacenamiento local
    router.push('/login') // Redirigir al login después de cerrar sesión
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// Función para alternar el estado del menú
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// Función para manejar la apertura del menú
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

// Función para manejar el cierre del menú
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

// Función para detectar si es móvil según el tamaño de la ventana
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Ejecutar la verificación al montar el componente y actualizar en cambios de tamaño de pantalla
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// Limpiar el evento cuando el componente se desmonta
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>


<style scoped>
/* Menú principal */
.el-menu-vertical-demo {
  background-color: #ffffff;
  color: #0f0f0f;
  width: 250px;
  transition: all 0.3s;
  font-size: 16px;
  border-right: 1px solid #ddd;
}

.el-menu-vertical-demo.el-menu--collapse {
  width: 80px;
  transition: all 0.3s;
}

/* Logo */
.logo img {
  width: 80%;
  margin: 20px auto;
  display: block;
}

.menu-icon1 {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.menu-icon2 {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.menu-icon3 {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

/* Títulos */
.menu-title {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

/* Items del menú */
.el-menu-item {
  font-size: 15px;
  color: #666;
  transition: background-color 0.3s, color 0.3s;
}

.el-menu-item.is-active {
  background-color: #eceff1;
  color: #0078d7;
}

.el-menu-item:hover {
  color: #0078d7;
}

/* Submenú */
.el-sub-menu .menu-title {
  color: #333;
  font-weight: 600;
}

.el-sub-menu__title:hover {
  color: #0078d7;
}

/* Íconos */
.el-menu-item .el-icon, .el-sub-menu .el-icon {
  color: #666;
  font-size: 20px;
  margin-right: 10px;
}

.el-menu-item.is-active .el-icon, .el-menu-item:hover .el-icon {
  color: #0078d7;
}

/* Botón de hamburguesa */
.hamburger-menu {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 35px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger-menu .bar {
  width: 100%;
  height: 4px;
  background-color: #0078d7;
  transition: all 0.3s;
}

.hamburger-menu.active .bar:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-menu.active .bar:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active .bar:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}
</style>
