

import test from 'ava'
import execa from 'execa'

test('throw with no exported func calling only the file', async t => {
	const error = await t.throws(execa('node', ['./testfiles/noexport.spec.js']))
	const msg = `Error: RUNNABLE-EXPORTS: can't run your command: `
  t.true(error.message.search(msg) > -1)

})

test('throw with default exported func calling with double type args', async t => {
	const error = await t.throws(execa('node', ['./testfiles/defaultexport.spec.js', 'asd', '--asd']))
	const msg = `Error: RUNNABLE-EXPORTS: can't run with both objectArgs and arrayArgs: {\"asd\":true}, asd`
  t.true(error.message.search(msg) > -1)
})

test('throw with exported func calling with a wrong name', async t => {
	const error = await t.throws(execa('node', ['./testfiles/export.spec.js', 'asd']))
	const msg = `Error: RUNNABLE-EXPORTS: can't run your command: asd`
  t.true(error.message.search(msg) > -1)
})

test('throw with exported func calling with double type args', async t => {
	const error = await t.throws(execa('node', ['./testfiles/export.spec.js', 'test', 'asdasd', '--asd']))
	const msg = `Error: RUNNABLE-EXPORTS: can't run with both objectArgs and arrayArgs: {\"asd\":true}, asdasd`
  t.true(error.message.search(msg) > -1)
})

test('work with default export (no-args)', async t => {
	const stdout = (await execa('node', ['./testfiles/defaultexport.spec.js'])).stdout
	t.is(stdout, '[]')
})
test('work with default export (normal args)', async t => {
	const stdout = (await execa('node', ['./testfiles/defaultexport.spec.js', 'test'])).stdout
	t.is(stdout, `[ 'test' ]`)
})
test('work with default export (object args)', async t => {
	const stdout = (await execa('node', ['./testfiles/defaultexport.spec.js', '--test'])).stdout
	t.is(stdout, '{ test: true }')
})

test('work with func export (no-args)', async t => {
	const stdout = (await execa('node', ['./testfiles/export.spec.js', 'test'])).stdout
	t.is(stdout, '[]')
})
test('work with func export (normal args)', async t => {
	const stdout = (await execa('node', ['./testfiles/export.spec.js', 'test', 'asd'])).stdout
	t.is(stdout, `[ 'asd' ]`)
})
test('work with func export (object args)', async t => {
	const stdout = (await execa('node', ['./testfiles/export.spec.js', 'test', '--asd'])).stdout
	t.is(stdout, '{ asd: true }')
})

test('nested runnable-exports', async t => {
	const stdout = (await execa('node', ['./testfiles/nested.spec.js', 'test', '--asd'])).stdout
	t.is(stdout, 'cache deleted')
})

