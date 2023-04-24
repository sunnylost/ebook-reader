import type { Config } from 'tailwindcss'

export default {
    darkMode: 'class',
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                bg: '#fff',
                'dark-bg': '#48484a',
                primary: '#d4d4d4',
                'dark-primary': '#0f172a',
                text: '#030712',
                'dark-text': '#f3f4f6',
            },
            spacing: {
                2: '2px',
                4: '4px',
                6: '6px',
                8: '8px',
                10: '10px',
                12: '12px',
                14: '14px',
                16: '16px',
                18: '18px',
                20: '20px',
                24: '24px',
                36: '36px',
            },
        },
    },
    plugins: [],
} satisfies Config
