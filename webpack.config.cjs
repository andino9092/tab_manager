

const HtmlWebpackPlugin = require("html-webpack-plugin")

const CopyPlugin = require("copy-webpack-plugin")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const tailwindcss = require("tailwindcss")

const autoprefixer = require("autoprefixer")

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    contentScript: './src/content/index.tsx',
    background: './src/background/index.tsx',
    react: './src/react/index.tsx'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve('manifest.json'),
        to: path.resolve('dist')
      }]
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { 'runtime': 'automatic' }],
              '@babel/preset-typescript',
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        include: path.resolve('src'),
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              ident: 'postcss',
              plugins: [tailwindcss, autoprefixer]
            }
          }
        }],
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx']
  }
};