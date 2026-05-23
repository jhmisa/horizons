import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Footer from "../Footer";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

function mockCountryCookie(value: string | undefined) {
  (cookies as ReturnType<typeof vi.fn>).mockResolvedValue({
    get: (name: string) =>
      name === "country" && value ? { name: "country", value } : undefined,
  });
}

describe("Footer regulator row", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows IAA + 'Verify our advisers' for NZ", async () => {
    mockCountryCookie("nz");
    const ui = await Footer();
    render(ui);
    expect(screen.getByText(/Regulated by/i)).toBeInTheDocument();
    // "IAA Code of Conduct" link also contains "IAA", so check exact text via span
    expect(screen.getByText("IAA")).toBeInTheDocument();
    const verifyLink = screen.getByRole("link", {
      name: /Verify our advisers/i,
    });
    expect(verifyLink).toHaveAttribute("href", expect.stringContaining("iaa.govt.nz"));
    expect(verifyLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(verifyLink).toHaveAttribute("target", "_blank");
  });

  it("shows OMARA + 'Verify our agents' for AU", async () => {
    mockCountryCookie("au");
    const ui = await Footer();
    render(ui);
    expect(screen.getByText(/OMARA/)).toBeInTheDocument();
    const verifyLink = screen.getByRole("link", {
      name: /Verify our agents/i,
    });
    expect(verifyLink).toHaveAttribute("href", expect.stringContaining("mara.gov.au"));
  });

  it("shows CICC + 'Verify our consultants' for CA", async () => {
    mockCountryCookie("ca");
    const ui = await Footer();
    render(ui);
    expect(screen.getByText(/CICC/)).toBeInTheDocument();
    const verifyLink = screen.getByRole("link", {
      name: /Verify our consultants/i,
    });
    expect(verifyLink).toHaveAttribute("href", expect.stringContaining("college-ic.ca"));
  });

  it("defaults to NZ when country cookie missing", async () => {
    mockCountryCookie(undefined);
    const ui = await Footer();
    render(ui);
    // Exact text match for the regulator abbreviation span (avoids "IAA Code of Conduct" collision)
    expect(screen.getByText("IAA")).toBeInTheDocument();
  });
});
