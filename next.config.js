/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io'],
  },
  eslint: {
    dirs: [
      'contracts',
      'pages',
      'components',
      'scripts',
      'styles',
      '__tests__',
      'types',
    ],
  },
};
