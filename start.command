#!/bin/bash
# Double-click to set everything up and open the site at http://localhost:3000
cd "$(dirname "$0")"
command -v npm >/dev/null || { echo "Node.js is needed first: https://nodejs.org (LTS)"; read -r; exit 1; }
bash scripts/fetch-assets.sh || { read -r; exit 1; }
[ -d node_modules ] || npm install
(sleep 6 && open http://localhost:3000) &
npm run dev
