import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import {data, loggerMock} from '../setup';

describe('api: getBreaches', () => {
  const hibpMock = {
    breaches: (options) => {
      options = options || {};
      if (options.domain === data.found) {
        return Promise.resolve(data.objArray);
      } else if (options.domain === data.notFound) {
        return Promise.resolve(data.emptyArray);
      } else if (options.domain === data.error) {
        return Promise.reject(new Error(data.errorMsg));
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
    spinner = require('../../src/utils/spinner');
    spinnerStart = sinon.stub(spinner, 'start');
    spinnerStop = sinon.stub(spinner, 'stop');

    mockery.registerMock('hibp', hibpMock);
    mockery.registerMock('../utils/logger', loggerMock);
    mockery.registerMock('../utils/spinner', spinner);
    getBreaches = require('../../src/api/getBreaches');
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

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinnerStop.called).to.be(false);
    return getBreaches(data.found, false)
        .then(() => {
          expect(spinnerStop.called).to.be(true);
        });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinnerStop.called).to.be(false);
    return getBreaches(data.found, true)
        .then(() => {
          expect(spinnerStop.called).to.be(false);
        });
  });

  // ////////////////// breachData ////////////////// //

  it('should call logger.log (found && !raw)', () => {
    expect(loggerMock.log.called).to.be(false);
    return getBreaches(data.found, false)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(1);
        });
  });

  it('should call logger.log (found && raw)', () => {
    expect(loggerMock.log.called).to.be(false);
    return getBreaches(data.found, true)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(1);
        });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(loggerMock.log.called).to.be(false);
    return getBreaches(data.notFound, false)
        .then(() => {
          expect(loggerMock.log.callCount).to.be(1);
        });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(loggerMock.log.called).to.be(false);
    return getBreaches(data.notFound, true)
        .then(() => {
          expect(loggerMock.log.called).to.be(false);
        });
  });

  // ////////////////// error ////////////////// //

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinnerStop.called).to.be(false);
    return getBreaches(data.error, false)
        .then(() => {
          expect(spinnerStop.called).to.be(true);
        });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinnerStop.called).to.be(false);
    return getBreaches(data.error, true)
        .then(() => {
          expect(spinnerStop.called).to.be(false);
        });
  });

  it('should call logger.error (error)', () => {
    expect(loggerMock.error.called).to.be(false);
    return getBreaches(data.error, false)
        .then(() => {
          expect(loggerMock.log.called).to.be(false);
          expect(loggerMock.error.called).to.be(true);
        });
  });
});
