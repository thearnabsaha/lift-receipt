"use client";
import { useEffect, useState } from "react";
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
      {cur && online && (
        <div className="mb-3" data-testid="form-video-player">
          <div className={`relative mx-auto ${cur.vertical ? "aspect-[9/16] max-h-[62dvh]" : "aspect-video w-full"} overflow-hidden rounded-xl border bg-black`}>
            <iframe key={cur.videoId} src={embedUrl(cur.videoId)} title={cur.title} className="absolute inset-0 size-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" loading="lazy" />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Muted · tap 🔊 in the player for sound</span>
            <span className="flex shrink-0 gap-3">
              <a href={watchUrl(cur)} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">Watch on YouTube ↗</a>
              <button type="button" onClick={() => setPlaying(null)} className="underline underline-offset-2 hover:text-foreground">Close</button>
            </span>
          </div>
        </div>
      )}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {videos.map((v) => (
          <div key={v.videoId} className="w-[7.5rem] shrink-0 snap-start">
            {online ? (
              <button type="button" onClick={() => setPlaying(v.videoId)} aria-label={`Play ${v.title} (muted)`} data-testid="form-video-card"
                className={`relative block aspect-[9/16] w-full overflow-hidden rounded-xl border bg-muted ${playing === v.videoId ? "ring-2 ring-foreground" : ""}`}>
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
