import { Bot } from 'lucide-react';

export function LoadingAnimation({ isDark }: { isDark: boolean }) {
  return (
    <div className={`flex items-center space-x-4 p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}>
      <div className="relative w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
        <Bot className="w-8 h-8 text-white" />
        <div className="absolute inset-0 border-4 border-t-blue-300 border-blue-500 rounded-full animate-spin"></div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-24 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="h-2 w-32 bg-gray-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
