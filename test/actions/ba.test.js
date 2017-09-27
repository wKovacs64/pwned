import commander from 'commander';
import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import { NONE, NOT_FOUND } from '../testData';

describe('action: ba', () => {
  const getBreachedAccountStub = sinon.stub();
  let ba;
  let command;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../api/getBreachedAccount', getBreachedAccountStub);
    ba = require('../../src/actions/ba');
    command = new commander.Command('');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call command help when passed an empty string', (done) => {
    const help = sinon.stub(command, 'help').returns();
    ba(NONE, command);
    expect(help.called).to.be.true;
    done();
  });

  // prettier-ignore
  it('should call getBreachedAccount when passed a non-empty string',
    (done) => {
      ba(NOT_FOUND, command);
      expect(getBreachedAccountStub.called).to.be.true;
      done();
    });
});
