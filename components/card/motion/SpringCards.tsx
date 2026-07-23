'use client';

import { motion, MotionConfig } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useReducedMotion, useMotionAllowed } from '../motion/gates';

interface ShowcaseItem {
  image?: string;
  title?: string;
  blurb?: string;
  tags?: string[];
  link?: string;
  live_url?: string;
}

interface SpringCardsProps {
  items: ShowcaseItem[];
  accent: string;
  isRtl: boolean;
  title?: string;
}

const PALETTE = ['#FFE45C', '#7FD1AE', '#8AB6F9', '#F5A6C9', '#C9A9F5', '#FFB27A'];

export function SpringCards({ items, accent, isRtl, title }: SpringCardsProps) {
  const reduced = useReducedMotion();
  const animated = useMotionAllowed() && !reduced;
  const list = (items ?? []).filter(Boolean).slice(0, 6);
  if (list.length === 0) return null;

  const dir = isRtl ? -1 : 1;
  const Arrow = isRtl ? FiArrowLeft : FiArrowRight;
  const spring = { type: 'spring' as const, stiffness: 420, damping: 26 };

  return (
    <MotionConfig reducedMotion="user">
      <section dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
        {title && (
          <h2 className="mb-6 text-2xl font-black tracking-tight" style={{ color: 'var(--card-ink)' }}>
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item, i) => {
            const color = PALETTE[i % PALETTE.length];
            const lifted = i % 3 === 1;
            const href = item.link || item.live_url;

            return (
              <motion.a
                key={i}
                href={href || undefined}
                target={href ? '_blank' : undefined}
                rel={href ? 'noopener noreferrer' : undefined}
                initial="rest"
                animate="rest"
                whileHover={animated ? 'hover' : undefined}
                whileFocus={animated ? 'hover' : undefined}
                transition={spring}
                className={twMerge(
                  'group relative block max-w-full outline-none',
                  lifted && animated ? 'lg:-translate-y-5' : ''
                )}
              >
                {/* back layers */}
                <motion.span
                  aria-hidden
                  variants={{ rest: { x: 0, y: 0 }, hover: { x: dir * -8, y: -8 } }}
                  transition={spring}
                  className="absolute inset-0 rounded-[var(--card-radius-lg)] border-[3px] border-black"
                  style={{ background: color, opacity: 0.5 }}
                />
                <motion.span
                  aria-hidden
                  variants={{ rest: { x: 0, y: 0 }, hover: { x: dir * -4, y: -4 } }}
                  transition={spring}
                  className="absolute inset-0 rounded-[var(--card-radius-lg)] border-[3px] border-black"
                  style={{ background: color, opacity: 0.75 }}
                />
                {/* front card */}
                <div
                  className="relative z-10 overflow-hidden rounded-[var(--card-radius-lg)] border-[3px] border-black p-4"
                  style={{ background: color }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title || ''}
                      loading="lazy"
                      className="mb-3 h-36 w-full rounded-md border-2 border-black object-cover"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <motion.span
                      aria-hidden
                      variants={{ rest: { width: 0, opacity: 0 }, hover: { width: 20, opacity: 1 } }}
                      transition={spring}
                      className="inline-flex shrink-0 items-center overflow-hidden text-black"
                    >
                      <Arrow className="h-5 w-5" />
                    </motion.span>
                    <h3 className="text-base font-black leading-tight text-black line-clamp-2">
                      {item.title || 'Untitled'}
                    </h3>
                  </div>
                  {item.blurb && (
                    <p className="mt-1.5 text-sm font-medium leading-snug text-black/75 line-clamp-2">
                      {item.blurb}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((t, j) => (
                        <span
                          key={j}
                          className="rounded border-2 border-black bg-white px-1.5 py-0.5 text-[11px] font-bold text-black"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <motion.div
                    variants={{
                      rest: { height: 0, opacity: 0, marginTop: 0 },
                      hover: { height: 'auto', opacity: 1, marginTop: 12 },
                    }}
                    transition={spring}
                    className="overflow-hidden"
                  >
                    <span
                      className="inline-flex items-center gap-1 rounded-md border-2 border-black px-2.5 py-1 text-xs font-black text-black"
                      style={{ background: accent }}
                    >
                      View
                      <Arrow className="h-3.5 w-3.5" />
                    </span>
                  </motion.div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>
    </MotionConfig>
  );
}
