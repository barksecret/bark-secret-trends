import React from 'react';

interface TooltipProps {
  children: React.ReactElement;
  text: string;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top' }) => {
  const positionClass = position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  return (
    <div className="relative flex items-center group">
      {children}
      <div className={`absolute ${positionClass} w-max max-w-xs p-2 text-xs text-white bg-gray-900/90 dark:bg-black/90 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50`}>
        {text}
      </div>
    </div>
  );
};
