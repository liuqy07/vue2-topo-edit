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
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          include: [path.resolve(__dirname, "packages/vue2-topo-edit/img")],
          exclude: [path.resolve(__dirname, 'src/assets')],

           type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 1 // 8KB
              }
            },
            generator: {
              filename: 'img/[name].[hash:8][ext]'
            }

          // use: {
          //   loader: 'url-loader',
          //   options: {
          //     // limit: 8192,
          //     name: 'img/[name].[hash:8].[ext]'
          //   }
          // }
        },
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, "packages")],
          use: {
            loader: 'babel-loader',
            options: {
              // 原tap回调中的options会合并到这里
            }
          }
        }
      ]
    }
  }
};
