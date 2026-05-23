interface ProgressIndicatorProps {
  current: number;
  total: number;
  onBack?: () => void;
}

export function ProgressIndicator({ current, total, onBack }: ProgressIndicatorProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={onBack}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${
            current === 1 ? "opacity-0 pointer-events-none" : ""
          }`}
          aria-label="Go back"
        >
          <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center flex-1 gap-0">
          {Array.from({ length: total }).map((_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < current;
            const isCurrent = stepNum === current;
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                {isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-900 ring-2 ring-stone-200 ring-offset-2" />
                ) : isCompleted ? (
                  <div className="w-2 h-2 rounded-full bg-stone-900" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-stone-300" />
                )}
                {i < total - 1 && <div className="flex-1 h-px bg-stone-200 mx-1" />}
              </div>
            );
          })}
        </div>

        <span className="text-xs tracking-widest uppercase text-stone-400 whitespace-nowrap">
          Step {current} of {total}
        </span>
      </div>

      {current === 1 && (
        <p className="text-xs text-stone-400 text-center">Takes about 2 minutes</p>
      )}
    </div>
  );
}
