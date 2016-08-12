import expect from 'expect.js';
import spinner from '../../lib/utils/spinner';

describe('util: spinner', () => {
  it('should return an object with start and stop functions', (done) => {
    expect(spinner).to.be.an('object');
    expect(spinner).to.have.property('start');
    expect(spinner.start).to.be.a('function');
    expect(spinner).to.have.property('stop');
    expect(spinner.stop).to.be.a('function');
    done();
  });
});
