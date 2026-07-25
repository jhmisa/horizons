import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SiteJsonLd } from "../SiteJsonLd";

function getJsonLd(container: HTMLElement): Record<string, unknown>[] {
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => JSON.parse(s.innerHTML));
}

describe("SiteJsonLd", () => {
  it("renders Organization schema with IAA credential", () => {
    const { container } = render(
      <SiteJsonLd siteUrl="https://www.horizonsimmigration.com" />
    );
    const org = getJsonLd(container).find((d) => d["@type"] === "Organization");
    expect(org).toBeDefined();
    expect(org!.name).toBe("Horizons Immigration Consulting");
    expect(JSON.stringify(org)).toContain("Immigration Advisers Authority");
  });

  it("renders Person schema for Rowel with LinkedIn sameAs and IAA credential", () => {
    const { container } = render(
      <SiteJsonLd siteUrl="https://www.horizonsimmigration.com" />
    );
    const person = getJsonLd(container).find((d) => d["@type"] === "Person");
    expect(person).toBeDefined();
    expect(person!.name).toBe("Rowel Mercado");
    expect(person!.sameAs).toContain(
      "https://www.linkedin.com/in/rowel-mercado-1388883a/"
    );
    const cred = person!.hasCredential as Record<string, unknown>;
    expect(cred.credentialCategory).toBe("license");
    expect(cred.identifier).toBe("200900577");
    expect(JSON.stringify(cred)).toContain("Immigration Advisers Authority");
  });
});
