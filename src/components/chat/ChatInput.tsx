import React, { useState, FormEvent, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const { isDark } = useTheme();
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={`rounded-3xl backdrop-blur-xl border shadow-2xl ${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/70 border-white/40'
    }`}>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className={`flex gap-3 rounded-2xl p-2 transition-all duration-300 ${
            isDark 
              ? 'bg-white/10 hover:bg-white/15' 
              : 'bg-purple-50 hover:bg-purple-100'
          }`}>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              placeholder="Escribe tu mensaje aquí..."
              className={`flex-1 px-4 py-3 bg-transparent outline-none text-base ${
                isDark 
                  ? 'text-white placeholder-gray-400' 
                  : 'text-gray-900 placeholder-gray-500'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button 
              type="submit"
              disabled={disabled || !inputValue.trim()}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg ${
                disabled || !inputValue.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105'
              } ${
                isDark
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              }`}
            >
              <span>Enviar</span>
              <Send size={18} />
            </button>
          </div>
        </form>
        <p className={`text-xs mt-3 text-center ${
          isDark ? 'text-gray-500' : 'text-gray-600'
        }`}>
          <Zap size={12} className="inline mb-0.5" /> Potenciado por IA · Respuestas instantáneas
        </p>
      </div>
    </div>
  );
};

export default ChatInput;