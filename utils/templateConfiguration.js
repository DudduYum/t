var fs = require('fs');
var path = require('path');

var pathConfiguration = {
	confFiles: path.join('src', 'conf')
};

function getConfigurationForTarget (targets) {
	return targets.map(
		function (target) {
			return readComponentConfiguration(target);
		}
	);
}

function readTemplateConfiguration (target) {
	return readJson(target);
}

function readComponentConfiguration (target) {
	return readJson(target);
}

function readJson (target) {
	return fs.readFileSync(
		path.join(pathConfiguration.confFiles, `${target}.json`)
	);
}

module.exports = {
	readTemplateConfiguration: readTemplateConfiguration,
	readComponentConfiguration: readComponentConfiguration,
	getConfigurationForTarget: getConfigurationForTarget
};
