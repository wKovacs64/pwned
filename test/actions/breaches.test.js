import commander from 'commander';
import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';

describe('action: breaches', () => {
  const getBreachesStub = sinon.stub();
  let breaches;
  let command;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../api/getBreaches', getBreachesStub);
    breaches = require('../../src/actions/breaches');
    command = new commander.Command('');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call getBreaches', (done) => {
    breaches(command);
    expect(getBreachesStub.called).to.be(true);
    done();
  });
});
