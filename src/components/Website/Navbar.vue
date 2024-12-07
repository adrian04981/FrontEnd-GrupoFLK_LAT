<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <img src="@/assets/SELLO_FLK.png" alt="Logo" class="navbar-logo" />
      </router-link>
      <button
        class="navbar-toggler custom-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">Nosotros</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/services">Servicios</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact">Contacto</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link btn-login" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>

<style scoped>
/* General navbar style */
.navbar {
  background-color: #1e1e1e; /* Industrial dark background */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow */
  padding: 1rem;
  transition: background-color 0.3s ease;
}

/* Logo styling */
.navbar-logo {
  height: 45px; /* Slightly larger logo */
  width: auto;
  transition: transform 0.3s ease;
}

.navbar-logo:hover {
  transform: scale(1.1); /* Subtle hover effect on logo */
  filter: drop-shadow(0 0 10px rgba(255, 165, 0, 0.5)); /* Add a glowing effect */
}

/* Navbar links */
.nav-link {
  font-size: 1.2rem; /* Increased font size */
  font-weight: bold; /* Bold text */
  color: #f2b950 !important; /* Bright metallic color */
  margin-right: 1.5rem;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease;
}

/* Hover effect for the links */
.nav-link:hover {
  color: #f26430 !important; /* Changes to a brighter orange on hover */
  transform: scale(1.1);
}

/* Active link styling */
.nav-link.active {
  color: #f26430 !important;
  border-bottom: 2px solid #f26430; /* Underline the active link */
}

/* Navbar toggler button customization */
.navbar-toggler.custom-toggler {
  border-color: #f2b950;
}

.navbar-toggler-icon {
  background-image: linear-gradient(135deg, #f2b950, #f26430); /* Gradient for toggler icon */
}

/* Login button styled as a special button */
.btn-login {
  font-size: 1.2rem; /* Increased font size for login button */
  font-weight: bold; /* Bold text */
  background-color: #f2b950;
  color: #1e1e1e !important;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  background-color: #f26430;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem;
  }

  .nav-link {
    margin-right: 1rem;
  }

  .btn-login {
    margin-top: 0.5rem;
  }
}
</style>
