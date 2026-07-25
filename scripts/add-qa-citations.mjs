import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; })
);
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-10-01", token: env.SANITY_API_TOKEN, useCdn: false,
});

const key = () => Math.random().toString(36).slice(2, 10);
const dryRun = process.argv.includes("--dry-run");
const mappings = JSON.parse(readFileSync(process.argv[2], "utf8"));

for (const { docId, links } of mappings) {
  const doc = await client.getDocument(docId);
  const article = structuredClone(doc.article);
  const applied = [];
  for (const { blockKey, phrase, href } of links) {
    const blk = article.find((b) => b._key === blockKey);
    if (!blk) { console.warn(`SKIP ${docId}: block ${blockKey} not found`); continue; }
    const idx = blk.children.findIndex((c) => c._type === "span" && c.text.includes(phrase));
    if (idx === -1) { console.warn(`SKIP ${docId}: phrase not found: ${phrase}`); continue; }
    const span = blk.children[idx];
    const [before, after] = [span.text.slice(0, span.text.indexOf(phrase)), span.text.slice(span.text.indexOf(phrase) + phrase.length)];
    const markKey = key();
    blk.markDefs = [...(blk.markDefs || []), { _type: "link", _key: markKey, href }];
    const repl = [];
    if (before) repl.push({ _type: "span", _key: key(), text: before, marks: span.marks || [] });
    repl.push({ _type: "span", _key: key(), text: phrase, marks: [...(span.marks || []), markKey] });
    if (after) repl.push({ _type: "span", _key: key(), text: after, marks: span.marks || [] });
    blk.children.splice(idx, 1, ...repl);
    applied.push(`${phrase} -> ${href}`);
  }
  if (dryRun) { console.log(`[dry-run] ${docId}:`); applied.forEach((a) => console.log("  " + a)); continue; }
  await client.patch(docId).set({ article }).commit();
  console.log(`✔ ${docId}: ${applied.length} links`);
}
