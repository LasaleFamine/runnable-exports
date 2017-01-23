
const argv = require('yargs').argv

const helpers = {}

helpers.isFunc = target => {
	return target instanceof Function
}
helpers.getObjectArgs = argv => {
	const args = Object.assign({}, argv)
	delete args.$0
	delete args._
	return args
}
helpers.isExecutable = (targetFunc, parentExports) => {
	return targetFunc in parentExports && helpers.isFunc(parentExports[targetFunc])
}
helpers.hasBothTypesOfArg = (objectArgs, arrayArgs) => {
	return Object.keys(objectArgs).length > 0 && arrayArgs.length > 0
}
helpers.getAndRun = (func, objectArgs, arrayArgs) => {
	const targetArgs = helpers._getCurrentArgs(objectArgs, arrayArgs)
	return helpers._runFunc(func, targetArgs)
}
helpers._getCurrentArgs = (objectArgs, arrayArgs) => {
	return Object.keys(objectArgs).length > arrayArgs.length ? objectArgs : arrayArgs
}
helpers._runFunc = (func, args) => {
	func(args)
}

const main = () => {
	const parent = module.parent
	// Args passed like --test=anarg
	const objectArgs = helpers.getObjectArgs(argv)
	// All other args, also with the function name
	const args = argv._.slice(0)

	// Check for others `runnable-exports`
	if (require.main !== parent) {
		return delete require.cache(__filename)
	}

	const parentExports = parent.exports
	const correctArgs = helpers.isFunc(parentExports) ? args.slice(0) : args.slice(1)

	if (helpers.hasBothTypesOfArg(objectArgs, correctArgs)) {
		throw new Error(`RUNNABLE-EXPORTS: can't run with both objectArgs and arrayArgs: ${JSON.stringify(objectArgs)}, ${correctArgs}`)
	}

	// Check if the parent.exports (the file you are running) is a just an exported anonymous function
	if (helpers.isFunc(parentExports)) {
		return helpers.getAndRun(parentExports, objectArgs, args.slice(0))
	}

	const targetFunc = args.slice(0, 1)
	const isExecutable = helpers.isExecutable(targetFunc, parentExports)
	if (isExecutable) {
		return helpers.getAndRun(parentExports[targetFunc], objectArgs, args.slice(1))
	}

	throw new Error(`RUNNABLE-EXPORTS: can't run your command: ${targetFunc}`)
}

module.exports = main
