'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarDays, Clock3, MapPin } from 'lucide-react';

type SidebarProps = {
  event: {
    label: string;
    date: string;
    time: string;
    location: string;
    price: string;
    image: string;
  };
};

export default function Sidebar({ event }: SidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="rounded-[18px] border border-white/6 bg-white/3 overflow-hidden">
        <div className="relative h-44 overflow-hidden rounded-t-[18px]">
          <Image
            src={event.image}
            alt={event.label}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>
        <div className="p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-gold-soft">Event Details</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{event.label}</h3>

          <div className="mt-4 space-y-3 text-slate-300 text-sm">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-gold" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-gold" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gold" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-white/6 pt-4 text-sm text-slate-300">
            <p className="text-xs uppercase text-gold-soft">Ticket Price</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl text-white">{event.price.split(' ')[0]}</span>
              <span className="text-3xl font-bold text-gold">{event.price.split(' ')[1]}</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">All registrations are subject to availability. Confirmation sent within 24 hours.</p>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] border border-white/6 bg-white/3 p-6">
        <h4 className="text-sm font-semibold text-white">Why register with us?</h4>
        <div className="mt-4 space-y-3 text-slate-300 text-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-gold">•</span>
            <span>Secure your spot with premium service</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-gold">•</span>
            <span>Instant confirmation within 24 hours</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-gold">•</span>
            <span>Personalized experience for every guest</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
