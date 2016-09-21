import expect from 'expect.js';
import spinner from '../../src/utils/spinner';

describe('util: spinner', () => {
  it('should return an object', (done) => {
    expect(spinner).to.be.an('object');
    done();
  });

  it('should have a "start" function', (done) => {
    expect(spinner).to.have.property('start');
    expect(spinner.start).to.be.a('function');
    done();
  });

  it('should have a "stop" function', (done) => {
    expect(spinner).to.have.property('stop');
    expect(spinner.stop).to.be.a('function');
    done();
  });
});
