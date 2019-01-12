import * as assert from 'assert';
import * as minimist from 'minimist';
import {describe, it} from 'mocha';
import * as tv4 from 'tv4';

import * as parseCommands from '../index';
const COMMAND_JSON_SCHEMA = parseCommands.COMMAND_JSON_SCHEMA;

describe('minimist-subcommand', function() {
  it('should parse argv by simple schema', function() {
    const schema = {
      commands: {
        foo: null,
        bar: null
      }
    };

    assert.deepEqual(parseCommands(schema, ['foo', 'a', '-b']), {
      commands: ['foo'],
      argv: ['a', '-b']
    });
    assert.deepEqual(parseCommands(schema, ['bar', 'a', '-b']), {
      commands: ['bar'],
      argv: ['a', '-b']
    });
    assert.deepEqual(parseCommands(schema, ['foo', 'bar']), {
      commands: ['foo'],
      argv: ['bar']
    });
    assert.deepEqual(parseCommands(schema, ['a', '-b']), {
      commands: [],
      argv: ['a', '-b']
    });
  });

  it('should parse argv by nested schema', function() {
    const schema = {
      commands: {
        foo: {
          commands: {
            hello: null,
            world: null,
            bar: {
              commands: {
                x: null
              }
            }
          }
        },
        bar: null
      }
    };

    assert.deepEqual(parseCommands(schema, ['a', '-b']), {
      commands: [],
      argv: ['a', '-b']
    });
    assert.deepEqual(parseCommands(schema, ['bar', 'a', '-b']), {
      commands: ['bar'],
      argv: ['a', '-b']
    });

    assert.deepEqual(parseCommands(schema, ['foo', 'a', '-b']), {
      commands: ['foo'],
      argv: ['a', '-b']
    });
    assert.deepEqual(parseCommands(schema, ['foo', 'hello', 'a']), {
      commands: ['foo', 'hello'],
      argv: ['a']
    });
    assert.deepEqual(parseCommands(schema, ['hello', 'foo', 'a']), {
      commands: [],
      argv: ['hello', 'foo', 'a']
    });
    assert.deepEqual(parseCommands(schema, ['foo', 'bar', 'x']), {
      commands: ['foo', 'bar', 'x'],
      argv: []
    });
  });

  it('should be enabled the default option', function() {
    const schema = {
      default: 'foo',
      commands: {
        foo: null,
        bar: null
      }
    };

    assert.deepEqual(parseCommands(schema, []), {
      commands: ['foo'],
      argv: []
    });
    assert.deepEqual(parseCommands(schema, ['a', '-b']), {
      commands: ['foo'],
      argv: ['a', '-b']
    });
    assert.deepEqual(parseCommands(schema, ['bar', 'a', '-b']), {
      commands: ['bar'],
      argv: ['a', '-b']
    });
  });

  it('should throw error by invalid default option', function() {
    const schema = {
      default: 'baz',
      commands: {
        foo: null,
        bar: null
      }
    };

    assert.throws(function() {
      parseCommands(schema, []);
    }, /baz/);
  });

  describe('COMMAND_JSON_SCHEMA', function() {
    it('can be used for JSON Schema', function() {
      let schema;

      schema = {
        default: 1,
        commands: {
          foo: null
        }
      };
      assert.strictEqual(tv4.validateResult(schema, COMMAND_JSON_SCHEMA).valid, false);

      schema = {
        commands: {
          foo: 1
        }
      };
      assert.strictEqual(tv4.validateResult(schema, COMMAND_JSON_SCHEMA).valid, false);

      schema = {
        commands: {
          foo: {
            commands: {
              bar: 1
            }
          }
        }
      };
      assert.strictEqual(tv4.validateResult(schema, COMMAND_JSON_SCHEMA).valid, false);
    });
  });

  describe('with minimist', function() {
    it('should be', function() {
      const schema = {
        commands: {
          foo: {
            commands: {
              bar: null
            }
          }
        }
      };
      const argv = 'foo bar arg1 arg2 -a -b val -c'.split(/ +/);
      const result = parseCommands(schema, argv);
      const options = minimist(result.argv);

      assert.deepEqual(options, {
        _: ['arg1', 'arg2'],
        a: true,
        b: 'val',
        c: true
      });
    });
  });
});
