/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                bg: '#2D2727',
                primary: '#1e1818',
            },
            spacing: {
                12: '12px',
                36: '36px',
            },
        },
    },
    plugins: [],
}
