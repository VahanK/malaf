'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, useDragControls } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { useMotionAllowed } from '../motion/gates';

interface GalleryImage {
  url: string;
  alt?: string;
}

interface SwipeCardsProps {
  images: GalleryImage[];
  accent: string;
  isRtl: boolean;
  title?: string;
}

function FrontCard({
  image,
  accent,
  isRtl,
  onDismiss,
}: {
  image: GalleryImage;
  accent: string;
  isRtl: boolean;
  onDismiss: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-14, 0, 14]);
  const opacity = useTransform(x, [-200, -60, 0, 60, 200], [0, 1, 1, 1, 0]);
  const controls = useDragControls();

  return (
    <motion.div
      className="absolute inset-0 cursor-grab overflow-hidden rounded-[var(--card-radius-lg)] border border-[var(--card-border)] bg-[var(--card-surface)] shadow-xl active:cursor-grabbing touch-none"
      style={{ x, rotate, opacity }}
      drag="x"
      dragControls={controls}
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 50) onDismiss();
      }}
      whileTap={{ scale: 0.98 }}
    >
      {image.url ? (
        <img
          src={image.url}
          alt={image.alt || ''}
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-cover"
        />
      ) : (
        <div className="h-full w-full" style={{ background: accent }} />
      )}
      <div
        className="pointer-events-none absolute bottom-0 h-1.5 w-full"
        style={{ background: accent, [isRtl ? 'right' : 'left']: 0 }}
      />
    </motion.div>
  );
}

export function SwipeCards({ images, accent, isRtl, title }: SwipeCardsProps) {
  const items = (images || []).filter((i) => i && i.url);
  // Hooks must run unconditionally, before any early return.
  const motionAllowed = useMotionAllowed(true);
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));

  if (items.length === 0) return null;

  // Static fallback: reduced motion or non-pointer/touch -> plain grid, same content.
  if (!motionAllowed) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
        {title ? <h3 className="mb-3 text-lg font-semibold text-[var(--card-ink)]">{title}</h3> : null}
        <div className="grid max-w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((img, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[var(--card-radius-lg)] border border-[var(--card-border)] bg-[var(--card-surface)]"
            >
              <img src={img.url} alt={img.alt || ''} className="aspect-square w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const dismiss = () => setOrder((prev) => (prev.length < 2 ? prev : [...prev.slice(1), prev[0]]));

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
      {title ? <h3 className="mb-3 text-lg font-semibold text-[var(--card-ink)]">{title}</h3> : null}
      <div className="relative mx-auto aspect-[4/5] w-full max-w-xs">
        {order
          .slice(0, 4)
          .reverse()
          .map((itemIdx, revPos, arr) => {
            const depth = arr.length - 1 - revPos; // 0 = front
            const isFront = depth === 0;
            const dir = isRtl ? -1 : 1;
            if (isFront) {
              return (
                <FrontCard
                  key={itemIdx}
                  image={items[itemIdx]}
                  accent={accent}
                  isRtl={isRtl}
                  onDismiss={dismiss}
                />
              );
            }
            return (
              <div
                key={itemIdx}
                className={twMerge(
                  'absolute inset-0 overflow-hidden rounded-[var(--card-radius-lg)] border border-[var(--card-border)] bg-[var(--card-surface)] shadow-md',
                )}
                style={{
                  transform: `translateX(${depth * 8 * dir}px) translateY(${depth * 6}px) scale(${1 - depth * 0.05}) rotate(${depth * 2 * dir}deg)`,
                  zIndex: 10 - depth,
                }}
              >
                {items[itemIdx].url ? (
                  <img
                    src={items[itemIdx].url}
                    alt={items[itemIdx].alt || ''}
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <div className="h-full w-full" style={{ background: accent }} />
                )}
              </div>
            );
          })}
      </div>
      {items.length > 1 ? (
        <p className="mt-3 text-center text-xs text-[var(--card-muted)]">
          {isRtl ? 'اسحب لرؤية المزيد' : 'Swipe to see more'}
        </p>
      ) : null}
    </div>
  );
}
