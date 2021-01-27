const { webpackConfig } = require("direflow-scripts");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
/**
 * Webpack configuration for Direflow Component
 * Additional webpack plugins / overrides can be provided here
 */
module.exports = (config, env) => ({
  ...webpackConfig(config, env),
  /* plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static", //para que lo haga sólo al momento de hacer el build
      openAnalyzer: true, //para que nos muestre el resultado inmediatamente
    }),
  ], */
  // Add your own webpack config here (optional)
});
