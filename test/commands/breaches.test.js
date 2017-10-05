import commander from 'commander';
import breaches from '../../src/commands/breaches';

describe('command: breaches', () => {
  it('should add "breaches" command to Commander instance', () => {
    const program = new commander.Command('');
    expect(program.commands).toHaveLength(0);
    breaches(program);
    expect(program.commands[0]._name).toBe('breaches');
  });
});
