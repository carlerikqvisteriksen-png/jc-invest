/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                obsidian: '#0a0a0a',
                stone: {
                    DEFAULT: '#57534e',
                    dark: '#1c1917',
                    light: '#78716c',
                },
                blood: '#880808',
                brass: {
                    DEFAULT: '#D4AF37', // Royal Gold
                    glow: '#F4CF57',
                    dark: '#B48F17',
                },
                ink: {
                    primary: '#F5F5F5',
                    secondary: 'rgba(255, 255, 255, 0.6)',
                }
            },
            fontFamily: {
                serif: ['Cinzel', 'Playfair Display', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
