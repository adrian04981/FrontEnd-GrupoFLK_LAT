const mailgun = require('mailgun-js');

// Configura Mailgun con tu API Key y dominio
const DOMAIN = 'sandboxe32628e65af44acf8e7da33cc324e421.mailgun.org'; // Tu dominio de Mailgun
const apiKey = 'f6fe91d3-e51ff4fd'; // Tu API Key
const mg = mailgun({ apiKey: apiKey, domain: DOMAIN });

// Configura el correo a enviar
const data = {
  from: 'Excited User <mailgun@sandboxe32628e65af44acf8e7da33cc324e421.mailgun.org>',
  to: 'matiose12@gmail.com', // Correo de destino
  subject: 'Correo de prueba de Mailgun',
  text: 'Este es un correo enviado usando Mailgun desde tu aplicación.',
};

// Enviar el correo
mg.messages().send(data, function (error, body) {
  if (error) {
    console.log('Error al enviar el correo:', error);
  } else {
    console.log('Correo enviado:', body);
  }
});
