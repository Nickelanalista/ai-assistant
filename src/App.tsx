import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ErrorMessage } from './components/ErrorMessage';
import { generateAIResponse } from './lib/openai';
import type { Message, ChatState, MessageContent } from './types';
import { Bot } from 'lucide-react';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ViewportMeta } from './components/ViewportMeta';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === null ? true : savedTheme !== 'light';
  });
  
  const [chatState, setChatState] = useState<ChatState>({
    messages: [{
      role: 'assistant',
      content: [{ 
        type: 'text',
        text: '¡Hola! Soy tu asistente AI. ¿En qué puedo ayudarte hoy?'
      }]
    }],
    isLoading: false,
    error: null,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };
  }, [chatState.messages, chatState.isLoading]);

  useEffect(() => {
    const setVH = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);

    return () => window.removeEventListener('resize', setVH);
  }, []);

  const handleSendMessage = async (text: string, imageData: string[]) => {
    const newMessage: Message = {
      role: 'user',
      content: [
        { type: 'text', text },
        ...imageData.map(data => ({ type: 'image_url', image_url: { url: data } } as MessageContent))
      ]
    };

    setChatState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const aiResponse = await generateAIResponse([...chatState.messages, newMessage]);
      setChatState(prevState => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            role: 'assistant',
            content: [{ type: 'text', text: aiResponse.content }]
          }
        ],
        isLoading: false,
      }));
    } catch (error) {
      setChatState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  };

  const clearError = () => {
    setChatState(prev => ({ ...prev, error: null }));
  };

  return (
    <>
      <ViewportMeta />
      <div className="min-h-screen flex items-center justify-center bg-transparent animated-bg p-4">
        <div className="w-full max-w-3xl h-[90vh] max-h-[calc(var(--vh,1vh)*90)] flex flex-col overflow-hidden rounded-2xl shadow-2xl">
          <div className={`chat-window flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-white bg-opacity-70 backdrop-blur-md'}`}>
            <header className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-gray-700' : 'border-blue-200'}`}>
              <div className="flex items-center gap-2">
                <Bot className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>AI Assistant</h1>
              </div>
              <ThemeToggle isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6" ref={chatContainerRef}>
              {chatState.messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  isLatest={index === chatState.messages.length - 1}
                  isLoading={chatState.isLoading && index === chatState.messages.length - 1}
                  isDark={isDark}
                />
              ))}
              {chatState.isLoading && (
                <LoadingAnimation isDark={isDark} />
              )}
              {chatState.error && (
                <ErrorMessage 
                  message={chatState.error}
                  onDismiss={clearError}
                  isDark={isDark}
                />
              )}
            </main>

            <ChatInput 
              onSendMessage={handleSendMessage}
              isLoading={chatState.isLoading}
              isDark={isDark}
            />

            <div className={`text-center p-2 text-sm border-t ${
              isDark ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-blue-200'
            }`}>
              Desarrollado por <a href="https://cordillera.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">@CordilleraLabs</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
