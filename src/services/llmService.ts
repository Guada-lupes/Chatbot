//Lista de paquetes a instalar:
// npm install react react-dom lucide-react langchain @langchain/groq @langchain/core
//npm install -D tailwindcss postcss autoprefixer typescript @types/react @types/react-dom

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  BaseMessage,
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import { LLM_CONFIG, validateApiKey } from "../config/llmConfig";
import { SYSTEM_PROMPT } from "../config/domainKeywords";
import { DomainClassification, Message } from "../types/assistant.types";

// Inicializar el LLM de Groq
let llm: ChatGroq | null = null;

function initializeLLM(): ChatGroq {
  if (!validateApiKey()) {
    throw new Error("API Key de Groq no configurada");
  }

  if (!llm) {
    llm = new ChatGroq({
      apiKey: LLM_CONFIG.apiKey,
      model: LLM_CONFIG.model,
      temperature: LLM_CONFIG.temperature,
    });
  }

  return llm;
}

/*
  Clasificador de dominio usando LLM
 */
export async function classifyWithLLM(
  userInput: string
): Promise<DomainClassification> {
  try {
    const llmInstance = initializeLLM();

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Eres un clasificador de consultas.\n" +
          "CloudNote Pro es una aplicación de toma de notas que permite:\n" +
          "- crear y editar notas\n" +
          "- sincronizar notas entre dispositivos\n" +
          "- iniciar sesión con una cuenta\n" +
          "- compartir notas con otros usuarios\n\n" +
          "Las preguntas relacionadas con estos temas son IN_DOMAIN.\n" +
          "También considera IN_DOMAIN:\n" +
          "- Saludos generales (hola, buenos días, etc.)\n" +
          "- Solicitudes de ayuda genéricas (ayuda, necesito ayuda, etc.)\n" +
          "- Agradecimientos (gracias, ok, vale, etc.)\n\n" +
          "Solo considera OUT_OF_DOMAIN preguntas claramente no relacionadas como:\n" +
          "- Clima, matemáticas, programación, noticias, deportes, etc.\n\n" +
          "Responde únicamente con IN_DOMAIN o OUT_OF_DOMAIN. " +
          "No añadas ningún otro texto.",
      ],
      ["human", "{question}"],
    ]);

    const parser = new StringOutputParser();
    const chain = prompt.pipe(llmInstance).pipe(parser);

    const response = await chain.invoke({ question: userInput });
    const cleaned = response.trim();

    if (cleaned === "IN_DOMAIN" || cleaned === "OUT_OF_DOMAIN") {
      return cleaned as DomainClassification;
    }

    return DomainClassification.OUT_OF_DOMAIN;
  } catch (error) {
    console.error("Error en clasificador LLM:", error);
    return DomainClassification.OUT_OF_DOMAIN;
  }
}

/*
  Construir mensajes para el LLM conversacional incluyendo memoria
 */
export function buildMessagesFromMemory(messages: Message[]): BaseMessage[] {
  const formattedMessages: BaseMessage[] = [new SystemMessage(SYSTEM_PROMPT)];

  for (const msg of messages) {
    if (msg.role === "user") {
      formattedMessages.push(new HumanMessage(msg.content));
    } else if (msg.role === "assistant") {
      formattedMessages.push(new AIMessage(msg.content));
    }
  }

  return formattedMessages;
}

/*
  Generar respuesta del asistente usando memoria
 */
export async function generateResponseWithMemory(
  userInput: string,
  memoryMessages: Message[]
): Promise<string> {
  try {
    const llmInstance = initializeLLM();

    // Construir mensajes con memoria
    const messages = buildMessagesFromMemory(memoryMessages);

    // Añadir la pregunta actual
    messages.push(new HumanMessage(userInput));

    // Invocar el LLM
    const response = await llmInstance.invoke(messages);

    return response.content as string;
  } catch (error) {
    console.error("Error generando respuesta:", error);
    throw error;
  }
}
