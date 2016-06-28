# Releasing

1. Update the version in `package.json` to a non-dev version in the `develop`
   branch.

        # Patch
        semver.inc('1.0.1-dev.0', 'patch') # 1.0.1

        # Minor
        semver.inc('1.0.1-dev.0', 'minor') # 1.1.0

        # Major
        semver.inc('1.0.1-dev.0', 'major') # 2.0.0

2. Update the `CHANGELOG.md` for the impending release.
3. `git commit -am "X.Y.Z"` (where X.Y.Z is the new version)
4. `git checkout master && git merge develop`
5. `git tag vX.Y.Z` (where X.Y.Z is the new version)
6. `git push && git push --tags`
7. `npm publish`
8. `git checkout develop`
9. Update the version in `package.json` to the next dev version in the
   `develop` branch.

        semver.inc('1.0.1', 'prerelease', 'dev') # 1.0.2-dev.0

10. `git commit -am "Prepare next development version"`
11. `git push`
