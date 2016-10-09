import commander from 'commander';
import { expect } from 'chai';
import dc from '../../src/commands/dc';

describe('command: dc', () => {
  it('should add "dc" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands).to.have.lengthOf(0);
    dc(program);
    expect(program.commands[0]._name).to.equal('dc');
    done();
  });
});
