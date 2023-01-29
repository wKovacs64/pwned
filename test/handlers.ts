import { rest } from 'msw';
import {
  FOUND,
  BREACH,
  BREACHES,
  DATA_CLASSES,
  PASTES,
  PASSWORD_HASHES,
  EMPTY_ARRAY,
} from './fixtures.js';

export const handlers = [
  rest.get('*/breachedaccount/:account', (req, res, ctx) => {
    const { account } = req.params;
    return res(account === FOUND ? ctx.json(BREACHES) : ctx.status(404));
  }),
  rest.get('*/pasteaccount/:account', (req, res, ctx) => {
    const { account } = req.params;
    return res(account === FOUND ? ctx.json(PASTES) : ctx.status(404));
  }),
  rest.get('*/breach/:breachName', (req, res, ctx) => {
    const { breachName } = req.params;
    return res(breachName === FOUND ? ctx.json(BREACH) : ctx.status(404));
  }),
  rest.get('*/breaches', (req, res, ctx) => {
    const domain = req.url.searchParams.get('domain');
    return res(ctx.json(!domain || domain === FOUND ? BREACHES : EMPTY_ARRAY));
  }),
  rest.get('*/dataclasses', (_, res, ctx) => res(ctx.json(DATA_CLASSES))),
  rest.get('*/range/:suffix', (_, res, ctx) => res(ctx.text(PASSWORD_HASHES))),
];
