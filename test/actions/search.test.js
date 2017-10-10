import getSearch from '../../src/api/getSearch';
import search from '../../src/actions/search';
import { NONE, NOT_FOUND } from '../testData';

jest.mock('../../src/api/getSearch', () => jest.fn());

describe('action: search', () => {
  it('should call command help when passed an empty string', () => {
    const help = jest.fn();
    search(NONE, { help });
    expect(help).toHaveBeenCalledTimes(1);
  });

  it('should call search when passed a non-empty string', () => {
    search(NOT_FOUND, {});
    expect(getSearch).toHaveBeenCalledTimes(1);
  });
});
