import commander from 'commander';
import { expect } from 'chai';
import addCommands from '../../src/commands/index';

describe('command loader', () => {
  it('should add all commands to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands).to.have.lengthOf(0);
    addCommands(program);
    expect(program.commands).to.have.lengthOf(5);
    expect(program.commands[0]._name).to.equal('ba');
    expect(program.commands[1]._name).to.equal('breach');
    expect(program.commands[2]._name).to.equal('breaches');
    expect(program.commands[3]._name).to.equal('dc');
    expect(program.commands[4]._name).to.equal('pa');
    done();
  });
});
