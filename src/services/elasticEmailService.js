import axios from "axios";

const API_KEY = "35CD92192BDB55FD606B3B8370DFF425D8CB224D13D57F3181D2DB60D0FFC94D6B9851A4D6322557898843D911CC8EDE"; // Reemplaza con tu API Key de Elastic Email
const BASE_URL = "https://api.elasticemail.com/v2/email/send";

export const sendEmail = async (to, subject, body) => {
  try {
    const response = await axios.post(BASE_URL, null, {
      params: {
        apikey: API_KEY,
        to,
        subject,
        from: "admin@grupoflk.lat", // Cambia por el remitente configurado en Elastic Email
        bodyHtml: body,
        isTransactional: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error enviando correo con Elastic Email:", error);
    throw new Error("No se pudo enviar el correo.");
  }
};
