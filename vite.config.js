import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ base: './', plugins: [tailwindcss()], test: { include: ['tests/*.test.jsx'], environment: 'jsdom', setupFiles: './tests/setup.js' } });
