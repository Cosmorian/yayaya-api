module.exports = withCss(
  withSass({
    webpack(config) {
      const stats = {...config.stats};
      stats.warnings = false;
      stats.warningsFilter = warning => /Conflicting order between/gm.test(warning);
      config.stats = stats;
      return config;
    },
    target: 'serverless',
    cssModules: true,
    sassLoaderOptions: {
      importLoaders: 1,
      localIdentName: isBuild ? '[hash:base64:5]' : '[local]-[hash:base64:5]'
    },
  })
);
