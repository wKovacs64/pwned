import { http } from 'msw';
import {
  FOUND,
  BREACH,
  BREACHES,
  BREACHED_DOMAIN,
  DATA_CLASSES,
  PASTES,
  PASSWORD_HASHES,
  SUBSCRIBED_DOMAINS,
  SUBSCRIPTION_STATUS,
  EMPTY_ARRAY,
} from './fixtures.js';

export const handlers = [
  http.get('*/breachedaccount/:account', ({ params }) => {
    const { account } = params;
    if (account === FOUND) {
      return new Response(JSON.stringify(BREACHES));
    }
    return new Response(null, { status: 404 });
  }),
  http.get('*/pasteaccount/:account', ({ params }) => {
    const { account } = params;
    if (account === FOUND) {
      return new Response(JSON.stringify(PASTES));
    }
    return new Response(null, { status: 404 });
  }),
  http.get('*/breach/:breachName', ({ params }) => {
    const { breachName } = params;
    if (breachName === FOUND) {
      return new Response(JSON.stringify(BREACH));
    }
    return new Response(null, { status: 404 });
  }),
  http.get('*/breaches', ({ request }) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain');
    if (!domain || domain === FOUND) {
      return new Response(JSON.stringify(BREACHES));
    }
    return new Response(JSON.stringify(EMPTY_ARRAY));
  }),
  http.get('*/dataclasses', () => {
    return new Response(JSON.stringify(DATA_CLASSES));
  }),
  http.get('*/range/:suffix', () => {
    return new Response(PASSWORD_HASHES);
  }),
  http.get('*/subscription/status', () => {
    return new Response(JSON.stringify(SUBSCRIPTION_STATUS));
  }),
  http.get('*/latestbreach', () => {
    return new Response(JSON.stringify(BREACH));
  }),
  http.get('*/breacheddomain/:domain', ({ params }) => {
    const { domain } = params;
    if (domain === FOUND) {
      return new Response(JSON.stringify(BREACHED_DOMAIN));
    }
    return new Response(null, { status: 404 });
  }),
  http.get('*/subscribeddomains', () => {
    return new Response(JSON.stringify(SUBSCRIBED_DOMAINS));
  }),
];
