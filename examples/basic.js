#!/usr/bin/env node

const parseArgs = require('minimist');
const {parseCommands} = require('../dist/index');

// parse sub-commands
const commandDefinition = {
  commands: {
    foo: null,
    bar: null
  }
};
const parsedCommandsAndArgv = parseCommands(commandDefinition, process.argv.slice(2));

// pass parsed argv to minimist
const options = parseArgs(parsedCommandsAndArgv.argv);

console.log('sub-command:', parsedCommandsAndArgv.commands);
console.log('parsed options by minimist:', options);
