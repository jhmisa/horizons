import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PaySuccessPage, { metadata } from "../page";

describe("PaySuccessPage", () => {
  it("renders the payment received heading", () => {
    render(<PaySuccessPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Payment received/i }),
    ).toBeInTheDocument();
  });

  it("lists the three next steps", () => {
    render(<PaySuccessPage />);
    expect(screen.getByText(/receipt from Stripe/i)).toBeInTheDocument();
    expect(
      screen.getByText(/match your payment to your invoice/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/reply to your invoice email/i),
    ).toBeInTheDocument();
  });

  it("links back to home", () => {
    render(<PaySuccessPage />);
    expect(screen.getByRole("link", { name: /Back to home/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

describe("metadata", () => {
  it("is noindexed", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
