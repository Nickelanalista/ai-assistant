import { Bot, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { LoadingAnimation } from './LoadingAnimation';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
  isLoading: boolean;
  isDark: boolean;
}

export function ChatMessage({ message, isLatest, isLoading, isDark }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const messageRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = message.content.filter(content => content.type === 'image_url').length;

  useEffect(() => {
    if (isLatest && messageRef.current && (imagesLoaded === totalImages || totalImages === 0)) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLatest, imagesLoaded, totalImages]);

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  const formatText = (text: string) => {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  };

  return (
    <div ref={messageRef} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                     ${isUser ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
        {isUser ? (
          <User className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </div>
      <div className="flex flex-col gap-2 max-w-[80%]">
        {message.content.map((content, index) => (
          <div key={index}>
            {content.type === 'text' && (
              <div className={`p-4 rounded-2xl ${
                isUser 
                  ? 'bg-blue-500 text-white rounded-tr-none' 
                  : isDark
                    ? 'bg-gray-700 text-white rounded-tl-none'
                    : 'bg-purple-100 bg-opacity-70 text-gray-800 rounded-tl-none'
              }`}>
                {formatText(content.text || '')}
              </div>
            )}
            {content.type === 'image_url' && content.image_url && (
              <img 
                src={content.image_url.url} 
                alt="Contenido compartido"
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
                onLoad={handleImageLoad}
              />
            )}
          </div>
        ))}
        {isLatest && !isUser && isLoading && <LoadingAnimation isDark={isDark} />}
      </div>
    </div>
  );
}
