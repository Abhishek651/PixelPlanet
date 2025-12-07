import React from 'react';

export const Button = ({ children, size = 'md', color = 'primary', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const colorClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      className={`rounded-lg font-medium transition-colors ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
