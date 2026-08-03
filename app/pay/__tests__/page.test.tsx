import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PayPage from "@/components/pages/PayPage";
import { metadata } from "../page";

const STRIPE_URL = "https://buy.stripe.com/test_flex123";

describe("PayPage", () => {
  it("renders the Make a Payment heading", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Make a Payment/i }),
    ).toBeInTheDocument();
  });

  it("renders the three instruction steps referencing the invoice email", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    expect(screen.getByText(/Find your amount/i)).toBeInTheDocument();
    expect(screen.getAllByText(/invoice email/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Enter the amount/i)).toBeInTheDocument();
  });

  it("does not mention the card processing fee (invoice email covers payment options)", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    expect(
      screen.queryByText(/card processing fee/i),
    ).not.toBeInTheDocument();
  });

  it("links the pay button to the Stripe payment link", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    const btn = screen.getByRole("link", { name: /Pay with Stripe/i });
    expect(btn).toHaveAttribute("href", STRIPE_URL);
  });

  it("cross-links to the booking page", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    const link = screen.getByRole("link", { name: /booking page/i });
    expect(link).toHaveAttribute("href", "/book");
  });

  it("shows a fallback instead of the pay button when the link is not configured", () => {
    render(<PayPage stripeUrl={null} />);
    expect(
      screen.getByText(/Payment link unavailable/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Pay with Stripe/i }),
    ).not.toBeInTheDocument();
  });
});

describe("metadata", () => {
  it("is noindexed", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
