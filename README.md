# runnable-exports
[![Build Status](https://travis-ci.org/LasaleFamine/runnable-exports.svg?branch=master)](https://travis-ci.org/LasaleFamine/runnable-exports)

> Run your `exports` as command line arguments

If you want to easly create a command line tool from a file and a bunch of exported functions.

## Install

	$ yarn add runnable-exports

## Usage
```javascript
// your-file.js
const runnableExports = require('runnable-exports')
module.exports.awesome = args => {
	console.log('Awesome', args)
}
runnableExports()
```
And simply

	$ node your-file.js awesome and nice arguments

Output

	Awesome ['and', 'nice', 'arguments']

### ***ObjectArgs***

Underthehood is used [yargs](https://www.npmjs.com/package/yargs), so you can pass easly also `objectArgs` like so

	$ node your-file.js awesome --nice

Output

	Awesome {nice: true}

> :warning: NOTE: the module currently doesn't accept **both types of arguments**

## Related

This is a fork of [make-runnable](https://github.com/super-cache-money/make-runnable)

## License

MIT © LasaleFamine
