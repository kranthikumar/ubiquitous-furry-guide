"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Captions,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

const TICK_MS = 250;

function formatTime(total: number) {
  const s = Math.floor(total);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-white/15"
    >
      {children}
    </button>
  );
}

/**
 * A pretend video player: there is no media, so the "frame" is the video's
 * thumbnail and playback is a clock ticking towards the video's duration.
 */
export function Player({
  frame,
  duration,
  captions,
  nextHref,
}: {
  frame: ReactNode;
  duration: number;
  captions: string[];
  nextHref?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const ended = time >= duration;
  const running = playing && !ended;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
      () => setTime((t) => Math.min(t + TICK_MS / 1000, duration)),
      TICK_MS,
    );
    return () => clearInterval(timer);
  }, [running, duration]);

  useEffect(() => {
    const onChange = () =>
      setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const togglePlay = () => {
    if (ended) {
      setTime(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };
  const seekBy = (delta: number) =>
    setTime((t) => Math.max(0, Math.min(duration, t + delta)));
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const onContainer = event.target === event.currentTarget;
    const actions: Record<string, (() => void) | undefined> = {
      k: togglePlay,
      m: () => setMuted((m) => !m),
      c: () => setCaptionsOn((c) => !c),
      f: toggleFullscreen,
      j: () => seekBy(-10),
      l: () => seekBy(10),
      // Buttons and the seek slider handle these keys themselves.
      " ": onContainer ? togglePlay : undefined,
      ArrowLeft: onContainer ? () => seekBy(-5) : undefined,
      ArrowRight: onContainer ? () => seekBy(5) : undefined,
    };
    const action = actions[event.key];
    if (!action || event.metaKey || event.ctrlKey || event.altKey) return;
    event.preventDefault();
    action();
  };

  const caption =
    captions[Math.floor(time / 4) % Math.max(captions.length, 1)] ?? "";
  const progress = duration ? (time / duration) * 100 : 0;
  const showBigPlay = !playing || ended;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Video player"
      role="region"
      className={`group relative aspect-video w-full overflow-hidden bg-black text-white outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${fullscreen ? "" : "sm:rounded-xl"}`}
    >
      <div
        onClick={togglePlay}
        className="absolute inset-0 cursor-pointer"
        aria-hidden="true"
      >
        <div
          className={`size-full animate-ken-burns ${running ? "" : "[animation-play-state:paused]"}`}
        >
          {frame}
        </div>
      </div>

      {showBigPlay && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={ended ? "Replay" : "Play"}
          className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/60 backdrop-blur-sm hover:bg-paw"
        >
          {ended ? (
            <RotateCcw className="size-8" />
          ) : (
            <Play className="size-8 translate-x-0.5 fill-current" />
          )}
        </button>
      )}

      {captionsOn && caption && (
        <p className="absolute inset-x-0 bottom-16 mx-auto w-fit max-w-[85%] rounded bg-black/75 px-2 py-1 text-center text-sm sm:text-base">
          {caption}
        </p>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-8 pb-1 transition-opacity duration-200 sm:px-3 ${running ? "opacity-0 group-hover:opacity-100 group-has-focus-visible:opacity-100" : "opacity-100"}`}
      >
        <input
          type="range"
          min={0}
          max={duration}
          step={1}
          value={Math.floor(time)}
          onChange={(e) => setTime(Number(e.target.value))}
          aria-label="Seek"
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          className="seek-bar"
          style={{ "--progress": `${progress}%` } as React.CSSProperties}
        />
        <div className="flex items-center gap-1 pt-1">
          <ControlButton
            label={ended ? "Replay (k)" : running ? "Pause (k)" : "Play (k)"}
            onClick={togglePlay}
          >
            {ended ? (
              <RotateCcw className="size-5" />
            ) : running ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current" />
            )}
          </ControlButton>
          {nextHref && (
            <Link
              href={nextHref}
              aria-label="Next video"
              title="Next video"
              className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-white/15"
            >
              <SkipForward className="size-5 fill-current" />
            </Link>
          )}
          <ControlButton
            label={muted ? "Unmute (m)" : "Mute (m)"}
            onClick={() => setMuted((m) => !m)}
          >
            {muted ? (
              <VolumeX className="size-5" />
            ) : (
              <Volume2 className="size-5" />
            )}
          </ControlButton>
          <span className="px-2 text-xs tabular-nums sm:text-sm">
            {formatTime(time)} / {formatTime(duration)}
          </span>
          <span className="flex-1" />
          <ControlButton
            label={
              captionsOn ? "Turn off captions (c)" : "Turn on captions (c)"
            }
            onClick={() => setCaptionsOn((c) => !c)}
          >
            <Captions
              className={`size-5 ${captionsOn ? "text-paw" : ""}`}
              aria-hidden="true"
            />
          </ControlButton>
          <ControlButton
            label={fullscreen ? "Exit full screen (f)" : "Full screen (f)"}
            onClick={toggleFullscreen}
          >
            {fullscreen ? (
              <Minimize className="size-5" />
            ) : (
              <Maximize className="size-5" />
            )}
          </ControlButton>
        </div>
      </div>
    </div>
  );
}
