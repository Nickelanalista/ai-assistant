import { useState, useRef } from 'react';
import { Image, Send } from 'lucide-react';
import { validateImage, convertImageToBase64 } from '../utils/image';

interface ChatInputProps {
  onSendMessage: (text: string, imageData?: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [imageData, setImageData] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || imageData) {
      onSendMessage(message, imageData);
      setMessage('');
      setImageData('');
      setSelectedImage(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        validateImage(file);
        setSelectedImage(file);
        const base64Data = await convertImageToBase64(file);
        setImageData(base64Data);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  };

  return (
    <div className="p-6 bg-gray-800 border-t border-gray-700">
      {selectedImage && (
        <div className="mb-4 p-2 bg-gray-700 rounded-lg">
          <img 
            src={imageData}
            alt="Selected"
            className="max-h-32 rounded object-contain mx-auto"
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Image className="w-5 h-5 text-white" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400
                   border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isLoading || (!message.trim() && !imageData)}
          className="p-2.5 rounded-full bg-blue-500 text-white 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-blue-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}