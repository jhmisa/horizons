import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PartnerSchool } from "@/lib/partnerSchools";

vi.mock("@/lib/partnerSchools", () => ({
  getPartnerSchools: vi.fn(),
}));

import { getPartnerSchools } from "@/lib/partnerSchools";
import PartnerSchoolsPage, { metadata } from "../page";

const mockSchool = (overrides: Partial<PartnerSchool> = {}): PartnerSchool => ({
  _id: "school-1",
  name: "Auckland University of Technology",
  slug: "auckland-university-of-technology",
  country: "nz",
  city: "Auckland",
  logoUrl: "https://cdn.sanity.io/aut-logo.png",
  logoAlt: "AUT logo",
  website: "https://www.aut.ac.nz",
  blurb: "World-class research university with strong pathways for international students.",
  order: 10,
  ...overrides,
});

describe("PartnerSchoolsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the hero section", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    expect(
      screen.getByRole("heading", { level: 1, name: /partner schools|educational/i }),
    ).toBeInTheDocument();
  });

  it("renders a card per school returned by Sanity", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([
      mockSchool({ _id: "a", name: "School A", slug: "school-a" }),
      mockSchool({ _id: "b", name: "School B", slug: "school-b" }),
    ]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    expect(screen.getByText("School A")).toBeInTheDocument();
    expect(screen.getByText("School B")).toBeInTheDocument();
  });

  it("school cards link to the school website with safe external attributes", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([
      mockSchool({ website: "https://example-school.ac.nz" }),
    ]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    const visitLink = screen.getByRole("link", { name: /visit school/i });
    expect(visitLink).toHaveAttribute("href", "https://example-school.ac.nz");
    expect(visitLink).toHaveAttribute("target", "_blank");
    expect(visitLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the empty state when no schools are returned", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    expect(
      screen.getByText(/partner schools will be listed here shortly/i),
    ).toBeInTheDocument();
  });

  it("filters by NZ (passes 'nz' to getPartnerSchools)", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    await PartnerSchoolsPage();
    expect(getPartnerSchools).toHaveBeenCalledWith("nz");
  });

  it("renders the final CTA linking to /how-it-works#step-1", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    const cta = screen.getByRole("link", { name: /Watch the Masterclass/i });
    expect(cta).toHaveAttribute("href", "/how-it-works#step-1");
  });

  it("exports correct metadata", () => {
    expect(metadata.title).toBe("Partner Schools | Horizons Immigration");
    expect(metadata.alternates?.canonical).toBe("/partner-schools");
  });
});
