const runnableExports = require('./../src/index.js');

const PI = 3;
const variable = "my variable";

const testFunction = (...args) => {

    console.log(`${args.length} arguments entered.`);
}

const otherFunction = (key, value, type) => {
    console.log(`Inserting ${value} at index ${key} with type ${type}`);
}

const testObject = (object) => {
	console.log(object);
}

module.exports = {
    PI,
    variable,
    testFunction,
    otherFunction,
	testObject,
}

runnableExports()
