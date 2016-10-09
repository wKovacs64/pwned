import commander from 'commander';
import { expect } from 'chai';
import pa from '../../src/commands/pa';

describe('command: pa', () => {
  it('should add "pa" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands).to.have.lengthOf(0);
    pa(program);
    expect(program.commands[0]._name).to.equal('pa');
    done();
  });
});
