import { setupServer } from 'msw/node';

export const server = setupServer();

// (some tests import msw exports from this file for convenience)
export * from 'msw';
