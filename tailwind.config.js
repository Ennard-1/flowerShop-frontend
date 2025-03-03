/** @type {import('tailwindcss').Config} */
export const content = ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      primary: "#D16BA5", // Tom rosado
      secondary: "#FAE1DD", // Creme rosado
      dark: "#333333", // Cinza chumbo
      accent: "#8D6A9F", // Cinza arroxeado
    },
  },
};
export const plugins = [];
