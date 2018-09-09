import test from 'ava';

import ArgHandler from '../../src/lib/ArgHandler';

test.beforeEach(t => {
	t.context.handler = new ArgHandler({});
	t.context.arrayArgs = [1, true, 'foobar', 2, 3];
	t.context.functionName = 'myFunc';
	t.context.arrayArgsWithFunctionName = [t.context.functionName, ...t.context.arrayArgs];
	t.context.objectArgs = { foo: 'bar', int: 3, bool: false };
	t.context.arrayArgObject = {_: t.context.arrayArgs};
	t.context.bothArgObject = Object.assign({_: t.context.arrayArgs}, t.context.objectArgs);

	t.context.returnFirstArg = (firstArg) => firstArg;
});

test('ArgHandler can be constructed', async t => {
	t.truthy(t.context.handler, "Arg Handler could not be created.");
});

test('ArgHandler.splitArgs parses array args', async t => {
	t.context.handler.splitArgs({_: t.context.arrayArgs});

	t.is(t.context.handler.arrayArgs, t.context.arrayArgs);
});

test('ArgHandler.splitArgs parses object args', async t => {
  const objectArgs = { foo: 'bar', int: 3, bool: false };
	const handler = new ArgHandler({});

	t.context.handler.splitArgs(t.context.objectArgs);

	t.is(JSON.stringify(t.context.handler.objectArgs), JSON.stringify(t.context.objectArgs));
});

test('ArgHandler.splitArgs handles both kinds of args', async t => {
	t.context.handler.splitArgs(t.context.bothArgObject);

	t.is(t.context.handler.arrayArgs, t.context.arrayArgs);
	t.is(JSON.stringify(t.context.handler.objectArgs), JSON.stringify(t.context.objectArgs));
});

test('ArgHandler.resolveArrayArgs handles first arg being a function name', async t => {
	const firstArgIsFunctionName = true;
	t.context.handler.resolveArrayArgs(t.context.arrayArgsWithFunctionName, firstArgIsFunctionName);

	t.is(t.context.handler.arrayArgs.toString(), t.context.arrayArgs.toString());
	t.is(t.context.handler.functionName, t.context.functionName);
});

test('ArgHandler.resolveArrayArgs handles first arg not being a function name', async t => {
	const firstArgIsFunctionName = false;
	t.context.handler.resolveArrayArgs(t.context.arrayArgsWithFunctionName, firstArgIsFunctionName);

	t.is(t.context.handler.arrayArgs.toString(), t.context.arrayArgsWithFunctionName.toString());
	t.is(t.context.handler.functionName, undefined);
});

test('ArgHandler.hasArrayArgs returns true when there are array args', async t => {
	const handler = new ArgHandler(t.context.arrayArgObject);
	t.is(handler.hasArrayArgs(), true);
});

test('ArgHandler.hasArrayArgs returns false when there are no array args', async t => {
	const  handler = new ArgHandler(t.context.objectArgs);
	t.is(handler.hasArrayArgs(), false);
});

test('ArgHandler.hasArrayArgs returns false when initialised with an empty args object', async t => {
	t.is(t.context.handler.hasArrayArgs(), false);
})

test('ArgHandler.hasObjectArgs returns true when there are object arguments', async t => {
  const handler = new ArgHandler(t.context.objectArgs);

	t.is(handler.hasObjectArgs(), true);
});

test('ArgHandler.hasObjectArgs returns false when there are no object arguments', async t => {
	const handler = new ArgHandler(t.context.arrayArgObject);

	t.is(handler.hasObjectArgs(), false);
});

test('ArgHandler.hasObjectArgs returns false when initialised with an empty args object', async t => {
	t.is(t.context.handler.hasObjectArgs(), false);
});

test('ArgHandler.hasBothTypesOfArg returns true when both types of arg are present', async t => {
  const handler = new ArgHandler(t.context.bothArgObject);

	t.is(handler.hasBothTypesOfArg(), true);
});

test('ArgHandler.hasBothTypesOfArg returns false with only array args', async t => {
	const handler = new ArgHandler(t.context.arrayArgObject);

	t.is(handler.hasBothTypesOfArg(), false);
});

test('ArgHandler.hasBothTypesOfArg returns false with only object args', async t => {
	const handler = new ArgHandler(t.context.objectArgs);
	t.is(handler.hasBothTypesOfArg(), false);
});

test('ArgHandler.hasBothTypesOfArg returns false when initialised with an empty args object', async t => {
  t.is(t.context.handler.hasBothTypesOfArg(), false);
});

test('ArgHandler.getAllArgs returns an empty array with no args', async t => {
	t.is(t.context.handler.getAllArgs().length, 0);
});

test('ArgHandler.getAllArgs handles array args', async t => {
	const handler = new ArgHandler(t.context.arrayArgObject);
	const allArgs = handler.getAllArgs();

	t.is(allArgs.length, t.context.arrayArgs.length);
	t.is(JSON.stringify(allArgs), JSON.stringify(t.context.arrayArgs));
});

test('ArgHandler.getAllArgs handles object args', async t => {
	const handler = new ArgHandler(t.context.objectArgs);
	const allArgs = handler.getAllArgs();

	t.is(allArgs.length, 1);
	t.is(JSON.stringify(allArgs[0]), JSON.stringify(t.context.objectArgs));
});

test('ArgHandler.getAllArgs handles both arg types', async t => {
  const handler = new ArgHandler(t.context.bothArgObject);
	const allArgs = handler.getAllArgs();
	const lengthOfAllArgs = t.context.arrayArgs.length + 1;
	const [objectArgs, ...arrayArgs] = allArgs;

	t.is(allArgs.length, lengthOfAllArgs);
	t.is(JSON.stringify(objectArgs), JSON.stringify(t.context.objectArgs));
	t.is(JSON.stringify(arrayArgs), JSON.stringify(t.context.arrayArgs));
});

test('runWithArgs handles an empty object', async t => {
	const argReturned = t.context.handler.runWithArgs(t.context.returnFirstArg);

	t.is(argReturned, undefined);
});

test('ArgHandler.runWithArgs handles object args', async t => {
	const handler = new ArgHandler(t.context.objectArgs);
  const argReturned = handler.runWithArgs(t.context.returnFirstArg);
	t.is(JSON.stringify(argReturned), JSON.stringify(t.context.objectArgs));
});

test('ArgHandler.runWithArgs handles array args', async t => {
	const handler = new ArgHandler(t.context.arrayArgObject);

	const myFunc = (...args) => {
		t.is(args.length, t.context.arrayArgs.length);
		t.is(JSON.stringify(args), JSON.stringify(t.context.arrayArgs));
	};
	handler.runWithArgs(myFunc);
});

test('ArgHandler.runWithArgs handles both kinds of args', async t => {
	const handler = new ArgHandler(t.context.bothArgObject);
	const myFunc = (objectArg, ...arrayArgs) => {
		t.is(arrayArgs.length, t.context.arrayArgs.length);
		t.is(JSON.stringify(objectArg), JSON.stringify(t.context.objectArgs));
		t.is(JSON.stringify(arrayArgs), JSON.stringify(t.context.arrayArgs));
	};

	handler.runWithArgs(myFunc);
});
