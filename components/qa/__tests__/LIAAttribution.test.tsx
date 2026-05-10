import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LIAAttribution } from "../LIAAttribution";

const fakeLIA = {
  _id: "lia-1",
  name: "David Mitchell",
  licenseNumber: "201500123",
  photo: { asset: { _ref: "image-fake-100x100-jpg" } },
  bio: "12 years helping families migrate to New Zealand.",
};

describe("LIAAttribution", () => {
  it("renders the LIA name, role, license, and bio", () => {
    render(<LIAAttribution lia={fakeLIA} />);
    expect(screen.getByText("David Mitchell")).toBeInTheDocument();
    expect(
      screen.getByText("Licensed Immigration Adviser")
    ).toBeInTheDocument();
    expect(screen.getByText(/201500123/)).toBeInTheDocument();
    expect(screen.getByText(/12 years helping families/)).toBeInTheDocument();
  });

  it("does not render an external link out", () => {
    const { container } = render(<LIAAttribution lia={fakeLIA} />);
    expect(container.querySelector("a")).toBeNull();
  });
});
