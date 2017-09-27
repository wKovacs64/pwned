import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import { OBJ_ARRAY, EMPTY_ARRAY, ERROR_MSG } from '../testData';

describe('api: getDataClasses', () => {
  const hibpMockFound = {
    dataClasses: () => Promise.resolve(OBJ_ARRAY),
  };

  const hibpMockNotFound = {
    dataClasses: () => Promise.resolve(EMPTY_ARRAY),
  };

  const hibpMockError = {
    dataClasses: () => Promise.reject(new Error(ERROR_MSG)),
  };

  let getDataClasses;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });
    mockery.registerMock('../utils/logger', logger);
    mockery.registerMock('../utils/spinner', spinner);
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

  describe('found', () => {
    before(() => {
      mockery.resetCache();
      mockery.registerMock('hibp', hibpMockFound);
      getDataClasses = require('../../src/api/getDataClasses');
    });

    after(() => {
      mockery.deregisterMock('hibp');
    });

    it('should call spinner.start (found && !raw)', (done) => {
      getDataClasses(false);
      expect(spinner.start.called).to.be.true;
      done();
    });

    it('should not call spinner.start (found && raw)', (done) => {
      getDataClasses(true);
      expect(spinner.start.called).to.be.false;
      done();
    });

    it('should call spinner.stop (found && !raw)', () => {
      expect(spinner.stop.called).to.be.false;
      return getDataClasses(false).then(() => {
        expect(spinner.stop.called).to.be.true;
      });
    });

    it('should not call spinner.stop (found && raw)', () => {
      expect(spinner.stop.called).to.be.false;
      return getDataClasses(true).then(() => {
        expect(spinner.stop.called).to.be.false;
      });
    });

    it('should call logger.log (found && !raw)', () => {
      expect(logger.log.called).to.be.false;
      return getDataClasses(false).then(() => {
        expect(logger.log.callCount).to.equal(1);
      });
    });

    it('should call logger.log (found && raw)', () => {
      expect(logger.log.called).to.be.false;
      return getDataClasses(true).then(() => {
        expect(logger.log.callCount).to.equal(1);
      });
    });
  });

  describe('not found', () => {
    before(() => {
      mockery.resetCache();
      mockery.registerMock('hibp', hibpMockNotFound);
      getDataClasses = require('../../src/api/getDataClasses');
    });

    after(() => {
      mockery.deregisterMock('hibp');
    });

    it('should call spinner.start (notFound && !raw)', (done) => {
      getDataClasses(false);
      expect(spinner.start.called).to.be.true;
      done();
    });

    it('should not call spinner.start (notFound && raw)', (done) => {
      getDataClasses(true);
      expect(spinner.start.called).to.be.false;
      done();
    });

    it('should call spinner.stop (notFound && !raw)', () => {
      expect(spinner.stop.called).to.be.false;
      return getDataClasses(false).then(() => {
        expect(spinner.stop.called).to.be.true;
      });
    });

    it('should not call spinner.stop (notFound && raw)', () => {
      expect(spinner.stop.called).to.be.false;
      return getDataClasses(true).then(() => {
        expect(spinner.stop.called).to.be.false;
      });
    });

    it('should call logger.log (notFound && !raw)', () => {
      expect(logger.log.called).to.be.false;
      return getDataClasses(false).then(() => {
        expect(logger.log.callCount).to.equal(1);
      });
    });

    it('should not call logger.log (notFound && raw)', () => {
      expect(logger.log.called).to.be.false;
      return getDataClasses(true).then(() => {
        expect(logger.log.called).to.be.false;
      });
    });
  });

  describe('error', () => {
    before(() => {
      mockery.resetCache();
      mockery.registerMock('hibp', hibpMockError);
      getDataClasses = require('../../src/api/getDataClasses');
    });

    after(() => {
      mockery.deregisterMock('hibp');
    });

    it('should call spinner.start (error && !raw)', (done) => {
      getDataClasses(false);
      expect(spinner.start.called).to.be.true;
      done();
    });

    it('should not call spinner.start (error && raw)', (done) => {
      getDataClasses(true);
      expect(spinner.start.called).to.be.false;
      done();
    });

    it('should call spinner.stop (error && !raw)', () => {
      expect(spinner.stop.called).to.be.false;
      return getDataClasses(false).then(() => {
        expect(spinner.stop.called).to.be.true;
      });
    });

    it('should not call spinner.stop (error && raw)', () => {
      expect(spinner.stop.called).to.be.false;
      return getDataClasses(true).then(() => {
        expect(spinner.stop.called).to.be.false;
      });
    });

    it('should call logger.error (error)', () => {
      expect(logger.error.called).to.be.false;
      return getDataClasses(false).then(() => {
        expect(logger.log.called).to.be.false;
        expect(logger.error.called).to.be.true;
      });
    });
  });
});
