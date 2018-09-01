const execa = require('execa');

const testfileDir = './tests/testfiles';
const testfileExtension = '.js';

const exec = async (filename, ...args) => {
	const filepath = `${testfileDir}/${filename}${testfileExtension}`;
	return execa('node', [filepath, ...args]);
};

const checkError = async (t, stringsToCheck, ...execArgs) => {
	const error = (await t.throws(exec(...execArgs))).stderr;
	for (const string in stringsToCheck) {
		t.true(error.includes(string));
	}
};

const checkSuccess = async (t, expectedOutput, ...execArgs) => {
	const output = (await exec(...execArgs)).stdout;
	t.is(output, expectedOutput);
};

module.exports = {
	checkError,
	checkSuccess,
};
