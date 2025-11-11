// postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // O plugin que o erro pedia
    autoprefixer: {},
  },
};

export default config;