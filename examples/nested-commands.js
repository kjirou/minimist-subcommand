#!/usr/bin/env node

var parseArgs = require('minimist');
var {parseCommands} = require('../dist/index');

// parse sub-commands
var commandDefinition = {
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
var parsedCommandsAndArgv = parseCommands(commandDefinition, process.argv.slice(2));

// pass parsed argv to minimist
var options = parseArgs(parsedCommandsAndArgv.argv);

console.log('commands:', parsedCommandsAndArgv.commands);
console.log('parsed options by minimist:', options);
