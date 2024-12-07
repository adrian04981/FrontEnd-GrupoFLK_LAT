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
      <img src="@/assets/SELLO_FLK.png" alt="Logo" />
    </div>

    <!-- Submenú Gestión Operativa -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>Modulo Inspecciones</span>
      </template>
    
        <!-- Subgrupo de Gestión Operativa con opciones -->
        <el-menu-item index="1-1">
          <router-link class="nav-link" to="/operations-assistant-dashboard/VisitasAsignadas">
            Visitas Programadas
          </router-link>
        </el-menu-item>
    </el-sub-menu>


    <!-- Botón de Cerrar Sesión -->
    <el-menu-item index="2" @click="handleLogout">
      <el-icon><User /></el-icon>
      <template #title>Cerrar Sesión</template>
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

const isCollapse = ref(false)
const isMobile = ref(false)
const router = useRouter()

const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>


<style scoped>
.el-menu-vertical-demo {
  background-color: #1c1c1c; /* Fondo oscuro */
  color: #f1f1f1; /* Texto blanco suave */
  border-right: none;
  width: 200px;
  font-size: 18px;
} /* <-- Closing brace added here */

.el-menu-vertical-demo.el-menu--collapse {
  width: 64px;
  transition: all 0.3s ease-in-out;
}

.el-menu-item {
  color: #333333;
  transition: color 0.3s ease;
  font-size: relative;
  height: auto !important;
  overflow: visible;
}

.el-menu-item.is-active {
  background-color: #ff8c00; /* Naranja para ítem activo */
  color: #ffffff;
}

.el-menu-item:hover {
  background-color: #333333; /* Fondo claro en hover */
  color: #ff8c00; /* Texto naranja */
}

.el-sub-menu .el-menu-item-group__title, .el-sub-menu .el-sub-menu__title {
  color: #f1f1f1;
  font-size: 19px;
  font-weight: 600;
}

.el-sub-menu__title:hover {
  color: #ff8c00; /* Naranja en hover */
}

.el-menu-item .el-icon, .el-sub-menu .el-icon {
  color: #f1f1f1;
}

.el-menu-item.is-active .el-icon, .el-menu-item:hover .el-icon {
  color: #f1f1f1;
}

/* Logo */
.logo img {
  width: 80%;
  margin: 00px auto;
  display: block;
}

.hamburger-menu {
  position: relative;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 35px;
  height: 30px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s ease-in-out;
}

.hamburger-menu .bar {
  width: 100%;
  height: 4px;
  background-color: #ff8c00;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
}

.hamburger-menu.active .bar:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
  background-color: #ffffff;
}

.hamburger-menu.active .bar:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active .bar:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
  background-color: #ffffff;
}

.hamburger-menu:hover .bar {
  background-color: #e69500; /* Color naranja brillante */
}

.MenuDesplegable {
  color: #f1f1f1;
}
</style>