import { ROWEL } from "@/lib/adviser";

export function SiteJsonLd({ siteUrl }: { siteUrl: string }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Horizons Immigration Consulting",
    url: siteUrl,
    logo: `${siteUrl}/images/favicon/apple-touch-icon.png`,
    description:
      "Licensed Immigration Advisers helping Filipino families migrate to New Zealand.",
    memberOf: {
      "@type": "Organization",
      name: "Immigration Advisers Authority (IAA), New Zealand",
      url: "https://www.iaa.govt.nz/",
    },
    employee: { "@id": `${siteUrl}/#rowel` },
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#rowel`,
    name: ROWEL.name,
    jobTitle: `${ROWEL.jobTitle} (IAA #${ROWEL.licenseNumber})`,
    worksFor: { "@id": `${siteUrl}/#organization` },
    url: `${siteUrl}/about`,
    sameAs: [ROWEL.linkedinUrl],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      identifier: ROWEL.licenseNumber,
      name: "Licensed Immigration Adviser",
      recognizedBy: {
        "@type": "Organization",
        name: "Immigration Advisers Authority (IAA), New Zealand",
        url: "https://www.iaa.govt.nz/",
      },
      url: ROWEL.iaaRegisterSearchUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
    </>
  );
}
