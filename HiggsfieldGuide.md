# Higgsfield Image Generation Guide

How Claude generates AI images for this project, plus the rules Joey set as standing defaults.

## Standing rules

**Joey's defaults — DO NOT DEVIATE without explicit instruction:**

| Setting | Value |
|---|---|
| Model | `gpt_image_2` (GPT Image 2) |
| Quality | `high` |
| Resolution | `2k` |
| Aspect ratio | `16:9` |

**Always confirm setup BEFORE generating.** Show Joey the planned command (model, flags, prompt, character references) and wait for his OK. Do not run `higgsfield generate create` blind.

Use a different model only when Joey explicitly says so (e.g., "use Soul V2 for this one").

## CLI prerequisites

- `higgsfield` CLI installed globally (`npm install -g @higgsfield/cli`)
- Authenticated via `higgsfield auth login` (OAuth, one-time)
- Account: `misa@dealzkk.com` — Plus plan
- Per-image cost: ~0.12–0.5 credits (negligible at scale)

## Character references

Recurring personas live in `.character-refs.json` at the repo root (gitignored — UUIDs are account-scoped).

Current personas:

| Slug | Who | UploadId (Higgsfield) |
|---|---|---|
| `jojo-reyes` | Filipino dad, 35, IT PM in Makati | `2f810018-ebbe-47fb-9448-3bfdf40adc00` |
| `kathleen-reyes` | Filipino mom, 33, nurse | `cb1c560f-021b-4d99-9260-14b5e1eda495` |
| `liam-reyes` | Filipino son, 8 | `59300487-f730-49b4-bbc0-c27960e603dd` |
| `sofia-reyes` | Filipino daughter, 4 | `bd852981-e83a-44f7-af76-74bf0cceb8b1` |
| `rowel-mercado` | LIA — real photos only, no AI gen of his likeness | (no upload — policy: `real-photos-only`) |

Source PNGs are in `tmp/higgsfield/characters/` (gitignored).

## Standard generation command

```bash
higgsfield generate create gpt_image_2 \
  --prompt "<prompt>" \
  --aspect_ratio 16:9 \
  --quality high \
  --resolution 2k \
  --image <character-uuid> \
  [--image <another-character-uuid>] \
  --wait \
  --wait-timeout 5m \
  --json
```

`--wait` blocks until the job finishes and returns the result URL. Pass `--image` for each character reference being included in the scene.

## After generation

1. Download the result URL to `tmp/higgsfield/` with a kebab-case descriptive filename (e.g., `medical-bill-scene-01.png`).
2. Show Joey the result (Read the image file so he can see it inline).
3. Critique honestly — what worked, what didn't.
4. Wait for direction before iterating or moving to Sanity upload.

## Future: Sanity integration

When a generated image is approved, we'll push it to Sanity as an image asset and reference it from the relevant blog post / Q&A / page. The Sanity upload helper script is a separate piece of work (not yet built — see notes when the time comes).

## Why these defaults

- **GPT Image 2** chosen after Soul V2 produced unwanted magazine-template text overlays. GPT Image 2 handles text reliably and gives cleaner photo output.
- **16:9** = standard blog hero ratio.
- **High / 2k** = sharp enough for retina screens, big enough for hero use without further upscaling.
- **Confirm-before-generate** = Joey wants visibility into each generation rather than burning through credits on bad prompts.

## Related

- `.character-refs.json` — persona library (gitignored)
- `tmp/higgsfield/` — generation outputs and character sources (gitignored)
- `SEOStrategy.md` — content strategy this image gen ultimately serves
