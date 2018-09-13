const hasKeys = iterable => {
	return Object.keys(iterable).length > 0;
};

const isFunc = target => target instanceof Function;

const isExecutable = (targetFunc, parentExports) => {
	return (targetFunc in parentExports) && isFunc(parentExports[targetFunc]);
};

const getFunctionNames = object => {
	const objectFunctionNames = Object.keys(object).filter(key => {
		const objectProperty = object[key];
		return isFunc(objectProperty);
	});

	return objectFunctionNames;
};

const generateSuggestion = functionNames => {
	let suggestion = '';
	const functionListString = functionNames.join(', ');
	if (functionNames.length > 1) {
		suggestion = `Perhaps you meant one of the following: ${functionListString}`;
	} else if (functionNames.length === 1) {
		suggestion = `Perhaps you meant: ${functionListString}`;
	} else {
		suggestion = 'Module doesn\'t export any functions';
	}
	return suggestion;
};

module.exports = {
	hasKeys,
	isFunc,
	isExecutable,
	getFunctionNames,
	generateSuggestion,
};
