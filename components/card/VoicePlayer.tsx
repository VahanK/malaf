'use client'

import { useEffect, useRef, useState } from 'react'

const BARS = [8, 14, 20, 11, 17, 7, 13, 21, 9, 15, 18, 8, 12, 19, 10, 16, 7, 14]

export function VoicePlayer({ src, label, accent }: { src: string | null; label: string; accent: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState<number | null>(null)

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audioRef.current = audio
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
    audio.addEventListener('timeupdate', () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0))
    audio.addEventListener('ended', () => { setPlaying(false); setProgress(0) })
    return () => { audio.pause(); audioRef.current = null }
  }, [src])

  if (!src) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { void audio.play(); setPlaying(true) }
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-[#262a35] bg-[#16181f] px-3.5 py-2.5">
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause voice intro' : 'Play voice intro'}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm text-[#141414] transition-transform active:scale-90"
        style={{ background: accent }}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <div className={`flex h-[22px] flex-1 items-center gap-[2.5px] ${playing ? 'wave-playing' : ''}`} aria-hidden>
        {BARS.map((h, i) => (
          <i
            key={i}
            className="block w-[3px] rounded-sm transition-colors"
            style={{
              height: h,
              background: i / BARS.length <= progress ? accent : i % 2 ? '#4c5262' : '#6b7284',
              animationDelay: playing ? `${(i % 6) * 0.12}s` : undefined,
            }}
          />
        ))}
      </div>
      <small className="whitespace-nowrap text-[11px] text-[#9aa0ae]">
        {label}{duration ? ` · ${fmt(duration)}` : ''}
      </small>
    </div>
  )
}
