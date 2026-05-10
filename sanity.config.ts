import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "horizons-studio",
  title: "Horizons Studio",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
    muxInput(),
  ],
  schema: { types: schemaTypes },
});
