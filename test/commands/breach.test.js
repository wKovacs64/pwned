import commander from 'commander';
import breach from '../../src/commands/breach';

describe('command: breach', () => {
  it('should add "breach" command to Commander instance', () => {
    const program = new commander.Command('');
    expect(program.commands).toHaveLength(0);
    breach(program);
    expect(program.commands[0]._name).toBe('breach');
  });
});
