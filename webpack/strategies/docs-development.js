import _ from 'lodash';
import webpack from 'webpack';

function addWebpackDevServerScripts(entries, webpackDevServerAddress) {
  let clientScript = `webpack-dev-server/client?${webpackDevServerAddress}`;
  let webpackScripts = ['webpack/hot/dev-server', clientScript];
  return _.mapValues(entries, entry => webpackScripts.concat(entry));
}

export default (config, options) => {
  if (options.development && options.docs) {
    let webpackDevServerAddress = `http://localhost:${options.port}`;
    config = _.extend({}, config, {
      entry: addWebpackDevServerScripts(config.entry, webpackDevServerAddress),
      output: {
        publicPath: `${webpackDevServerAddress}/assets/`
      },
      module: {
        loaders: config.module.loaders.map(value => {
          if (/js/.test(value.test.toString())) {
            return _.extend({}, value, {
              loader: 'react-hot!' + value.loader
            });
          }
          else {
            return value;
          }
        })
      },
      plugins: config.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ])
    });

    return config;
  }

  return config;
};
