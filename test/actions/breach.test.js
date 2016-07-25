/* eslint-env mocha */
/* global describe, it, before, after */

import commander from 'commander';
import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import {data} from '../setup';

describe('action: breach', () => {
  const getBreachStub = sinon.stub();
  let breach;
  let command;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
    mockery.registerMock('../api/getBreach', getBreachStub);
    breach = require('../../lib/actions/breach');
    command = new commander.Command('');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call command help when passed an empty string', (done) => {
    const help = sinon.stub(command, 'help').returns();
    breach(data.none, command);
    expect(help.called).to.be(true);
    done();
  });

  it('should call getBreach when passed a non-empty string', (done) => {
    breach(data.accountNotFound, command);
    expect(getBreachStub.called).to.be(true);
    done();
  });
});
