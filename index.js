module.exports = function parseCommands(schema, argv) {

  // TODO: check schema by json-schema
  //
  // {
  //   default: 'foo',
  //   commands: {
  //     foo: { /* schema */ },
  //     bar: null
  //   }
  // }

  function popCommandRecursively(currentSchema, currentArgv, parsedCommands) {

    if (currentSchema === null) {
      return {
        commands: parsedCommands,
        argv: currentArgv
      };
    }

    var proposedCommands = Object.keys(currentSchema.commands);
    var firstArg = currentArgv[0];  // string || undefined
    var commandName = null;
    var newArgv = currentArgv.slice();

    if (proposedCommands.indexOf(firstArg) !== -1) {
      commandName = firstArg;
      newArgv.shift();
    } else if (typeof currentSchema.default === 'string') {
      if (proposedCommands.indexOf(currentSchema.default) !== -1) {
        commandName = currentSchema.default;
      } else {
        throw new Error('"' + currentSchema.default + '" command of default does not exist from commands');
      }
    }

    if (commandName !== null) {
      return popCommandRecursively(
        currentSchema.commands[commandName],
        newArgv,
        parsedCommands.concat([commandName])
      );
    } else {
      return {
        commands: parsedCommands,
        argv: newArgv
      };
    }
  }

  var result = popCommandRecursively(schema, argv, []);

  return {
    commands: result.commands,
    argv: result.argv
  };
};
