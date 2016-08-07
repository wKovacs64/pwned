/* eslint-env mocha */
/* global describe, it, before, after, beforeEach, afterEach */

import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import {data, loggerMock} from '../setup';

describe('api: getDataClasses', () => {
  const hibpMockFound = {
    dataClasses: () => {
      return Promise.resolve(data.objArray);
    }
  };

  const hibpMockNotFound = {
    dataClasses: () => {
      return Promise.resolve(data.emptyArray);
    }
  };

  const hibpMockError = {
    dataClasses: () => {
      return Promise.reject(new Error(data.errorMsg));
    }
  };

  let getDataClasses;
  let spinner;
  let spinnerStart;
  let spinnerStop;

  beforeEach(() => {
    sinon.spy(loggerMock, 'log');
    sinon.spy(loggerMock, 'error');
    spinner = require('../../lib/utils/spinner');
    spinnerStart = sinon.stub(spinner, 'start');
    spinnerStop = sinon.stub(spinner, 'stop');

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
    mockery.registerMock('../utils/logger', loggerMock);
    mockery.registerMock('../utils/spinner', spinner);
  });

  afterEach(() => {
    loggerMock.log.restore();
    loggerMock.error.restore();
    spinnerStart.restore();
    spinnerStop.restore();

    mockery.deregisterAll();
    mockery.disable();
  });

  // ////////////////// spinner.start() ////////////////// //

  it('should call spinner.start (!raw)', (done) => {
    mockery.registerMock('hibp', hibpMockFound);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(false);
    expect(spinnerStart.called).to.be(true);
    done();
  });

  it('should not call spinner.start (raw)', (done) => {
    mockery.registerMock('hibp', hibpMockFound);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(true);
    expect(spinnerStart.called).to.be(false);
    done();
  });

  // ////////////////// spinner.stop() ////////////////// //

  it('should call spinner.stop (non-error results, !raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    mockery.registerMock('hibp', hibpMockFound);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(false)
        .then(() => {
          expect(spinnerStop.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should not call spinner.stop (non-error results, raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    mockery.registerMock('hibp', hibpMockFound);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(true)
        .then(() => {
          expect(spinnerStop.called).to.be(false);
          done();
        })
        .catch(done);
  });

  // ////////////////// breachData ////////////////// //

  it('should call logger.log (found && !raw)', (done) => {
    expect(loggerMock.log.called).to.be(false);
    mockery.registerMock('hibp', hibpMockFound);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(false)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(2);
          done();
        })
        .catch(done);
  });

  it('should call logger.log (found && raw)', (done) => {
    expect(loggerMock.log.called).to.be(false);
    mockery.registerMock('hibp', hibpMockFound);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(true)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(1);
          done();
        })
        .catch(done);
  });

  it('should call logger.log (notFound && !raw)', (done) => {
    expect(loggerMock.log.called).to.be(false);
    mockery.registerMock('hibp', hibpMockNotFound);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(false)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(2);
          done();
        })
        .catch(done);
  });

  it('should not call logger.log (notFound && raw)', (done) => {
    expect(loggerMock.log.called).to.be(false);
    mockery.registerMock('hibp', hibpMockNotFound);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(true)
        .then(() => {
          expect(loggerMock.log.called).to.be(false);
          done();
        })
        .catch(done);
  });

  // ////////////////// error ////////////////// //

  it('should call spinner.stop (error && !raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    mockery.registerMock('hibp', hibpMockError);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(false)
        .then(() => {
          expect(spinnerStop.called).to.be(true);
          done();
        })
        .catch(done);
  });

  it('should not call spinner.stop (error && raw)', (done) => {
    expect(spinnerStop.called).to.be(false);
    mockery.registerMock('hibp', hibpMockError);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(true)
        .then(() => {
          expect(spinnerStop.called).to.be(false);
          done();
        })
        .catch(done);
  });

  it('should call logger.error (error)', (done) => {
    expect(loggerMock.error.called).to.be(false);
    mockery.registerMock('hibp', hibpMockError);
    getDataClasses = require('../../lib/api/getDataClasses');
    getDataClasses(false)
        .then(() => {
          expect(loggerMock.error.called).to.be(true);
          done();
        })
        .catch(done);
  });
});
