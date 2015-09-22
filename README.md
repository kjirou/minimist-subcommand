# minimist-subcommand

[![npm version](https://badge.fury.io/js/minimist-subcommand.svg)](http://badge.fury.io/js/minimist-subcommand)
[![Build Status](https://travis-ci.org/kjirou/minimist-subcommand.svg?branch=master)](https://travis-ci.org/kjirou/minimist-subcommand)

A simple sub-command parser for [minimist](https://www.npmjs.com/package/minimist)


## Installation

```
npm install --save minimist-subcommand
```


## Examples

### Basic

`basic.js`:

```js
var parseArgs = require('minimist');
var parseCommands = require('minimist-subcommand');

// parse sub-commands
var commandDefinition = {
  commands: {
    foo: null,
    bar: null
  }
};
var parsedCommandsAndArgv = parseCommands(commandDefinition, process.argv.slice(2));

// pass parsed argv to minimist
var options = parseArgs(parsedCommandsAndArgv.argv);

console.log('sub-command:', parsedCommandsAndArgv.commands);
console.log('parsed options by minimist:', options);
```

```bash
$ node ./basic.js foo arg -a -b val -c
sub-command: [ 'foo' ]
parsed options by minimist: { _: [ 'arg' ], a: true, b: 'val', c: true }
```

```bash
sub-command: []
parsed options by minimist: { _: [ 'arg' ], a: true }
```

```bash
$ node ./basic.js bar foo
sub-command: [ 'bar' ]
parsed options by minimist: { _: [ 'foo' ] }
```
