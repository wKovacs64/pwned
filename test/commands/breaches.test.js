import commander from 'commander';
import { expect } from 'chai';
import breaches from '../../src/commands/breaches';

describe('command: breaches', () => {
  it('should add "breaches" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands).to.have.lengthOf(0);
    breaches(program);
    expect(program.commands[0]._name).to.equal('breaches');
    done();
  });
});
