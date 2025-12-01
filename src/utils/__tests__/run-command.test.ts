import { describe, expect, it, vi, type MockInstance } from 'vitest';
import { logger as mockLogger, type Logger } from '../logger.js';
import { spinner as mockSpinner } from '../spinner.js';
import { runCommand } from '../run-command.js';

vi.mock('../logger');
vi.mock('../spinner');

const logger = mockLogger as Logger & Record<string, MockInstance>;
const spinner = mockSpinner as typeof mockSpinner & Record<string, MockInstance>;

describe('runCommand', () => {
  describe('normal output (raw: false)', () => {
    it('starts spinner', async () => {
      await runCommand({
        raw: false,
        fetchData: async () => null,
        hasData: () => false,
        noDataMessage: 'No data',
      });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('with data: stops spinner and logs prettyjson', async () => {
      await runCommand({
        raw: false,
        fetchData: async () => ({ foo: 'bar' }),
        hasData: () => true,
      });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: shows success message', async () => {
      await runCommand({
        raw: false,
        fetchData: async () => null,
        hasData: () => false,
        noDataMessage: 'Nothing found!',
      });
      expect(spinner.succeed).toHaveBeenCalledWith('Nothing found!');
    });

    it('on error: fails spinner with message', async () => {
      await runCommand({
        raw: false,
        fetchData: async () => {
          throw new Error('API error');
        },
        hasData: () => false,
      });
      expect(spinner.fail).toHaveBeenCalledWith('API error');
    });
  });

  describe('raw output (raw: true)', () => {
    it('does not start spinner', async () => {
      await runCommand({
        raw: true,
        fetchData: async () => null,
        hasData: () => false,
      });
      expect(spinner.start).not.toHaveBeenCalled();
    });

    it('with data: logs JSON', async () => {
      await runCommand({
        raw: true,
        fetchData: async () => ({ foo: 'bar' }),
        hasData: () => true,
      });
      expect(logger.log).toHaveBeenCalledWith('{"foo":"bar"}');
    });

    it('without data: does nothing', async () => {
      await runCommand({
        raw: true,
        fetchData: async () => null,
        hasData: () => false,
        noDataMessage: 'Nothing found!',
      });
      expect(spinner.succeed).not.toHaveBeenCalled();
      expect(logger.log).not.toHaveBeenCalled();
    });

    it('on error: logs to stderr', async () => {
      await runCommand({
        raw: true,
        fetchData: async () => {
          throw new Error('API error');
        },
        hasData: () => false,
      });
      expect(logger.error).toHaveBeenCalledWith('API error');
    });
  });
});
