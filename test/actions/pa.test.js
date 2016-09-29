import commander from 'commander';
import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import { data } from '../setup';

describe('action: pa', () => {
  const getPastesStub = sinon.stub();
  let pa;
  let command;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../api/getPastes', getPastesStub);
    pa = require('../../src/actions/pa');
    command = new commander.Command('');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call command help when passed an empty string', (done) => {
    const help = sinon.stub(command, 'help').returns();
    pa(data.none, command);
    expect(help.called).to.be(true);
    done();
  });

  it('should call getPastes when passed a non-empty string', (done) => {
    pa(data.email, command);
    expect(getPastesStub.called).to.be(true);
    done();
  });
});
