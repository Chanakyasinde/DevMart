#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "DevMart setup"

echo "Checking for npm..."
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Install Node.js first." >&2
  exit 1
fi

echo "Installing server dependencies..."
(cd server && npm install)

echo "Installing client dependencies..."
(cd client && npm install)

echo "Setup complete."
