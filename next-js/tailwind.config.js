/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
       scale: {
        '110': '1.10', // เพิ่มขนาดการขยายเพิ่มเติม
        '120': '1.20', // เพิ่มขนาดการขยายเพิ่มเติม
        '130': '1.30', // เพิ่มขนาดการขยายเพิ่มเติม
        '160': '1.60', // เพิ่มขนาดการขยายเพิ่มเติม
      }
    },
  },
  plugins: [],
};
