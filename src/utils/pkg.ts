import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import type { PackageJson } from 'type-fest';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const pkg = JSON.parse(
  fs.readFileSync(path.join(dirname, '..', '..', 'package.json'), 'utf8'),
) as PackageJson;
