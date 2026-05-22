import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import deskStructure from "./sanity/structure";

export default defineConfig({
  name: "horizons-studio",
  title: "Horizons Studio",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
