"""Double-click to build the Sổ chi tiêu image and push it to Docker Hub.

Tags the image with the version in app/package.json (APP_VERSION, read by docker-compose.yml).
Runs `docker-compose build`, then `docker-compose push` only if the build succeeded.
Needs Docker Desktop running and `docker login` done once.
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))  # double-click may start in another folder
with open(os.path.join(HERE, "..", "app", "package.json"), encoding="utf-8") as f:
    VERSION = json.load(f)["version"]


def run(step):
    print(f"\n=== docker-compose {step} ({VERSION}) ===\n", flush=True)
    env = {**os.environ, "APP_VERSION": VERSION}
    return subprocess.call(["docker-compose", step], cwd=HERE, env=env) == 0


def main():
    if not run("build"):
        print("\nBuild failed, nothing was pushed.")
        return 1
    if not run("push"):
        print("\nPush failed. Check that you are logged in (docker login).")
        return 1
    print(f"\nDone: luuca792/expense-tracker:{VERSION} pushed to Docker Hub.")
    return 0


if __name__ == "__main__":
    code = main()
    input("\nPress Enter to close...")  # keep the window open after a double-click
    sys.exit(code)
