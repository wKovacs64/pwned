import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const parsedPackage: unknown = JSON.parse(
  fs.readFileSync(path.join(dirname, "..", "..", "package.json"), "utf8"),
);

if (
  typeof parsedPackage !== "object" ||
  parsedPackage === null ||
  !("name" in parsedPackage) ||
  typeof parsedPackage.name !== "string" ||
  !("version" in parsedPackage) ||
  typeof parsedPackage.version !== "string"
) {
  throw new TypeError("Invalid package.json");
}

export const pkg = {
  name: parsedPackage.name,
  version: parsedPackage.version,
};
