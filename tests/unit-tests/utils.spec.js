import test from 'ava';
import { checkSuccess, checkError } from '../utils/utils';
import { hasKeys, isFunc, isExecutable, getFunctionNames, generateSuggestion } from '../../src/lib/utils';

test('hasKeys returns false for an empty object', async t => {
	const testObject = {};
	const expected = false;

	t.is(hasKeys(testObject), expected);
});

test('hasKeys returns true for an object with one element', async t => {
	const testObject = { foo: 'bar' };
	const expected = true;

	t.is(hasKeys(testObject), expected);
});

test('hasKeys returns true for an object with several elements', async t => {
	const testObject = {
		foo: 'bar',
		baz: 3,
		bool: false,
	};
	const expected = true;

	t.is(hasKeys(testObject), expected);
});

test('hasKeys throws an error when passed null', async t => {
  const testObject = null;
	await t.throws(() => hasKeys(testObject), 'Cannot convert undefined or null to object');
});

test('hasKeys throws an error when passed no arguments', async t => {
	await t.throws(hasKeys, 'Cannot convert undefined or null to object');
});

test('isFunc returns true for an arrow function', async t => {
  const myFunc = () => 'myReturnValue';
	const expected = true;

	t.is(isFunc(myFunc), expected);
});

test('isFunc returns true for a named function', async t => {
  function foo () { return 'bar' };
	const expected = true;

	t.is(isFunc(foo), expected);
});

test('isFunc returns false for an object', async t => {
  const myObject = {};
	const expected = false;

	t.is(isFunc(myObject), expected);
});

test('isFunc returns false for null', async t => {
  t.is(isFunc(null), false);
});

test('isFunc retuns false for undefined', async t => {
  t.is(isFunc(undefined), false)
});

test('isFunc returns false when given no arguments', async t => {
  t.is(isFunc(), false);
});

