import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import { FOUND, OBJ_ARRAY, NOT_FOUND, ERROR, ERROR_MSG } from '../testData';

describe('api: getPastes', () => {
  const hibpMock = {
    pasteAccount: (email) => {
      if (email === FOUND) {
        return Promise.resolve(OBJ_ARRAY);
      } else if (email === NOT_FOUND) {
        return Promise.resolve(null);
      } else if (email === ERROR) {
        return Promise.reject(new Error(ERROR_MSG));
      }
    },
  };

  let getPastes;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../utils/logger', logger);
    mockery.registerMock('../utils/spinner', spinner);
    mockery.registerMock('hibp', hibpMock);
    getPastes = require('../../src/api/getPastes');
    sinon.stub(logger, 'log');
    sinon.stub(logger, 'error');
    sinon.stub(spinner, 'start');
    sinon.stub(spinner, 'stop');
  });

  after(() => {
    logger.log.restore();
    logger.error.restore();
    spinner.start.restore();
    spinner.stop.restore();
    mockery.deregisterAll();
    mockery.disable();
  });

  afterEach(() => {
    logger.log.reset();
    logger.error.reset();
    spinner.start.reset();
    spinner.stop.reset();
  });

  it('should call spinner.start (!raw)', (done) => {
    getPastes(FOUND, false);
    expect(spinner.start.called).to.be.true;
    done();
  });

  it('should not call spinner.start (raw)', (done) => {
    getPastes(FOUND, true);
    expect(spinner.start.called).to.be.false;
    done();
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getPastes(FOUND, false).then(() => {
      expect(spinner.stop.called).to.be.true;
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getPastes(FOUND, true).then(() => {
      expect(spinner.stop.called).to.be.false;
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log.called).to.be.false;
    return getPastes(FOUND, false).then(() => {
      expect(logger.log.callCount).to.equal(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log.called).to.be.false;
    return getPastes(FOUND, true).then(() => {
      expect(logger.log.callCount).to.equal(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log.called).to.be.false;
    return getPastes(NOT_FOUND, false).then(() => {
      expect(logger.log.callCount).to.equal(1);
    });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log.called).to.be.false;
    return getPastes(NOT_FOUND, true).then(() => {
      expect(logger.log.called).to.be.false;
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getPastes(ERROR, false).then(() => {
      expect(spinner.stop.called).to.be.true;
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getPastes(ERROR, true).then(() => {
      expect(spinner.stop.called).to.be.false;
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error.called).to.be.false;
    return getPastes(ERROR, false).then(() => {
      expect(logger.log.called).to.be.false;
      expect(logger.error.called).to.be.true;
    });
  });
});
