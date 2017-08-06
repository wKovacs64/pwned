import commander from 'commander';
import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import { NONE, NOT_FOUND } from '../testData';

describe('action: pw', () => {
  const getPwnedPasswordStub = sinon.stub();
  let pw;
  let command;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../api/getPwnedPassword', getPwnedPasswordStub);
    pw = require('../../src/actions/pw');
    command = new commander.Command('');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call command help when passed an empty string', (done) => {
    const help = sinon.stub(command, 'help').returns();
    pw(NONE, command);
    expect(help.called).to.be.true;
    done();
  });

  it('should call getPwnedPassword when passed a non-empty string', (done) => {
    pw(NOT_FOUND, command);
    expect(getPwnedPasswordStub.called).to.be.true;
    done();
  });
});
