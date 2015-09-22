var assert = require('assert');
var minimist = require('minimist');

var parseCommands = require('../index');


describe('minimist-subcommand', function() {

  it('should parse argv by simple schema', function() {
    var schema = {
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
    var schema = {
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
    var schema = {
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
    var schema = {
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


  context('schema validation', function() {

    it('should be', function() {
      var schema;

      schema = {
        default: 1,
        commands: {
          foo: null
        }
      };
      assert.throws(function() {
        parseCommands(schema, []);
      }, /ValidationError/);

      schema = {
        commands: {
          foo: 1
        }
      };
      assert.throws(function() {
        parseCommands(schema, []);
      }, /ValidationError/);

      schema = {
        commands: {
          foo: {
            commands: {
              bar: 1
            }
          }
        }
      };
      assert.throws(function() {
        parseCommands(schema, []);
      }, /ValidationError/);
    });
  });


  context('with minimist', function() {

    it('should be', function() {
      var schema = {
        commands: {
          foo: {
            commands: {
              bar: null
            }
          }
        }
      };
      var argv = 'foo bar arg1 arg2 -a -b val -c'.split(/ +/);
      var result = parseCommands(schema, argv);
      var options = minimist(result.argv);

      assert.deepEqual(options, {
        _: ['arg1', 'arg2'],
        a: true,
        b: 'val',
        c: true
      });
    });
  });
});
