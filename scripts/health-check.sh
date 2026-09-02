#!/usr/bin/env bash
set -euo pipefail

curl --fail --retry 10 --retry-delay 2 \
  http://127.0.0.1:8080/health
