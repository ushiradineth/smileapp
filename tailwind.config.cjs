/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        screens: {
            'mobile': '320px',

            'tab': '768px',

            'web': '1024px',
        },
    },
    plugins: [],
}