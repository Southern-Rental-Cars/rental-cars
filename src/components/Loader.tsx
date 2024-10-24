import React from 'react';

interface LoaderProps {
  message?: string;  // Optional loading message
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="loader-spinner border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin mb-4"></div>
      {message && <p className="text-gray-600 text-lg">{message}</p>}
    </div>
  );
};

export default Loader;
