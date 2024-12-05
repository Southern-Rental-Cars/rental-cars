'use client';

import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning'; // Optional types for customization
  onClose?: () => void; // Callback when alert is closed
}

const Alert: React.FC<AlertProps> = ({ message, type = 'info', onClose }) => {
  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md p-4 border rounded-lg shadow-lg flex items-start space-x-4 ${typeStyles[type]}`}
    >
      <div className="flex-grow">
        <p className="font-semibold">{message}</p>
      </div>
      {onClose && (
        <button
          className="text-lg focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default Alert;
