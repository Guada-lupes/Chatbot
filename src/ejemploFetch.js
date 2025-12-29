// Ejemplo completo de configuración de chat con la API de Gemini
// usando peticiones HTTP con JavaScript

const GEMINI_API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza con tu API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Función principal para enviar mensaje a Gemini
async function chatWithGemini(userMessage, conversationHistory = []) {
  
  // CONFIGURACIÓN COMPLETA DEL CHAT
  const requestBody = {
    
    // 1. CONFIGURACIÓN DE GENERACIÓN (generationConfig)
    generationConfig: {
      temperature: 0.9,              // Creatividad (0.0 = preciso, 2.0 = muy creativo)
      topP: 0.95,                    // Nucleus sampling (0.8-0.95 recomendado)
      topK: 40,                      // Límite de tokens a considerar
      maxOutputTokens: 1000,         // Máximo de tokens en la respuesta
      candidateCount: 1,             // Número de respuestas alternativas
      stopSequences: ["FIN", "###"], // Secuencias para detener generación
      presencePenalty: 0.0,          // Penalización por repetición (-2.0 a 2.0)
      frequencyPenalty: 0.0,         // Penalización por frecuencia (-2.0 a 2.0)
      responseMimeType: "text/plain",// Formato: "text/plain" o "application/json"
      seed: 42,                      // Semilla para reproducibilidad (opcional)
      
      // Para respuestas JSON estructuradas (opcional)
      // responseMimeType: "application/json",
      // responseSchema: {
      //   type: "object",
      //   properties: {
      //     respuesta: { type: "string" },
      //     confianza: { type: "number" }
      //   }
      // }
    },
    
    // 2. CONFIGURACIÓN DE SEGURIDAD (safetySettings)
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_CIVIC_INTEGRITY",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ],
    
    // 3. INSTRUCCIÓN DEL SISTEMA (systemInstruction)
    systemInstruction: {
      parts: [
        {
          text: "Eres un asistente útil, amigable y experto en programación. " +
                "Respondes de forma clara y concisa. Usas ejemplos cuando es apropiado. " +
                "Si no sabes algo, lo admites honestamente."
        }
      ]
    },
    
    // 4. HISTORIAL DE CONVERSACIÓN (contents)
    contents: [
      // Incluir historial previo si existe
      ...conversationHistory,
      // Agregar el nuevo mensaje del usuario
      {
        role: "user",
        parts: [
          {
            text: userMessage
          }
        ]
      }
    ]
  };

  try {
    // Realizar la petición HTTP POST
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error de la API: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Verificar si la respuesta fue bloqueada por seguridad
    if (data.promptFeedback?.blockReason) {
      console.error('Prompt bloqueado por:', data.promptFeedback.blockReason);
      return {
        blocked: true,
        reason: data.promptFeedback.blockReason,
        safetyRatings: data.promptFeedback.safetyRatings
      };
    }

    // Extraer el texto de la respuesta
    const candidate = data.candidates[0];
    const responseText = candidate.content.parts[0].text;
    
    // Información adicional útil
    const responseInfo = {
      text: responseText,
      blocked: false,
      finishReason: candidate.finishReason, // STOP, MAX_TOKENS, SAFETY, etc.
      safetyRatings: candidate.safetyRatings,
      usageMetadata: data.usageMetadata // Tokens usados
    };

    return responseInfo;

  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
}

// ============================================
// EJEMPLO DE USO: Chat simple
// ============================================
async function ejemploSimple() {
  console.log('=== EJEMPLO SIMPLE ===');
  
  const respuesta = await chatWithGemini('¿Qué es JavaScript?');
  
  console.log('Respuesta:', respuesta.text);
  console.log('Tokens usados:', respuesta.usageMetadata);
}

// ============================================
// EJEMPLO DE USO: Conversación con historial
// ============================================
async function ejemploConHistorial() {
  console.log('\n=== EJEMPLO CON HISTORIAL ===');
  
  // Mantener el historial de la conversación
  let historial = [];
  
  // Primer mensaje
  console.log('\nUsuario: Hola, ¿cómo estás?');
  let resp1 = await chatWithGemini('Hola, ¿cómo estás?', historial);
  console.log('Asistente:', resp1.text);
  
  // Actualizar historial con el primer intercambio
  historial.push(
    { role: "user", parts: [{ text: "Hola, ¿cómo estás?" }] },
    { role: "model", parts: [{ text: resp1.text }] }
  );
  
  // Segundo mensaje (el modelo recordará el contexto)
  console.log('\nUsuario: ¿Puedes ayudarme con Python?');
  let resp2 = await chatWithGemini('¿Puedes ayudarme con Python?', historial);
  console.log('Asistente:', resp2.text);
  
  // Actualizar historial
  historial.push(
    { role: "user", parts: [{ text: "¿Puedes ayudarme con Python?" }] },
    { role: "model", parts: [{ text: resp2.text }] }
  );
  
  // Tercer mensaje
  console.log('\nUsuario: Dame un ejemplo de bucle for');
  let resp3 = await chatWithGemini('Dame un ejemplo de bucle for', historial);
  console.log('Asistente:', resp3.text);
}

// ============================================
// EJEMPLO DE USO: Respuestas JSON estructuradas
// ============================================
async function ejemploRespuestaJSON() {
  console.log('\n=== EJEMPLO RESPUESTA JSON ===');
  
  const requestBody = {
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          lenguaje: { type: "string" },
          dificultad: { type: "string" },
          ventajas: { 
            type: "array",
            items: { type: "string" }
          },
          usos: {
            type: "array", 
            items: { type: "string" }
          }
        },
        required: ["lenguaje", "dificultad", "ventajas", "usos"]
      }
    },
    contents: [{
      role: "user",
      parts: [{
        text: "Dame información sobre Python: nombre, dificultad, 3 ventajas y 3 usos principales"
      }]
    }]
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  const jsonResponse = JSON.parse(data.candidates[0].content.parts[0].text);
  
  console.log('Respuesta JSON estructurada:');
  console.log(JSON.stringify(jsonResponse, null, 2));
}

// ============================================
// EJECUTAR EJEMPLOS
// ============================================
// Descomenta la función que quieras probar:

// ejemploSimple();
// ejemploConHistorial();
// ejemploRespuestaJSON();

// NOTA: Recuerda reemplazar 'TU_API_KEY_AQUI' con tu API key real
// Puedes obtener una gratis en: https://makersuite.google.com/app/apikey