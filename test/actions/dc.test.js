import commander from 'commander';
import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';

describe('action: dc', () => {
  const getDataClassesStub = sinon.stub();
  let dc;
  let command;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
    mockery.registerMock('../api/getDataClasses', getDataClassesStub);
    dc = require('../../lib/actions/dc');
    command = new commander.Command('');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call getDataClasses', (done) => {
    dc(command);
    expect(getDataClassesStub.called).to.be(true);
    done();
  });
});
