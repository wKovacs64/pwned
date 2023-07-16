import { oneLine } from 'common-tags';

export function translateApiError(originalMessage: string): string {
  const errMsg = originalMessage.includes('hibp-api-key')
    ? oneLine`
        Access denied due to invalid or missing API key. Please obtain an API
        key from https://haveibeenpwned.com/API/Key and then run "pwned apiKey
        <key>" to configure pwned.
      `
    : originalMessage;

  return errMsg;
}
