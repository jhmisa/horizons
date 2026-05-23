"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  COUNTRIES,
  countryConfig,
  type Country,
} from "@/lib/config";

/**
 * Derive the active country from a pathname.
 * - `/au` or `/au/...` => 'au'
 * - `/ca` or `/ca/...` => 'ca'
 * - anything else => 'nz' (NZ lives at the root)
 */
export function getCurrentCountryFromPathname(pathname: string): Country {
  if (pathname === "/au" || pathname.startsWith("/au/")) return "au";
  if (pathname === "/ca" || pathname.startsWith("/ca/")) return "ca";
  return "nz";
}

const HOME_PATH: Record<Country, string> = {
  nz: "/",
  au: "/au",
  ca: "/ca",
};

interface CountrySwitcherProps {
  /** Optional onSelect callback (used by the mobile menu to close itself). */
  onSelect?: () => void;
}

export default function CountrySwitcher({ onSelect }: CountrySwitcherProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const country = getCurrentCountryFromPathname(pathname);
  const current = countryConfig[country];

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (target: Country) => {
    setOpen(false);
    onSelect?.();
    if (target !== country) {
      router.push(HOME_PATH[target]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-accent-700 hover:text-brand-600 hover:border-brand-200 font-medium text-sm transition-colors"
      >
        <i className="fa-solid fa-globe text-brand-500" aria-hidden="true" />
        <span>{current.displayName}</span>
        <i
          className={`fa-solid fa-chevron-down text-xs transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 min-w-[180px] bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden z-50"
        >
          {COUNTRIES.map((c) => {
            const cfg = countryConfig[c];
            const isActive = c === country;
            return (
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(c)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-accent-700 hover:bg-slate-50 hover:text-brand-600"
                }`}
              >
                <span>{cfg.displayName}</span>
                {isActive && (
                  <span className="text-xs uppercase tracking-wider text-brand-500">
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
