import type { StructureBuilder } from "sanity/structure";

type CountryOption = { title: string; value: string };

const COUNTRIES: CountryOption[] = [
  { title: "New Zealand", value: "nz" },
  { title: "Australia", value: "au" },
  { title: "Canada", value: "ca" },
  { title: "Global", value: "global" },
];

function countryGroupedList(
  S: StructureBuilder,
  opts: { id: string; title: string; schemaType: string }
) {
  const { id, title, schemaType } = opts;

  return S.listItem()
    .id(id)
    .title(title)
    .child(
      S.list()
        .id(`${id}-root`)
        .title(title)
        .items([
          S.listItem()
            .id(`${id}-all`)
            .title("All")
            .child(
              S.documentTypeList(schemaType)
                .id(`${id}-all-list`)
                .title(`All ${title}`)
            ),
          S.divider(),
          ...COUNTRIES.map((c) =>
            S.listItem()
              .id(`${id}-${c.value}`)
              .title(c.title)
              .child(
                S.documentTypeList(schemaType)
                  .id(`${id}-${c.value}-list`)
                  .title(`${title} — ${c.title}`)
                  .filter('_type == $type && country == $country')
                  .params({ type: schemaType, country: c.value })
              )
          ),
        ])
    );
}

export default function deskStructure(S: StructureBuilder) {
  return S.list()
    .id("root")
    .title("Content")
    .items([
      countryGroupedList(S, {
        id: "qa",
        title: "Q&A",
        schemaType: "qa",
      }),
      countryGroupedList(S, {
        id: "post",
        title: "Blog posts",
        schemaType: "post",
      }),
      countryGroupedList(S, {
        id: "successStory",
        title: "Success stories",
        schemaType: "successStory",
      }),
      countryGroupedList(S, {
        id: "submittedQuestion",
        title: "Submitted questions",
        schemaType: "submittedQuestion",
      }),
      S.divider(),
      S.documentTypeListItem("lia").title("Licensed Immigration Advisers"),
      S.documentTypeListItem("googleReview").title("Google reviews"),
      S.documentTypeListItem("interestSubmission").title(
        "Interest submissions"
      ),
    ]);
}
