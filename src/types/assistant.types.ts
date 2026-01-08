
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export enum DomainClassification {
  IN_DOMAIN = 'IN_DOMAIN',
  OUT_OF_DOMAIN = 'OUT_OF_DOMAIN'
}

export interface AssistantResponse {
  text: string;
  isInDomain: boolean;
}

// Configuración para el LLM
export interface LLMConfig {
  model: string;
  temperature: number;
  apiKey: string;
}