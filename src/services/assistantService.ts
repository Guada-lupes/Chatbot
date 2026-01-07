// src/services/assistantService.ts

import { ConversationMemory } from './conversationMemory';
import { classifyDomainHybrid } from './domainFilter';
import { generateResponseWithMemory } from './llmService';
import { DomainClassification, AssistantResponse } from '../types/assistant.types';
import { OUT_OF_DOMAIN_MESSAGE } from '../config/domainKeywords';

export class AssistantService {
  private memory: ConversationMemory;

  constructor() {
    this.memory = new ConversationMemory();
  }

  /**
   * Maneja el input del usuario y retorna la respuesta
   */
  async handleUserInput(userInput: string): Promise<AssistantResponse> {
    try {
      // 1. Clasificar el dominio
      const domain = await classifyDomainHybrid(userInput);

      // 2. Si está fuera del dominio, respuesta automática
      if (domain === DomainClassification.OUT_OF_DOMAIN) {
        return {
          text: OUT_OF_DOMAIN_MESSAGE,
          isInDomain: false
        };
      }

      // 3. Si está dentro del dominio, guardar en memoria
      this.memory.addUserMessage(userInput);

      // 4. Generar respuesta usando memoria
      const response = await this.generateResponse(userInput);

      // 5. Guardar respuesta en memoria
      this.memory.addAiMessage(response);

      // 6. Retornar respuesta
      return {
        text: response,
        isInDomain: true
      };

    } catch (error) {
      console.error('Error en handleUserInput:', error);
      return {
        text: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
        isInDomain: false
      };
    }
  }

  /**
   * Genera la respuesta del asistente
   */
  private async generateResponse(userInput: string): Promise<string> {
    const memoryMessages = this.memory.getMessages();
    return await generateResponseWithMemory(userInput, memoryMessages);
  }

  /**
   * Limpia la memoria de la conversación
   */
  clearMemory(): void {
    this.memory.clear();
  }

  /**
   * Obtiene el historial de mensajes
   */
  getConversationHistory() {
    return this.memory.getMessages();
  }
}