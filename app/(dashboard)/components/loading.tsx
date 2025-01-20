import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-200"></div>
      <p className="mr-4 text-lg text-gray-600">صبوری کنید...</p>
    </div>
  );
};

export default LoadingScreen;