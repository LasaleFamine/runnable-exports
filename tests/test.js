import test from 'ava';
import execa from 'execa';

const testfileDir = './tests/testfiles';
const testfileExtension = '.spec.js';
const generalErrorMessage = 'Error: RUNNABLE-EXPORTS: can\'t run your command: ';

const exec = async (filename, ...args) => {
	const filepath = `${testfileDir}/${filename}${testfileExtension}`;
	return execa('node', [filepath, ...args]);
};

const checkError = async (t, stringsToCheck, ...execArgs) => {
	const error = (await t.throws(exec(...execArgs))).stderr;
	for (const string in stringsToCheck) {
		t.true(error.includes(string));
	}
}

const checkSuccess = async (t, expectedOutput, ...execArgs) => {
	const output = (await exec(...execArgs)).stdout;
	t.is(output, expectedOutput);
};

test('throw with no exported func calling only the file', checkError,
	[generalErrorMessage, 'Module doesn\'t export any functions'], 'noexport', []);

test('works with default exported func calling with double type args', checkSuccess,
	`[ { asd: true }, 'asd' ]`, 'defaultexport', 'asd', '--asd');

test('throw with exported func calling with a wrong name', async t => {
	const file = 'export';
	const testArgs = ['asd'];
	const errorMessage = `${generalErrorMessage}asd`;
	const suggestion = 'Perhaps you meant: test';

	await checkError(t, [errorMessage, suggestion], file, ...testArgs);
})

test('works with exported func calling with double type args', async t => {
  const file = 'export';
  const testArgs = ['test', 'asdasd', '--asd'];
  const expectedOutput = `[ { asd: true }, 'asdasd' ]`;

  await checkSuccess(t, expectedOutput, file, ...testArgs);
})

test('throw with func calling wrong name suggests valid function names', async t => {
	const file = 'multiple-exports';
	const testArgs = ['noFunction'];
	const errorMessage = `Error: RUNNABLE-EXPORTS: can't run your command: noFunction`;
	const suggestions = `Perhaps you meant one of the following: testFunction, otherFunction, testObject`;

	await checkError(t, [errorMessage, suggestions], file, ...testArgs);
})

test('work with default export (no-args)', async t => {
	const file = 'defaultexport';
	const testArgs = [];
	const expectedOutput = '[]';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('work with default export (normal args)', async t => {
	const file = 'defaultexport';
	const testArgs = ['test'];
	const expectedOutput = '[ \'test\' ]';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('work with default export (object args as array)', async t => {
	const file = 'defaultexport';
	const testArgs = ['--test'];
	const expectedOutput = '[ { test: true } ]';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('work with func export (no-args)', async t => {
	const file = 'export';
	const testArgs = ['test'];
	const expectedOutput = '[]';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('work with func export (normal args)', async t => {
	const file = 'export';
	const testArgs = ['test', 'asd'];
	const expectedOutput = '[ \'asd\' ]';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('work with func export (object args)', async t => {
  const file = 'multiple-exports';
	const testArgs = ['testObject', '--asd'];
	const expectedOutput = '{ asd: true }';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('work with func export (object args as array)', async t => {
	const file = 'export';
	const testArgs = ['test', '--asd'];
	const expectedOutput = '[ { asd: true } ]';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('nested runnable-exports', async t => {
	const file = 'nested';
	const testArgs = ['test', '--asd'];
	const expectedOutput = 'cache deleted';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('Function args are not passed as an array', async t => {
	const file = 'multiple-exports';
	const functionName = 'otherFunction';
	const functionArgs = ['foo', 'bar', 'baz'];
	const testArgs = [functionName, ...functionArgs];
	const expectedOutput = 'Inserting bar at index foo with type baz';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});


test('Function args can be combined into array', async t => {
	const file = 'multiple-exports';
	const testArgs = ['testFunction', 'arg1', 'arg2', 'arg3', 'arg4'];
	const expectedOutput = '4 arguments entered.';

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('Function can count array of 0 args', async t => {
	const file = 'multiple-exports';
	const expectedOutput = '0 arguments entered.';
	const testArgs = ['testFunction'];

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('Function can count array with 1 arg', async t => {
	const file = 'multiple-exports';
	const expectedOutput = '1 arguments entered.';
	const testArgs = ['testFunction', 'arg'];

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});

test('Function can handle both object and array args', async t => {
	const file = 'both-arg-types';
	const expectedOutput = '{ objArg: true } [ \'otherArg\' ]';
	const testArgs = ['test', 'otherArg', '--objArg'];

	await checkSuccess(t, expectedOutput, file, ...testArgs);
});
