/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fresh: {
          mint: "#00b894",
          light: "#55efc4",
        },
        saffron: {
          warm: "#e67e22",
          light: "#fab1a0",
        },
        canvas: "#f9f9f9",
      },
      boxShadow: {
        'bento': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'bento-hover': '0 20px 40px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
