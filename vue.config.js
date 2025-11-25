const path = require('path');

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: "expanded" }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@@': path.resolve(__dirname, 'packages')
      }
    },
    output: {
      library: 'vue2TopoEdit',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: 'this'
    },
    optimization: {
      usedExports: true, // 启用tree-shaking
      minimize: true     // 启用压缩
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|webp)/,
          include: [path.resolve(__dirname, "packages/vue2-topo-edit/img")],
          exclude: [path.resolve(__dirname, 'src/assets/images/topo')],
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: Infinity } },
          generator: { filename: 'img/[name].[hash:8][ext]' }
        },
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, "packages")],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: { browsers: ['> 1%', 'last 2 versions', 'not ie < 11'] },
                    corejs: 3,
                    useBuiltIns: 'usage'
                  }
                ]
              ]
            }
          }
        }
      ]
    }
  }
};
