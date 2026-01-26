/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // Disable Tailwind's preflight/reset since we handle it ourselves
  corePlugins: {
    preflight: false,
  },
};
