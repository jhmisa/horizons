import { sanityClient } from "./sanity";
import type { Country } from "./config";

export interface PartnerSchool {
  _id: string;
  name: string;
  slug: string;
  country: Country;
  city: string | null;
  logoUrl: string;
  logoAlt: string;
  website: string;
  blurb: string;
  order: number;
}

const partnerSchoolsQuery = `
*[_type == "partnerSchool" && country == $country && isActive == true]
| order(order asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  country,
  city,
  "logoUrl": logo.asset->url,
  "logoAlt": logo.alt,
  website,
  blurb,
  order
}
`;

export async function getPartnerSchools(country: Country): Promise<PartnerSchool[]> {
  return sanityClient.fetch<PartnerSchool[]>(partnerSchoolsQuery, { country });
}
