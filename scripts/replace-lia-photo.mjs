#!/usr/bin/env node
/**
 * Replace the photo on a Licensed Immigration Adviser (LIA) document in Sanity.
 *
 * Usage:
 *   node scripts/replace-lia-photo.mjs --name "Rowel Mercado" --photo public/images/rowel-headshot.jpg
 *
 * Finds the LIA by exact name match, uploads the image as a new asset, and
 * patches the lia.photo field to point at the new asset. Hotspot is left at
 * the default (centered) — fine-tune in Studio if needed.
 */
import { createClient } from "@sanity/client";
import { createReadStream, readFileSync, statSync } from "node:fs";
import { basename } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, val, i, arr) => {
    if (val.startsWith("--") && arr[i + 1] && !arr[i + 1].startsWith("--")) {
      acc.push([val.slice(2), arr[i + 1]]);
    }
    return acc;
  }, [])
);

if (!args.name || !args.photo) {
  console.error("Usage: node scripts/replace-lia-photo.mjs --name \"Full Name\" --photo path/to/photo.jpg");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [
        l.slice(0, i).trim(),
        l.slice(i + 1).trim().replace(/^["']|["']$/g, ""),
      ];
    })
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01",
  token: env.SANITY_API_TOKEN,
  useCdn: false,
});

const stat = statSync(args.photo);
console.log(`Photo: ${args.photo} (${Math.round(stat.size / 1024)} KB)`);

const lia = await client.fetch(
  `*[_type == "lia" && name == $name][0]{_id, name, "currentPhotoRef": photo.asset._ref}`,
  { name: args.name }
);

if (!lia) {
  console.error(`No LIA found with name: ${args.name}`);
  process.exit(1);
}
console.log(`Found LIA: ${lia.name} (${lia._id})`);
console.log(`Current photo asset: ${lia.currentPhotoRef ?? "(none)"}`);

console.log(`Uploading new asset…`);
const asset = await client.assets.upload("image", createReadStream(args.photo), {
  filename: basename(args.photo),
});
console.log(`Uploaded asset: ${asset._id}`);

console.log(`Patching ${lia._id}.photo → ${asset._id}…`);
const updated = await client
  .patch(lia._id)
  .set({
    photo: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    },
  })
  .commit();

console.log(`Done. Updated rev: ${updated._rev}`);
console.log(`Open Studio to set the hotspot if the auto-crop needs fine-tuning.`);
