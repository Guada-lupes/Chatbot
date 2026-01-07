import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ChatHeader from '../chat/ChatHeader';
import MessageList, { MessageType } from '../chat/MessageList';
import ChatInput from '../chat/ChatInput';

const ChatContainer: React.FC = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<MessageType[]>([
    {
      text: '¡Hola! 👋 Soy tu asistente virtual potenciado con IA. Estoy aquí para ayudarte con cualquier consulta que tengas. ¿En qué puedo asistirte hoy?',
      isUser: false,
      timestamp: '10:30 AM'
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = (messageText: string): void => {
    // Agregar mensaje del usuario
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

    // Simular respuesta del asistente (aquí conectarás tu backend más adelante)
    setTimeout(() => {
      const assistantMessage: MessageType = {
        text: 'Esta es una respuesta de ejemplo. Aquí conectarás tu lógica con LangChain y Groq.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
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