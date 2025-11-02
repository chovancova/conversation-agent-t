import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-scroll-area',
          ],
          'icons': ['@phosphor-icons/react', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  // Vitest configuration for testing
  test: {
    // Makes test globals like `describe`, `it`, `expect` available without imports
    globals: true,
    // Simulates a browser environment for tests (DOM APIs available)
    environment: 'jsdom',
    // Runs setup code before tests (configures testing-library matchers)
    setupFiles: './src/test/setup.ts',
  },
});
