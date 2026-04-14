/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "#fff7ed",
          100: "#ffedd4",
          200: "#ffd6a8",
          300: "#ffb86f",
          400: "#ff9442",
          500: "#f97316",
          600: "#dd5d0a",
          700: "#b7460a",
          800: "#93390f",
          900: "#772f10",
        },
        field: {
          50: "#eefbff",
          100: "#d7f4ff",
          200: "#b3eaff",
          300: "#7fdbff",
          400: "#42c2f5",
          500: "#1496d4",
          600: "#0b78b3",
          700: "#0d5f8e",
          800: "#124f75",
          900: "#153f5d",
        },
        ink: "#0f172a",
        cream: "#f8fbff",
      },
      fontFamily: {
        display: ['"Sora"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 23, 42, 0.14)",
      },
      backgroundImage: {
        "stadium-glow":
          "radial-gradient(circle at top left, rgba(127, 219, 255, 0.26), transparent 34%), radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.24), transparent 30%), linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(13, 95, 142, 0.78))",
      },
    },
  },
  plugins: [],
};
