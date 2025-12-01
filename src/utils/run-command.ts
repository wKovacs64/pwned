import prettyjson from 'prettyjson';
import { logger } from './logger.js';
import { spinner } from './spinner.js';
import { translateApiError } from './translate-api-error.js';

/**
 * Shared handler for commands that fetch and display data. Handles spinner, raw JSON output,
 * prettyjson formatting, and errors.
 */
export async function runCommand<T>({
  raw,
  fetchData,
  hasData,
  noDataMessage,
}: {
  raw: boolean;
  fetchData: () => Promise<T>;
  hasData: (data: T) => boolean;
  noDataMessage?: string;
}): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const data = await fetchData();
    if (hasData(data)) {
      if (raw) {
        logger.log(JSON.stringify(data));
      } else {
        spinner.stop();
        logger.log(prettyjson.render(data));
      }
    } else if (!raw && noDataMessage) {
      spinner.succeed(noDataMessage);
    }
  } catch (maybeError) {
    /* v8 ignore else -- @preserve */
    if (maybeError instanceof Error) {
      const msg = translateApiError(maybeError.message);
      if (!raw) {
        spinner.fail(msg);
      } else {
        logger.error(msg);
      }
    }
  }
}
