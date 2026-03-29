import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F5F2",
        surface: "#FFFFFF",
        text: "#111111",
        muted: "#6B6B6B",
        line: "#E7E4DD",
        sand: "#D9D3C8",
        accent: "#FF6B3D",
        "accent-deep": "#E4572E"
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI", "Helvetica Neue", "Arial", "system-ui", "sans-serif"],
        display: ["Aptos", "Segoe UI", "Helvetica Neue", "Arial", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 24px 64px rgba(17, 17, 17, 0.08)"
      },
      animation: {
        reveal: "reveal 520ms ease-out both",
        progress: "progress 2.9s ease-in-out forwards",
        pulsebar: "pulsebar 1.8s ease-in-out infinite"
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        progress: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" }
        },
        pulsebar: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
