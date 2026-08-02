"use client";

// Command search bar (adapted from kokonutui's ActionSearchBar).
// Real actions only: every entry drives the dashboard (view switch or the
// new-order flow). No sample commands, no fake data.

import {
  ListChecks,
  ReceiptText,
  Layers,
  Bot,
  Settings,
  Plus,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export interface CommandAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
  view?: "orders" | "receipts" | "venues" | "agent" | "settings";
  newOrder?: boolean;
}

const DASHBOARD_COMMANDS: CommandAction[] = [
  { id: "orders", label: "Orders", icon: <ListChecks className="h-4 w-4 text-primary" />, description: "standing orders", short: "O", end: "view", view: "orders" },
  { id: "receipts", label: "Receipts", icon: <ReceiptText className="h-4 w-4 text-[#f2c94c]" />, description: "execution receipts", short: "R", end: "view", view: "receipts" },
  { id: "venues", label: "Venues", icon: <Layers className="h-4 w-4 text-[#27ae60]" />, description: "yield adapters", short: "V", end: "view", view: "venues" },
  { id: "agent", label: "Agent", icon: <Bot className="h-4 w-4 text-[#9b51e0]" />, description: "strategy decisions", short: "A", end: "view", view: "agent" },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4 text-muted-foreground" />, description: "contracts · env", short: "S", end: "view", view: "settings" },
  { id: "new-order", label: "New order", icon: <Plus className="h-4 w-4 text-primary" />, description: "pay once · runs forever", short: "N", end: "create", newOrder: true },
];

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { height: { duration: 0.35 }, staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { height: { duration: 0.25 }, opacity: { duration: 0.15 } },
    },
  },
  item: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  },
} as const;

export default function CommandSearch({
  onCommand,
  commands = DASHBOARD_COMMANDS,
}: {
  onCommand: (cmd: CommandAction) => void;
  commands?: CommandAction[];
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 150);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return commands;
    const q = debouncedQuery.toLowerCase().trim();
    return commands.filter((c) =>
      `${c.label} ${c.description || ""}`.toLowerCase().includes(q)
    );
  }, [debouncedQuery, commands]);

  // ⌘K / Ctrl+K focuses the search from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("command-search")?.focus();
        setIsFocused(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = useCallback(
    (cmd: CommandAction) => {
      onCommand(cmd);
      setQuery("");
      setIsFocused(false);
      setActiveIndex(-1);
    },
    [onCommand]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!filtered.length) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((p) => (p < filtered.length - 1 ? p + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((p) => (p > 0 ? p - 1 : filtered.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filtered[activeIndex]) pick(filtered[activeIndex]);
          break;
        case "Escape":
          setIsFocused(false);
          setActiveIndex(-1);
          break;
      }
    },
    [filtered, activeIndex, pick]
  );

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
        <Search size={13} className="text-muted-foreground" />
        <input
          id="command-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search commands"
          className="w-full flex-1 bg-transparent font-body text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <span className="rounded border border-border px-1 font-mono text-[10px] text-muted-foreground">⌘K</span>
      </div>

      <AnimatePresence>
        {isFocused && filtered.length > 0 && (
          <motion.div
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
          >
            {filtered.map((cmd, i) => (
              <motion.button
                key={cmd.id}
                variants={ANIMATION_VARIANTS.item}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(cmd);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left transition-colors",
                  activeIndex === i ? "bg-primary/10" : "hover:bg-accent/60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true">{cmd.icon}</span>
                  <span className="font-body text-[13px] font-medium text-foreground">{cmd.label}</span>
                  {cmd.description && (
                    <span className="hidden font-body text-[11px] text-muted-foreground sm:block">
                      {cmd.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {cmd.short && (
                    <span className="font-mono text-[10px] text-muted-foreground">{cmd.short}</span>
                  )}
                  {cmd.end && (
                    <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {cmd.end}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
            <div className="border-t border-border px-3 py-1.5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                <span>⌘K to open · ↑↓ navigate · ⏎ select</span>
                <span>esc to cancel</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
