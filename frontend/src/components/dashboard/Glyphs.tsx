import { cn } from "@/lib/utils";

/* ---------- priority glyphs ---------- */

export function Priority({ level }: { level: "urgent" | "high" | "med" | "low" | "none" }) {
  if (level === "urgent") {
    return (
      <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[4px] bg-[#eb5757] font-body text-[10px] font-bold text-white">
        !
      </span>
    );
  }
  if (level === "none") {
    return (
      <span className="flex h-[16px] w-[16px] flex-col items-center justify-center gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[2px] w-[10px] rounded bg-mist" />
        ))}
      </span>
    );
  }
  const fill = { high: 3, med: 2, low: 1 }[level];
  return (
    <span className="flex h-[16px] w-[16px] items-end justify-center gap-[2px] pt-[3px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-sm", i < fill ? "bg-[#b9bdc6]" : "bg-white/15")}
          style={{ height: `${4 + i * 3}px` }}
        />
      ))}
    </span>
  );
}

/* ---------- status rings ---------- */

export function StatusRing({ status }: { status: "running" | "due" | "paused" | "done" }) {
  const common = "h-[16px] w-[16px] rounded-full border-2";
  if (status === "running") {
    return (
      <span className={cn(common, "border-[#f2c94c]")}>
        <span className="block h-[12px] w-[12px] translate-x-[1px] translate-y-[1px] rounded-full border-[2.5px] border-t-transparent border-l-transparent border-r-transparent border-b-[#f2c94c] bg-transparent" />
      </span>
    );
  }
  if (status === "due") {
    return <span className={cn(common, "border-[#7d828c]")} />;
  }
  if (status === "paused") {
    return (
      <span className={cn(common, "border-[#626871]")}>
        <span className="block h-[1px] w-[8px] translate-x-[2px] translate-y-[6.5px] bg-[#626871]" />
      </span>
    );
  }
  return (
    <span className={cn(common, "border-transparent bg-indigo")}>
      <svg viewBox="0 0 16 16" className="h-full w-full p-[3px] text-white">
        <path d="M4 8.5l2.5 2.5L12 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ---------- label pills ---------- */

const LABEL_COLORS: Record<string, string> = {
  mint: "bg-[#f2c94c]",
  route: "bg-[#5e6ad2]",
  fdc: "bg-[#eb5757]",
  fxrp: "bg-[#27ae60]",
  gas: "bg-[#9b51e0]",
  sig: "bg-[#56ccf2]",
};

export function LabelPill({ text }: { text: string }) {
  const color = LABEL_COLORS[text.toLowerCase()] ?? "bg-[#7d828c]";
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-0.5 font-body text-[11px] text-[#b9bdc6]">
      <span className={cn("h-1.5 w-1.5 rounded-full", color)} />
      {text}
    </span>
  );
}

/* ---------- assignee avatar ---------- */

const AVATAR_TINTS = ["bg-[#5e6ad2]/30 text-[#a5b0f0]", "bg-[#f2c94c]/20 text-[#f2c94c]", "bg-[#27ae60]/20 text-[#6fe3a0]", "bg-[#eb5757]/20 text-[#f39c9c]"];

export function Avatar({ initials, tint = 0 }: { initials: string; tint?: number }) {
  return (
    <span className={cn("flex h-[22px] w-[22px] items-center justify-center rounded-full font-body text-[9px] font-medium", AVATAR_TINTS[tint % AVATAR_TINTS.length])}>
      {initials}
    </span>
  );
}

export function AvatarStack({ people }: { people: string[] }) {
  return (
    <span className="flex -space-x-1.5">
      {people.map((p, i) => (
        <Avatar key={p} initials={p} tint={i} />
      ))}
    </span>
  );
}

export function Unassigned() {
  return (
    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-dashed border-mist/60">
      <span className="h-1.5 w-1.5 rounded-full bg-mist/40" />
    </span>
  );
}
