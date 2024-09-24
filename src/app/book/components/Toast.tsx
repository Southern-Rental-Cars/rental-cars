import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error'; // Optional types for styling the toast
  onClose: () => void; // Function to close the toast
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  // Automatically close the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 bg-${type === 'success' ? 'green' : 'red'}-500 text-white p-4 rounded-lg shadow-md`}>
      <div className="flex items-center">
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
