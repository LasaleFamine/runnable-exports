const runnableExports = require('./../src/index.js');

const PI = 3;
const variable = "my variable";

const testFunction = (...args) => {
    console.log(`${args.length} arguments entered.`);
}

const otherFunction = (key, value, object) => {
    console.log(`Inserting ${value} into ${object} at ${key}`);
    object[key] = value;
}

module.exports = {
    PI,
    variable,
    testFunction,
    otherFunction,
}

runnableExports()
