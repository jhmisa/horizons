import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
  usePathname: () => "/",
}));

import CountrySwitcher from "../CountrySwitcher";

describe("CountrySwitcher", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
  });

  it("calls router.push AND router.refresh when switching from NZ to AU (desktop)", () => {
    render(<CountrySwitcher />);
    // Open the dropdown
    fireEvent.click(screen.getByRole("button", { name: /New Zealand/ }));
    // Click the Australia option
    fireEvent.click(screen.getByRole("option", { name: /Australia/ }));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/au");
    // refresh() is what fixes the Footer-doesn't-update-on-switch bug:
    // it invalidates the client Router Cache so the root layout re-renders.
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("calls router.push AND router.refresh when switching from NZ to CA (desktop)", () => {
    render(<CountrySwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /New Zealand/ }));
    fireEvent.click(screen.getByRole("option", { name: /Canada/ }));

    expect(push).toHaveBeenCalledWith("/ca");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("does NOT call push or refresh when selecting the current country", () => {
    render(<CountrySwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /New Zealand/ }));
    // Click the NZ option (current country)
    fireEvent.click(screen.getByRole("option", { name: /New Zealand/ }));

    expect(push).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("calls router.push AND router.refresh in mobile variant", () => {
    render(<CountrySwitcher variant="mobile" />);
    // Mobile variant renders the listbox inline (no trigger to click first)
    fireEvent.click(screen.getByRole("option", { name: /Australia/ }));

    expect(push).toHaveBeenCalledWith("/au");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("invokes onSelect callback when provided (mobile menu close hook)", () => {
    const onSelect = vi.fn();
    render(<CountrySwitcher variant="mobile" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("option", { name: /Australia/ }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
