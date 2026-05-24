"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ConditionEntry } from "@/lib/types";

interface InspectionShowcaseProps {
  frames: string[];
  brand: string;
  model: string;
  referenceNumber: string;
  conditionLog: ConditionEntry[];
  watchmaker: string;
  certificateNumber: string;
}

type Phase = "intro" | "rotate" | "details" | "grade" | "outro";

interface PhaseConfig {
  phase: Phase;
  durationMs: number;
}

const PHASES: PhaseConfig[] = [
  { phase: "intro", durationMs: 2000 },
  { phase: "rotate", durationMs: 4000 },
  { phase: "details", durationMs: 3000 },
  { phase: "grade", durationMs: 3000 },
  { phase: "outro", durationMs: 2000 },
];

const TOTAL_DURATION = PHASES.reduce((sum, p) => sum + p.durationMs, 0);

export function InspectionShowcase({
  frames,
  brand,
  model,
  referenceNumber,
  conditionLog,
  watchmaker,
  certificateNumber,
}: InspectionShowcaseProps) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);

  const latestCondition = conditionLog[conditionLog.length - 1];
  const frameCount = frames.length;

  useEffect(() => {
    let loadedCount = 0;
    const images = frames.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frames.length) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frames.length) setLoaded(true);
      };
      return img;
    });
    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [frames]);

  const tick = useCallback(
    (timestamp: number) => {
      const currentElapsed =
        pausedAtRef.current + (timestamp - startTimeRef.current);
      if (currentElapsed >= TOTAL_DURATION) {
        setElapsed(TOTAL_DURATION);
        setPlaying(false);
        pausedAtRef.current = 0;
        return;
      }
      setElapsed(currentElapsed);
      animRef.current = requestAnimationFrame(tick);
    },
    []
  );

  useEffect(() => {
    if (playing) {
      startTimeRef.current = performance.now();
      animRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [playing, tick]);

  function togglePlay() {
    if (playing) {
      cancelAnimationFrame(animRef.current);
      pausedAtRef.current = elapsed;
      setPlaying(false);
    } else {
      if (elapsed >= TOTAL_DURATION) {
        pausedAtRef.current = 0;
        setElapsed(0);
      }
      setPlaying(true);
    }
  }

  function getCurrentPhase(): { phase: Phase; progress: number } {
    let cumulative = 0;
    for (const p of PHASES) {
      if (elapsed < cumulative + p.durationMs) {
        return {
          phase: p.phase,
          progress: (elapsed - cumulative) / p.durationMs,
        };
      }
      cumulative += p.durationMs;
    }
    return { phase: "outro", progress: 1 };
  }

  function getCurrentFrame(): number {
    const { phase, progress } = getCurrentPhase();
    switch (phase) {
      case "intro":
        return 0;
      case "rotate": {
        const smoothProgress = easeInOut(progress);
        return Math.floor(smoothProgress * (frameCount - 1));
      }
      case "details":
        return Math.floor(frameCount * 0.25);
      case "grade":
        return Math.floor(frameCount * 0.75);
      case "outro":
        return 0;
      default:
        return 0;
    }
  }

  const { phase, progress } = getCurrentPhase();
  const currentFrame = getCurrentFrame();
  const overlayOpacity = phase === "intro" || phase === "outro" ? easeInOut(phase === "intro" ? progress : 1 - progress) : 1;

  return (
    <div className="relative aspect-square bg-stone-950 rounded-lg overflow-hidden select-none">
      {/* Watch frames */}
      {frames.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === currentFrame ? `${brand} ${model} Inspektion` : ""}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            opacity: i === currentFrame ? 1 : 0,
            transition: "opacity 150ms ease",
          }}
          draggable={false}
          loading={i < 4 ? "eager" : "lazy"}
        />
      ))}

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Intro overlay */}
      {phase === "intro" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          style={{ opacity: overlayOpacity }}
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400 mb-2">
            Marlo Inspektion
          </p>
          <p className="text-lg sm:text-xl font-medium text-white">
            {brand} {model}
          </p>
          <p className="text-xs text-stone-400 font-mono mt-1">
            Ref. {referenceNumber}
          </p>
        </div>
      )}

      {/* Rotation phase — angle indicator */}
      {phase === "rotate" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-[11px] font-mono tabular-nums text-gold-400/80">
            {Math.round(easeInOut(progress) * 360)}°
          </span>
        </div>
      )}

      {/* Details overlay */}
      {phase === "details" && latestCondition && (
        <div
          className="absolute bottom-0 left-0 right-0 p-4 sm:p-5"
          style={{
            opacity: easeInOut(Math.min(progress * 3, 1)),
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400 mb-1.5">
            Inspektionsbericht
          </p>
          <p className="text-sm text-white/90 leading-relaxed line-clamp-3">
            {latestCondition.notes}
          </p>
          <p className="text-xs text-stone-400 mt-2">
            {latestCondition.inspectedBy} ·{" "}
            {new Date(latestCondition.date).toLocaleDateString("de-DE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Grade overlay */}
      {phase === "grade" && latestCondition && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: easeInOut(Math.min(progress * 3, 1)) }}
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-8 py-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400 mb-3">
              Zustandsbewertung
            </p>
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-gold-400 text-gold-400 text-2xl font-medium">
              {latestCondition.grade}
            </span>
            <p className="text-xs text-stone-300 mt-3">
              Geprüft von {watchmaker}
            </p>
            <p className="text-[10px] text-stone-500 font-mono mt-1">
              {certificateNumber}
            </p>
          </div>
        </div>
      )}

      {/* Outro overlay */}
      {phase === "outro" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          style={{ opacity: easeInOut(progress) }}
        >
          <svg
            className="w-8 h-8 text-gold-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <p className="text-sm font-medium text-gold-400">
            Echtheit bestätigt
          </p>
          <p className="text-xs text-stone-400 mt-1">marianni.de</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-stone-800">
        <div
          className="h-full bg-gold-400 transition-[width] duration-100"
          style={{ width: `${(elapsed / TOTAL_DURATION) * 100}%` }}
        />
      </div>

      {/* Play/pause button */}
      <button
        onClick={togglePlay}
        disabled={!loaded}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white transition-colors disabled:opacity-30"
        aria-label={playing ? "Pause" : "Abspielen"}
      >
        {!loaded ? (
          <LoadingSpinner />
        ) : playing ? (
          <PauseIcon />
        ) : (
          <PlayIcon />
        )}
      </button>

      {/* Initial play CTA when not started */}
      {!playing && elapsed === 0 && loaded && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center group"
          aria-label="Inspektionsvideo abspielen"
        >
          <div className="w-16 h-16 rounded-full bg-gold-400/90 flex items-center justify-center group-hover:bg-gold-400 transition-colors shadow-lg">
            <svg
              className="w-7 h-7 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" className="opacity-25" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8"
        strokeLinecap="round"
      />
    </svg>
  );
}
