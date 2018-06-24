# runnable-exports
[![Build Status](https://travis-ci.org/emurphy-9/runnable-exports.svg?branch=master)](https://travis-ci.org/emurphy-9/runnable-exports) [![Coverage Status](https://coveralls.io/repos/github/emurphy-9/runnable-exports/badge.svg)](https://coveralls.io/github/emurphy-9/runnable-exports)

> Run your `exports` as command line arguments

If you want to easily create a command line tool from a file and a bunch of exported functions.

## Install

	$ yarn add runnable-exports

## Usage
```javascript
// your-file.js
const runnableExports = require('runnable-exports')
module.exports.awesome = ...args => {
	console.log('Awesome', args)
}
runnableExports()
```
And simply

	$ node your-file.js awesome and nice arguments

Output

	Awesome ['and', 'nice', 'arguments']

### ***ObjectArgs***
```javascript
// your-file.js
const runnableExports = require('runnable-exports')
module.exports.awesome = args => {
	console.log('Awesome', args)
}
runnableExports()
```

Under the hood [yargs](https://www.npmjs.com/package/yargs) is used, so you can pass easily also `objectArgs` like so

	$ node your-file.js awesome --nice

Output

	Awesome {nice: true}

> NOTE: the module accepts both types of args, the object args will be the first arg passed to the called function, all other args will follow from this

## Test

> XO and AVA

	$ yarn test

## Related

This is a fork of [make-runnable](https://github.com/super-cache-money/make-runnable)

## License

MIT © LasaleFamine
