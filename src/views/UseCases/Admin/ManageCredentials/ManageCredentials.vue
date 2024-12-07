<template>
  <div class="credentials-layout">
    <h1 class="page-title">Solicitudes Aceptadas</h1>
    <div class="table-container">
      <table class="credentials-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Usuario</th>
            <th>Contraseña</th>
            <th>Documento</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="solicitud in solicitudes" :key="solicitud.id">
            <td>{{ solicitud.nombre_completo || "Nulo" }}</td>
            <td>{{ solicitud.usuario || "Nulo" }}</td>
            <td>{{ solicitud.contrasena || "Nulo" }}</td>
            <td>{{ obtenerDocumento(solicitud.FK_Operador) || "Nulo" }}</td>
            <td>
              <button @click="enviarCorreo(solicitud)" class="btn-generar">
                Enviar Correo
              </button>
              <span v-if="!existeOperador(solicitud.usuario)">
                (Generar usuario y contraseña)
              </span>
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
  name: "ManageRequests",
  data() {
    return {
      solicitudes: [],
      operadores: [], // Aquí almacenamos los operadores
    };
  },
  async mounted() {
    await this.fetchSolicitudes();
    await this.fetchOperadores(); // Traemos los operadores al cargar el componente
  },
  methods: {
    async fetchSolicitudes() {
      try {
        const { data, error } = await supabase
          .from("solicitud_capacitacion")
          .select("*")
          .eq("estado_solicitud", "Aceptada");

        if (error) throw error;

        console.log("Solicitudes aceptadas cargadas:", data);
        this.solicitudes = data;
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error.message);
        alert("Ocurrió un error al cargar las solicitudes.");
      }
    },
    async fetchOperadores() {
      try {
        // Traemos los operadores que tienen correo
        const { data, error } = await supabase
          .from("Operador")
          .select("correo_electronico, Pk_Alumno");

        if (error) throw error;

        console.log("o cargados:", data);
        this.operadores = data;
      } catch (error) {
        console.error("Error al cargar operadores:", error.message);
      }
    },
    obtenerDocumento(fkOperador) {
      const operador = this.operadores.find(
        (op) => op.Pk_Alumno === fkOperador
      );
      return operador ? operador.nro_documento : "Nulo";
    },
    existeOperador(correo) {
      return this.operadores.some((op) => op.correo_electronico === correo);
    },
    async enviarCorreo(solicitud) {
      try {
        // Buscar el operador que coincide con el correo de la solicitud
        const { data: operadores, error: operadorError } = await supabase
          .from("Operador")
          .select("*")
          .eq("correo_electronico", solicitud.correo_electronico)
          .single(); // Usar .single() para obtener un solo registro

        if (operadorError) throw operadorError;

        if (!operadores) {
          alert("No se encontró un operador con este correo.");
          return;
        }

        const { data: credenciales, error: credError } = await supabase
          .from("credenciales_alumnos")
          .select("*")
          .eq("Pk_Alumno", operadores.Pk_Alumno);

        if (credError) throw credError;

        if (credenciales.length > 0) {
          alert("Las credenciales ya existen para este operador.");
          return;
        }

        // Generar una nueva contraseña
        const nuevaContraseña = this.generarContraseña();


        let id = operadores.Pk_Alumno;
        // Crear nuevas credenciales
        const { data: nuevasCredenciales, error: insertError } = await supabase
          .from("credenciales_alumnos")
          .insert([
            {
              FK_Operador: id,
              usuario: solicitud.usuario,
              contrasena: nuevaContraseña,
            },
          ]);

        if (insertError) throw insertError;


        // Enviar correo con las nuevas credenciales
        const { error: emailError } = await supabase.rpc("schema_name.send_email", {
          email: solicitud.usuario,
          subject: "Solicitud Aceptada - Credenciales",
          message: `
        <h1>Solicitud Aceptada</h1>
        <p>Estimado usuario, tu solicitud ha sido aceptada:</p>
        <p><strong>Usuario:</strong> ${solicitud.usuario}</p>
        <p><strong>Contraseña:</strong> ${nuevaContraseña}</p>
        <p>Por favor, utiliza estas credenciales para acceder a tu capacitación.</p>
      `,
        });

        if (emailError) throw emailError;

        alert("Credenciales generadas y correo enviado correctamente.");

      } catch (error) {
        console.error("Error al procesar la solicitud:", error.message);
        alert("Ocurrió un error al procesar la solicitud.");
      }
    },

    // Función para generar contraseña (debes implementarla)
    generarContraseña() {
      // Implementa aquí la lógica para generar una contraseña segura
      // Por ejemplo:
      const length = 10;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      return password;
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