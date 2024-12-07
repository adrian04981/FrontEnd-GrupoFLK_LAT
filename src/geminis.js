/*import { GoogleGenerativeAI } from "@google/generative-ai";

const config = {
  GoogleGenerativeAI: {
    API_KEY: "AIzaSyDy9AkidGx2NbJb82X9TuHmfYMf-G9b9bs",
    Model: {
      Name: "gemini-1.5-flash",
      Type: "GenerativeModel"
    }
  }
};

const API_KEY = config.GoogleGenerativeAI.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Función asíncrona para ejecutar el prompt
async function generateContent() {
  const model = genAI.getGenerativeModel({
    model: config.GoogleGenerativeAI.Model.Name,
  });

  // Prompt para el modelo "gemini"
  const prompt = "Conéctame con el modelo gemini y genera contenido";

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error al generar contenido:", error);
  }
}

// Llama a la función asíncrona
generateContent();

export default config;
*/