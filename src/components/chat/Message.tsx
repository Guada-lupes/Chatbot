import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import FormattedMessage from './FormattedMessage';

interface MessageProps {
  message?: string;
  isUser?: boolean;
  timestamp?: string;
  isTyping?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isUser, timestamp, isTyping }) => {
  const { isDark } = useTheme();

  if (isTyping) {
    return (
      <div className="flex gap-4 animate-fade-in">
        <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
          isDark 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
            : 'bg-gradient-to-br from-purple-600 to-pink-600'
        }`}>
          <Sparkles className="text-white" size={20} />
        </div>
        <div className={`rounded-3xl rounded-tl-md px-6 py-4 shadow-lg ${
          isDark 
            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30' 
            : 'bg-white shadow-purple-200/50'
        }`}>
          <div className="flex gap-1.5">
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? 'bg-purple-400' : 'bg-purple-600'
            }`} style={{animationDelay: '0ms'}}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? 'bg-purple-400' : 'bg-purple-600'
            }`} style={{animationDelay: '150ms'}}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? 'bg-purple-400' : 'bg-purple-600'
            }`} style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex gap-4 justify-end animate-fade-in">
        <div className="flex-1 flex flex-col items-end">
          <div className={`rounded-3xl rounded-tr-md px-6 py-4 max-w-[85%] shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
              : 'bg-gradient-to-br from-purple-600 to-pink-600'
          }`}>
            <p className="text-white leading-relaxed">{message}</p>
          </div>
          {timestamp && (
            <p className={`text-xs mt-2 mr-2 ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {timestamp}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
          isDark 
            ? 'bg-gradient-to-br from-slate-700 to-slate-600' 
            : 'bg-gradient-to-br from-slate-400 to-slate-500'
        }`}>
          <span className="text-white font-bold text-sm">TÚ</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 animate-fade-in">
      <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
        isDark 
          ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
          : 'bg-gradient-to-br from-purple-600 to-pink-600'
      }`}>
        <Sparkles className="text-white" size={20} />
      </div>
      <div className="flex-1">
        <div className={`rounded-3xl rounded-tl-md px-6 py-4 shadow-lg ${
          isDark 
            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30' 
            : 'bg-white shadow-purple-200/50'
        }`}>
          <div className={isDark ? 'text-gray-100' : 'text-gray-800'}>
            <FormattedMessage content={message || ''} isDark={isDark} />
          </div>
        </div>
        {timestamp && (
          <p className={`text-xs mt-2 ml-2 ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default Message;