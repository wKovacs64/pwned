import commander from 'commander';
import search from '../../src/commands/search';

describe('command: search', () => {
  it('should add "search" command to Commander instance', () => {
    const program = new commander.Command('');
    expect(program.commands).toHaveLength(0);
    search(program);
    expect(program.commands[0]._name).toBe('search');
  });
});
