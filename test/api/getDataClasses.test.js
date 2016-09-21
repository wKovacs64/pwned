import expect from 'expect.js';
import mockery from 'mockery';
import sinon from 'sinon';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import {data} from '../setup';

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

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
    mockery.registerMock('../utils/logger', logger);
    mockery.registerMock('../utils/spinner', spinner);
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
      expect(spinner.start.called).to.be(true);
      done();
    });

    it('should not call spinner.start (found && raw)', (done) => {
      getDataClasses(true);
      expect(spinner.start.called).to.be(false);
      done();
    });

    it('should call spinner.stop (found && !raw)', () => {
      expect(spinner.stop.called).to.be(false);
      return getDataClasses(false)
          .then(() => {
            expect(spinner.stop.called).to.be(true);
          });
    });

    it('should not call spinner.stop (found && raw)', () => {
      expect(spinner.stop.called).to.be(false);
      return getDataClasses(true)
          .then(() => {
            expect(spinner.stop.called).to.be(false);
          });
    });

    it('should call logger.log (found && !raw)', () => {
      expect(logger.log.called).to.be(false);
      return getDataClasses(false)
          .then(() => {
            expect(logger.log.callCount).to.be(1);
          });
    });

    it('should call logger.log (found && raw)', () => {
      expect(logger.log.called).to.be(false);
      return getDataClasses(true)
          .then(() => {
            expect(logger.log.callCount).to.be(1);
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
      expect(spinner.start.called).to.be(true);
      done();
    });

    it('should not call spinner.start (notFound && raw)', (done) => {
      getDataClasses(true);
      expect(spinner.start.called).to.be(false);
      done();
    });

    it('should call spinner.stop (notFound && !raw)', () => {
      expect(spinner.stop.called).to.be(false);
      return getDataClasses(false)
          .then(() => {
            expect(spinner.stop.called).to.be(true);
          });
    });

    it('should not call spinner.stop (notFound && raw)', () => {
      expect(spinner.stop.called).to.be(false);
      return getDataClasses(true)
          .then(() => {
            expect(spinner.stop.called).to.be(false);
          });
    });

    it('should call logger.log (notFound && !raw)', () => {
      expect(logger.log.called).to.be(false);
      return getDataClasses(false)
          .then(() => {
            expect(logger.log.callCount).to.be(1);
          });
    });

    it('should not call logger.log (notFound && raw)', () => {
      expect(logger.log.called).to.be(false);
      return getDataClasses(true)
          .then(() => {
            expect(logger.log.called).to.be(false);
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
      expect(spinner.start.called).to.be(true);
      done();
    });

    it('should not call spinner.start (error && raw)', (done) => {
      getDataClasses(true);
      expect(spinner.start.called).to.be(false);
      done();
    });

    it('should call spinner.stop (error && !raw)', () => {
      expect(spinner.stop.called).to.be(false);
      return getDataClasses(false)
          .then(() => {
            expect(spinner.stop.called).to.be(true);
          });
    });

    it('should not call spinner.stop (error && raw)', () => {
      expect(spinner.stop.called).to.be(false);
      return getDataClasses(true)
          .then(() => {
            expect(spinner.stop.called).to.be(false);
          });
    });

    it('should call logger.error (error)', () => {
      expect(logger.error.called).to.be(false);
      return getDataClasses(false)
          .then(() => {
            expect(logger.log.called).to.be(false);
            expect(logger.error.called).to.be(true);
          });
    });
  });
});
