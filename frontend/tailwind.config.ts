import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				// Primary brand colors
				primary: {
					50: "#eff6ff",
					100: "#dbeafe",
					200: "#bfdbfe",
					300: "#93c5fd",
					400: "#60a5fa",
					500: "#3b82f6",
					600: "#2563eb",
					700: "#1d4ed8",
					800: "#1e40af",
					900: "#1e3a8a",
					950: "#172554",
				},
				// Secondary accent colors
				secondary: {
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#64748b",
					600: "#475569",
					700: "#334155",
					800: "#1e293b",
					900: "#0f172a",
					950: "#020617",
				},
				// Gradient colors
				gradient: {
					from: "#667eea",
					via: "#764ba2",
					to: "#f093fb",
				},
				// Status colors
				success: {
					50: "#f0fdf4",
					500: "#22c55e",
					600: "#16a34a",
				},
				warning: {
					50: "#fffbeb",
					500: "#f59e0b",
					600: "#d97706",
				},
				error: {
					50: "#fef2f2",
					500: "#ef4444",
					600: "#dc2626",
				},
				// Semantic colors
				background: "var(--background)",
				foreground: "var(--foreground)",
				card: "var(--card)",
				"card-foreground": "var(--card-foreground)",
				popover: "var(--popover)",
				"popover-foreground": "var(--popover-foreground)",
				"primary-foreground": "var(--primary-foreground)",
				"secondary-foreground": "var(--secondary-foreground)",
				muted: "var(--muted)",
				"muted-foreground": "var(--muted-foreground)",
				accent: "var(--accent)",
				"accent-foreground": "var(--accent-foreground)",
				destructive: "var(--destructive)",
				"destructive-foreground": "var(--destructive-foreground)",
				border: "var(--border)",
				input: "var(--input)",
				ring: "var(--ring)",
				surface: {
					light: "#ffffff",
					dark: "#1f2937",
				},
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				mono: ["JetBrains Mono", "Menlo", "Monaco", "monospace"],
			},
			fontSize: {
				"2xs": ["0.625rem", { lineHeight: "0.875rem" }],
				"3xl": ["1.875rem", { lineHeight: "2.25rem" }],
				"4xl": ["2.25rem", { lineHeight: "2.5rem" }],
				"5xl": ["3rem", { lineHeight: "3.5rem" }],
				"6xl": ["3.75rem", { lineHeight: "4rem" }],
			},
			spacing: {
				18: "4.5rem",
				88: "22rem",
				128: "32rem",
			},
			borderRadius: {
				"4xl": "2rem",
			},
			boxShadow: {
				soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
				medium:
					"0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.04)",
				strong:
					"0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)",
				glow: "0 0 20px rgba(59, 130, 246, 0.15)",
				"glow-lg": "0 0 40px rgba(59, 130, 246, 0.15)",
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-up": "slideUp 0.3s ease-out",
				scale: "scale 0.2s ease-in-out",
				"pulse-soft": "pulseSoft 2s infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				scale: {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.05)" },
				},
				pulseSoft: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.8" },
				},
			},
			backdropBlur: {
				xs: "2px",
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		({ addUtilities }: any) => {
			addUtilities({
				".glass": {
					background: "rgba(255, 255, 255, 0.25)",
					"backdrop-filter": "blur(10px)",
					border: "1px solid rgba(255, 255, 255, 0.18)",
				},
				".glass-dark": {
					background: "rgba(0, 0, 0, 0.25)",
					"backdrop-filter": "blur(10px)",
					border: "1px solid rgba(255, 255, 255, 0.125)",
				},
				".gradient-text": {
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					"-webkit-background-clip": "text",
					"-webkit-text-fill-color": "transparent",
					"background-clip": "text",
				},
			});
		},
	],
};
export default config;
