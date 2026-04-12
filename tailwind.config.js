/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "#f6f2e8",
          100: "#ece2cc",
          200: "#d8c18c",
          300: "#c29c53",
          400: "#ac7e2c",
          500: "#8b6115",
          600: "#704b11",
          700: "#55380c",
          800: "#3b2708",
          900: "#221604",
        },
        field: {
          50: "#ecfaf1",
          100: "#d3f3df",
          200: "#a8e5bd",
          300: "#74d294",
          400: "#45b76e",
          500: "#289955",
          600: "#1b7741",
          700: "#175f35",
          800: "#154b2b",
          900: "#123f25",
        },
        ink: "#101820",
        cream: "#f8f4eb",
      },
      fontFamily: {
        display: ['"Poppins"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 45px rgba(16, 24, 32, 0.12)",
      },
      backgroundImage: {
        "stadium-glow":
          "radial-gradient(circle at top, rgba(116, 210, 148, 0.16), transparent 38%), radial-gradient(circle at bottom right, rgba(172, 126, 44, 0.22), transparent 32%)",
      },
    },
  },
  plugins: [],
};
