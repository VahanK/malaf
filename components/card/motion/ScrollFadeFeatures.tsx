'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { useMotionAllowed } from '../motion/gates';

interface ShowcaseItem {
  image?: string;
  title?: string;
  blurb?: string;
  tags?: string[];
  link?: string;
  repo_url?: string;
  live_url?: string;
  tech?: string[];
}

interface ScrollFadeFeaturesProps {
  items: ShowcaseItem[];
  accent: string;
  isRtl: boolean;
  title?: string;
}

function ItemCard({ item, accent, isRtl }: { item: ShowcaseItem; accent: string; isRtl: boolean }) {
  return (
    <div
      className="w-full rounded-[var(--card-radius-lg)] border p-5 overflow-hidden"
      style={{ background: 'var(--card-surface)', borderColor: 'var(--card-border)' }}
    >
      {item.image ? (
        <div className="mb-4 aspect-video w-full overflow-hidden rounded-[calc(var(--card-radius-lg)*0.6)]">
          <img src={item.image} alt={item.title || ''} className="h-full w-full object-cover" loading="lazy" />
        </div>
      ) : null}
      {item.title ? (
        <h3 className="text-lg font-semibold" style={{ color: 'var(--card-ink)' }}>
          {item.title}
        </h3>
      ) : null}
      {item.blurb ? (
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--card-muted)' }}>
          {item.blurb}
        </p>
      ) : null}
      {item.tags && item.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 5).map((t, i) => (
            <span
              key={i}
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ color: accent, background: accent + '18' }}
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ScrollFadeFeatures({ items, accent, isRtl, title }: ScrollFadeFeaturesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animate = useMotionAllowed();
  const list = Array.isArray(items) ? items.filter(Boolean) : [];

  const heading = (
    <div className="sm:sticky sm:top-16 sm:self-start">
      {title ? (
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl" style={{ color: 'var(--card-ink)' }}>
          {title}
        </h2>
      ) : null}
      <div className="mt-3 h-1 w-16 rounded-full" style={{ background: accent }} />
      <p className="mt-4 text-sm" style={{ color: 'var(--card-muted)' }}>
        {isRtl ? 'مرّر لاستكشاف' : 'Scroll to explore'}
      </p>
    </div>
  );

  if (!animate || list.length === 0) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="grid w-full max-w-full gap-6 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
        {heading}
        <div className="flex flex-col gap-4">
          {list.map((item, i) => (
            <ItemCard key={i} item={item} accent={accent} isRtl={isRtl} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="grid w-full max-w-full gap-6 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]"
    >
      {heading}
      <div className="flex flex-col gap-6">
        {list.map((item, i) => (
          <ScrollStep key={i} index={i} total={list.length} container={containerRef}>
            <ItemCard item={item} accent={accent} isRtl={isRtl} />
          </ScrollStep>
        ))}
      </div>
    </div>
  );
}

function ScrollStep({
  index,
  total,
  container,
  children,
}: {
  index: number;
  total: number;
  container: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.7, 1], [0.35, 1, 1, 0.35]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.7, 1], [0.9, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.25], [24, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, scale, y }} className="will-change-transform">
      {children}
    </motion.div>
  );
}
