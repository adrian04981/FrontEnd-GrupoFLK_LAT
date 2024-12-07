import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Conectar a Supabase
const supabaseUrl = 'https://qyfrfgcefvwpkqtzjjxi.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5ZnJmZ2NlZnZ3cGtxdHpqanhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5NzY1MDEsImV4cCI6MjA0MDU1MjUwMX0.GNOj175EL5XrpSHlwD2l_uz0Z6_SYOKiyFwOVJ5NtVo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configurar Gmail SMTP con Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'matiose12@gmail.com', // Tu correo de Gmail
    pass: 'lfmz aupq glfm kkpp', // Contraseña de aplicación generada en Gmail
  },
});

// Escuchar el canal de Supabase
const listenToSupabase = async () => {
  console.log('Iniciando listener para eventos en Supabase...');
  
  // Suscribirse al canal "enviar_correo"
  const subscription = supabase
    .channel('public:solicitud_capacitacion')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'solicitud_capacitacion' }, (payload) => {
      console.log('Evento recibido:', payload);

      const { correo_electronico, asunto, cuerpo } = payload.new;

      // Enviar el correo
      transporter.sendMail({
        from: '"GrupoFLK" <grupoflk13@gmail.com>', // Cambia esto si deseas un remitente personalizado
        to: correo_electronico,
        subject: asunto,
        html: cuerpo,
      }, (err, info) => {
        if (err) {
          console.error('Error al enviar correo:', err);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });
    })
    .subscribe();

  console.log('Listener configurado y en espera de eventos.');
};


// Ejecutar el listener
listenToSupabase();
