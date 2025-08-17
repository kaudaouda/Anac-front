import React, { useEffect } from 'react';
import { 
  CheckCircle as CheckCircleIcon, 
  Close as XMarkIcon 
} from '@mui/icons-material';

const SuccessNotification = ({ 
  isVisible, 
  message, 
  onClose, 
  type = 'success',
  autoHideDuration = 5000 
}) => {
  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <CheckCircleIcon className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <CheckCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-green-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[99999] animate-in slide-in-from-right duration-300" style={{ zIndex: 99999 }}>
      <div className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {message}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex ${getTextColor()} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
