/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',  // Include files in app directory
    './src/components/**/*.{js,ts,jsx,tsx}',  // Include if you have a components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
