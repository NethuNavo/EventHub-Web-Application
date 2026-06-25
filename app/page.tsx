'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Clock3, MapPin, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FormField from '../components/FormField';
import FeatureCard from '../components/FeatureCard';
import GoldButton from '../components/GoldButton';

type EventOption = {
  id: string;
  label: string;
  sub: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
};

const events: EventOption[] = [
  {
    id: 'tech-summit',
    label: 'Tech Summit 2026',
    sub: 'July 14 · BMICH, Colombo',
    date: 'Monday, July 14, 2026',
    time: '9:00 AM — 6:00 PM IST',
    location: 'BMICH — Bandaranaike Memorial International Conference Hall, Colombo 07',
    price: 'LKR 3,500',
    image: '/asset/tech-summit.png',
  },
  {
    id: 'ai-workshop',
    label: 'AI & Machine Learning Workshop',
    sub: 'August 3 · Colombo',
    date: 'Monday, August 3, 2026',
    time: '10:00 AM — 4:00 PM IST',
    location: 'Ceylon Chamber of Commerce, 50 Navam Mawatha, Colombo 02',
    price: 'LKR 2,500',
    image: '/asset/ai-machine-learning.jpeg',
  },
  {
    id: 'product-design-conf',
    label: 'Product Design Conference',
    sub: 'August 22 · Kandy',
    date: 'Saturday, August 22, 2026',
    time: '8:30 AM — 5:30 PM IST',
    location: 'Kandy City Centre Convention Hall, Dalada Veediya, Kandy',
    price: 'LKR 3,000',
    image: '/asset/product-design.jpg',
  },
  {
    id: 'data-engineering-bootcamp',
    label: 'Data Engineering Bootcamp',
    sub: 'September 5 · Colombo',
    date: 'Saturday, September 5, 2026',
    time: '9:00 AM — 5:00 PM IST',
    location: 'Sri Lanka Convention Bureau, Level 5, Galadari Hotel, Colombo 01',
    price: 'LKR 2,000',
    image: '/asset/data-engineering.jpeg',
  },
  {
    id: 'startup-pitch-night',
    label: 'Startup Pitch Night',
    sub: 'September 19 · Galle',
    date: 'Saturday, September 19, 2026',
    time: '6:00 PM — 10:00 PM IST',
    location: 'Galle Face Hotel Ballroom, 2 Kollupitiya Road, Colombo 03',
    price: 'LKR 1,000',
    image: '/asset/startup.jpeg',
  },
];

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  eventName: events[0].id,
  guests: '1',
  dietary: 'No preference',
  notes: '',
};

const dietaryOptions = ['No preference', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+0-9 ()-]{7,20}$/;

