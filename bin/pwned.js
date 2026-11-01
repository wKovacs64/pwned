#!/usr/bin/env node
import sourceMapSupport from "source-map-support";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as apiKey from "../lib/commands/api-key.js";
import * as ba from "../lib/commands/ba.js";
import * as bar from "../lib/commands/bar.js";
import * as bd from "../lib/commands/bd.js";
import * as breach from "../lib/commands/breach.js";
import * as breaches from "../lib/commands/breaches.js";
import * as dc from "../lib/commands/dc.js";
import * as dcd from "../lib/commands/dcd.js";
import * as gdt from "../lib/commands/gdt.js";
import * as lb from "../lib/commands/lb.js";
import * as pa from "../lib/commands/pa.js";
import * as pw from "../lib/commands/pw.js";
import * as sd from "../lib/commands/sd.js";
import * as se from "../lib/commands/se.js";
import * as search from "../lib/commands/search.js";
import * as slbe from "../lib/commands/slbe.js";
import * as slbed from "../lib/commands/slbed.js";
import * as slbwd from "../lib/commands/slbwd.js";
import * as subStatus from "../lib/commands/sub-status.js";
import * as vdt from "../lib/commands/vdt.js";
import { pkg } from "../lib/utils/pkg.js";

sourceMapSupport.install();

void yargs(hideBin(process.argv))
  .command(apiKey)
  .command(ba)
  .command(bar)
  .command(bd)
  .command(breach)
  .command(breaches)
  .command(dc)
  .command(dcd)
  .command(gdt)
  .command(lb)
  .command(pa)
  .command(pw)
  .command(sd)
  .command(se)
  .command(search)
  .command(slbe)
  .command(slbed)
  .command(slbwd)
  .command(subStatus)
  .command(vdt)
  .demandCommand()
  .recommendCommands()
  .strict()
  .wrap(Math.min(100, yargs().terminalWidth()))
  .version(pkg.version)
  .alias("h", "help")
  .alias("v", "version").argv;
