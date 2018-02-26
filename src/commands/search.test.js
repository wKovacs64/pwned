import * as hibp from 'hibp';
import {
  FOUND,
  OBJ,
  NOT_FOUND,
  ERROR,
  ERROR_MSG,
  NONE,
} from '../../test/fixtures';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as search } from './search';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: search', () => {
  beforeAll(() => {
    hibp.search.mockImplementation(async account => {
      if (account === FOUND) {
        return { breaches: OBJ, pastes: null };
      } else if (account === NOT_FOUND) {
        return { breaches: null, pastes: null };
      } else if (account === ERROR) {
        throw new Error(ERROR_MSG);
      }
      throw new Error('Unexpected input!');
    });
  });

  it('should call spinner.start (!raw)', async () => {
    expect(spinner.start).toHaveBeenCalledTimes(0);
    await search({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    });
    expect(spinner.start).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.start (raw)', async () => {
    await search({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    });
    expect(spinner.start).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (non-error results, !raw)', async () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    await search({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    });
    expect(spinner.stop).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.stop (non-error results, raw)', async () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    await search({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    });
    expect(spinner.stop).toHaveBeenCalledTimes(0);
  });

  it('should call logger.log (found && !raw)', async () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    await search({
      account: FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    });
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('should call logger.log (found && raw)', async () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    await search({
      account: FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    });
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('should call logger.log (notFound && !raw)', async () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    await search({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    });
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('should not call logger.log (notFound && raw)', async () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    await search({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    });
    expect(logger.log).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (error && !raw)', async () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    await search({
      account: ERROR,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    });
    expect(spinner.stop).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.stop (error && raw)', async () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    await search({
      account: ERROR,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    });
    expect(spinner.stop).toHaveBeenCalledTimes(0);
  });

  it('should call logger.error (error)', async () => {
    expect(logger.error).toHaveBeenCalledTimes(0);
    await search({
      account: ERROR,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    });
    expect(logger.log).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
