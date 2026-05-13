import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { generateCoverAction } from "./src/sanity/actions/generate-cover";

export default defineConfig({
  name: "victor-alpha",
  title: "Victor Alpha",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "post") {
        return [...prev, generateCoverAction];
      }
      return prev;
    },
  },
});
