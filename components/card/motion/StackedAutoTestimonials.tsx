'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { FiMessageCircle } from 'react-icons/fi';
import { useReducedMotion } from './gates';

interface Quote {
  text: string;
  attribution: string;
  date_label?: string;
}

interface StackedAutoTestimonialsProps {
  quotes: Quote[];
  accent: string;
  isRtl: boolean;
  title?: string;
}

const DURATION_MS = 5000;

export function StackedAutoTestimonials({ quotes, accent, isRtl, title }: StackedAutoTestimonialsProps) {
  const reduced = useReducedMotion();
  const items = (quotes ?? []).filter((q) => q && q.text);
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number>(0);

  useEffect(() => {
    if (reduced || items.length <= 1) return;
    let mounted = true;
    start.current = performance.now();
    const loop = (now: number) => {
      if (!mounted) return;
      const p = Math.min(1, (now - start.current) / DURATION_MS);
      setTick(p);
      if (p >= 1) {
        setActive((a) => (a + 1) % items.length);
        start.current = now;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduced, items.length, active]);

  const jump = (i: number) => {
    setActive(i);
    start.current = performance.now();
    setTick(0);
  };

  if (items.length === 0) return null;

  const Card = ({ q, tone }: { q: Quote; tone: number }) => (
    <div
      className={twMerge(
        'rounded-[var(--card-radius-lg)] border border-[var(--card-border)] p-5 shadow-sm',
        tone % 2 === 0 ? 'bg-[var(--card-surface)]' : 'bg-[var(--card-bg)]'
      )}
      style={{ minHeight: 160 }}
    >
      <FiMessageCircle size={20} style={{ color: accent }} className="mb-3" />
      <p className="text-[15px] leading-relaxed text-[var(--card-ink)]">{q.text}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-[var(--card-ink)]">{q.attribution}</span>
        {q.date_label && <span className="text-xs text-[var(--card-muted)]">{q.date_label}</span>}
      </div>
    </div>
  );

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="min-w-0">
          {title && <h3 className="mb-4 text-lg font-bold text-[var(--card-ink)]">{title}</h3>}
          <div className="flex flex-col gap-2">
            {items.map((q, i) => {
              const isActive = i === active;
              const fill = reduced ? (isActive ? 100 : 0) : isActive ? tick * 100 : i < active ? 100 : 0;
              return (
                <button
                  key={i}
                  onClick={() => jump(i)}
                  className="group w-full min-w-0 text-start"
                  aria-current={isActive}
                >
                  <span className="mb-1 block truncate text-sm text-[var(--card-muted)] group-hover:text-[var(--card-ink)]">
                    {q.attribution}
                  </span>
                  <span className="block h-1.5 w-full overflow-hidden rounded-full bg-[var(--card-border)]">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${fill}%`, backgroundColor: accent, transition: reduced ? 'none' : 'width 60ms linear' }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative min-w-0">
          {reduced ? (
            <div className="flex flex-col gap-3">
              {items.map((q, i) => (
                <Card key={i} q={q} tone={i} />
              ))}
            </div>
          ) : (
            <div className="relative" style={{ minHeight: 200 }}>
              {items.map((q, i) => {
                const rel = (i - active + items.length) % items.length;
                if (rel > 2) return i === active ? null : null;
                return (
                  <AnimatePresence key={i}>
                    {rel <= 2 && (
                      <motion.div
                        className="absolute inset-x-0 top-0"
                        initial={false}
                        animate={{
                          scale: 1 - rel * 0.05,
                          y: rel * 14,
                          x: isRtl ? -rel * 10 : rel * 10,
                          opacity: rel === 0 ? 1 : 0.6 - rel * 0.15,
                          zIndex: 10 - rel,
                        }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                        style={{ pointerEvents: rel === 0 ? 'auto' : 'none', zIndex: 10 - rel }}
                        onClick={() => rel !== 0 && jump(i)}
                      >
                        <Card q={q} tone={i} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
