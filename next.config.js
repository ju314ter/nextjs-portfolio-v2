module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Note: we provide webpack above so you should not `require` it
      // Perform customizations to webpack config
      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
            test: /\.(js|ts|css|scss)x?$/,
        },
        use: ['@svgr/webpack'],
        });
  
      // Important: return the modified config
      return config
    },
  }