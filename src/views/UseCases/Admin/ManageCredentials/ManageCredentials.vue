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
          </tr>
        </thead>
        <tbody>
          <tr v-for="solicitud in solicitudes" :key="solicitud.id">
            <td>{{ solicitud.nombre_completo || "Nulo" }}</td>
            <td>{{ solicitud.usuario }}</td>
            <td>{{ solicitud.contrasena }}</td>
            <td>
              <button @click="enviarCorreo(solicitud)" class="btn-generar">
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
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2'

export default {
  name: "ManageRequests",
  data() {
    return {
      solicitudes: [],
      operadores: [],
      credenciales: [],
    };
  },
  async mounted() {
    await this.fetchSolicitudes();
    await this.fetchOperadores();
    await this.fetchCredenciales();
    this.actualizarSolicitudesConCredenciales();
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
      }
    },
    async fetchOperadores() {
      try {
        const { data, error } = await supabase
          .from("Operador")
          .select("correo_electronico, Pk_Alumno");

        if (error) throw error;

        console.log("Operadores cargados:", data);
        this.operadores = data;
      } catch (error) {
        console.error("Error al cargar operadores:", error.message);
      }
    },
    async fetchCredenciales() {
      try {
        const { data, error } = await supabase
          .from("credenciales_alumnos")
          .select("*");

        if (error) throw error;

        console.log("Credenciales cargadas:", data);
        this.credenciales = data;
      } catch (error) {
        console.error("Error al cargar las credenciales:", error.message);
      }
    },
    actualizarSolicitudesConCredenciales() {
      // Agregar las credenciales correspondientes a cada solicitud
      this.solicitudes = this.solicitudes.map((solicitud) => {
        const operador = this.operadores.find(
          (op) => op.correo_electronico === solicitud.correo_electronico
        );

        if (!operador) {
          return { ...solicitud, usuario: "Nulo", contrasena: "Nulo" };
        }

        const credencial = this.credenciales.find(
          (cred) => cred.FK_Operador === operador.Pk_Alumno
        );

        return {
          ...solicitud,
          usuario: credencial?.usuario || "Nulo",
          contrasena: credencial?.contrasena || "Nulo",
        };
      });

      console.log("Solicitudes actualizadas con credenciales:", this.solicitudes);
    },

    async enviarCorreo(solicitud) {
      try {
        const operador = this.operadores.find(
          (op) => op.correo_electronico === solicitud.correo_electronico
        );

        if (!operador) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Operador no encontrado.",
          });
          return;
        }

        let credencial = this.credenciales.find(
          (cred) => cred.FK_Operador === operador.Pk_Alumno
        );

        if (!credencial) {
          // Si no existen credenciales, se crean nuevas
          credencial = await this.crearCredenciales(operador);
        }

        // Construir el mensaje de correo
        const saludo = `Hola ${solicitud.nombre_completo},\n\n`;
        const detalleSolicitud = `Detalles de la solicitud:\n\n\n`;

        let mensaje;
        if (solicitud.estado_solicitud === "Aceptada") {
          mensaje = `${saludo}¡Estamos emocionados de informarte que tu solicitud de capacitación ha sido aceptada con éxito!\n\n${detalleSolicitud}\n\n¡Gracias por confiar en nosotros!`;

          // Incluir credenciales en el mensaje
          if (credencial) {
            mensaje += `\n\nTus credenciales para acceder al curso son:\nUsuario: ${credencial.usuario}\nContraseña: ${credencial.contrasena}`;
          }
        } else {
          mensaje = `${saludo}Lamentamos informarte que tu solicitud de capacitación ha sido rechazada.\n\nMotivo del rechazo:\n"${solicitud.motivo_rechazo}"\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nGracias por tu comprensión.`;
        }

        const templateParams = {
          to_email: solicitud.correo_electronico,
          subject: solicitud.estado_solicitud === "Aceptada" ? "¡Solicitud Aceptada!" : "Solicitud Rechazada",
          message: mensaje,
        };

        // Enviar el correo usando EmailJS
        emailjs.init("8GJwYc75XE3Qp05j_");
        const { response, status } = await emailjs.send(
          "service_5u4cv8t", // Service ID
          "template_tryi5ab", // Template ID
          templateParams
        );

        if (status === 200) {
          console.log("Correo enviado exitosamente:", response);
          Swal.fire({
            icon: "success",
            title: "Operación exitosa",
            text: `Solicitud ${solicitud.estado_solicitud.toLowerCase()} y correo enviado correctamente.`,
          });
          this.actualizarSolicitudesConCredenciales();
        } else {
          console.error("Error en el envío del correo:", response);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al enviar el correo de confirmación.",
          });
        }
      } catch (error) {
        console.error("Error al procesar la solicitud:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al enviar el correo.",
        });
      }
    },

    // Función para crear credenciales si no existen
    async crearCredenciales(operador) {
      try {
        // Obtener el autor desde el localStorage (suponiendo que 'use' almacena el id del usuario)
        const autor = JSON.parse(localStorage.getItem('user'));
        if (!autor) {
          throw new Error("No se ha encontrado el autor en el localStorage.");
        }
        console.log(autor.id);

        // Obtener los datos del operador desde Supabase
        const { data, error } = await supabase
          .from("Operador")
          .select("correo_electronico, Pk_Alumno")
          .eq("correo_electronico", operador.correo_electronico)  // Filtrar por correo_electronico
          .single();  // Suponiendo que debería haber solo un operador con ese correo

        if (error) {
          console.error("Error al obtener datos del operador:", error.message);  // Detalle del error
          throw new Error("Error al obtener datos del operador: " + error.message);
        }

        // Verificar que obtuviste los datos correctos del operador
        if (!data) {
          throw new Error("Operador no encontrado en la base de datos.");
        }
        console.log(autor);

        // Generar un usuario y contraseña por defecto
        const usuario = operador.correo_electronico;  // Usuario será el correo electrónico
        const contrasena = operador.correo_electronico;  // La contraseña debería ser diferente y no el correo

        // Crear las credenciales
        const nuevaCredencial = {
          FK_Operador: data.Pk_Alumno,  // Asignamos el Pk_Alumno del operador encontrado
          usuario: usuario,  // El usuario es el correo electrónico
          contrasena: contrasena,  // La contraseña es temporal
          autor: autor.id,  // El id del autor obtenido desde el localStorage
          ultimo_autor: autor.id,  // El último autor también es el mismo por ahora
          fecha_creacion: new Date(),
        };
        console.log(nuevaCredencial);

        // Guardar las credenciales en la base de datos usando Supabase
        const { data: credencialGuardada, error: saveError } = await supabase
          .from("credenciales_alumnos")  // Suponiendo que la tabla es "Credenciales"
          .insert([nuevaCredencial]);

        if (saveError) {
          console.error("Error al guardar las credenciales:", saveError.message);  // Detalle del error
          throw new Error("Error al guardar las credenciales: " + saveError);
        }

        console.log('Credenciales guardadas:', credencialGuardada);

        // Ahora, crear el usuario con supabase.auth.signUp
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: usuario,  // Usamos el correo electrónico como el email
          password: contrasena,  // Usamos la contraseña temporal
        });

        if (signUpError) {
          console.error("Error al crear el usuario:", signUpError.message);
          throw new Error("Error al crear el usuario: " + signUpError.message);
        }

        const user = signUpData.user;

        if (user) {
          // Asignar rol al usuario después de la creación
          const { error: insertError } = await supabase
            .from('asignaciondeusuario')
            .insert([
              { id: user.id, rol: 5}  // Asumí que `operador.rol` está disponible
            ]);

          if (insertError) {
            console.error("Error al asignar el rol al usuario:", insertError.message);
            throw new Error("Error al asignar el rol al usuario.");
          }

          console.log('Usuario registrado y rol asignado:', user);

          // Retornar las credenciales y el usuario creado
          return {
            credencialGuardada,
            usuarioCreado: user
          };
        } else {
          throw new Error("Usuario no creado.");
        }

      } catch (error) {
        console.error("Error al crear las credenciales:", error.message);
        throw new Error("No se pudieron crear las credenciales y el usuario.");
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