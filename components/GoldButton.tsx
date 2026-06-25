'use client';

import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export default function GoldButton({ children, onClick, type = 'button' }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-[#C9A55C] to-[#E1C984] px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_60px_rgba(201,165,92,0.16)] transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40"
    >
      {children}
    </button>
  );
}
