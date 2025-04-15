// src/components/ui/Card.js
import React from 'react';

export function Card({ children, className, ...props }) {
  return (
    <div className={`bg-cardBg shadow-xl backdrop-blur-sm border border-borderGray rounded-lg p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={`border-b border-borderGray pb-4 mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h2 className={`text-lg font-bold text-textPrimary ${className}`}>{children}</h2>;
}

export function CardDescription({ children, className }) {
  return <p className={`text-sm text-textSecondary ${className}`}>{children}</p>;
}

export function CardContent({ children, className }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={`pt-4 border-t border-borderGray mt-4 ${className}`}>{children}</div>;
}

export default Card;