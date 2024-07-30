/** @type {import('tailwindcss').Config} */
module.exports = {
    daisyui: {
        themes: ["halloween"],
    },
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
}

