'use strict'

const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const paths = require('./paths')
const getClientEnvironment = require('./env')
const px2rem = require('postcss-px2rem')
const theme = require('../theme')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// Note: defined here because it will be used more than once.
const cssFilename = 'static/css/[name].[contenthash:8].css'
const environment = process.env.REACT_APP_ENV
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
let publicPath, shouldUseSourceMap
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
let publicUrl = ''

switch (environment) {
  case 'development':
    publicPath = '/'
    shouldUseSourceMap = false
    break

  case 'alpha':
    publicPath = '//alpha-fe-static.waka.life/'
    shouldUseSourceMap = true
    publicUrl = publicPath.slice(0, -1)
    break

  case 'production':
    publicPath = '//fe-static01.waka.life/'
    shouldUseSourceMap = true
    publicUrl = publicPath.slice(0, -1)
    break

  default:
    break
}
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl)
const targetEntry = process.env.npm_config_target

let pages = {
  index: {
    entry: paths.appIndexJs,
    template: paths.appHtml,
    filename: 'index.html',
    useVendor: true,
  },
  mobile: {
    entry: resolve('fe/mobile.jsx'),
    template: resolve('public/mobile.html'),
    filename: 'mobile.html',
  },
  video: {
    entry: resolve('fe/page/video/index.js'),
    template: resolve('public/video.html'),
    filename: 'page/video/index.html',
  },
  register: {
    entry: resolve('fe/page/register/index.js'),
    template: resolve('public/register.html'),
    filename: 'page/register.html',
  },
}

if (targetEntry && pages[targetEntry]) {
  pages = { [targetEntry]: pages[targetEntry] }
}

function getEntry() {
  const entry = {}
  const extract = []
  if (environment === 'development') {
    extract.push(require.resolve('react-dev-utils/webpackHotDevClient'))
  }
  Object.keys(pages).forEach(function(name) {
    entry[name] = extract.concat([pages[name].entry])
  })
  return entry
}

function getHtmls() {
  const htmls = []
  const defaultOpt = {
    inject: true,
    env: environment,
  }
  const minify = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  }
  if (environment !== 'development') {
    Object.assign(defaultOpt, { minify: minify })
  }
  Object.keys(pages).forEach(function(name) {
    const page = pages[name]
    const chunks = [name]
    if (environment !== 'development' && page.useVendor) {
      const vendor = `vendor-${name}`
      const manifest = `manifest-${name}`

      htmls.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: vendor,
          chunks: [name],
          minChunks: ({ resource }) =>
            resource &&
            resource.indexOf('node_modules') >= 0 &&
            resource.match(/\.js$/),
        })
      )

      htmls.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: manifest,
          chunks: [vendor],
        })
      )

      htmls.push(
        new InlineChunkWebpackPlugin({
          inlineChunks: [manifest],
        })
      )

      chunks.unshift(manifest, vendor)
    }
    const opt = Object.assign({ chunks: chunks }, defaultOpt, page)
    delete opt.entry
    htmls.push(new HtmlWebpackPlugin(opt))
  })
  return htmls
}

function getStyleLoaders(rule, isMobile, ext) {
  let ident = 'postcss'
  if (ext) {
    ident = ident + '-' + ext
  }
  const postLoaderPlugins = [
    require('postcss-flexbugs-fixes')(),
    isMobile ? px2rem({ remUnit: 100 }) : function() {},
    autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ],
      flexbox: 'no-2009',
    }),
  ]
  let loaders = [
    {
      loader: 'css-loader',
      options: {
        minimize: environment != 'development',
        sourceMap: shouldUseSourceMap,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: ident,
        plugins: () => postLoaderPlugins,
      },
    },
  ]
  // 拼接自定义loaders
  if (rule.use) {
    loaders = loaders.concat(rule.use)
  }
  // 开发环境使用行内style
  if (environment != 'development') {
    rule.loader = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders,
    })
    delete rule.use
  } else {
    rule.use = ['style-loader'].concat(loaders)
  }
  return rule
}

const webpackConfig = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  // In production, we only want to load the polyfills and the app code.
  entry: getEntry(),
  output: {
    // The build folder.
    path: paths.appBuild,
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath,
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: [
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
      '.less',
      '.scss',
    ],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
      fe: resolve('fe'),
      'app-store': resolve('fe/model/store.jsx'),
      backbone: resolve('fe/components/backbone/backbone.jsx'),
      node_modules: resolve('node_modules'),
      'backbone-react': resolve(
        'fe/components/backbone-store/store-without-jquery'
      ),
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // TODO: Disable require.ensure as it's not a standard language feature.
      // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
      // { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx)$/,
            include: paths.appSrc,
            loader: 'babel-loader',
            options: {
              compact: true,
              cacheDirectory: true,
            },
          },
          // The notation here is somewhat confusing.
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader normally turns CSS into JS modules injecting <style>,
          // but unlike in development configuration, we do something different.
          // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
          // (second argument), then grabs the result CSS and puts it into a
          // separate file in our build process. This way we actually ship
          // a single CSS file in production instead of JS code injecting <style>
          // tags. If you use code splitting, however, any async bundles will still
          // use the "style" loader inside the async code so CSS from them won't be
          // in the main CSS file.
          getStyleLoaders({
            test: /\.css$/,
          }),
          getStyleLoaders(
            {
              test: /\.less$/,
              include: [
                resolve('fe/assets/css/mobile'),
                resolve('fe/module/mobile'),
              ],
              use: [
                {
                  loader: require.resolve('less-loader'),
                  options: { modifyVars: theme },
                },
              ],
            },
            true,
            'less'
          ),
          getStyleLoaders({
            test: /\.less$/,
            exclude: [
              resolve('fe/assets/css/mobile'),
              resolve('fe/module/mobile'),
            ],
            use: [
              {
                loader: require.resolve('less-loader'),
                options: { modifyVars: theme },
              },
            ],
          }),
          getStyleLoaders(
            {
              test: /\.scss$/,
              include: [
                resolve('fe/assets/css/mobile'),
                resolve('fe/module/mobile'),
              ],
              use: [{ loader: require.resolve('sass-loader') }],
            },
            true,
            'scss'
          ),
          getStyleLoaders({
            test: /\.scss$/,
            exclude: [
              resolve('fe/assets/css/mobile'),
              resolve('fe/module/mobile'),
            ],
            use: [{ loader: require.resolve('sass-loader') }],
          }),
          // "file" loader makes sure assets end up in the `build` folder.
          // When you `import` an asset, you get its filename.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin(env.raw),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
}

webpackConfig.plugins = webpackConfig.plugins.concat(getHtmls())
// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = webpackConfig
