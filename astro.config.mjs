import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  ViewTransitions: true,
  output: "server",
  adapter: vercel(),
  integrations: [tailwind(), react(), mdx()]
});