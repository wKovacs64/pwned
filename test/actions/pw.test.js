import getPwnedPassword from '../../src/api/getPwnedPassword';
import pw from '../../src/actions/pw';
import { NONE, NOT_FOUND } from '../testData';

jest.mock('../../src/api/getPwnedPassword', () => jest.fn());

describe('action: pw', () => {
  it('should call command help when passed an empty string', () => {
    const help = jest.fn();
    pw(NONE, { help });
    expect(help).toHaveBeenCalledTimes(1);
  });

  it('should call getPwnedPassword when passed a non-empty string', () => {
    pw(NOT_FOUND, {});
    expect(getPwnedPassword).toHaveBeenCalledTimes(1);
  });
});
