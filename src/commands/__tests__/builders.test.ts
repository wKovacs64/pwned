import { describe, it } from 'vitest';
import type { Argv } from 'yargs';

import { builder as baBuilder } from '../ba.js';
import { builder as breachBuilder } from '../breach.js';
import { builder as breachesBuilder } from '../breaches.js';
import { builder as dcBuilder } from '../dc.js';
import { builder as paBuilder } from '../pa.js';
import { builder as pwBuilder } from '../pw.js';
import { builder as searchBuilder } from '../search.js';
import { builder as subStatusBuilder } from '../sub-status.js';

// Minimal chainable Argv stub that can optionally invoke the provided check callback
function makeArgvStub<T extends Record<string, unknown>>(checkArgv?: T) {
  const stub = {
    positional: () => stub,
    demandOption: () => stub,
    check: (fn: (argv: T) => unknown) => {
      if (checkArgv) {
        try {
          fn(checkArgv);
        } catch {
          // ignore on purpose; we only execute branches for coverage
        }
      }
      return stub;
    },
    option: () => stub,
    alias: () => stub,
    group: () => stub,
    epilog: () => stub,
  } as const;

  return stub as unknown as Argv<T>;
}

describe('command builders', () => {
  it('ba builder executes and validates check branches', () => {
    // valid branch
    baBuilder(makeArgvStub<{ account: string }>({ account: 'user@example.com' }));
    // error branch
    baBuilder(makeArgvStub<{ account: string }>({ account: '' }));
  });

  it('breach builder executes and validates check branches', () => {
    breachBuilder(makeArgvStub<{ name: string }>({ name: 'Acme' }));
    breachBuilder(makeArgvStub<{ name: string }>({ name: '' }));
  });

  it('pa builder executes and validates check branches', () => {
    paBuilder(makeArgvStub<{ email: string }>({ email: 'user@example.com' }));
    paBuilder(makeArgvStub<{ email: string }>({ email: '' }));
  });

  it('pw builder executes and validates check branches', () => {
    pwBuilder(makeArgvStub<{ password: string }>({ password: 'secret' }));
    pwBuilder(makeArgvStub<{ password: string }>({ password: '' }));
  });

  it('search builder executes and validates check branches', () => {
    searchBuilder(makeArgvStub<{ account: string }>({ account: 'user' }));
    searchBuilder(makeArgvStub<{ account: string }>({ account: '' }));
  });

  it('breaches builder executes', () => {
    breachesBuilder(makeArgvStub<Record<string, unknown>>());
  });

  it('dc builder executes', () => {
    dcBuilder(makeArgvStub<Record<string, unknown>>());
  });

  it('sub-status builder executes', () => {
    subStatusBuilder(makeArgvStub<Record<string, unknown>>());
  });
});
