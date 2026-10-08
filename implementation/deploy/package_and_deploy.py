"""Double-click (or `npm run package-and-deploy` in app/) to release the version in app/package.json.

1. Checks that the repo is on main. Uncommitted and untracked files are ignored: the tag is the last commit.
2. Tags the repo with the version (annotated, no "v", like 1.0.0) and pushes main and the tag to origin.
3. Runs build_and_push.py: docker-compose build, then push luuca792/expense-tracker:<version> to Docker Hub.

A -SNAPSHOT version (a test build) skips steps 1-2: no tag, no git push, only the image.
`--no-pause` skips the "Press Enter" at the end (used by the npm script).
"""
import os
import subprocess
import sys

sys.dont_write_bytecode = True  # no __pycache__/ next to the scripts
import build_and_push  # same folder; reads VERSION from app/package.json

VERSION = build_and_push.VERSION
ROOT = os.path.join(build_and_push.HERE, "..", "..")


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


def main():
    if "SNAPSHOT" in VERSION:
        print(f"{VERSION} is a snapshot: no git tag or push, only the image.")
    elif not tag_and_push():
        return 1
    return build_and_push.main()


if __name__ == "__main__":
    code = main()
    if "--no-pause" not in sys.argv:
        input("\nPress Enter to close...")  # keep the window open after a double-click
    sys.exit(code)
