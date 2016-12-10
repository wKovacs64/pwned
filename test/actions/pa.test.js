import commander from 'commander';
import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import { NONE, EMAIL } from '../testData';

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
    pa(NONE, command);
    expect(help.called).to.be.true;
    done();
  });

  it('should call getPastes when passed a non-empty string', (done) => {
    pa(EMAIL, command);
    expect(getPastesStub.called).to.be.true;
    done();
  });
});
