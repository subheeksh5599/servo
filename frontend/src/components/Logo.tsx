export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-label="Servo logo"
    >
      {/* tick ring */}
      <circle
        cx="16"
        cy="13.5"
        r="9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.9"
      />
      {/* ring ticks */}
      <line x1="16" y1="3" x2="16" y2="5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="26" y1="13.5" x2="24" y2="13.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="16" y1="24" x2="16" y2="22" stroke="currentColor" strokeWidth="1.4" />
      <line x1="6" y1="13.5" x2="8" y2="13.5" stroke="currentColor" strokeWidth="1.4" />
      {/* needle locked to setpoint */}
      <line x1="16" y1="13.5" x2="22.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* setpoint dot (primary violet) */}
      <circle cx="22.5" cy="6.5" r="2.1" fill="hsl(var(--primary))" />
      {/* recurring flow line */}
      <path
        d="M5 28c2.6-2 5-2 7.5 0s4.9 2 7.5 0 5-2 7-0.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
