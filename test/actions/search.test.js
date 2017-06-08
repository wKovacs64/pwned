import commander from 'commander';
import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import { NONE, NOT_FOUND } from '../testData';

describe('action: search', () => {
  const getSearchStub = sinon.stub();
  let search;
  let command;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../api/getSearch', getSearchStub);
    search = require('../../src/actions/search');
    command = new commander.Command('');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call command help when passed an empty string', (done) => {
    const help = sinon.stub(command, 'help').returns();
    search(NONE, command);
    expect(help.called).to.be.true;
    done();
  });

  it('should call search when passed a non-empty string',
    (done) => {
      search(NOT_FOUND, command);
      expect(getSearchStub.called).to.be.true;
      done();
    });
});
