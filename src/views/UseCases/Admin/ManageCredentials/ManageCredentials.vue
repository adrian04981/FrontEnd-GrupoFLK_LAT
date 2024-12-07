<template>
  <div class="credentials-layout">
    <h1 class="page-title">Credenciales de Alumnos</h1>
    <div class="table-container">
      <table class="credentials-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Documento</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="credencial in credenciales" :key="credencial.id">
            <td>{{ credencial.usuario }}</td>
            <td>{{ obtenerDocumento(credencial.FK_Operador) }}</td>
            <td>
              <button @click="enviarCorreo(credencial)" class="btn-generar">
                Enviar Correo
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";

export default {
  name: "ManageCredentials",
  data() {
    return {
      credenciales: [],
      operadores: [],
    };
  },
  async mounted() {
    try {
      const { data: credenciales, error: credencialesError } = await supabase
        .from("credenciales_alumnos")
        .select("*");

      if (credencialesError) throw credencialesError;

      this.credenciales = credenciales;

      const { data: operadores, error: operadoresError } = await supabase
        .from("Operador")
        .select("Pk_Alumno, nro_documento");

      if (operadoresError) throw operadoresError;

      this.operadores = operadores;
    } catch (error) {
      console.error("Error al cargar datos: ", error.message);
      alert("Ocurrió un error al cargar los datos.");
    }
  },
  methods: {
    obtenerDocumento(fkOperador) {
      const operador = this.operadores.find(
        (op) => op.Pk_Alumno === fkOperador
      );
      return operador ? operador.nro_documento : "Desconocido";
    },
    async enviarCorreo(credencial) {
      try {
        const { error: emailError } = await supabase.rpc("schema_name.send_email", {
          email: credencial.usuario,
          subject: "Credenciales Generadas para Acceso",

          message: `
            <h1>Acceso Generado</h1>
            <p>Estimado usuario, tus credenciales han sido generadas:</p>
            <p><strong>Usuario:</strong> ${credencial.usuario}</p>
            <p><strong>Contraseña:</strong> ${credencial.contrasena}</p>
            <p>Por favor, utiliza estas credenciales para iniciar sesión en nuestro sistema.</p>
          `,
        });

        if (emailError) throw emailError;

        alert("Correo enviado correctamente.");
      } catch (error) {
        console.error("Error al enviar correo: ", error.message);
        alert("Ocurrió un error al enviar el correo.");
      }
    },
  },
};
</script>

<style scoped>
.credentials-layout {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
}

.credentials-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.credentials-table th,
.credentials-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.credentials-table th {
  background-color: #333;
  color: #fff;
  font-size: 1.2rem;
}

.credentials-table td {
  font-size: 1rem;
}

.btn-generar {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-generar:hover {
  background-color: #218838;
}
</style>