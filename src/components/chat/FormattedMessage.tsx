import React from 'react';

interface FormattedMessageProps {
  content: string;
  isDark: boolean;
}

const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, isDark }) => {
  // Dividir el contenido en líneas
  const lines = content.split('\n');

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        // Línea vacía
        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }

        // Detectar listas con guiones o números
        const isListItem = /^[\-\*\•]\s/.test(line) || /^\d+\.\s/.test(line);
        
        // Detectar encabezados (líneas que terminan en :)
        const isHeading = line.trim().endsWith(':') && line.length < 80;

        // Detectar texto en negrita (entre **)
        const hasBold = line.includes('**');

        if (isHeading) {
          return (
            <p key={index} className={`font-semibold text-base ${
              isDark ? 'text-purple-300' : 'text-purple-700'
            }`}>
              {line}
            </p>
          );
        }

        if (isListItem) {
          return (
            <div key={index} className="flex gap-2 ml-2">
              <span className={isDark ? 'text-purple-400' : 'text-purple-600'}>•</span>
              <p className="flex-1 leading-relaxed">
                {formatBoldText(line.replace(/^[\-\*\•]\s/, '').replace(/^\d+\.\s/, ''), isDark)}
              </p>
            </div>
          );
        }

        if (hasBold) {
          return (
            <p key={index} className="leading-relaxed">
              {formatBoldText(line, isDark)}
            </p>
          );
        }

        return (
          <p key={index} className="leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
};

// Función para formatear texto en negrita (**)
function formatBoldText(text: string, isDark: boolean) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return (
        <strong key={index} className={isDark ? 'text-purple-300' : 'text-purple-700'}>
          {content}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default FormattedMessage;