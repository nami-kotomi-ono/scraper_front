import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 rounded-lg">
      <AlertCircle className="shrink-0" />
      <p>{message}</p>
    </div>
  );
};