import commander from 'commander';
import { expect } from 'chai';
import search from '../../src/commands/search';

describe('command: search', () => {
  it('should add "search" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands).to.have.lengthOf(0);
    search(program);
    expect(program.commands[0]._name).to.equal('search');
    done();
  });
});
