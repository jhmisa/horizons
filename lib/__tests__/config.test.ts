import { describe, it, expect } from "vitest";
import { COUNTRIES, getCountryConfig } from "../config";

describe("CountryConfig regulator verify fields", () => {
  it.each(COUNTRIES)("country %s has regulatorVerifyUrl and regulatorVerifyLabel", (country) => {
    const config = getCountryConfig(country);
    expect(config.regulatorVerifyUrl).toMatch(/^https:\/\//);
    expect(config.regulatorVerifyLabel).toMatch(/^Verify our /);
  });

  it("NZ uses IAA register search", () => {
    expect(getCountryConfig("nz").regulatorVerifyUrl).toContain("iaa.govt.nz");
  });

  it("AU uses MARA register search", () => {
    expect(getCountryConfig("au").regulatorVerifyUrl).toContain("mara.gov.au");
  });

  it("CA uses CICC register search", () => {
    expect(getCountryConfig("ca").regulatorVerifyUrl).toContain("college-ic.ca");
  });
});
