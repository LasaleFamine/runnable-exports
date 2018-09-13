const runnableExports = require('../../src/index.js');

module.exports = (...testArgs) => {
	console.log(testArgs);
};

runnableExports();
