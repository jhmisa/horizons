/**
 * Horizons office locations, as supplied by Rowel (email "Update Horizons
 * Website", 13 Nov 2026). Shown in the footer on every page and on the
 * matching country homepage.
 */

export type OfficeCode = "nz" | "au" | "ph";

export interface Office {
  code: OfficeCode;
  label: string;
  flag: string;
  /** Address lines, rendered one per line. */
  lines: readonly string[];
  tel: { display: string; href: string };
  mobile: { display: string; href: string };
  mapsUrl: string;
}

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const OFFICES: readonly Office[] = [
  {
    code: "nz",
    label: "Auckland, New Zealand",
    flag: "🇳🇿",
    lines: ["Level 10, GHD House", "21 Queen Street, Auckland 1010"],
    tel: { display: "+64 9 277 7162", href: "tel:+6492777162" },
    mobile: { display: "022 193 2457", href: "tel:+64221932457" },
    mapsUrl: maps("GHD House, 21 Queen Street, Auckland 1010"),
  },
  {
    code: "au",
    label: "Sydney, Australia",
    flag: "🇦🇺",
    lines: ["Level 5, 7 Eden Park Drive", "Macquarie Park NSW 2113"],
    tel: { display: "+61 2 8387 7589", href: "tel:+61283877589" },
    // TODO(joey): Rowel's email says 0491 309 072; his signature says
    // 0493 335 139. Confirm which one is correct.
    mobile: { display: "0491 309 072", href: "tel:+61491309072" },
    mapsUrl: maps("7 Eden Park Drive, Macquarie Park NSW 2113"),
  },
  {
    code: "ph",
    label: "Manila, Philippines",
    flag: "🇵🇭",
    lines: [
      "Unit 1023 City & Land Mega Plaza",
      "ADB Ave. cor. Garnet Road, Ortigas Center",
      "Pasig 1605",
    ],
    tel: { display: "+63 2 8826 6944", href: "tel:+63288266944" },
    mobile: { display: "0917 894 3424", href: "tel:+639178943424" },
    mapsUrl: maps(
      "City & Land Mega Plaza, ADB Avenue corner Garnet Road, Ortigas Center, Pasig 1605"
    ),
  },
] as const;

export function getOffice(code: OfficeCode): Office {
  return OFFICES.find((o) => o.code === code)!;
}
