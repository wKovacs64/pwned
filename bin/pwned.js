#!/usr/bin/env node
import sourceMapSupport from 'source-map-support';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import * as apiKey from '../lib/commands/api-key.js';
import * as ba from '../lib/commands/ba.js';
import * as breach from '../lib/commands/breach.js';
import * as breaches from '../lib/commands/breaches.js';
import * as dc from '../lib/commands/dc.js';
import * as lb from '../lib/commands/lb.js';
import * as pa from '../lib/commands/pa.js';
import * as pw from '../lib/commands/pw.js';
import * as search from '../lib/commands/search.js';
import * as subStatus from '../lib/commands/sub-status.js';

sourceMapSupport.install();

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
  .command(apiKey)
  .command(ba)
  .command(breach)
  .command(breaches)
  .command(dc)
  .command(lb)
  .command(pa)
  .command(pw)
  .command(search)
  .command(subStatus)
  .demandCommand()
  .recommendCommands()
  .strict()
  .wrap(Math.min(100, yargs().terminalWidth()))
  .alias('h', 'help')
  .alias('v', 'version').argv;
