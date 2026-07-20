// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        goldPulse: {
          "0%, 100%": { color: "#c69749" },
          "50%": { color: "#8a6425" },
        },
      },
      animation: {
        "gold-pulse": "goldPulse 2.5s ease-in-out infinite",
      },
    },
  },
};