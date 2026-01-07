// src/services/conversationMemory.ts

import { Message } from '../types/assistant.types';

export class ConversationMemory {
  private messages: Message[] = [];

  addUserMessage(content: string): void {
    this.messages.push({
      role: 'user',
      content: content
    });
  }

  addAiMessage(content: string): void {
    this.messages.push({
      role: 'assistant',
      content: content
    });
  }

  getMessages(): Message[] {
    return this.messages;
  }

  clear(): void {
    this.messages = [];
  }

  isEmpty(): boolean {
    return this.messages.length === 0;
  }
}