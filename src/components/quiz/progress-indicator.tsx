interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressIndicator({ current, total, label }: ProgressIndicatorProps) {
  return (
    <div className="mb-10" aria-label={`Step ${current} of ${total}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs tracking-widest uppercase text-stone-500">
          {label ?? `Step ${current} of ${total}`}
        </span>
        <span className="text-xs tracking-widest uppercase text-stone-400">
          {current} / {total}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 transition-colors ${
              i < current ? "bg-stone-900" : "bg-stone-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
