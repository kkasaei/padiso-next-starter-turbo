const path = require('path');

module.exports = function (options) {
  return {
    ...options,
    entry: {
      main: './src/main.ts',
      lambda: './src/lambda.ts',
    },
    externals: [], // Bundle everything for serverless
    output: {
      ...options.output,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
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
