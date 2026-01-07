import React from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ChatHeader: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`rounded-3xl mb-6 backdrop-blur-xl border shadow-2xl ${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/70 border-white/40'
    }`}>
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
              : 'bg-gradient-to-br from-purple-600 to-pink-600'
          }`}>
            <Sparkles className="text-white" size={28} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-purple-400 to-pink-400' 
                : 'from-purple-600 to-pink-600'
            }`}>
              Asistente Virtual
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Listo para ayudarte
              </p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={toggleTheme}
          className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
            isDark 
              ? 'bg-white/10 hover:bg-white/20 text-purple-300' 
              : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
          }`}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;