
export const LLM_CONFIG = {
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  model: 'llama-3.1-8b-instant',
  temperature: 0.3
};

// Validar que existe la API key
export function validateApiKey(): boolean {
  if (!LLM_CONFIG.apiKey) {
    console.error('❌ GROQ_API_KEY no está configurada');
    return false;
  }
  return true;
}