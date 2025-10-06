import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Clock, AlertTriangle } from 'lucide-react';

interface AutoSaveNotificationProps {
  message: string;
  type: 'success' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function AutoSaveNotification({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}: AutoSaveNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full border rounded-lg p-3 shadow-lg ${getBackgroundColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="text-sm font-medium">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}