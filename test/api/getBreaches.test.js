import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import {
  FOUND,
  OBJ_ARRAY,
  NOT_FOUND,
  EMPTY_ARRAY,
  ERROR,
  ERROR_MSG,
} from '../testData';

describe('api: getBreaches', () => {
  const hibpMock = {
    breaches: (options = {}) => {
      if (options.domain === FOUND) {
        return Promise.resolve(OBJ_ARRAY);
      } else if (options.domain === NOT_FOUND) {
        return Promise.resolve(EMPTY_ARRAY);
      } else if (options.domain === ERROR) {
        return Promise.reject(new Error(ERROR_MSG));
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
    getBreaches(FOUND, false);
    expect(spinner.start.called).to.be.true;
    done();
  });

  it('should not call spinner.start (raw)', (done) => {
    getBreaches(FOUND, true);
    expect(spinner.start.called).to.be.false;
    done();
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getBreaches(FOUND, false)
      .then(() => {
        expect(spinner.stop.called).to.be.true;
      });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getBreaches(FOUND, true)
      .then(() => {
        expect(spinner.stop.called).to.be.false;
      });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log.called).to.be.false;
    return getBreaches(FOUND, false)
      .then(() => {
        expect(logger.log.callCount).to.equal(1);
      });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log.called).to.be.false;
    return getBreaches(FOUND, true)
      .then(() => {
        expect(logger.log.callCount).to.equal(1);
      });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log.called).to.be.false;
    return getBreaches(NOT_FOUND, false)
      .then(() => {
        expect(logger.log.callCount).to.equal(1);
      });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log.called).to.be.false;
    return getBreaches(NOT_FOUND, true)
      .then(() => {
        expect(logger.log.called).to.be.false;
      });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getBreaches(ERROR, false)
      .then(() => {
        expect(spinner.stop.called).to.be.true;
      });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop.called).to.be.false;
    return getBreaches(ERROR, true)
      .then(() => {
        expect(spinner.stop.called).to.be.false;
      });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error.called).to.be.false;
    return getBreaches(ERROR, false)
      .then(() => {
        expect(logger.log.called).to.be.false;
        expect(logger.error.called).to.be.true;
      });
  });
});
