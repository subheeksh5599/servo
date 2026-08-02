export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="aurora-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="120" />
          </filter>
        </defs>
        <g filter="url(#aurora-blur)">
          <ellipse
            className="aurora-1"
            cx="18%"
            cy="30%"
            rx="420"
            ry="300"
            fill="#6C5CE7"
            opacity="0.32"
          />
          <ellipse
            className="aurora-2"
            cx="78%"
            cy="55%"
            rx="460"
            ry="340"
            fill="#4D7CFE"
            opacity="0.26"
          />
          <ellipse
            className="aurora-3"
            cx="45%"
            cy="85%"
            rx="380"
            ry="260"
            fill="#E555C7"
            opacity="0.18"
          />
        </g>
      </svg>
    </div>
  );
}
