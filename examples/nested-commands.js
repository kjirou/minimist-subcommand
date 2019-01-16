#!/usr/bin/env node

const parseArgs = require('minimist');
const {parseCommands} = require('../dist/index');

// parse sub-commands
const commandDefinition = {
  commands: {
    singleton: null,
    married: {
      commands: {
        child: {
          commands: {
            grandchild: null
          }
        }
      }
    }
  }
};
const parsedCommandsAndArgv = parseCommands(commandDefinition, process.argv.slice(2));

// pass parsed argv to minimist
const options = parseArgs(parsedCommandsAndArgv.argv);

console.log('commands:', parsedCommandsAndArgv.commands);
console.log('parsed options by minimist:', options);
