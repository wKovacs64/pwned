import commander from 'commander';
import pa from '../../src/commands/pa';

describe('command: pa', () => {
  it('should add "pa" command to Commander instance', () => {
    const program = new commander.Command('');
    expect(program.commands).toHaveLength(0);
    pa(program);
    expect(program.commands[0]._name).toBe('pa');
  });
});
