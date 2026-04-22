import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a237e",
        "primary-light": "#3949ab",
        accent: "#f9a825",
        "accent-light": "#fdd835",
        page: "#f5f6fa",
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
