import getPastes from '../../src/api/getPastes';
import pa from '../../src/actions/pa';
import { NONE, EMAIL } from '../testData';

jest.mock('../../src/api/getPastes', () => jest.fn());

describe('action: pa', () => {
  it('should call command help when passed an empty string', () => {
    const help = jest.fn();
    pa(NONE, { help });
    expect(help).toHaveBeenCalledTimes(1);
  });

  it('should call getPastes when passed a non-empty string', () => {
    pa(EMAIL, {});
    expect(getPastes).toHaveBeenCalledTimes(1);
  });
});
