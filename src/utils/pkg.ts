import fs from 'fs';
import path from 'path';
import url from 'url';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const pkg = JSON.parse(
  fs.readFileSync(path.join(dirname, '..', '..', 'package.json'), 'utf8'),
);
