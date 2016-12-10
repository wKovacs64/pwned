import commander from 'commander';
import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import { NONE, NOT_FOUND } from '../testData';

describe('action: breach', () => {
  const getBreachStub = sinon.stub();
  let breach;
  let command;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../api/getBreach', getBreachStub);
    breach = require('../../src/actions/breach');
    command = new commander.Command('');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call command help when passed an empty string', (done) => {
    const help = sinon.stub(command, 'help').returns();
    breach(NONE, command);
    expect(help.called).to.be.true;
    done();
  });

  it('should call getBreach when passed a non-empty string', (done) => {
    breach(NOT_FOUND, command);
    expect(getBreachStub.called).to.be.true;
    done();
  });
});
