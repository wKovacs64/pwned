/* eslint-env mocha */
/* global describe, it, before, after, beforeEach, afterEach */

import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import {data} from '../setup';

describe('api: getBreachedAccount', () => {
  const hibpMock = {
    breachedAccount: (account) => {
      if (account === data.accountFound) {
        return Promise.resolve(data.breach);
      } else if (account === data.accountNotFound) {
        return Promise.resolve(undefined);
      } else if (account === data.accountError) {
        return Promise.reject(new Error('Set sail for fail!'));
      }
    }
  };

  let getBreachedAccount;
  let spinner;
  let spinnerStart;
  let spinnerStop;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
  });

  after(() => {
    mockery.disable();
  });

  beforeEach(() => {
    sinon.spy(console, 'log');
    sinon.spy(console, 'error');
    spinner = require('../../lib/utils/spinner');
    spinnerStart = sinon.stub(spinner, 'start');
    spinnerStop = sinon.stub(spinner, 'stop');

    mockery.registerMock('hibp', hibpMock);
    mockery.registerMock('../utils/spinner', spinner);
    getBreachedAccount = require('../../lib/api/getBreachedAccount');
  });

  afterEach(() => {
    console.log.restore();
    console.error.restore();
    spinnerStart.restore();
    spinnerStop.restore();
    mockery.deregisterAll();
  });

  // ////////////////// spinner.start() ////////////////// //

  it('should call spinner.start (!raw)', (done) => {
    getBreachedAccount(data.accountNotFound, data.none, false, false);
    expect(spinnerStart.called).to.be(true);
    done();
  });

  it('should not call spinner.start (raw)', (done) => {
    getBreachedAccount(data.accountNotFound, data.none, false, true);
    expect(spinnerStart.called).to.be(false);
    done();
  });

  // ////////////////// spinner.stop() ////////////////// //

  it('should call spinner.stop (non-error results, !raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    getBreachedAccount(data.accountNotFound, data.none, false, false)
        .then(() => {
          expect(spinnerStop.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should not call spinner.stop (non-error results, raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    getBreachedAccount(data.accountNotFound, data.none, false, true)
        .then(() => {
          expect(spinnerStop.called).to.be(false);
          done();
        })
        .catch(done);
  });

  // ////////////////// breachData ////////////////// //

  it('should call console.log (accountFound && !raw)', (done) => {
    expect(console.log.called).to.be(false);
    getBreachedAccount(data.accountFound, data.none, false, false)
        .then(() => {
          expect(console.log.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should call console.log (accountFound && raw)', (done) => {
    expect(console.log.called).to.be(false);
    getBreachedAccount(data.accountFound, data.none, false, true)
        .then(() => {
          expect(console.log.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should call console.log (accountNotFound && !raw)', (done) => {
    expect(console.log.called).to.be(false);
    getBreachedAccount(data.accountNotFound, data.none, false, false)
        .then(() => {
          expect(console.log.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should not call console.log (accountNotFound && raw)', (done) => {
    expect(console.log.called).to.be(false);
    getBreachedAccount(data.accountNotFound, data.none, false, true)
        .then(() => {
          expect(console.log.called).to.be(false);
          done();
        })
        .catch(done);
  });

  // ////////////////// error ////////////////// //

  it('should call spinner.stop (accountError && !raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    getBreachedAccount(data.accountError, data.none, false, false)
        .then(() => {
          expect(spinnerStop.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should not call spinner.stop (accountError && raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    getBreachedAccount(data.accountError, data.none, false, true)
        .then(() => {
          expect(spinnerStop.called).to.be(false);
          done();
        })
        .catch(done);
  });

  it('should call console.error (accountError)', (done) => {
    expect(console.error.called).to.be(false);
    getBreachedAccount(data.accountError, data.none, false, false)
        .then(() => {
          expect(console.error.called).to.be(true);
          done();
        })
        .catch(done);
  });
});
