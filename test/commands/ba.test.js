import commander from 'commander';
import { expect } from 'chai';
import ba from '../../src/commands/ba';

describe('command: ba', () => {
  it('should add "ba" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands).to.have.lengthOf(0);
    ba(program);
    expect(program.commands[0]._name).to.equal('ba');
    done();
  });
});
