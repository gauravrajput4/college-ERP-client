import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7F1D1D",
        "primary-light": "#991b1b",
        accent: "#F59E0B",
        "accent-light": "#fbbf24",
        page: "#FFF7ED",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Nunito", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(26,35,126,0.10)",
      },
    },
  },
  plugins: [forms],
};
