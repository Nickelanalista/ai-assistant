import { Bot, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLatest]);

  return (
    <div ref={messageRef} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                     ${isUser ? 'bg-blue-500' : 'bg-gray-600'}`}>
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
                  : 'bg-gray-700 text-white rounded-tl-none'
              }`}>
                {content.text}
              </div>
            )}
            {content.type === 'image_url' && content.image_url && (
              <img 
                src={content.image_url.url} 
                alt="Shared content"
                className="max-w-sm rounded-lg shadow-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}