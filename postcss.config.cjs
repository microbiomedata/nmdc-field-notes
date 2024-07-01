const postcssNesting = require("postcss-nesting");

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    postcssNesting({
      edition: "2024-02",
    }),
  ],
};

module.exports = config;
