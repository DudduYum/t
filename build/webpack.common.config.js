const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PATHS = {
	src: '../src',
	dist: '../dist'
};

const PAGES_DIR = `src/templates`;
// const PAGES_DIR = `${PATHS.src}/templates`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

module.exports = {
  entry: {
    app: `./src/entries/service1.js`
  },
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, PATHS.dist),
		publicPath: '/'
	},
	externals: {
		paths: PATHS,
		'fs': fs
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.pug$/,
				use: {
					loader: 'pug-loader'
				}
			},
		],
	},
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    // new CleanWebpackPlugin(),
		...PAGES.map(
			page => new HtmlWebpackPlugin(
				{
		      title: 'Production',
					hash: true,
					inject: 'head',
					template: `${PAGES_DIR}/${page}`,
					filename: `./${page.replace(/\.pug/, '.html')}`
		    }
			)
		),
    new CopyPlugin(
			[
	      {
					from: 'src/static',
					to: '',
					force: true,
					copyUnmodified: true
				 },
	    ]
		)

  ],
	resolve: {
		alias: {
			// lance: path.resolve(__dirname, '../node_modules/lance-gg/src'),
			lance: path.resolve(__dirname, '../node_modules/lance-gg/dist'),
			js: path.resolve(__dirname, '../src/js'),
			gameObjects: path.resolve(__dirname, '../src/js/common')
		},
		extensions: ['.pug','.css','.sass', '.mjs', '.js', '.json', '.bin', '.gltf']
	}
};
