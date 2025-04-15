// frontend/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Inclui todos os arquivos de componentes dentro de src
    "./public/index.html"          // Inclui o arquivo HTML principal
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#000510",
        cardBg: "rgba(0,0,0,0.2)",
        borderGray: "#333",
        textPrimary: "#ffffff",
        textSecondary: "#d1d5db",
      },
    },
  },
  plugins: [],
};