import { useState, useRef } from 'react';
import { Image, Send } from 'lucide-react';
import { validateImage, convertImageToBase64, processMultipleImages } from '../utils/image';

interface ChatInputProps {
  onSendMessage: (text: string, imageData: string[]) => void;
  isLoading: boolean;
  isDark: boolean;
}

export function ChatInput({ onSendMessage, isLoading, isDark }: ChatInputProps & { isDark: boolean }) {
  const [message, setMessage] = useState('');
  const [imageData, setImageData] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || imageData.length > 0) {
      onSendMessage(message, imageData);
      setMessage('');
      setImageData([]);
      setSelectedImages([]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const newImageData = await processMultipleImages(files);
      setImageData(prev => [...prev, ...newImageData]);
      setSelectedImages(prev => [...prev, ...files]);
    } catch (error) {
      console.error('Error processing images:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleImageSelect = (data: string) => {
    setSelectedPreview(selectedPreview === data ? null : data);
  };

  return (
    <div className={`p-2 sm:p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border-t flex-shrink-0 max-h-[30vh] overflow-y-auto`}>
      {selectedImages.length > 0 && (
        <div className="mb-2 p-1 bg-gray-700 rounded-lg flex overflow-x-auto">
          {imageData.map((data, index) => (
            <div key={index} className="relative mr-1 flex-shrink-0">
              <img 
                src={data}
                alt={`Selected ${index}`}
                className={`h-12 w-12 sm:h-16 sm:w-16 object-cover rounded cursor-pointer ${selectedPreview === data ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleImageSelect(data)}
              />
            </div>
          ))}
        </div>
      )}
      {selectedPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedPreview(null)}>
          <img 
            src={selectedPreview}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Image className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple={true}
            className="hidden"
          />
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 sm:p-3 text-sm sm:text-base rounded-lg bg-gray-700 text-white placeholder-gray-400
                   border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isLoading || (!message.trim() && imageData.length === 0)}
          className="p-2 sm:p-2.5 rounded-full bg-blue-500 text-white 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-blue-600 transition-colors"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>
    </div>
  );
}
