import commander from 'commander';
import { expect } from 'chai';
import breach from '../../src/commands/breach';

describe('command: breach', () => {
  it('should add "breach" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands).to.have.lengthOf(0);
    breach(program);
    expect(program.commands[0]._name).to.equal('breach');
    done();
  });
});
