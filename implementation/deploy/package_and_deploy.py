"""Double-click (or `npm run package-and-deploy` in app/) to release the version in app/package.json.

1. Checks that the repo is on main. Uncommitted and untracked files are ignored: the tag is the last commit.
2. Tags the repo with the version (annotated, no "v", like 1.0.0) and pushes main and the tag to origin.
3. Runs build_and_push.py: docker-compose build, then push luuca792/expense-tracker:<version> to Docker Hub.
4. Bumps the patch version (1.0.1 -> 1.0.2) everywhere it is written (BUMP_FILES, app/package.json and
   package-lock.json), adds an empty "## [1.0.2] - <today>" block on top of CHANGELOG.md, commits only those
   files as "Increase version to 1.0.2" and pushes main, so the next changes land in the new version.

A -SNAPSHOT version (a test build) skips steps 1, 2 and 4: no tag, no git push, no bump, only the image.
`--no-pause` skips the "Press Enter" at the end (used by the npm script).
"""
import datetime
import os
import re
import subprocess
import sys

sys.dont_write_bytecode = True  # no __pycache__/ next to the scripts
import build_and_push  # same folder; reads VERSION from app/package.json

VERSION = build_and_push.VERSION
ROOT = os.path.join(build_and_push.HERE, "..", "..")
IMPL = os.path.join(build_and_push.HERE, "..")

# default versions outside package.json (paths from implementation/): file -> patterns; group 1 is the text before the version
BUMP_FILES = {
    "deploy/docker-compose.yml": [r"(APP_VERSION:-)[\w.-]+"],
    "deploy/Dockerfile": [r"(APP_VERSION=)[\w.-]+", r"(expense-tracker:)[\w.-]+"],
    "deploy/README.md": [r"(\(default `)[\w.-]+(?=`\))"],
}


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)


def tag_and_push():
    if git("branch", "--show-current").stdout.strip() != "main":
        print("Not on main, nothing was done.")
        return False
    head = git("rev-parse", "HEAD").stdout.strip()
    tagged = git("rev-parse", "--verify", "--quiet", f"refs/tags/{VERSION}^{{commit}}").stdout.strip()
    if tagged and tagged != head:
        print(f"Tag {VERSION} already exists on another commit. Bump the version in app/package.json.")
        return False
    if not tagged:
        print(f"\n=== git tag {VERSION} ===\n", flush=True)
        if git("tag", "-a", VERSION, "-m", f"Release {VERSION}").returncode != 0:
            print("Tagging failed.")
            return False
    print(f"\n=== git push origin main {VERSION} ===\n", flush=True)
    if subprocess.call(["git", "push", "origin", "main", f"refs/tags/{VERSION}"], cwd=ROOT) != 0:
        print("Git push failed, the image was not built.")
        return False
    return True


def bump_version():
    major, minor, patch = VERSION.split(".")
    new = f"{major}.{minor}.{int(patch) + 1}"
    print(f"\n=== bump version to {new} ===\n", flush=True)
    # package.json and package-lock.json (both of its root "version" fields)
    if subprocess.call(f"npm version {new} --no-git-tag-version", cwd=os.path.join(IMPL, "app"), shell=True) != 0:
        print("npm version failed, nothing was committed.")
        return 1
    for path, patterns in BUMP_FILES.items():
        full = os.path.join(IMPL, path)
        with open(full, encoding="utf-8", newline="") as f:
            text = f.read()
        for pattern in patterns:
            text = re.sub(pattern, lambda m: m.group(1) + new, text)
        with open(full, "w", encoding="utf-8", newline="") as f:
            f.write(text)
    # new empty block on top: the next changes are written under it (see CLAUDE.md)
    changelog = os.path.join(IMPL, "CHANGELOG.md")
    with open(changelog, encoding="utf-8", newline="") as f:
        text = f.read()
    text = text.replace("## [", f"## [{new}] - {datetime.date.today().isoformat()}\n\n## [", 1)
    with open(changelog, "w", encoding="utf-8", newline="") as f:
        f.write(text)
    files = ["implementation/app/package.json", "implementation/app/package-lock.json", "implementation/CHANGELOG.md"]
    files += [f"implementation/{path}" for path in BUMP_FILES]
    # commit only the bumped files: other uncommitted work stays as it is
    if git("commit", "-m", f"Increase version to {new}", "--", *files).returncode != 0:
        print("Commit failed.")
        return 1
    print("\n=== git push origin main ===\n", flush=True)
    if subprocess.call(["git", "push", "origin", "main"], cwd=ROOT) != 0:
        print("Git push failed: the bump is committed locally only.")
        return 1
    print(f"\nDone: now working on {new}.")
    return 0


def main():
    if "SNAPSHOT" in VERSION:
        print(f"{VERSION} is a snapshot: no git tag or push, no bump, only the image.")
        return build_and_push.main()
    if not tag_and_push():
        return 1
    if build_and_push.main() != 0:
        return 1
    return bump_version()


if __name__ == "__main__":
    code = main()
    if "--no-pause" not in sys.argv:
        input("\nPress Enter to close...")  # keep the window open after a double-click
    sys.exit(code)
