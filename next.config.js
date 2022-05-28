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
      'tests',
      'types',
      'utils',
    ],
  },
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    ACCOUNT_PRIVATE_KEY: process.env.ACCOUNT_PRIVATE_KEY,
  },
};
