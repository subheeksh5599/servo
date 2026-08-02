"use client";

import { FileText, Settings, Wallet, Github, ExternalLink } from "lucide-react";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onSelect?: () => void;
  href?: string;
  external?: boolean;
}

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  onNavigate: (view: "settings") => void;
  onConnect: () => void;
}

// No mock identity: the account is not connected yet, so the dropdown shows
// the honest state and real destinations only.
export default function ProfileDropdown({
  onNavigate,
  onConnect,
  className,
  ...props
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems: MenuItem[] = [
    {
      label: "Connect wallet",
      icon: <Wallet className="h-4 w-4 text-indigo" />,
      onSelect: onConnect,
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onSelect: () => onNavigate("settings"),
    },
    {
      label: "GitHub",
      icon: <Github className="h-4 w-4" />,
      href: "https://github.com/subheeksh5599/servo",
      external: true,
    },
    {
      label: "Flare Dev Hub",
      icon: <FileText className="h-4 w-4" />,
      href: "https://dev.flare.network",
      external: true,
    },
  ];

  return (
    <div className={cn("relative", className)} {...props}>
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
              className="flex w-full items-center gap-3 rounded-xl border border-white/7 bg-pane p-3 transition-all duration-200 hover:border-white/15 hover:bg-white/5 focus:outline-none"
              type="button"
            >
              <div className="flex-1 text-left">
                <div className="font-body text-[13px] font-medium leading-tight text-ink">
                  Not connected
                </div>
                <div className="font-body text-[11px] leading-tight text-mist">
                  connect wallet · sign once
                </div>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-mist/50 font-body text-[10px] text-mist">
                —
              </span>
            </button>
          </DropdownMenuTrigger>

          {/* bending line indicator */}
          <div
            className={cn(
              "absolute top-1/2 -right-3 -translate-y-1/2 transition-all duration-200",
              isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"
            )}
          >
            <svg
              aria-hidden="true"
              className={cn(
                "transition-all duration-200",
                isOpen ? "scale-110 text-indigo" : "text-mist group-hover:text-ink"
              )}
              fill="none"
              height="24"
              viewBox="0 0 12 24"
              width="12"
            >
              <path
                d="M2 4C6 8 6 16 2 20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <DropdownMenuContent
            align="end"
            className="w-64 origin-top-right rounded-xl border border-white/10 bg-rail p-2 shadow-xl shadow-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-white/10"
            sideOffset={6}
          >
            <div className="space-y-1">
              {menuItems.map((item) =>
                item.href ? (
                  <DropdownMenuItem asChild key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex cursor-pointer items-center rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/5"
                    >
                      <div className="flex flex-1 items-center gap-2.5">
                        {item.icon}
                        <span className="whitespace-nowrap font-body text-[13px] font-medium text-ink">
                          {item.label}
                        </span>
                      </div>
                      {item.external && <ExternalLink className="h-3.5 w-3.5 text-mist" />}
                    </a>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild key={item.label}>
                    <button
                      type="button"
                      onClick={item.onSelect}
                      className="flex w-full cursor-pointer items-center rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/5"
                    >
                      <div className="flex flex-1 items-center gap-2.5">
                        {item.icon}
                        <span className="whitespace-nowrap font-body text-[13px] font-medium text-ink">
                          {item.label}
                        </span>
                      </div>
                    </button>
                  </DropdownMenuItem>
                )
              )}
            </div>

            <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-widest text-mist/70">
              no session · everything stays on-chain
            </p>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  );
}
