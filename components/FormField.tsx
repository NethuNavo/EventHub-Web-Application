'use client';

import React from 'react';

type Props = {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  placeholder?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  children?: React.ReactNode;
  textarea?: boolean;
  className?: string;
};

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  children,
  textarea,
  className = '',
}: Props) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        {textarea ? (
          <textarea
            id={id}
            rows={5}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`glass-input min-h-[120px] resize-none ${error ? 'ring-1 ring-amber-400/60' : ''}`}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`glass-input ${error ? 'ring-1 ring-amber-400/60' : ''}`}
          />
        )}
        {children && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/70">{children}</div>}
      </div>
      {error && <p className="text-sm text-amber-200">{error}</p>}
    </div>
  );
}
