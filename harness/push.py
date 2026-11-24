# push.py - an argv-true lane push for run-day.ps1
#
# PowerShell 5.1 mangles native arguments containing spaces and quotes,
# so the harness never passes a payload through its own command line.
# The payload rides a file instead; this helper hands it to spur as a
# single list element, which subprocess quotes correctly on Windows.
#
#   python push.py SPUR_EXE STREAM SUBJECT PAYLOAD_FILE

import subprocess
import sys


def main():
    spur, stream, subject, path = sys.argv[1:5]
    payload = open(path, "rb").read().decode("utf-8")
    result = subprocess.run([spur, "stream", "push", stream, subject, payload])
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
