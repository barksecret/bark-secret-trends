
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark"></div>
    </div>
  );
};
