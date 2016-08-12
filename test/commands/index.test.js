import commander from 'commander';
import expect from 'expect.js';
import addCommands from '../../src/commands/index';

describe('command loader', () => {
  it('should add all commands to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands.length).to.be(0);
    addCommands(program);
    expect(program.commands.length).to.be(5);
    expect(program.commands[0]._name).to.be('ba');
    expect(program.commands[1]._name).to.be('breach');
    expect(program.commands[2]._name).to.be('breaches');
    expect(program.commands[3]._name).to.be('dc');
    expect(program.commands[4]._name).to.be('pa');
    done();
  });
});
