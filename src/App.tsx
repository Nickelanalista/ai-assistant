import { useState, useEffect } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ErrorMessage } from './components/ErrorMessage';
import { generateAIResponse } from './lib/openai';
import type { Message, ChatState } from './types';
import { Bot } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  const [chatState, setChatState] = useState<ChatState>({
    messages: [{
      role: 'assistant',
      content: [{ 
        type: 'text', 
        text: '¡Hola! ¿Cómo puedo ayudarte hoy?' 
      }]
    }],
    isLoading: false,
    error: null
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSendMessage = async (text: string, imageData?: string) => {
    const newMessage: Message = {
      role: 'user',
      content: [
        ...(imageData ? [{ type: 'image_url', image_url: { url: imageData } }] : []),
        { type: 'text', text }
      ]
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isLoading: true,
      error: null
    }));

    try {
      const aiResponse = await generateAIResponse(
        chatState.messages.concat(newMessage)
      );

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          role: 'assistant',
          content: [{ type: 'text', text: aiResponse.content }]
        }],
        isLoading: false
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al comunicarse con la IA'
      }));
    }
  };

  const clearError = () => {
    setChatState(prev => ({ ...prev, error: null }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="chat-window bg-gray-800 rounded-2xl shadow-2xl flex flex-col">
        <header className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold text-white">AI Assistant</h1>
          </div>
          <ThemeToggle isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6">
          {chatState.messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message} 
              isLatest={index === chatState.messages.length - 1}
            />
          ))}
          {chatState.error && (
            <ErrorMessage 
              message={chatState.error}
              onDismiss={clearError}
            />
          )}
        </main>

        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={chatState.isLoading}
        />

        <div className="text-center p-2 text-sm text-gray-400 border-t border-gray-700">
          Desarrollado por <a href="https://twitter.com/CordilleraLabs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">@CordilleraLabs</a>
        </div>
      </div>
    </div>
  );
}

export default App;