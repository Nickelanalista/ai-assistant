interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-between">
      <p>{message}</p>
      <button 
        onClick={onDismiss}
        className="ml-4 text-red-400 hover:text-red-300"
      >
        ×
      </button>
    </div>
  );
}