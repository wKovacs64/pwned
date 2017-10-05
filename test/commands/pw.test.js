import commander from 'commander';
import pw from '../../src/commands/pw';

describe('command: pw', () => {
  it('should add "pw" command to Commander instance', () => {
    const program = new commander.Command('');
    expect(program.commands).toHaveLength(0);
    pw(program);
    expect(program.commands[0]._name).toBe('pw');
  });
});
