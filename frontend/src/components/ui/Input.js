// src/components/ui/Input.js
import React from 'react';

export function Input({ ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className}`}
    />
  );
}

export default Input;