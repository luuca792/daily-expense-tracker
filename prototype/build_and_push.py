"""Double-click to build the prototype image and push it to Docker Hub.

Runs `docker-compose build`, then `docker-compose push` only if the build succeeded.
Needs Docker Desktop running and `docker login` done once.
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))  # double-click may start in another folder


def run(step):
    print(f"\n=== docker-compose {step} ===\n", flush=True)
    return subprocess.call(["docker-compose", step], cwd=HERE) == 0


def main():
    if not run("build"):
        print("\nBuild failed, nothing was pushed.")
        return 1
    if not run("push"):
        print("\nPush failed. Check that you are logged in (docker login).")
        return 1
    print("\nDone: new version pushed to Docker Hub.")
    return 0


if __name__ == "__main__":
    code = main()
    input("\nPress Enter to close...")  # keep the window open after a double-click
    sys.exit(code)
