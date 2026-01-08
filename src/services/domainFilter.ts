
import { DomainClassification } from '../types/assistant.types';
import { IN_DOMAIN_KEYWORDS } from '../config/domainKeywords';
import { classifyWithLLM } from './llmService';

/*
  Normaliza el texto a minúsculas y quita espacios
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/*
  Clasificador basado en reglas (palabras clave)
 */
export function classifyDomainByRules(userInput: string): DomainClassification {
  if (!userInput || typeof userInput !== 'string') {
    return DomainClassification.OUT_OF_DOMAIN;
  }

  const text = normalizeText(userInput);

  for (const keyword of IN_DOMAIN_KEYWORDS) {
    if (text.includes(keyword)) {
      return DomainClassification.IN_DOMAIN;
    }
  }

  return DomainClassification.OUT_OF_DOMAIN;
}

/*
  Clasificador basado en LLM 
 */
export async function classifyDomainByLLM(userInput: string): Promise<DomainClassification> {
  return await classifyWithLLM(userInput);
}

/*
  Clasificador híbrido: primero reglas, luego LLM si es necesario
 */
export async function classifyDomainHybrid(userInput: string): Promise<DomainClassification> {
  try {
    // Primero intentamos con reglas
    const ruleResult = classifyDomainByRules(userInput);
    
    if (ruleResult === DomainClassification.IN_DOMAIN) {
      return DomainClassification.IN_DOMAIN;
    }

    // Si las reglas no detectan dominio, usamos el LLM
    return await classifyDomainByLLM(userInput);

  } catch (error) {
    console.error('Error en clasificador híbrido:', error);
    return DomainClassification.OUT_OF_DOMAIN;
  }
}