test('isExecutable returns false if target is not in exports', async t => {
  const targetFunc = 'foo';
	const parentExports = { 'bar': 'baz', 'for': 4 };
	const expected = false;

	t.is(isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable returns false if target is a boolean', async t => {
  const targetFunc = 'foo';
	const parentExports = { foo: false };
	const expected = false;

	t.is(isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable returns false if target is a string', async t => {
  const targetFunc = 'foo';
	const parentExports = { foo: 'bar' };
	const expected = false;

	t.is(isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable returns false if target is a number', async t => {
  const targetFunc = 'foo';
	const parentExports = { foo: 5 };
	const expected = false;

	t.is(isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable returns false if target is null in exports', async t => {
  const targetFunc = 'foo';
	const parentExports = { foo: null };
	const expected = false;

	t.is(isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable returns false if target is undefined in exports', async t => {
  const targetFunc = 'foo';
	const parentExports = { foo: undefined };
	const expected = false;

	t.is(isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable throws an error if parentExports are null', async t => {
  const targetFunc = 'foo';
	const parentExports = null;
	const expected = Error;

	await t.throws(() => isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable throws an error if parentExports are undefined', async t => {
  const targetFunc = 'foo';
	const parentExports = undefined;
	const expected = Error;

	await t.throws(() => isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable throws an error if parentExports is a string', async t => {
  const targetFunc = 'foo';
	const parentExports = 'bar';
	const expected = Error;

	await t.throws(() => isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable throws an error if parentExports is a boolean', async t => {
  const targetFunc = 'foo';
	const parentExports = true;
	const expected = Error;

	await t.throws(() => isExecutable(targetFunc, parentExports), expected);
});

test('isExecutable returns true if target is a function in exports', async t => {
  const targetFunc = 'foo';
	const parentExports = { 'foo': () => 'bar' };
	const expected = true;

	t.is(isExecutable(targetFunc, parentExports), expected);
});

test('getFunctionNames throws an Error for null', async t => {
  const testObject = null;
	const expected = Error;

	await t.throws(() => getFunctionNames(testObject), expected);
});

test('getFunctionNames throws an Error for null', async t => {
  const testObject = undefined;
	const expected = Error;

	await t.throws(() => getFunctionNames(testObject), expected);
});

test('getFunctionNames returns an empty array for a string', async t => {
  const testObject = 'foo bar';
	const result = getFunctionNames(testObject);
	const expectedLength = 0;

	t.is(result instanceof Array, true);
	t.is(result.length, expectedLength);
});

test('getFunctionNames returns an empty array for a boolean', async t => {
  const testObject = true;
	const result = getFunctionNames(testObject);
	const expectedLength = 0;

	t.is(result instanceof Array, true);
	t.is(result.length, expectedLength);
});

test('getFunctionNames returns an empty array for a number', async t => {
  const testObject = 4;
	const result = getFunctionNames(testObject);
	const expectedLength = 0;

	t.is(result instanceof Array, true);
	t.is(result.length, expectedLength);
});

test('getFunctionNames returns an empty array for an empty object', async t => {
  const testObject = {};
	const result = getFunctionNames(testObject);
	const expectedLength = 0;

	t.is(result instanceof Array, true);
	t.is(result.length, expectedLength);
});

test('getFunctionNames returns an empty array for an object with no functions', async t => {
  const testObject = {
		foo: 'bar',
		bool: false,
		int: 4,
		float: 4.232134,
	};
	const result = getFunctionNames(testObject);
	const expectedLength = 0;

	t.is(result instanceof Array, true);
	t.is(result.length, expectedLength);
});

test('getFunctionNames returns one function correctly', async t => {
  const testObject = {
		foo: () => 'bar',
		bool: false,
		int: 4,
		float: 4.232134,
	};
	const result = getFunctionNames(testObject);
	const expectedLength = 1;

	t.is(result instanceof Array, true);
	t.is(result.length, expectedLength);
	t.is(result.includes('foo'), true);
});

test('getFunctionNames returns several function correctly', async t => {
  const testObject = {
		foo: () => 'bar',
		baz () {
			return 123;
		},
		myFunc: () => { return },
		float: 4.232134,
	};
	const result = getFunctionNames(testObject);
	const expectedLength = 3;

	t.is(result instanceof Array, true);
	t.is(result.length, expectedLength);
	t.is(result.includes('foo'), true);
	t.is(result.includes('baz'), true);
	t.is(result.includes('myFunc'), true);
});

test('generateSuggestion throws an error when given null', async t => {
  const functionNames = null;
	const expected = Error;

	await t.throws(() => generateSuggestion(functionNames), expected);
});

test('generateSuggestion throws an error when given undefined', async t => {
  const functionNames = undefined;
	const expected = Error;

	await t.throws(() => generateSuggestion(functionNames), expected);
});

test('generateSuggestion throws an error when given a boolean', async t => {
  const functionNames = true;
	const expected = Error;

	await t.throws(() => generateSuggestion(functionNames), expected);
});

test('generateSuggestion throws an error when given a number', async t => {
  const functionNames = 4;
	const expected = Error;

	await t.throws(() => generateSuggestion(functionNames), expected);
});

test('generateSuggestion throws an error when given a string', async t => {
  const functionNames = 'foo';
	const expected = Error;

	await t.throws(() => generateSuggestion(functionNames), expected);
});

test('generateSuggestion throws an error when given an object', async t => {
  const functionNames = {};
	const expected = Error;

	await t.throws(() => generateSuggestion(functionNames), expected);
});

test('generateSuggestion returns correct message when passed an empty array', async t => {
  const functionNames = [];
	const expected = 'Module doesn\'t export any functions';
	const result = generateSuggestion(functionNames);

	t.is(generateSuggestion(functionNames), expected);
});

test('generateSuggestion returns correct message when passed array with one element', async t => {
  const functionNames = ['foo'];
	const expected = 'Perhaps you meant: foo';
	const result = generateSuggestion(functionNames);

	t.is(generateSuggestion(functionNames), expected);
});

test('generateSuggestion returns correct message when passed array with many elements', async t => {
  const functionNames = ['foo', 'bar', 'baz', 'function', 'example'];
	const expected = 'Perhaps you meant one of the following: foo, bar, baz, function, example';
	const result = generateSuggestion(functionNames);

	t.is(generateSuggestion(functionNames), expected);
});
