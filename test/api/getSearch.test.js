import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import { FOUND, OBJ, NOT_FOUND, ERROR, ERROR_MSG, NONE } from '../testData';

describe('api: getSearch', () => {
  const hibpMock = {
    search: (account) => {
      if (account === FOUND) {
        return Promise.resolve({ breaches: OBJ, pastes: null });
      } else if (account === NOT_FOUND) {
        return Promise.resolve({ breaches: null, pastes: null });
      } else if (account === ERROR) {
        return Promise.reject(new Error(ERROR_MSG));
      }
    },
  };

  let getSearch;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../utils/logger', logger);
    mockery.registerMock('../utils/spinner', spinner);
    mockery.registerMock('hibp', hibpMock);
    getSearch = require('../../src/api/getSearch');
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
    getSearch(NOT_FOUND, NONE, false, false);
    expect(spinner.start.called).to.be.true;
    done();
  });

  it('should not call spinner.start (raw)', (done) => {
    getSearch(NOT_FOUND, NONE, false, true);
    expect(spinner.start.called).to.be.false;
    done();
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getSearch(NOT_FOUND, NONE, false, false).then(() => {
      expect(spinner.stop.called).to.be.true;
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getSearch(NOT_FOUND, NONE, false, true).then(() => {
      expect(spinner.stop.called).to.be.false;
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log.called).to.be.false;
    return getSearch(FOUND, NONE, false, false).then(() => {
      expect(logger.log.callCount).to.equal(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log.called).to.be.false;
    return getSearch(FOUND, NONE, false, true).then(() => {
      expect(logger.log.callCount).to.equal(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log.called).to.be.false;
    return getSearch(NOT_FOUND, NONE, false, false).then(() => {
      expect(logger.log.callCount).to.equal(1);
    });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log.called).to.be.false;
    return getSearch(NOT_FOUND, NONE, false, true).then(() => {
      expect(logger.log.called).to.be.false;
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getSearch(ERROR, NONE, false, false).then(() => {
      expect(spinner.stop.called).to.be.true;
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getSearch(ERROR, NONE, false, true).then(() => {
      expect(spinner.stop.called).to.be.false;
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error.called).to.be.false;
    return getSearch(ERROR, NONE, false, false).then(() => {
      expect(logger.log.called).to.be.false;
      expect(logger.error.called).to.be.true;
    });
  });
});
