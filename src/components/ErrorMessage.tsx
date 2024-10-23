interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
  isDark: boolean;
}

export function ErrorMessage({ message, onDismiss, isDark }: ErrorMessageProps) {
  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
      <p>{message}</p>
      <button 
        onClick={onDismiss}
        className={`mt-2 px-4 py-2 rounded ${
          isDark ? 'bg-red-800 hover:bg-red-700' : 'bg-red-200 hover:bg-red-300'
        }`}
      >
        Cerrar
      </button>
    </div>
  );
}
