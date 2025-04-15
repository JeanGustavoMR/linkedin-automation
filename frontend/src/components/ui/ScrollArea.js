// src/components/ui/ScrollArea.js
import React from 'react';

export function ScrollArea({ children, className }) {
  return (
    <div className={`overflow-y-auto max-h-[400px] p-4 rounded-md border ${className}`}>
      {children}
    </div>
  );
}

export default ScrollArea;