// Supongamos que ya tienes el JWT del usuario autenticado en localStorage
const jwt = localStorage.getItem('jwt'); // JWT guardado en el login

// Clave API pública de Supabase
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5ZnJmZ2NlZnZ3cGtxdHpqanhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5NzY1MDEsImV4cCI6MjA0MDU1MjUwMX0.GNOj175EL5XrpSHlwD2l_uz0Z6_SYOKiyFwOVJ5NtVo';

if (!jwt) {
  throw new Error('JWT no encontrado. Por favor, inicia sesión.');
}

// Hacer la solicitud a la API de Supabase con la clave pública y el JWT
const response = await fetch('https://qyfrfgcefvwpkqtzjjxi.supabase.co/rest/v1/tipo_de_maquinaria', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${jwt}`, // Aquí envías el JWT para autenticar al usuario
    'apikey': apiKey,                  // Aquí envías la clave API pública (anon key)
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify([{ descripcion: 'Maquinaria nueva' }]) // Los datos que quieres enviar
});

const data = await response.json();
if (!response.ok) {
  throw new Error('Error al crear el tipo de maquinaria: ' + JSON.stringify(data));
}

console.log('Tipo de maquinaria creada:', data);
