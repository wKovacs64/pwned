import commander from 'commander';
import expect from 'expect.js';
import pa from '../../src/commands/pa';

describe('command: pa', () => {
  it('should add "pa" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands.length).to.be(0);
    pa(program);
    expect(program.commands[0]._name).to.be('pa');
    done();
  });
});
