import commander from 'commander';
import ba from '../../src/commands/ba';

describe('command: ba', () => {
  it('should add "ba" command to Commander instance', () => {
    const program = new commander.Command('');
    expect(program.commands).toHaveLength(0);
    ba(program);
    expect(program.commands[0]._name).toBe('ba');
  });
});
