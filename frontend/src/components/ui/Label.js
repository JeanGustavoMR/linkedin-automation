// src/components/ui/Label.js
import React from 'react';

export function Label({ children, ...props }) {
  return (
    <label {...props} className="text-gray-700 font-semibold block mb-1">
      {children}
    </label>
  );
}

export default Label;