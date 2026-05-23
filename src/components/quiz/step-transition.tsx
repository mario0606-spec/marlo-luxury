"use client";

import { useEffect, useRef, useState } from "react";

interface StepTransitionProps {
  stepKey: string | number;
  direction: "forward" | "back";
  children: React.ReactNode;
}

export function StepTransition({ stepKey, direction, children }: StepTransitionProps) {
  const [displayKey, setDisplayKey] = useState(stepKey);
  const [phase, setPhase] = useState<"visible" | "exit" | "enter">("visible");
  const dirRef = useRef(direction);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  dirRef.current = direction;

  useEffect(() => {
    if (stepKey === displayKey) return;
    setPhase("exit");
    const duration = prefersReducedMotion.current ? 150 : 220;
    const t = setTimeout(() => {
      setDisplayKey(stepKey);
      setPhase("enter");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("visible");
        });
      });
    }, duration);
    return () => clearTimeout(t);
  }, [stepKey, displayKey]);

  const reduced = prefersReducedMotion.current;
  const dur = reduced ? "150ms" : "220ms";

  let opacity = 1;
  let transform = "translateX(0)";

  if (phase === "exit") {
    opacity = 0;
    if (!reduced) {
      transform = dirRef.current === "forward" ? "translateX(-100%)" : "translateX(100%)";
    }
  } else if (phase === "enter") {
    opacity = 0;
    if (!reduced) {
      transform = dirRef.current === "forward" ? "translateX(100%)" : "translateX(-100%)";
    }
  }

  const style: React.CSSProperties = {
    transition: phase === "enter" ? "none" : `opacity ${dur} ease-in-out, transform ${dur} ease-in-out`,
    opacity,
    transform: reduced ? undefined : transform,
  };

  return (
    <div key={displayKey} style={style}>
      {children}
    </div>
  );
}
