const autoBind = require('auto-bind');
const utils = require('./utils');

class ArgHandler {
	constructor(inputArgs, isCallingDefaultFunction = false) {
		autoBind(this);
		this.splitArgs(inputArgs, isCallingDefaultFunction);
	}

	splitArgs(inputArgs, firstArgIsFunctionName) {
		const {$0: _, _: arrayArgs, ...objectArgs} = inputArgs;

		this.resolveArrayArgs(arrayArgs, firstArgIsFunctionName);
		this.objectArgs = objectArgs;
	}

	resolveArrayArgs(args, firstArgIsFunctionName) {
		if (firstArgIsFunctionName) {
			const [functionName, ...actualArgs] = args;
			this.functionName = functionName;
			this.arrayArgs = actualArgs;
		} else {
			this.arrayArgs = args ? args : [];
		}
	}

	hasArrayArgs() {
		return this.arrayArgs.length > 0;
	}

	hasObjectArgs() {
		return utils.hasKeys(this.objectArgs);
	}

	hasBothTypesOfArg() {
		return this.hasArrayArgs() && this.hasObjectArgs();
	}

	getAllArgs() {
		const args = [];
		if (this.hasObjectArgs()) {
			args.push(this.objectArgs);
		}
		if (this.hasArrayArgs()) {
			args.push(...this.arrayArgs);
		}
		return args;
	}

	runWithArgs(func) {
		const args = this.getAllArgs();
		return func(...args);
	}
}

module.exports = ArgHandler;
