import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "lyo2lw0j",
    dataset: "production",
  },
  /**
   * Deployment hostname for the hosted Studio.
   * After `npx sanity deploy` succeeds, the Studio will be at:
   *   https://<studioHost>.sanity.studio/
   */
  studioHost: "victor-alpha",
  deployment: {
    appId: "y3atrli9kq2735g2shxvc1ma",
    autoUpdates: true,
  },
});
