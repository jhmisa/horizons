import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutPage, { metadata } from "../page";

describe("AboutPage", () => {
  it("renders the hero section", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Horizons|future|licensed/i }),
    ).toBeInTheDocument();
  });

  it("renders the founder section with Rowel and his IAA license", () => {
    render(<AboutPage />);
    expect(screen.getAllByText(/Rowel Mercado/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/200900577/).length).toBeGreaterThan(0);
  });

  it("renders the by-the-numbers stats", () => {
    render(<AboutPage />);
    expect(screen.getByText(/6,500\+/)).toBeInTheDocument();
    expect(screen.getAllByText(/families/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/countries/i).length).toBeGreaterThan(0);
  });

  it("renders the Regulated By section with all three regulators", () => {
    render(<AboutPage />);
    const iaaLink = screen.getByRole("link", { name: /IAA|Immigration Advisers Authority/i });
    const maraLink = screen.getByRole("link", { name: /MARA|OMARA|Migration Agents/i });
    const ciccLink = screen.getByRole("link", { name: /CICC|College of Immigration/i });
    expect(iaaLink).toHaveAttribute("href", expect.stringContaining("iaa.govt.nz"));
    expect(maraLink).toHaveAttribute("href", expect.stringContaining("mara.gov.au"));
    expect(ciccLink).toHaveAttribute("href", expect.stringContaining("college-ic.ca"));
    [iaaLink, maraLink, ciccLink].forEach((link) => {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("renders a team teaser linking to /team", () => {
    render(<AboutPage />);
    const teamLink = screen.getByRole("link", { name: /Meet|team/i });
    expect(teamLink).toHaveAttribute("href", "/team");
  });

  it("renders a final CTA linking to /how-it-works#step-1", () => {
    render(<AboutPage />);
    const cta = screen.getByRole("link", { name: /Watch the Masterclass/i });
    expect(cta).toHaveAttribute("href", "/how-it-works#step-1");
  });

  it("exports correct metadata", () => {
    expect(metadata.title).toBe("About Us | Horizons Immigration");
    expect(metadata.alternates?.canonical).toBe("/about");
    expect(metadata.description).toMatch(/Rowel|Horizons|families/);
  });
});
