import getDataClasses from '../../src/api/getDataClasses';
import dc from '../../src/actions/dc';

jest.mock('../../src/api/getDataClasses', () => jest.fn());

describe('action: dc', () => {
  it('should call getDataClasses', () => {
    dc({});
    expect(getDataClasses.mock.calls.length).toBe(1);
  });
});
