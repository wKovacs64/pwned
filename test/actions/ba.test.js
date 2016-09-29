import commander from 'commander';
import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import { data } from '../setup';

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
    ba(data.none, command);
    expect(help.called).to.be(true);
    done();
  });

  it('should call getBreachedAccount when passed a non-empty string',
    (done) => {
      ba(data.notFound, command);
      expect(getBreachedAccountStub.called).to.be(true);
      done();
    });
});
