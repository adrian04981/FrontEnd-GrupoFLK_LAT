<template>
  <div class=" register-operador-container container mt-5">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white text-center">
        <h1>Registrar Formador</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm" ref="form">
          <!-- Nombre -->
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <input
              type="text"
              id="nombre"
              v-model="form.nombre"
              class="form-control"
              placeholder="Ingrese el nombre"
              required
            />
          </div>

          <!-- DNI -->
          <div class="mb-3">
            <label for="dni" class="form-label">DNI</label>
            <input
              type="text"
              id="dni"
              v-model="form.dni"
              class="form-control"
              placeholder="Ingrese el DNI"
              required
            />
          </div>

          <!-- Correo Electrónico -->
          <div class="mb-3">
            <label for="correo" class="form-label">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              v-model="form.correo"
              class="form-control"
              placeholder="Ingrese el correo electrónico"
              required
            />
          </div>

          <!-- Número Telefónico -->
          <div class="mb-3">
            <label for="nroTelefonico" class="form-label">Número Telefónico</label>
            <input
              type="text"
              id="nroTelefonico"
              v-model="form.nro_Telefonico"
              class="form-control"
              placeholder="Ingrese el número telefónico"
              required
            />
          </div>

          <!-- Modo de Curso -->
          <div class="mb-3">
            <label for="modoCurso" class="form-label">Modo de Curso</label>
            <select
              id="modoCurso"
              v-model="form.fk_modo_curso"
              class="form-select"
              required
            >
              <option value="" disabled>Seleccione el modo de curso</option>
              <option
                v-for="modo in modosCurso"
                :key="modo.Pk_modocurso"
                :value="modo.Pk_modocurso"
              >
                {{ modo.nombre_modo }}
              </option>
            </select>
          </div>

          <!-- Botones de Acción -->
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Registrar</button>
            <button type="button" class="btn btn-secondary" @click="resetForm">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensaje de Confirmación -->
    <div
      v-if="dialogVisible"
      class="alert alert-success alert-dismissible fade show mt-3"
      role="alert"
    >
      <strong>Éxito:</strong> El formador ha sido registrado con éxito.
      <button
        type="button"
        class="btn-close"
        @click="dialogVisible = false"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "@/supabase.js";
import { GetUser } from "@/auth";
import Swal from "sweetalert2";

export default {
  name: "RegistrarFormador",
  data() {
    return {
      form: {
        nombre: "",
        dni: "",
        correo: "",
        nro_Telefonico: "",
        fk_modo_curso: null,
      },
      modosCurso: [],
      dialogVisible: false,
    };
  },
  async mounted() {
    try {
      const { data: modosCurso, error } = await supabase
        .from("Modo_Curso")
        .select("Pk_modocurso, nombre_modo");
      if (error) throw error;
      this.modosCurso = modosCurso;
    } catch (error) {
      console.error("Error al obtener los modos de curso:", error);
    }
  },
  methods: {
    async submitForm() {
      try {
        const autor = GetUser();
        const ultimoAutor = GetUser();
        const { error } = await supabase.from("Formador").insert({
          nombre: this.form.nombre,
          dni: this.form.dni,
          correo: this.form.correo,
          nro_Telefonico: this.form.nro_Telefonico,
          fk_modo_curso: this.form.fk_modo_curso,
          autor,
          ultimo_autor: ultimoAutor,
        });

        if (error) throw error;
        this.dialogVisible = true;
        this.resetForm();
      } catch (error) {
        if (
          error.message.includes(
            "duplicate key value violates unique constraint"
          )
        ) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "El correo ya está registrado",
          });
          this.resetForm();
        }
      }
    },
    resetForm() {
      this.form = {
        nombre: "",
        dni: "",
        correo: "",
        nro_Telefonico: "",
        fk_modo_curso: null,
      };
    },
  },
};
</script>

<style scoped>
.register-operador-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>