'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useReducedMotion, useIsDesktopPointer } from '../motion/gates';

interface ShowcaseItem {
  image?: string;
  title?: string;
  blurb?: string;
  tags?: string[];
  link?: string;
}

interface CardCarouselProps {
  items: ShowcaseItem[];
  accent: string;
  isRtl: boolean;
  title?: string;
}

const CARD_W = 260; // px, includes gap accounting below
const GAP = 16;
const STEP = CARD_W + GAP;

function Card({ item, accent, isRtl, animate }: { item: ShowcaseItem; accent: string; isRtl: boolean; animate: boolean }) {
  const body = (
    <div
      className="relative h-64 w-[260px] max-w-full shrink-0 overflow-hidden rounded-[var(--card-radius-lg)] border"
      style={{ borderColor: 'var(--card-border)', background: 'var(--card-surface)' }}
    >
      {item.image ? (
        <img src={item.image} alt={item.title || ''} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}33, var(--card-surface))` }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className={twMerge('absolute inset-x-0 bottom-0 p-4', isRtl ? 'text-right' : 'text-left')}>
        {item.title && <h3 className="text-base font-semibold leading-tight text-white">{item.title}</h3>}
        {item.blurb && <p className="mt-1 line-clamp-2 text-sm text-white/80">{item.blurb}</p>}
        {item.tags && item.tags.length > 0 && (
          <div className={twMerge('mt-2 flex flex-wrap gap-1.5', isRtl && 'justify-end')}>
            {item.tags.slice(0, 3).map((t, i) => (
              <span key={i} className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: `${accent}cc` }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const inner = animate ? (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      {body}
    </motion.div>
  ) : (
    body
  );

  return item.link ? (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block shrink-0">
      {inner}
    </a>
  ) : (
    <div className="shrink-0">{inner}</div>
  );
}

export function CardCarousel(props: CardCarouselProps) {
  const { items, accent, isRtl, title } = props;
  const reduced = useReducedMotion();
  const desktopPointer = useIsDesktopPointer();
  const animate = !reduced;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const compute = () => setPerView(Math.max(1, Math.floor(el.clientWidth / STEP)));
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const list = items ?? [];
  const maxIndex = Math.max(0, list.length - perView);
  const clamped = Math.min(index, maxIndex);
  const atStart = clamped <= 0;
  const atEnd = clamped >= maxIndex;
  const dir = isRtl ? 1 : -1;
  const offset = clamped * STEP * dir;

  if (list.length === 0) return null;

  const shift = (delta: number) => setIndex((i) => Math.min(Math.max(0, Math.min(i, maxIndex) + delta), maxIndex));

  const btnBase =
    'absolute top-1/2 z-10 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border shadow-sm transition disabled:pointer-events-none';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full" style={{ color: 'var(--card-ink)' }}>
      {title && <h2 className={twMerge('mb-3 text-lg font-semibold', isRtl ? 'text-right' : 'text-left')}>{title}</h2>}
      <div className="relative">
        <div ref={viewportRef} className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={animate ? { x: offset } : undefined}
            style={animate ? undefined : { transform: `translateX(${offset}px)` }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            {list.map((it, i) => (
              <Card key={i} item={it} accent={accent} isRtl={isRtl} animate={animate && desktopPointer} />
            ))}
          </motion.div>
        </div>

        {!atStart && (
          <button
            type="button"
            aria-label="Previous"
            onClick={() => shift(-1)}
            className={twMerge(btnBase, isRtl ? 'right-1' : 'left-1')}
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', color: accent }}
          >
            {isRtl ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        )}
        {!atEnd && (
          <button
            type="button"
            aria-label="Next"
            onClick={() => shift(1)}
            className={twMerge(btnBase, isRtl ? 'left-1' : 'right-1')}
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', color: accent }}
          >
            {isRtl ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
