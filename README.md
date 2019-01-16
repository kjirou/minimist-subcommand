# minimist-subcommand

[![npm version](https://badge.fury.io/js/minimist-subcommand.svg)](http://badge.fury.io/js/minimist-subcommand)
[![Build Status](https://travis-ci.org/kjirou/minimist-subcommand.svg?branch=master)](https://travis-ci.org/kjirou/minimist-subcommand)

A simple sub-command parser for [minimist](https://www.npmjs.com/package/minimist)


## Installation

```bash
npm install minimist-subcommand
```


## Examples

### Basic

`basic.js`:

```js
const parseArgs = require('minimist');
const {parseCommands} = require('minimist-subcommand');

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
```

```bash
$ node ./basic.js foo arg -a -b val -c
sub-command: [ 'foo' ]
parsed options by minimist: { _: [ 'arg' ], a: true, b: 'val', c: true }
```

```bash
$ node ./basic.js arg -a
sub-command: []
parsed options by minimist: { _: [ 'arg' ], a: true }
```

```bash
$ node ./basic.js bar foo
sub-command: [ 'bar' ]
parsed options by minimist: { _: [ 'foo' ] }
```

### Nested commands

`nested-commands.js`:

```js
const parseArgs = require('minimist');
const {parseCommands} = require('minimist-subcommand');

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
```

```bash
$ node ./nested-commands.js married child grandchild arg -a
commands: [ 'married', 'child', 'grandchild' ]
parsed options by minimist: { _: [ 'arg' ], a: true }
```

```bash
$ node ./nested-commands.js singleton child grandchild
commands: [ 'singleton' ]
parsed options by minimist: { _: [ 'child', 'grandchild' ] }
```

### Use "default" option

`use-default-option.js`:

```js
const parseArgs = require('minimist');
const {parseCommands} = require('minimist-subcommand');

// parse sub-commands
const commandDefinition = {
  default: 'bar',
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
```

```bash
$ node ./use-default-option.js arg -a
sub-command: [ 'bar' ]
parsed options by minimist: { _: [ 'arg' ], a: true }
```


## Command's Schema

If you want to check schema of `commandDefinition`, please use `COMMAND_JSON_SCHEMA`.

```js
const COMMAND_JSON_SCHEMA = require('minimist-subcommand').COMMAND_JSON_SCHEMA;

const commandDefinition = {
  commands: {
    foo: null,
    bar: null
  }
};

// I will leave it to the judgment of the user.
someJsonSchemaLibrary.validate(COMMAND_JSON_SCHEMA, commandDefinition);
```
