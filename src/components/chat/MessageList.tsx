import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Message from './Message';

export interface MessageType {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const { isDark } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <main className={`flex-1 rounded-3xl backdrop-blur-xl border mb-6 shadow-2xl overflow-hidden ${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/70 border-white/40'
    }`}>
      <div className="h-[calc(100vh-340px)] overflow-y-auto px-8 py-8">
        <div className="space-y-6 max-w-4xl mx-auto">
          
          {/* Separador de fecha */}
          <div className="flex justify-center mb-8">
            <div className={`px-6 py-3 rounded-full text-sm font-medium ${
              isDark 
                ? 'bg-white/10 text-gray-300' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              Hoy, 10:30 AM
            </div>
          </div>

          {/* Renderizar mensajes */}
          {messages.map((msg, index) => (
            <Message
              key={index}
              message={msg.text}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
          ))}

          {/* Indicador de "escribiendo..." */}
          {isTyping && <Message isTyping={true} />}

          {/* Elemento invisible para hacer scroll */}
          <div ref={messagesEndRef} />

        </div>
      </div>
    </main>
  );
};

export default MessageList;