/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['ipfs.io'],
  },
  eslint: {
    dirs: ['pages', 'components', 'scripts', 'styles', 'test', 'contracts'],
  },
};
