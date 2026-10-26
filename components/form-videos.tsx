"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FormVideo } from "@/lib/data/exercise-videos";

// Loaded on demand so the ~40 KB list never ships in the workout bundle.
let cache: Promise<Record<string, FormVideo[]>> | null = null;
const load = () => (cache ??= import("@/lib/data/exercise-videos").then((m) => m.EXERCISE_VIDEOS));

const watchUrl = (v: FormVideo) => v.vertical ? `https://www.youtube.com/shorts/${v.videoId}` : `https://www.youtube.com/watch?v=${v.videoId}`;
/** Muted, inline, only ever built after an explicit tap, so background audio (YouTube Music etc.) is never interrupted. */
export const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${id}`;
export const searchUrl = (name: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} proper form`)}&sp=EgIYAQ%253D%253D`;

function Thumb({ v, online }: { v: FormVideo; online: boolean }) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${v.videoId}/${v.vertical ? "oardefault" : "hqdefault"}.jpg`);
  const [failed, setFailed] = useState(false);
  if (!online || failed) return <span className="absolute inset-0 grid place-items-center p-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Video</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" decoding="async" draggable={false} className={`absolute inset-0 size-full object-cover select-none ${v.vertical ? "" : "scale-[1.34]"}`}
    onLoad={(e) => { if (src.includes("oardefault") && e.currentTarget.naturalWidth <= 120) setSrc(`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`); }}
    onError={() => (src.includes("oardefault") ? setSrc(`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`) : setFailed(true))} />;
}

export function FormVideos({ exerciseId, name, custom = false }: { exerciseId: string; name: string; custom?: boolean }) {
  const [videos, setVideos] = useState<FormVideo[] | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  useEffect(() => {
    let live = true;
    setPlaying(null);
    load().then((ix) => { if (live) setVideos(ix[exerciseId] ?? []); }).catch(() => { if (live) setVideos([]); });
    const on = () => setOnline(navigator.onLine);
    on(); window.addEventListener("online", on); window.addEventListener("offline", on);
    return () => { live = false; window.removeEventListener("online", on); window.removeEventListener("offline", on); };
  }, [exerciseId]);
  if (videos === null) return null;
  if (videos.length === 0) {
    if (!custom) return null;
    return (
      <a href={searchUrl(name)} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center rounded-lg border border-dashed text-sm hover:bg-muted/60" data-testid="form-videos-search">
        Search form videos on YouTube ↗
      </a>
    );
  }
  const cur = videos.find((v) => v.videoId === playing);
  return (
    <section data-testid="form-videos">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="mono-label">Form videos</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{videos.length} video{videos.length > 1 ? "s" : ""} · YouTube</p>
      </div>
      {cur && online && <VideoViewer v={cur} onClose={() => setPlaying(null)} />}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {videos.map((v) => (
          <div key={v.videoId} className="w-[7.5rem] shrink-0 snap-start">
            {online ? (
              <button type="button" onClick={() => setPlaying(v.videoId)} aria-label={`Play ${v.title} (muted)`} data-testid="form-video-card"
                className={`relative block aspect-[9/16] w-full overflow-hidden rounded-xl border bg-muted `}>
                <Thumb v={v} online={online} />
                <span className="absolute inset-0 grid place-items-center" aria-hidden>
                  <span className="grid size-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur"><svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-current"><path d="M8 5v14l11-7z" /></svg></span>
                </span>
              </button>
            ) : (
              <a href={watchUrl(v)} target="_blank" rel="noreferrer" className="relative block aspect-[9/16] w-full overflow-hidden rounded-xl border border-dashed"><Thumb v={v} online={false} /></a>
            )}
            <p className="mt-1.5 line-clamp-2 text-xs leading-4">{v.title}</p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{v.channel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Full-screen fixed overlay (not the Fullscreen API, which iOS Safari lacks for non-video elements).
 *  The iframe only exists while this is mounted, so closing stops playback. */
function VideoViewer({ v, onClose }: { v: FormVideo; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const startY = useRef<number | null>(null);
  const [dy, setDy] = useState(0);
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !ref.current) return;
      const f = [...ref.current.querySelectorAll<HTMLElement>("button, a[href], iframe")];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; prevFocus?.focus?.(); };
  }, [onClose]);
  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-label={`Form video: ${v.title}`} data-testid="form-video-player"
      className="fixed inset-0 z-[100] flex h-[100dvh] flex-col bg-black/95 text-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      style={{ transform: dy ? `translateY(${dy}px)` : undefined, opacity: dy ? Math.max(0.4, 1 - dy / 400) : undefined }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={(e) => { startY.current = e.touches[0].clientY; }}
      onTouchMove={(e) => { if (startY.current !== null) setDy(Math.max(0, e.touches[0].clientY - startY.current)); }}
      onTouchEnd={() => { if (dy > 90) onClose(); else setDy(0); startY.current = null; }}>
      <div className="flex shrink-0 items-center justify-between gap-3 px-2 py-1">
        <p className="min-w-0 truncate px-2 text-sm">{v.title}</p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close video" data-testid="form-video-close"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-3" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className={`relative overflow-hidden rounded-xl bg-black ${v.vertical ? "aspect-[9/16] h-full max-h-full max-w-full" : "aspect-video w-full max-w-3xl"}`}>
          <iframe src={embedUrl(v.videoId)} title={v.title} className="absolute inset-0 size-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 text-xs text-white/70">
        <span>Muted · tap 🔊 in the player for sound</span>
        <a href={watchUrl(v)} target="_blank" rel="noreferrer" className="shrink-0 underline underline-offset-2 hover:text-white">Watch on YouTube ↗</a>
      </div>
    </div>,
    document.body,
  );
}
