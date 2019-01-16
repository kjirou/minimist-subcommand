export const COMMAND_JSON_SCHEMA: object = {
  definitions: {
    commandSchema: {
      type: 'object',
      properties: {
        commands: {
          type: 'object',
          patternProperties: {
            "": {
              oneOf: [
                { type: 'null' },
                { $ref: '#/definitions/commandSchema' },
              ]
            }
          }
        },
        default: {
          type: ['string', 'null']
        },
      },
      required: ['commands']
    }
  },
  $ref: '#/definitions/commandSchema'
};

export type CommandSchema = {
  commands: {
    [key: string]: CommandSchema | null,
  },
  default?: string | null,
};

export function parseCommands(schema: CommandSchema, argv: string[]): {
  commands: string[],
  argv: string[],
} {
  function popCommandRecursively(
    currentSchema: CommandSchema | null,
    currentArgv: string[],
    parsedCommands: string[]
  ): {
    commands: string[],
    argv: string[],
  } {
    if (currentSchema === null) {
      return {
        commands: parsedCommands,
        argv: currentArgv
      };
    }

    const proposedCommands = Object.keys(currentSchema.commands);
    const firstArg = currentArgv[0];  // string || undefined
    const newArgv = currentArgv.slice();
    let commandName: string | null = null;

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

  const result = popCommandRecursively(schema, argv, []);

  return {
    commands: result.commands,
    argv: result.argv
  };
};
