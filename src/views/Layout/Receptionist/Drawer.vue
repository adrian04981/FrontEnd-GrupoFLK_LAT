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
        <span>Gestionar Usuarios</span>
      </template>
      <el-sub-menu index="1-1">
        <template #title> Gestionar Operadores </template>
        <el-menu-item index="1-1-1">
          <router-link
            class="nav-link"
            to="/receptionist-dashboard/RegisterOperator"
          >
            Lista de Usuarios
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-1-2">
          <router-link
            class="nav-link"
            to="/receptionist-dashboard/RegisterOperador1"
          >
            Registrar Operador
          </router-link>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="1-2">
        <template #title> Gestionar Formadores </template>
        <el-menu-item index="1-2-1">
          <router-link
            class="nav-link"
            to="/receptionist-dashboard/RegisterTrainer"
          >
            Lista de Usuarios
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-2-2">
          <router-link
            class="nav-link"
            to="/receptionist-dashboard/RegisterFormador1"
          >
            Registrar Formador
          </router-link>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="1-3">
        <template #title> Gestionar Instructor </template>
        <el-menu-item index="1-3-1">
          <router-link
            class="nav-link"
            to="/receptionist-dashboard/RegisterInstructor"
          >
            Lista de Usuarios
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-3-2">
          <router-link
            class="nav-link"
            to="/receptionist-dashboard/RegisterInstructor1"
          >
            Registrar Instructor
          </router-link>
        </el-menu-item>
      </el-sub-menu>
    </el-sub-menu>

    <!-- Submenú Gestión -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>Gestión</span>
      </template>
      <el-menu-item index="2-1">
        <router-link
          class="nav-link"
          to="/receptionist-dashboard/ManageRequest"
        >
          Solicitudes
        </router-link>
      </el-menu-item>
      <el-menu-item index="2-2">
        <router-link
          class="nav-link"
          to="/receptionist-dashboard/ScheduleTraining"
        >
          Agendar Capacitación
        </router-link>
      </el-menu-item>

      <!-- Submenú para "Gestionar Solicitudes" -->
      <!-- <el-sub-menu index="2">
        <template #title>
          Gestionar Solicitudes
        </template>
        <el-menu-item index="2-2-1">
          <router-link class="nav-link" to="/receptionist-dashboard/ManageRequest">
            Solicitudes
          </router-link>
        </el-menu-item>
        <el-menu-item index="2-2-2">
          <router-link class="nav-link" to="/receptionist-dashboard/ScheduleTraining">
            Agendar Capacitación
          </router-link>
        </el-menu-item>
      </el-sub-menu>    -->
    </el-sub-menu>

    <!-- Botón de Cerrar Sesión -->
    <el-menu-item index="3" @click="handleLogout">
      <el-icon><User /></el-icon>
      <template #title>Cerrar Sesión</template>
    </el-menu-item>
  </el-menu>

  <!-- Botón de hamburguesa (solo visible en móviles) -->
  <button
    v-if="isMobile"
    class="hamburger-menu"
    @click="toggleCollapse"
    :class="{ active: isCollapse }"
  >
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "@/supabase";
import { useRouter } from "vue-router";

// Importar íconos de Element Plus
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  User,
} from "@element-plus/icons-vue";

// Estado para controlar si el menú está colapsado o no
const isCollapse = ref(false);
const isMobile = ref(false);
const router = useRouter();

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.el-menu-vertical-demo {
  background-color: #2e8332a9; /* Negro elegante */
  color: #000000; /* Naranja corporativo */
  border-right: none;
  transition: all 0.3s ease-in-out;
  width: 220px;
  font-size: 18px; /* Aumento general del tamaño de la letra */
  max-width: 100%; /* Ajusta este valor según tu diseño */
  overflow-y: auto; /* Agrega scroll vertical si el contenido es demasiado largo */
}

.el-menu-vertical-demo.el-menu--collapse {
  width: 64px;
  transition: all 0.3s ease-in-out;
}

.el-menu-item {
  color: #000000;
  transition: color 0.3s ease;
  font-size: relative; /* Ajuste del tamaño de fuente */
  font-weight: relative; /* Peso equilibrado */
  height: auto !important; /* Asegura que los ítems del menú ajusten su altura */
  overflow: visible; /* Permite que el contenido no se corte */
}

.el-menu-item.is-active {
  background-color: rgba(255, 165, 0, 0.1);
  color: #000000;
}

.el-menu-item:hover {
  color: #000000;
}

.el-sub-menu .el-menu-item-group__title,
.el-sub-menu .el-sub-menu__title {
  color: #000000;
  font-size: 19px;
  font-weight: 600;
}

.el-sub-menu__title:hover {
  color: #000000;
}

.el-menu-item .el-icon,
.el-sub-menu .el-icon {
  color: #000000;
}

.el-menu-item.is-active .el-icon,
.el-menu-item:hover .el-icon {
  color: #000000;
}

.logo img {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 20px auto;
  display: block;
}

.menu-item-word {
  display: block;
  line-height: 1.2; /* Ajusta la altura de línea para un espacio pequeño */
}
/* Estilo para los textos largos en el menú */
.menu-item-long-text {
  white-space: nowrap;
  overflow: flex;
  text-overflow: ellipsis;
  max-width: 180px;
}

/* Estilos del botón de hamburguesa */
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
  background-color: #ffa500;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
}

.hamburger-menu.active .bar:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
  background-color: #000000;
}

.hamburger-menu.active .bar:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active .bar:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
  background-color: #000000;
}

.hamburger-menu:hover .bar {
  background-color: #e69500; /* Un cambio suave al pasar el mouse */
}
.logo img {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 20px auto; /* Centra el logo horizontalmente */
  display: block; /* Asegura que la imagen se trate como un bloque */
}
</style>
