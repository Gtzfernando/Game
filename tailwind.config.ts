import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-alt": "var(--background-alt)",
        foreground: "var(--foreground)",
        "foreground-alt": "var(--foreground-alt)",
        moss: {
          DEFAULT: "#4A7C59",
          light: "#7DA37E",
        },
        sky: {
          DEFAULT: "#6B9AC4",
          soft: "#A3C6E0",
        },
        sun: "#E8B84B",
        terracotta: "#D96B52",
        cream: "#F5F1E3",
        ivory: "#FAF7EE",
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        organic: "24px 18px 28px 20px",
      },
      boxShadow: {
        warm: "0 4px 12px rgba(44, 53, 45, 0.12)",
      },
      animation: {
        "float-leaf": "floatLeaf 6s ease-in-out infinite",
        "float-leaf-slow": "floatLeaf 8s ease-in-out infinite",
        "drift-cloud": "driftCloud 35s linear infinite",
        "sparkle": "sparkle 4s ease-in-out infinite",
        "fall-flower": "fallFlower 8s linear infinite",
        "fall-flower-slow": "fallFlower 11s linear infinite",
        "fall-flower-fast": "fallFlower 6s linear infinite",
      },
      keyframes: {
        floatLeaf: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(8deg)" },
        },
        driftCloud: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(110%)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { opacity: "0.7", transform: "scale(1)" },
        },
        fallFlower: {
          "0%": {
            transform: "translateY(-10vh) rotate(0deg)",
            opacity: "0",
          },
          "10%": {
            opacity: "0.9",
          },
          "90%": {
            opacity: "0.8",
          },
          "100%": {
            transform: "translateY(110vh) rotate(360deg)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
