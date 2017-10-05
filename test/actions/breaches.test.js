import getBreaches from '../../src/api/getBreaches';
import breaches from '../../src/actions/breaches';

jest.mock('../../src/api/getBreaches', () => jest.fn());

describe('action: breaches', () => {
  it('should call getBreaches', () => {
    breaches({});
    expect(getBreaches.mock.calls.length).toBe(1);
  });
});
