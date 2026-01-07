import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ChatHeader from '../chat/ChatHeader';
import MessageList, { MessageType } from '../chat/MessageList';
import ChatInput from '../chat/ChatInput';
import { AssistantService } from '../../services/assistantService';

const ChatContainer: React.FC = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<MessageType[]>([
    {
      text: '¡Hola! 👋 Soy tu asistente virtual de CloudNote Pro. Estoy aquí para ayudarte con cualquier duda sobre notas, sincronización, inicio de sesión o cualquier problema con la aplicación. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Referencia al servicio del asistente
  const assistantServiceRef = useRef<AssistantService | null>(null);

  // Inicializar el servicio del asistente
  useEffect(() => {
    assistantServiceRef.current = new AssistantService();
  }, []);

  const handleSendMessage = async (messageText: string): Promise<void> => {
    // Agregar mensaje del usuario inmediatamente
    const userMessage: MessageType = {
      text: messageText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);


    try {
      // Llamar al servicio del asistente
      const response = await assistantServiceRef.current?.handleUserInput(messageText);

      if (response) {
        const assistantMessage: MessageType = {
          text: response.text,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (error) {
      console.error('Error al obtener respuesta:', error);
      
      // Mensaje de error para el usuario
      const errorMessage: MessageType = {
        text: 'Lo siento, ha ocurrido un error. Por favor, verifica tu conexión e intenta de nuevo.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
    }`}>
      {/* Efectos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-purple-500' : 'bg-purple-300'
        }`}></div>
        <div className={`absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-pink-500' : 'bg-pink-300'
        }`}></div>
      </div>

      {/* Container principal con márgenes mayores */}
      <div className="relative max-w-5xl mx-auto px-6 py-8 min-h-screen flex flex-col">
        <ChatHeader />
        <MessageList messages={messages} isTyping={isTyping} />
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default ChatContainer;