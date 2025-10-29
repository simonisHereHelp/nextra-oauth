// next.config.js
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
});

module.exports = withNextra({
  reactStrictMode: true,

  async redirects() {
    return [
      { source: '/', destination: '/_page', permanent: false },
    ];
  },
});
