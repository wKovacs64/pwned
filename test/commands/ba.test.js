import commander from 'commander';
import expect from 'expect.js';
import ba from '../../src/commands/ba';

describe('command: ba', () => {
  it('should add "ba" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands.length).to.be(0);
    ba(program);
    expect(program.commands[0]._name).to.be('ba');
    done();
  });
});
