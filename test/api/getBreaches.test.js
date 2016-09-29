import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import { data } from '../setup';

describe('api: getBreaches', () => {
  const hibpMock = {
    breaches: (options = {}) => {
      if (options.domain === data.found) {
        return Promise.resolve(data.objArray);
      } else if (options.domain === data.notFound) {
        return Promise.resolve(data.emptyArray);
      } else if (options.domain === data.error) {
        return Promise.reject(new Error(data.errorMsg));
      }
    },
  };

  let getBreaches;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../utils/logger', logger);
    mockery.registerMock('../utils/spinner', spinner);
    mockery.registerMock('hibp', hibpMock);
    getBreaches = require('../../src/api/getBreaches');
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  beforeEach(() => {
    sinon.stub(logger, 'log');
    sinon.stub(logger, 'error');
    sinon.stub(spinner, 'start');
    sinon.stub(spinner, 'stop');
  });

  afterEach(() => {
    logger.log.restore();
    logger.error.restore();
    spinner.start.restore();
    spinner.stop.restore();
  });

  it('should call spinner.start (!raw)', (done) => {
    getBreaches(data.found, false);
    expect(spinner.start.called).to.be(true);
    done();
  });

  it('should not call spinner.start (raw)', (done) => {
    getBreaches(data.found, true);
    expect(spinner.start.called).to.be(false);
    done();
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop.called).to.be(false);
    return getBreaches(data.found, false)
      .then(() => {
        expect(spinner.stop.called).to.be(true);
      });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop.called).to.be(false);
    return getBreaches(data.found, true)
      .then(() => {
        expect(spinner.stop.called).to.be(false);
      });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log.called).to.be(false);
    return getBreaches(data.found, false)
      .then(() => {
        expect(logger.log.callCount).to.be(1);
      });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log.called).to.be(false);
    return getBreaches(data.found, true)
      .then(() => {
        expect(logger.log.callCount).to.be(1);
      });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log.called).to.be(false);
    return getBreaches(data.notFound, false)
      .then(() => {
        expect(logger.log.callCount).to.be(1);
      });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log.called).to.be(false);
    return getBreaches(data.notFound, true)
      .then(() => {
        expect(logger.log.called).to.be(false);
      });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop.called).to.be(false);
    return getBreaches(data.error, false)
      .then(() => {
        expect(spinner.stop.called).to.be(true);
      });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop.called).to.be(false);
    return getBreaches(data.error, true)
      .then(() => {
        expect(spinner.stop.called).to.be(false);
      });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error.called).to.be(false);
    return getBreaches(data.error, false)
      .then(() => {
        expect(logger.log.called).to.be(false);
        expect(logger.error.called).to.be(true);
      });
  });
});
