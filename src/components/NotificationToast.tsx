
import React, { useEffect } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';

interface NotificationToastProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bgColor: 'bg-green-500',
      icon: Check,
      borderColor: 'border-green-600'
    },
    error: {
      bgColor: 'bg-red-500',
      icon: X,
      borderColor: 'border-red-600'
    },
    warning: {
      bgColor: 'bg-orange-500',
      icon: AlertTriangle,
      borderColor: 'border-orange-600'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in" dir="rtl">
      <div className={`${config.bgColor} ${config.borderColor} border-r-4 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm`}>
        <div className="flex items-center gap-3">
          <Icon size={20} />
          <span className="font-semibold">{message}</span>
          <button
            onClick={onClose}
            className="mr-auto hover:bg-white/20 p-1 rounded transition-colors"
            aria-label="סגור הודעה"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
