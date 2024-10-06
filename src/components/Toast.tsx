import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Set the background color class based on the type
  const backgroundColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`absolute mt-4 left-1/2 transform -translate-x-1/2 ${backgroundColor} text-white p-4 rounded-lg shadow-md`}
    >
      <div className="flex items-center justify-between">
        <p>{message}</p>
        <button
          className="ml-4 text-white font-bold"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Toast;
