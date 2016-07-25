/* eslint-env mocha */
/* global describe, it, before, after, beforeEach, afterEach */

import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import {data, loggerMock} from '../setup';

describe('api: getBreaches', () => {
  const hibpMock = {
    breaches: (domain) => {
      if (domain === data.found) {
        return Promise.resolve(data.objArray);
      } else if (domain === data.notFound) {
        return Promise.resolve(data.emptyArray);
      } else if (domain === data.error) {
        return Promise.reject(new Error('Set sail for fail!'));
      }
    }
  };

  let getBreaches;
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
    sinon.spy(loggerMock, 'log');
    sinon.spy(loggerMock, 'error');
    spinner = require('../../lib/utils/spinner');
    spinnerStart = sinon.stub(spinner, 'start');
    spinnerStop = sinon.stub(spinner, 'stop');

    mockery.registerMock('hibp', hibpMock);
    mockery.registerMock('../utils/logger', loggerMock);
    mockery.registerMock('../utils/spinner', spinner);
    getBreaches = require('../../lib/api/getBreaches');
  });

  afterEach(() => {
    loggerMock.log.restore();
    loggerMock.error.restore();
    spinnerStart.restore();
    spinnerStop.restore();
    mockery.deregisterAll();
  });

  // ////////////////// spinner.start() ////////////////// //

  it('should call spinner.start (!raw)', (done) => {
    getBreaches(data.found, false);
    expect(spinnerStart.called).to.be(true);
    done();
  });

  it('should not call spinner.start (raw)', (done) => {
    getBreaches(data.found, true);
    expect(spinnerStart.called).to.be(false);
    done();
  });

  // ////////////////// spinner.stop() ////////////////// //

  it('should call spinner.stop (non-error results, !raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    getBreaches(data.found, false)
        .then(() => {
          expect(spinnerStop.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should not call spinner.stop (non-error results, raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    getBreaches(data.found, true)
        .then(() => {
          expect(spinnerStop.called).to.be(false);
          done();
        })
        .catch(done);
  });

  // ////////////////// breachData ////////////////// //

  it('should call logger.log (found && !raw)', (done) => {
    expect(loggerMock.log.called).to.be(false);
    getBreaches(data.found, false)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(2);
          done();
        })
        .catch(done);
  });

  it('should call logger.log (found && raw)', (done) => {
    expect(loggerMock.log.called).to.be(false);
    getBreaches(data.found, true)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(1);
          done();
        })
        .catch(done);
  });

  it('should call logger.log (notFound && !raw)', (done) => {
    expect(loggerMock.log.called).to.be(false);
    getBreaches(data.notFound, false)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(2);
          done();
        })
        .catch(done);
  });

  it('should not call logger.log (notFound && raw)', (done) => {
    expect(loggerMock.log.called).to.be(false);
    getBreaches(data.notFound, true)
        .then(() => {
          expect(loggerMock.log.called).to.be(false);
          done();
        })
        .catch(done);
  });

  // ////////////////// error ////////////////// //

  it('should call spinner.stop (error && !raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    getBreaches(data.error, false)
        .then(() => {
          expect(spinnerStop.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should not call spinner.stop (error && raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    getBreaches(data.error, true)
        .then(() => {
          expect(spinnerStop.called).to.be(false);
          done();
        })
        .catch(done);
  });

  it('should call logger.error (error)', (done) => {
    expect(loggerMock.error.called).to.be(false);
    getBreaches(data.error, false)
        .then(() => {
          expect(loggerMock.error.called).to.be(true);
          done();
        })
        .catch(done);
  });
});
