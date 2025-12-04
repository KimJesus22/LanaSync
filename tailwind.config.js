/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: '#121212', // Dark Gray
                surface: '#1E1E1E',
                primary: '#39FF14', // Neon Green (Income/Accents)
                secondary: '#FF4D4D', // Soft Red (Expenses)
                accent: '#FFFF00', // Yellow (Vouchers)
                text: '#FFFFFF',
                muted: '#A0A0A0',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
