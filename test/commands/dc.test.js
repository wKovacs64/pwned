import commander from 'commander';
import dc from '../../src/commands/dc';

describe('command: dc', () => {
  it('should add "dc" command to Commander instance', () => {
    const program = new commander.Command('');
    expect(program.commands).toHaveLength(0);
    dc(program);
    expect(program.commands[0]._name).toBe('dc');
  });
});
