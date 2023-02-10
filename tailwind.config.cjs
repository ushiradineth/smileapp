/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                'sm': '320px',
                'md': '768px',
                'lg': '1024px'
            },
        },
        fontFamily: {
          cal: ['Cal Sans']
        }
    },
    plugins: [],
};