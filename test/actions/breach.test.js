import getBreach from '../../src/api/getBreach';
import breach from '../../src/actions/breach';
import { NONE, NOT_FOUND } from '../testData';

jest.mock('../../src/api/getBreach', () => jest.fn());

describe('action: breach', () => {
  it('should call command help when passed an empty string', () => {
    const help = jest.fn();
    breach(NONE, { help });
    expect(help).toHaveBeenCalledTimes(1);
  });

  it('should call getBreach when passed a non-empty string', () => {
    breach(NOT_FOUND, {});
    expect(getBreach).toHaveBeenCalledTimes(1);
  });
});
