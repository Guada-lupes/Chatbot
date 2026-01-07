// src/config/domainKeywords.ts

export const IN_DOMAIN_KEYWORDS = [
  'cloudnote',
  'nota',
  'notas',
  'sincron',
  'sincronizar',
  'login',
  'iniciar sesión',
  'cuenta',
  'compartir',
  'error',
  'problema'
];

export const SYSTEM_PROMPT = `
Eres un asistente de soporte técnico para CloudNote Pro.

Tu función es ayudar a resolver problemas relacionados con:
- sincronización
- notas
- dispositivos
- inicio de sesión
- configuración de la aplicación

Si no tienes información suficiente, haz preguntas de aclaración.
Sé claro, concreto y orientado a la resolución del problema.
`;

export const OUT_OF_DOMAIN_MESSAGE = 
  "Lo siento, solo puedo ayudar con dudas o problemas relacionados " +
  "con CloudNote Pro (como notas, sincronización, inicio de sesión " +
  "o compartir contenido).\n\n" +
  "Si tienes una consulta sobre CloudNote Pro, dime en qué puedo ayudarte.";