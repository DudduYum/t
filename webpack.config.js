// var fs = require('fs');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var generateEntryList = require('./utils/entryPointUtils').generateEntryList;
var readTemplateConfiguration = require('./utils/templateConfiguration').readTemplateConfiguration;
var getConfigurationForTarget = require('./utils/templateConfiguration').getConfigurationForTarget;

const commonConfig = {
	resolve: {
		alias: {
			lance: path.resolve(__dirname, 'node_modules/lance-gg/src'),
			js: path.resolve(__dirname, 'src/js')
		}
	},
	target: 'web',
	externals: [
		'fs'
	]
};

const pageList = {
	'service1': {}
};

module.exports = (env, argv) => {
	if (argv.target && argv.targets) {
		console.error('You can\'t use target and targets at same time, they both do the same');
	}

	console.log(path.resolve(__dirname, 'src'));
	
	let customConfiguration = {
		output: {
			filename: env.production ? '[name].[hash].js' : '[name].js',
			path: path.resolve(__dirname, (env.production ? 'dist' : 'dev'))
		},
		mode: env.production ? 'production' : 'development',
		devtool: env.production ? 'source-map' : 'eval',
		optimization: {
			usedExports: false
		}
	};

	var targets = Object.keys(pageList);

	console.log(argv);
	// vet a list of target to compile
	if (argv.tar) {
		targets = [argv.tar];
	}

	if (argv.tars) {
		targets = argv.tars.split('|');
	}

  // generate entry list based on target list, only these entries will be build
	customConfiguration.entry = generateEntryList(targets);

  // get the list of configuration for each template
	configurationList = getConfigurationForTarget(targets);

	return Object.assign(
		customConfiguration,
		commonConfig
	);
};
