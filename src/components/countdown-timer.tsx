"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(endDate: Date): TimeLeft {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface Props {
  endDate: Date;
}

export function CountdownTimer({ endDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(endDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTimeLeft(calcTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!mounted) {
    return (
      <div className="flex gap-3 sm:gap-6 justify-center" aria-label="Countdown">
        {["--", "--", "--", "--"].map((v, i) => (
          <CountdownUnit key={i} value={v} label={["Tage", "Stunden", "Minuten", "Sekunden"][i]} />
        ))}
      </div>
    );
  }

  const expired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  if (expired) {
    return (
      <p className="text-sm tracking-widest uppercase" style={{ color: "#C9A84C" }}>
        Angebot abgelaufen
      </p>
    );
  }

  return (
    <div
      className="flex gap-3 sm:gap-6 justify-center"
      aria-label={`Noch ${timeLeft.days} Tage, ${timeLeft.hours} Stunden, ${timeLeft.minutes} Minuten, ${timeLeft.seconds} Sekunden`}
    >
      <CountdownUnit value={pad(timeLeft.days)} label="Tage" />
      <CountdownUnit value={pad(timeLeft.hours)} label="Stunden" />
      <CountdownUnit value={pad(timeLeft.minutes)} label="Minuten" />
      <CountdownUnit value={pad(timeLeft.seconds)} label="Sekunden" />
    </div>
  );
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[56px] sm:min-w-[70px]">
      <span
        className="text-3xl sm:text-5xl font-light tabular-nums"
        style={{ color: "#C9A84C", fontFamily: "Georgia, serif" }}
      >
        {value}
      </span>
      <span
        className="text-[0.55rem] tracking-[0.25em] uppercase mt-1"
        style={{ color: "rgba(28,28,28,0.5)" }}
      >
        {label}
      </span>
    </div>
  );
}
