
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  /* ► HIER erweitern ◄ */
  theme: {
    extend: {
      colors: {
        /* MoveSmart-Palette  (anpassen, wenn du feinere Werte willst) */
        "brand-start": "#0ab0a0", // Türkis
        "brand-mid":   "#05b4c9", // Aqua
        "brand-end":   "#0084d1", // Blau
      },
    },
  },

  plugins: [forms],
};
