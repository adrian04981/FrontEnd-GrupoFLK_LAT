<template>
  <div class="register-operador-container container mt-5">
    <h1 class="text-center mb-4">Registrar Operador</h1>
    <form @submit.prevent="submitForm">
      <!-- Nombre -->
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre</label>
        <input
          type="text"
          class="form-control"
          id="nombre"
          v-model="form.nombre"
          placeholder="Ingrese el nombre"
          required
        />
      </div>

      <!-- Apellidos -->
      <div class="mb-3">
        <label for="apellidos" class="form-label">Apellidos</label>
        <input
          type="text"
          class="form-control"
          id="apellidos"
          v-model="form.apellidos"
          placeholder="Ingrese los apellidos"
          required
        />
      </div>

      <!-- Fecha de Nacimiento -->
      <div class="mb-3">
        <label for="fecha_nacimiento" class="form-label"
          >Fecha de Nacimiento</label
        >
        <input
          type="date"
          class="form-control"
          id="fecha_nacimiento"
          v-model="form.fecha_nacimiento"
          required
        />
      </div>

      <!-- Número de Documento -->
      <div class="mb-3">
        <label for="dni" class="form-label">Número de Documento</label>
        <input
          type="text"
          class="form-control"
          id="dni"
          v-model="form.dni"
          placeholder="Ingrese el número de documento"
          required
        />
      </div>

      <!-- Número Telefónico -->
      <div class="mb-3">
        <label for="nro_telefonico" class="form-label">Número Telefónico</label>
        <input
          type="text"
          class="form-control"
          id="nro_telefonico"
          v-model="form.nro_telefonico"
          placeholder="Ingrese el número telefónico"
          required
        />
      </div>

      <!-- Correo Electrónico -->
      <div class="mb-3">
        <label for="correo_electronico" class="form-label"
          >Correo Electrónico</label
        >
        <input
          type="email"
          class="form-control"
          id="correo_electronico"
          v-model="form.correo_electronico"
          placeholder="Ingrese el correo electrónico"
          required
        />
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
    <div v-if="dialogVisible" class="alert alert-success mt-4" role="alert">
      El operador ha sido registrado con éxito.
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "@/supabase.js";
import { GetUser } from "@/auth";
import Swal from "sweetalert2";

export default {
  name: "RegistrarOperador",
  data() {
    return {
      form: {
        nombre: "",
        apellidos: "",
        fecha_nacimiento: "",
        dni: "",
        nro_telefonico: "",
        correo_electronico: "",
      },
      tiposDocumento: [],
      dialogVisible: false,
    };
  },
  async mounted() {
    try {
      const { data: tiposDocumento, error } = await supabase
        .from("tipo_documento")
        .select("Pk_tipodocumento, nombre");
      if (error) throw error;
      this.tiposDocumento = tiposDocumento;
    } catch (error) {
      console.error("Error al registrar operador:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar operador: " + error.message,
      });
    }
  },
  methods: {
    async submitForm() {
      try {
        const autor = GetUser();
        const ultimoAutor = GetUser();

        const { error } = await supabase.from("Operador").insert({
          ...this.form,
          autor,
          ultimo_autor: ultimoAutor,
        });

        if (error) throw error;

        this.dialogVisible = true;
        this.resetForm();
      } catch (error) {
        if (
          error.message ==
          'duplicate key value violates unique constraint "Operador_correo_electronico_key"'
        ) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "El correo ya está registrado",
          });
        }
      }
    },
    resetForm() {
      this.form = {
        nombre: "",
        apellidos: "",
        fecha_nacimiento: "",
        dni: "",
        nro_telefonico: "",
        correo_electronico: "",
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
