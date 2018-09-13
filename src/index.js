const {argv} = require('yargs');
const ArgHandler = require('./lib/ArgHandler');
const utils = require('./lib/utils');

const main = () => {
	const {parent} = module;

	// Check for others `runnable-exports`
	if (require.main !== parent) {
		return delete require.cache[__filename];
	}

	const parentExports = parent.exports;

	const parentIsExportedFunction = utils.isFunc(parentExports);
	const firstArgIsFunctionName = !parentIsExportedFunction;

	const argHandler = new ArgHandler(argv, firstArgIsFunctionName);

	if (parentIsExportedFunction) {
		return argHandler.runWithArgs(parentExports);
	}

	const functionName = argHandler.functionName ? argHandler.functionName : '';
	const isExecutable = utils.isExecutable(functionName, parentExports);

	const targetFunc = parentExports[functionName];

	if (isExecutable) {
		return argHandler.runWithArgs(targetFunc);
	} else {
		const executableFunctions = utils.getFunctionNames(parentExports);
		const suggestionString = utils.generateSuggestion(executableFunctions);
		const errorMessage = `RUNNABLE-EXPORTS: can't run your command: ${functionName} \n${suggestionString}`;
		throw new Error(errorMessage);
	}
};

module.exports = main;
