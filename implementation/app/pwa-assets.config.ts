import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Icons for the installed app: maskable (Android) and apple-touch get a teal background instead of white padding.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#0D9488' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#0D9488' } },
  },
  images: ['public/icon.svg'],
});
