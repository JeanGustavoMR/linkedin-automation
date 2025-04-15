// src/components/ui/Button.js
import React from 'react';

export function Button({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;