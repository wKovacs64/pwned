import commander from 'commander';
import { expect } from 'chai';
import pw from '../../src/commands/pw';

describe('command: pw', () => {
  it('should add "pw" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands).to.have.lengthOf(0);
    pw(program);
    expect(program.commands[0]._name).to.equal('pw');
    done();
  });
});
