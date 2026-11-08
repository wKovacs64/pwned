import fs from "node:fs";
import path from "node:path";
import url from "node:url";

interface PackageJson {
  name: string;
  version: string;
}

function isPackageJson(value: unknown): value is PackageJson {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "version" in value &&
    typeof value.version === "string"
  );
}

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const parsedPackage: unknown = JSON.parse(
  fs.readFileSync(path.join(dirname, "..", "..", "package.json"), "utf8"),
);

if (!isPackageJson(parsedPackage)) {
  throw new TypeError("Invalid package.json");
}

export const pkg = {
  name: parsedPackage.name,
  version: parsedPackage.version,
};
