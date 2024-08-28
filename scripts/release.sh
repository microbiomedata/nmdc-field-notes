#!/usr/bin/env bash

set -e

log() {
  echo "[release] $1"
}

# Validate the first CLI option passed to the script.
if [[ ! $1 =~ ^(major|minor|patch|build)$ ]]; then
  log "ERROR: Must specify a release type: major, minor, patch, or build"
  exit 1
fi

RELEASE_TYPE=$1

log "Checking for clean working directory"
if [[ -n "$(git status --porcelain)" ]]; then
  log "ERROR: Working directory must be clean. Stash or commit changes before releasing."
  exit 1
fi

# Increment the build number by getting the current build number from the package.json file,
# incrementing it by 1, and then setting the new build number in the package.json file.
CURRENT_BUILD_NUMBER=${npm_package_config_buildNumber:=}
if [[ -z $CURRENT_BUILD_NUMBER ]]; then
  log "ERROR: Cannot determine current build number from package.json"
  log "       Ensure that release.sh is being called via 'npm run release' and not directly"
  exit 1
fi
NEW_BUILD_NUMBER=$((CURRENT_BUILD_NUMBER + 1))
npm pkg set config.buildNumber=$NEW_BUILD_NUMBER --json

log "New build number: $NEW_BUILD_NUMBER"

# If this is a build release, grab the existing version number; otherwise, increment the version
# number by running 'npm version' and then grab the new version number.
if [[ "$RELEASE_TYPE" == "build" ]]; then
  VERSION_NUMBER=${npm_package_version:=}
  if [[ -z $VERSION_NUMBER ]]; then
    log "ERROR: Cannot determine current version number from package.json"
    log "       Ensure that release.sh is being called via 'npm run release' and not directly"
    exit 1
  fi
  log "Keeping existing version number: $VERSION_NUMBER"
else
  VERSION_NUMBER=$(npm version "$RELEASE_TYPE" --no-git-tag-version)
  VERSION_NUMBER=${VERSION_NUMBER:1}  # Remove the 'v' prefix
  log "New version number: $VERSION_NUMBER"
fi

# Run trapeze to propagate the new version and build number to native projects
log "Updating native projects"
export FIELD_NOTES_VERSION_NUMBER=$VERSION_NUMBER
export FIELD_NOTES_BUILD_NUMBER=$NEW_BUILD_NUMBER
trapeze run trapeze.config.yaml -y

# Commit the changes to package.json, package-lock.json, and native projects
COMMIT_MESSAGE="$VERSION_NUMBER ($NEW_BUILD_NUMBER)"
log "Creating commit: $COMMIT_MESSAGE"
git add package.json package-lock.json android ios
git commit -m "$COMMIT_MESSAGE"

# If this is not a build release, tag the commit with the new version number
if [[ "$RELEASE_TYPE" != "build" ]]; then
  TAG_MESSAGE="v$VERSION_NUMBER"
  log "Creating tag: $TAG_MESSAGE"
  git tag -a "$TAG_MESSAGE" -m "$TAG_MESSAGE"
fi