export default function HomePage() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const errors = useMemo(() => ({
    fullName: !form.fullName.trim() ? 'Full name is required.' : '',
    email: !form.email.trim() ? 'Email address is required.' : !emailRegex.test(form.email) ? 'Enter a valid email address.' : '',
    phone: !form.phone.trim() ? 'Phone number is required.' : !phoneRegex.test(form.phone) ? 'Enter a valid phone number.' : '',
    guests: !form.guests || Number(form.guests) < 1 || Number(form.guests) > 10 ? 'Enter a guest count between 1 and 10.' : '',
    notes: form.notes.length > 500 ? 'Notes may not exceed 500 characters.' : '',
  }), [form]);

  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));
  const handleBlur = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true, guests: true, notes: true });

    if (hasErrors) {
      setStatus('error');
      setMessage('Please resolve the highlighted fields before continuing.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
      setMessage('Registration submitted successfully.');
      setForm(initialForm);
      setTouched({});
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message || 'Submission failed.');
    }
  };

  const selectedEvent = events.find((event) => event.id === form.eventName) ?? events[0];
  const unresolvedCount = Object.values(errors).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-10 sm:px-8 lg:px-16 text-slate-100 font-inter">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(212,175,55,0.12)]">
              <Image src="/asset/Logo.png" alt="Event Hub logo" fill sizes="64px" className="object-cover" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Event Hub</p>
              <p className="mt-1 text-xs text-slate-500">Exclusive events tailored for premium audiences</p>
            </div>
          </div>

        </header>

        <div className="grid gap-8 md:grid-cols-[1.7fr_0.95fr]">
          <div className="glass-panel p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-8 grid gap-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-gold-soft">
                <span className="font-semibold">01</span>
                <span>Personal Information</span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-semibold tracking-tight text-white">Reserve your seat</h1>
                <p className="mt-3 text-xl sm:text-2xl lg:text-3xl italic text-gold">at the event</p>
              </div>
              <p className="max-w-2xl text-slate-400">Complete the form below. A confirmation will be dispatched to your inbox and our team notified immediately upon submission.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/50 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-gold-soft">01 Personal Information</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">Personal information</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">Step 1</span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    id="fullName"
                    label="Full Name*"
                    value={form.fullName}
                    onChange={(v) => handleChange('fullName', v)}
                    onBlur={() => handleBlur('fullName')}
                    error={touched.fullName ? errors.fullName : ''}
                    placeholder="Alexandra Chen"
                  />

                  <FormField
                    id="email"
                    label="Email Address*"
                    type="email"
                    value={form.email}
                    onChange={(v) => handleChange('email', v)}
                    onBlur={() => handleBlur('email')}
                    error={touched.email ? errors.email : ''}
                    placeholder="alex@fim.com"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    id="phone"
                    label="Phone Number*"
                    value={form.phone}
                    onChange={(v) => handleChange('phone', v)}
                    onBlur={() => handleBlur('phone')}
                    error={touched.phone ? errors.phone : ''}
                    placeholder="+65 9000 0000"
                  />

                  <FormField
                    id="company"
                    label="Company / Organisation"
                    value={form.company}
                    onChange={(v) => handleChange('company', v)}
                    placeholder="Prestige Holdings (optional)"
                  />
                </div>
              </section>

              <section className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/50 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-gold-soft">02 Event Details</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">Attendance details</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">Step 2</span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="eventName" className="block text-sm font-medium text-slate-300">Select Event*</label>
                    <select
                      id="eventName"
                      value={form.eventName}
                      onChange={(e) => handleChange('eventName', e.target.value)}
                      className="glass-input w-full"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.label} — {ev.sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="guests" className="block text-sm font-medium text-slate-300">Number of Guests*</label>
                    <input
                      id="guests"
                      type="number"
                      min={1}
                      max={10}
                      value={form.guests}
                      onChange={(e) => handleChange('guests', e.target.value)}
                      className="glass-input w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dietary" className="block text-sm font-medium text-slate-300">Dietary Preference*</label>
                  <select
                    id="dietary"
                    value={form.dietary}
                    onChange={(e) => handleChange('dietary', e.target.value)}
                    className="glass-input w-full"
                  >
                    {dietaryOptions.map((diet) => (
                      <option key={diet} value={diet}>
                        {diet}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              <section className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/50 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-gold-soft">03 Special Requests</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">Personalized experience</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">Step 3</span>
                </div>

                <FormField
                  id="notes"
                  label="Additional Notes"
                  textarea
                  value={form.notes}
                  onChange={(v) => handleChange('notes', v)}
                  onBlur={() => handleBlur('notes')}
                  error={touched.notes ? errors.notes : ''}
                  placeholder="Accessibility requirements, preferred seating, or anything we should know..."
                />

                <div className="rounded-3xl border border-amber-500/10 bg-amber-950/10 p-4 text-sm text-amber-200">
                  <p className="font-medium">Please resolve {unresolvedCount} fields before continuing.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <GoldButton type="submit">
                    Confirm Registration
                    <ArrowRight className="h-5 w-5" />
                  </GoldButton>
                </div>

                {status === 'success' && <div className="text-sm text-emerald-200">Registration submitted successfully.</div>}
                {status === 'error' && <div className="text-sm text-amber-200">{message}</div>}
              </section>
            </form>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard title="Secure Your Spot" desc="Limited seats available for this exclusive event" icon={<ShieldCheck />} />
              <FeatureCard title="Instant Confirmation" desc="Receive a confirmation email within 24 hours" icon={<Truck />} />
              <FeatureCard title="Personalized Experience" desc="Tailored event experience just for you" icon={<Star />} />
              <FeatureCard title="24/7 Support" desc="Our team is here to help you anytime" icon={<Sparkles />} />
            </div>

            <footer className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 px-6 py-5 text-sm text-slate-400">
              <p>Your information is secure and will never be shared.</p>
              <p className="mt-2">© 2026 Event Hub. All rights reserved.</p>
            </footer>
          </div>

          <div className="hidden lg:block">
            <Sidebar event={selectedEvent} />
          </div>
        </div>
      </div>
    </main>
  );
}
