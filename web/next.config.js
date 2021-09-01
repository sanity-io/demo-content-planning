const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const {languages} = require('../languages')

module.exports = withBundleAnalyzer({
  images: {
    domains: [`cdn.sanity.io`],
  },
  i18n: {
    locales: languages.map((item) => item.id),
    defaultLocale: languages.find((item) => item.isDefault)?.id,
  },
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
})
