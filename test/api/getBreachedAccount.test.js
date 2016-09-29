import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import { data } from '../setup';

describe('api: getBreachedAccount', () => {
  const hibpMock = {
    breachedAccount: (account) => {
      if (account === data.found) {
        return Promise.resolve(data.obj);
      } else if (account === data.notFound) {
        return Promise.resolve(null);
      } else if (account === data.error) {
        return Promise.reject(new Error(data.errorMsg));
      }
    },
  };

  let getBreachedAccount;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../utils/logger', logger);
    mockery.registerMock('../utils/spinner', spinner);
    mockery.registerMock('hibp', hibpMock);
    getBreachedAccount = require('../../src/api/getBreachedAccount');
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
    getBreachedAccount(data.notFound, data.none, false, false);
    expect(spinner.start.called).to.be(true);
    done();
  });

  it('should not call spinner.start (raw)', (done) => {
    getBreachedAccount(data.notFound, data.none, false, true);
    expect(spinner.start.called).to.be(false);
    done();
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop.called).to.be(false);
    return getBreachedAccount(data.notFound, data.none, false, false)
      .then(() => {
        expect(spinner.stop.called).to.be(true);
      });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop.called).to.be(false);
    return getBreachedAccount(data.notFound, data.none, false, true)
      .then(() => {
        expect(spinner.stop.called).to.be(false);
      });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log.called).to.be(false);
    return getBreachedAccount(data.found, data.none, false, false)
      .then(() => {
        expect(logger.log.callCount).to.be(1);
      });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log.called).to.be(false);
    return getBreachedAccount(data.found, data.none, false, true)
      .then(() => {
        expect(logger.log.callCount).to.be(1);
      });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log.called).to.be(false);
    return getBreachedAccount(data.notFound, data.none, false, false)
      .then(() => {
        expect(logger.log.callCount).to.be(1);
      });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log.called).to.be(false);
    return getBreachedAccount(data.notFound, data.none, false, true)
      .then(() => {
        expect(logger.log.called).to.be(false);
      });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop.called).to.be(false);
    return getBreachedAccount(data.error, data.none, false, false)
      .then(() => {
        expect(spinner.stop.called).to.be(true);
      });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop.called).to.be(false);
    return getBreachedAccount(data.error, data.none, false, true)
      .then(() => {
        expect(spinner.stop.called).to.be(false);
      });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error.called).to.be(false);
    return getBreachedAccount(data.error, data.none, false, false)
      .then(() => {
        expect(logger.log.called).to.be(false);
        expect(logger.error.called).to.be(true);
      });
  });
});
