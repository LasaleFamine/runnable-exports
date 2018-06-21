const runnableExports = require('./../src/index.js')

module.exports.test = (objectArg, ...arrayArgs) => {
	console.log(objectArg, arrayArgs)
}

runnableExports()
