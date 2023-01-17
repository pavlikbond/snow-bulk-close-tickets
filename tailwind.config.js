/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                pirmary: "#202225",
                secondary: "#5865f2",
                gray: colors.coolGray,
            },
        },
    },
    plugins: [require("daisyui")],
};
