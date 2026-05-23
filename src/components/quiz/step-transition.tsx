"use client";

import { useEffect, useState } from "react";

interface StepTransitionProps {
  stepKey: string | number;
  children: React.ReactNode;
}

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  const [visibleKey, setVisibleKey] = useState(stepKey);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    if (stepKey === visibleKey) return;
    setPhase("out");
    const t = setTimeout(() => {
      setVisibleKey(stepKey);
      setPhase("in");
    }, 140);
    return () => clearTimeout(t);
  }, [stepKey, visibleKey]);

  return (
    <div
      key={visibleKey}
      className={`transition-all duration-150 ${
        phase === "in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      }`}
    >
      {children}
    </div>
  );
}
