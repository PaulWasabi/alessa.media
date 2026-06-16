// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://paulwasabi.github.io",
  base: "/alessa.media",
  vite: {
    plugins: [tailwindcss()]
  }
});