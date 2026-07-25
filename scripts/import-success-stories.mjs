import { createClient } from "@sanity/client";
import { readFileSync, createReadStream } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-10-01",
  token: env.SANITY_API_TOKEN,
  useCdn: false,
});

const PHOTO_DIR = "/tmp/wix-photos";
const PUBLISHED_AT = new Date().toISOString();

const block = (text) => ({
  _type: "block",
  _key: Math.random().toString(36).slice(2, 10),
  style: "normal",
  markDefs: [],
  children: [
    { _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks: [] },
  ],
});

// Testimonials salvaged verbatim from www.horizonsmigration.com/testimonials (old Wix site)
const stories = [
  {
    slug: "aldy-and-sona-daval-santos",
    clientFirstName: "Aldy & Sona",
    destination: "North Shore, Auckland",
    photo: "a0299e_9904f93600ba4adcb7bdf917444a658c~mv2_d_1360_1360_s_2.jpg",
    photoName: "daval-santos-family.jpg",
    summary:
      "On our first meeting alone, we were most impressed with their professionalism and utmost sincerity in providing an overall picture of what to expect in NZ life.",
    story: [
      "Our family was blessed having chosen the services of Horizons NZ. On our first meeting alone, we were most impressed with their professionalism and utmost sincerity in providing an overall picture of what to expect in NZ life. They guided us very well as new immigrants and gave valuable advice in securing work towards residency. Kudos to Rowel and to the rest of the team!",
    ],
  },
  {
    slug: "janis",
    clientFirstName: "Janis",
    destination: "Auckland",
    photo: "a0299e_1512f04844204e34954825392996913b~mv2.png",
    photoName: "janis-welcome-to-nz.png",
    summary:
      "With the assistance from Horizons New Zealand, I was able to join my husband just a MONTH after my visa application.",
    story: [
      "“Being away from your husband can be overwhelmingly doleful but with the assistance from Horizons New Zealand, I was able to join my husband (Brian) just a MONTH after my VISA application. It was not an easy course but with the partnership Horizons offered, we were able to prepare all required documents that helped speed up the process. Open communication is always effective and I appreciate Horizons sense of urgency in coming back to us for all of our concerns. They have been very accommodating and optimistic - 2 important qualities crucial in any VISA-processing firm.",
      "After almost 3 weeks here in New Zealand, I'm very happy to be with my husband again and I feel really blessed to have been offered a job within the same industry as my previous experience in the Philippines. All these possible because of God's grace, support from family and friends, and proper guidance from Horizons New Zealand. Thank you, team!”",
    ],
  },
  {
    slug: "brian",
    clientFirstName: "Brian",
    destination: "Auckland",
    photo: "a0299e_de659d9fb4af4c439b70e8d0fa971ae4~mv2.jpg",
    photoName: "brian-visa-approved.jpg",
    summary:
      "Thank you Horizons New Zealand — you served as the gateway that provided the path for me to reach one of my life goals.",
    story: [
      "Thank you Horizons New Zealand - you served as the gateway that provided the path for me to reach one of my life goals. I appreciate the partnership and the open communication that made me feel welcome; you've always responded urgently to my every question. Thank you for being efficient and reliable, and for the guidance that has always assured me that I'm in good hands. Keep up the excellent work!",
    ],
  },
  {
    slug: "perry-and-rowie",
    clientFirstName: "Perry & Rowie",
    destination: "Pakuranga, Auckland",
    visaCategory: "Parent Category",
    photo: "a0299e_0b8b98b5553246948a04a5dfd1d84dbb~mv2.jpg",
    photoName: "fajardo-family-parents.jpg",
    summary:
      "They took the load and stress away from me and made it a really easy process. After a few months, my parents' residency was approved!",
    story: [
      "Ever since we have settled here in New Zealand, I really wanted to bring my parents here so I can spend my time with them. They can only immigrate here in New Zealand through the Parent's Category of New Zealand Immigration. I decided to find all the requirements for them to immigrate here on my own. It was a very stressful process and I felt I was going nowhere doing it all on my own.",
      "I decided to consult Horizons New Zealand for advice and assistance. They took off the load and stress away from me and made it a really easy process. They requested all the files and documents that they needed from us and they sorted the rest of the application process for us. After a few months, my parent's residency was approved and they will be coming to New Zealand soon!",
      "I really recommend Horizons New Zealand for all your immigration needs as they will make the process easy and no stress for you. They would gladly answer all your questions and concerns regarding immigration. I would like to thank Horizons New Zealand for helping my family out.",
    ],
  },
  {
    slug: "grace",
    clientFirstName: "Grace",
    destination: "Auckland",
    visaCategory: "Post Study Work Visa",
    photo: "a0299e_2b75f6bd8670410b95aa80f8140906fb~mv2.jpg",
    photoName: "grace-post-study-work-visa.jpg",
    summary:
      "Congratulations Grace on your Post Study Work Visa! Grace celebrated her approval with the team at our Auckland office.",
    story: [
      "Grace came to Horizons as an international student and, with the team's guidance, secured her Post Study Work Visa. She celebrated the approval with the team at our Auckland office - congratulations, Grace!",
    ],
  },
  {
    slug: "sarangay-family",
    clientFirstName: "The Sarangay Family",
    destination: "Auckland",
    photo: "a0299e_2e157f1c20074bf7bbd67a9ad8e842d8~mv2.jpg",
    photoName: "sarangay-family.jpg",
    summary:
      "Finally! Our visa was approved! Thank you so much for all your efforts, for the time and patience you spent in dealing with the whole process.",
    story: [
      "Finally! Our visa was approved! Thank you so much for all your efforts. For the time and patience, you spent in dealing with the whole process. We are very much grateful for everything you've done for us. Thank You Horizons New Zealand Team. We are very fortunate for this opportunity.",
    ],
  },
  {
    slug: "eugene-and-chiqui",
    clientFirstName: "Eugene & Chiqui",
    destination: "Auckland",
    photo: "a0299e_d1163e218308409aa198eaadbd44f74d~mv2.jpg",
    photoName: "eugene-chiqui-thank-you.jpg",
    summary:
      "To Horizons Team — thank you for all your kind assistance. God bless! From Eugene and Chiqui.",
    story: [
      "“To Horizons Team, thank you for all your kind assistance. God bless! From Eugene and Chiqui.”",
      "We received a wonderful gift from our clients Eugene and Chiqui - thank you! Do not leave it to amateurs: work with a Licensed Immigration Adviser. Let our experience be your guide.",
    ],
  },
  {
    slug: "efren",
    clientFirstName: "Efren",
    destination: "Auckland",
    visaCategory: "Work Visa",
    photo: "a0299e_df0bb9826b0e43168d177b8cf23a4add~mv2_d_2048_1536_s_2.jpg",
    photoName: "efren-work-visa.jpg",
    summary:
      "I wanted to take an opportunity to thank you for all of your hard work, diligence, and attention to detail throughout the entire process. Thank you Horizons!",
    story: [
      "I wanted to take an opportunity to thank you for all of your hard work, diligence, and attention to detail throughout the entire process. Thank you Horizons!",
    ],
  },
  {
    slug: "mikenth",
    clientFirstName: "Mikenth",
    destination: "Auckland",
    photo: "a0299e_e225a63e54cd4a4aa1ace688f9b75853~mv2_d_2048_1536_s_2.jpg",
    photoName: "mikenth-celebration.jpg",
    summary:
      "These guys are truly professional — they listen, analyze the problem, develop a plan, advise you, and produce results without killing the budget.",
    story: [
      "These guys are truly professional - they listen, analyze the problem, develop a plan, advise you, and produce results without killing the budget. Thank you Horizons New Zealand!",
    ],
  },
];

for (const s of stories) {
  const asset = await client.assets.upload(
    "image",
    createReadStream(`${PHOTO_DIR}/${s.photo}`),
    { filename: s.photoName }
  );
  const doc = {
    _id: `successStory-${s.slug}`,
    _type: "successStory",
    clientFirstName: s.clientFirstName,
    slug: { _type: "slug", current: s.slug },
    country: "nz",
    destination: s.destination,
    ...(s.visaCategory ? { visaCategory: s.visaCategory } : {}),
    summary: s.summary,
    photo: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    },
    story: s.story.map(block),
    publishedAt: PUBLISHED_AT,
  };
  await client.createOrReplace(doc);
  console.log(`✔ ${s.clientFirstName} (${s.slug}) — photo ${asset._id}`);
}

console.log(`\nDone: ${stories.length} success stories published.`);
