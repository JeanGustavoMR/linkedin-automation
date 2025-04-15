// src/components/ui/Textarea.js
import React from 'react';

export function Textarea({ className, ...props }) {
  return (
    <textarea
      {...props}
      className={`border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}

export default Textarea;