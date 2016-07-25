/* eslint-env mocha */
/* global describe, it, before, after */

import commander from 'commander';
import expect from 'expect.js';
import dc from '../../lib/commands/dc';

describe('command: dc', () => {
  it('should add "dc" command to Commander instance', (done) => {
    const program = new commander.Command('');
    expect(program.commands.length).to.be(0);
    dc(program);
    expect(program.commands[0]._name).to.be('dc');
    done();
  });
});
