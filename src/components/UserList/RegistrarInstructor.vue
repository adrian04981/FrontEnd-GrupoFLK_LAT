<template>
  <div class="container register-instructor-container">
    <h1 class="text-center text-primary mb-4">Registrar Instructor</h1>
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
        <label for="nro_Telefonico" class="form-label">Número Telefónico</label>
        <input
          type="text"
          id="nro_Telefonico"
          v-model="form.nro_Telefonico"
          class="form-control"
          placeholder="Ingrese el número telefónico"
          required
        />
      </div>

      <!-- Modo de Curso -->
      <div class="mb-3">
        <label for="fk_modo_curso" class="form-label">Modo de Curso</label>
        <select
          id="fk_modo_curso"
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

    <!-- Mensaje de Confirmación -->
    <div
      v-if="dialogVisible"
      class="alert alert-success alert-dismissible fade show mt-4"
      role="alert"
    >
      El instructor ha sido registrado con éxito.
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="dialogVisible = false"
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
  name: "RegistrarInstructor",
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
        const { error } = await supabase.from("Instructor").insert({
          ...this.form,
          autor,
          ultimo_autor: autor,
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
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped>
.register-instructor-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
