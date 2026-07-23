'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { useMotionAllowed } from '../motion/gates';

interface GalleryImage {
  url: string;
  alt?: string;
}

interface HorizontalScrollGalleryProps {
  images: GalleryImage[];
  accent: string;
  isRtl: boolean;
  title?: string;
}

function GalleryCard({ img, accent }: { img: GalleryImage; accent: string }) {
  return (
    <div
      className="group relative h-[280px] w-[75vw] max-w-[420px] shrink-0 overflow-hidden rounded-[var(--card-radius-lg)] border sm:h-[340px]"
      style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-surface)' }}
    >
      {img.url ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url("${img.url}")` }}
          role="img"
          aria-label={img.alt || ''}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}22, transparent)` }} />
      )}
      {img.alt ? (
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p
            className="inline-block max-w-full truncate rounded-full px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            {img.alt}
          </p>
        </div>
      ) : null}
      <span
        className="absolute top-3 h-1.5 w-8 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: accent, insetInlineStart: '0.75rem' }}
      />
    </div>
  );
}

function StaticRow({ images, accent, isRtl, title }: HorizontalScrollGalleryProps) {
  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
      {title ? <h2 className="mb-4 px-1 text-xl font-bold" style={{ color: 'var(--card-ink)' }}>{title}</h2> : null}
      <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
        {images.map((img, i) => (
          <div key={i} className="snap-start">
            <GalleryCard img={img} accent={accent} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HorizontalScrollGallery(props: HorizontalScrollGalleryProps) {
  const { images, accent, isRtl, title } = props;
  const allowed = useMotionAllowed();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const forward = useTransform(scrollYProgress, [0, 1], ['1%', '-95%']);
  const backward = useTransform(scrollYProgress, [0, 1], ['-1%', '95%']);
  const x = isRtl ? backward : forward;

  if (!images || images.length === 0) return null;

  // reduced-motion / touch: normal horizontal overflow scroll row (no scroll hijack)
  if (!allowed) return <StaticRow {...props} />;

  return (
    <section ref={targetRef} dir={isRtl ? 'rtl' : 'ltr'} className="relative h-[300vh] w-full max-w-full">
      <div className="sticky top-0 flex h-screen max-w-full items-center overflow-hidden">
        {title ? (
          <h2
            className="pointer-events-none absolute top-8 z-10 px-2 text-2xl font-bold"
            style={{ color: 'var(--card-ink)', insetInlineStart: '1rem' }}
          >
            {title}
          </h2>
        ) : null}
        <motion.div style={{ x }} className={twMerge('flex gap-4 sm:gap-6', isRtl && 'flex-row-reverse')}>
          {images.map((img, i) => (
            <GalleryCard key={i} img={img} accent={accent} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
