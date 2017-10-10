import getBreachedAccount from '../../src/api/getBreachedAccount';
import ba from '../../src/actions/ba';
import { NONE, NOT_FOUND } from '../testData';

jest.mock('../../src/api/getBreachedAccount', () => jest.fn());

describe('action: ba', () => {
  it('should call command help when passed an empty string', () => {
    const help = jest.fn();
    ba(NONE, { help });
    expect(help).toHaveBeenCalledTimes(1);
  });

  it('should call getBreachedAccount when passed a non-empty string', () => {
    ba(NOT_FOUND, {});
    expect(getBreachedAccount).toHaveBeenCalledTimes(1);
  });
});
