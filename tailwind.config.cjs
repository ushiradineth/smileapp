/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                'xsm': '320px',
                'md': '750px',
                'lg': '1150px'
            },
        },
        fontFamily: {
          cal: ['Cal Sans']
        }
    },
    plugins: [],
};