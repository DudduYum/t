const path = require('path');

require('@babel/register')({
	only: [
		path.join(__dirname, 'src'),
		path.join(__dirname, 'srv'),
		// path.join(__dirname, 'node_modules', 'lance-gg', 'src'),
		path.join(__dirname, 'node_modules', 'lance-gg', 'dist')
	],
	// ignore: [path.join(__dirname, 'node_modules')],
	presets: ['@babel/preset-env']
});

var presets = [
	[
		'@babel/preset-env',
		{
			'useBuiltIns': 'usage',
			'corejs': '3'
		}
	]
];

var plugins = [
	[
		'module-resolver',
		{
			'root': ['./src'],
			'alias': {
				// 'lance': './node_modules/lance-gg/src',
				'lance': './node_modules/lance-gg/dist',
				'src': './src'
			}
		}
	]
];

module.exports = function (api) {
	api.cache(false);

	return {
		presets,
		plugins
	};
};
