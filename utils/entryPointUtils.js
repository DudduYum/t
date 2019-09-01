var fs = require('fs');
// var globalConf = fs.readFileSync('../configuration.json');

const generateEntryList = (targets) => {
	return targets.reduce(
		(acc, target) => {
			// if (pageList[target]) {
			acc[target] = `./src/entries/${target}.js`;
			// }
			return acc;
		},
		{}
	);
};

module.exports = {
	generateEntryList: generateEntryList
};
