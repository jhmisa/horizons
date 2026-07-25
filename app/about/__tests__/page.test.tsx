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

  it("shows Rowel's license in his title line and links to the IAA register", () => {
    render(<AboutPage />);
    expect(
      screen.getByText(/Licensed Immigration Adviser — IAA #200900577/),
    ).toBeInTheDocument();
    const verifyLink = screen.getByRole("link", {
      name: /Verify on the IAA register/i,
    });
    expect(verifyLink).toHaveAttribute(
      "href",
      expect.stringContaining("app.mbieregisters.govt.nz"),
    );
    expect(verifyLink).toHaveAttribute("target", "_blank");
    expect(verifyLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the by-the-numbers stats", () => {
    render(<AboutPage />);
    expect(screen.getByText(/6,500\+/)).toBeInTheDocument();
    expect(screen.getAllByText(/families/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/countries/i).length).toBeGreaterThan(0);
  });

  it("renders the Regulated By section with all three regulators", () => {
    render(<AboutPage />);
    const iaaLink = screen.getByRole("link", { name: /Verify our advisers/i });
    const maraLink = screen.getByRole("link", { name: /Verify our agents/i });
    const ciccLink = screen.getByRole("link", { name: /Verify our consultants/i });
    expect(iaaLink).toHaveAttribute("href", expect.stringContaining("iaa.govt.nz"));
    expect(maraLink).toHaveAttribute("href", expect.stringContaining("mara.gov.au"));
    expect(ciccLink).toHaveAttribute("href", expect.stringContaining("college-ic.ca"));
    [iaaLink, maraLink, ciccLink].forEach((link) => {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("renders all six Licensed Immigration Advisers", () => {
    render(<AboutPage />);
    const names = [
      "Jocelyn Ocampo",
      "Joyce Maneja-Curiano",
      "Lorna Caluag",
      "Stephanie Feret",
      "Tonet Cruz Jang",
      "Trinity Lee",
    ];
    for (const name of names) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders an IAA licence number for each adviser", () => {
    render(<AboutPage />);
    const licences = [
      "201001078",
      "202400363",
      "201900427",
      "201700294",
      "201601367",
      "201701299",
    ];
    for (const licence of licences) {
      expect(screen.getByText(new RegExp(licence))).toBeInTheDocument();
    }
  });

  it("renders the three behind-the-scenes support team members", () => {
    render(<AboutPage />);
    expect(screen.getByText("Marie Quintos")).toBeInTheDocument();
    expect(screen.getByText("Issa Mercado")).toBeInTheDocument();
    expect(screen.getByText("Paolo Quintos")).toBeInTheDocument();
    expect(screen.getByText("Office Manager")).toBeInTheDocument();
    expect(screen.getByText("Admin & Finance")).toBeInTheDocument();
    expect(screen.getByText("Marketing Officer")).toBeInTheDocument();
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
