const path = require('path');

module.exports = function (options) {
  return {
    ...options,
    externals: [], // Bundle everything, don't treat anything as external
    resolve: {
      ...options.resolve,
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        '@workspace/db': path.resolve(__dirname, '../../packages/db/src'),
      },
    },
    module: {
      ...options.module,
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, 'tsconfig.json'),
          },
        },
      ],
    },
  };
};
