import { expect } from 'chai';
import sinon from 'sinon';
import logger from '../../src/utils/logger';
import { data } from '../setup';

/**
 * WARNING:
 *
 * Test output is lost temporarily while console functions are stubbed, so check
 * here first if tests fail and there's no output containing the failed
 * assertion.
 */

describe('util: logger', () => {
  it('should return an object', (done) => {
    expect(logger).to.be.an('object');
    done();
  });

  it('should have an "error" function which calls console.error', (done) => {
    expect(logger).to.have.property('error');
    expect(logger.error).to.be.a('function');
    sinon.stub(console, 'error');
    expect(console.error.called).to.be.false;
    logger.error(data.message, data.obj);
    expect(console.error.called).to.be.true;
    console.error.restore();
    done();
  });

  it('should have an "info" function which calls console.info', (done) => {
    expect(logger).to.have.property('info');
    expect(logger.info).to.be.a('function');
    sinon.stub(console, 'info');
    expect(console.info.called).to.be.false;
    logger.info(data.message, data.obj);
    expect(console.info.called).to.be.true;
    console.info.restore();
    done();
  });

  it('should have a "log" function which calls console.log', (done) => {
    expect(logger).to.have.property('log');
    expect(logger.log).to.be.a('function');
    sinon.stub(console, 'log');
    expect(console.log.called).to.be.false;
    logger.log(data.message, data.obj);
    expect(console.log.called).to.be.true;
    console.log.restore();
    done();
  });

  it('should have a "warn" function which calls console.warn', (done) => {
    expect(logger).to.have.property('warn');
    expect(logger.warn).to.be.a('function');
    sinon.stub(console, 'warn');
    expect(console.warn.called).to.be.false;
    logger.warn(data.message, data.obj);
    expect(console.warn.called).to.be.true;
    console.warn.restore();
    done();
  });
});
