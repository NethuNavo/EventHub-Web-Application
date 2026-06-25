'use client';

import React from 'react';

type Props = {
  title: string;
  desc?: string;
  icon?: React.ReactNode;
};

export default function FeatureCard({ title, desc, icon }: Props) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/6 bg-white/3 p-4">
      <div className="rounded-full bg-gold/10 p-3 text-gold">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        {desc && <p className="text-xs text-slate-300">{desc}</p>}
      </div>
    </div>
  );
}
