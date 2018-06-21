const runnableExports = require('./../src/index.js')

module.exports.test = (...testArgs) => {
	console.log(testArgs)
}

runnableExports()
