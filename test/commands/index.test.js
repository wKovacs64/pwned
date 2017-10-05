import commander from 'commander';
import addCommands from '../../src/commands';

describe('command loader', () => {
  it('should add all commands to Commander instance', () => {
    const program = new commander.Command('');
    expect(program.commands).toHaveLength(0);
    addCommands(program);
    expect(program.commands).toHaveLength(7);
    expect(program.commands[0]._name).toBe('ba');
    expect(program.commands[1]._name).toBe('breach');
    expect(program.commands[2]._name).toBe('breaches');
    expect(program.commands[3]._name).toBe('dc');
    expect(program.commands[4]._name).toBe('pa');
    expect(program.commands[5]._name).toBe('pw');
    expect(program.commands[6]._name).toBe('search');
  });
});
