import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ChatContainer from './components/layout/ChatContainer';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatContainer />
    </ThemeProvider>
  );
};

export default App;